import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright-core';

const url='http://127.0.0.1:4173/Saeid-Mocha-/';
const browserPaths=[process.env.CHROME_BIN,'/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].filter(Boolean);
const chrome=browserPaths.find(p=>existsSync(p));
assert.ok(chrome,'Chromium or Google Chrome must be installed for the browser smoke test');
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4173','--strictPort'],{stdio:['ignore','pipe','pipe']});
server.stdout.on('data',d=>process.stdout.write(d));server.stderr.on('data',d=>process.stderr.write(d));
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let browser;
try{
  let ready=false;
  for(let i=0;i<60;i++){
    try{const r=await fetch(url);if(r.ok){ready=true;break}}catch{}
    await sleep(250);
  }
  assert.ok(ready,'Vite preview did not start successfully');
  browser=await chromium.launch({executablePath:chrome,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader']});
  async function open(options,name){
    const ctx=await browser.newContext(options);
    const page=await ctx.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('response',r=>{if(r.status()>=400&&r.url().includes('/assets/'))errors.push('Asset HTTP '+r.status()+' '+r.url())});
    const response=await page.goto(url,{waitUntil:'load'});
    assert.equal(response.status(),200,name+' HTML request');
    await page.waitForSelector('[data-action="play"]',{timeout:12000});
    const count=await page.locator('.menu-characters img').count();
    assert.equal(count,2,name+' displays both character references');
    const allImages=await page.locator('.menu-characters img').evaluateAll(images=>images.map(i=>i.complete&&i.naturalWidth>0));
    assert.ok(allImages.every(Boolean),name+' images actually loaded');
    return {ctx,page,errors};
  }
  async function expectPlaying(page,name){
    await page.waitForFunction(()=>{const e=document.querySelector('#hud');return e&&!e.classList.contains('hidden')},undefined,{timeout:12000});
    const canvas=await page.locator('canvas').count();
    assert.ok(canvas>=1,name+' renders a canvas');
  }
  const desktop=await open({viewport:{width:1366,height:768}},'desktop');
  await desktop.page.locator('[data-action="play"]').click();
  await expectPlaying(desktop.page,'desktop');
  await desktop.page.keyboard.down('Space');
  await sleep(350);
  await desktop.page.keyboard.up('Space');
  await desktop.page.locator('#ability').click();
  await desktop.page.waitForFunction(()=>document.querySelector('#cooldown')?.textContent?.includes('s'),undefined,{timeout:4000});
  await desktop.page.locator('#pause').click();
  await desktop.page.locator('[data-action="resume"]').waitFor();
  await desktop.page.locator('[data-action="resume"]').click();
  await desktop.page.locator('#pause').click();
  await desktop.page.locator('[data-action="restart"]').click();
  await expectPlaying(desktop.page,'restart');
  await desktop.page.locator('#pause').click();
  await desktop.page.locator('[data-action="menu"]').click();
  await desktop.page.locator('[data-action="play"]').waitFor();
  assert.deepEqual(desktop.errors,[],'desktop has no JS or asset errors');
  await desktop.ctx.close();
  console.log('PASS desktop: start, images, flight, Mocha shield, pause, resume, replay, menu');

  const mobile=await open({viewport:{width:844,height:390},deviceScaleFactor:2,isMobile:true,hasTouch:true},'landscape mobile');
  await mobile.page.locator('[data-action="play"]').tap();
  await expectPlaying(mobile.page,'landscape mobile');
  await mobile.page.locator('#ability').tap();
  await mobile.page.waitForFunction(()=>document.querySelector('#cooldown')?.textContent?.includes('s'),undefined,{timeout:4000});
  await mobile.page.locator('#pause').tap();
  await mobile.page.locator('[data-action="resume"]').waitFor();
  assert.deepEqual(mobile.errors,[],'landscape mobile has no JS or asset errors');
  await mobile.ctx.close();
  console.log('PASS mobile landscape: tap controls, shield and pause');

  const portrait=await open({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true},'portrait mobile');
  await portrait.page.locator('#portrait-continue').tap();
  await portrait.page.locator('[data-action="play"]').tap();
  await expectPlaying(portrait.page,'portrait mobile');
  await portrait.page.locator('#ability').tap();
  assert.deepEqual(portrait.errors,[],'portrait mobile has no JS or asset errors');
  await portrait.ctx.close();
  console.log('PASS mobile portrait: optional play-in-portrait and tap shield');
}finally{
  if(browser)await browser.close();
  server.kill('SIGTERM');
}
