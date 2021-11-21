import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';

import ffmpeg from 'fluent-ffmpeg'

// const url = 'https://preview.p5js.org/ClockworkOrange605/present/4YU57EI70';
// const path = './storage/temp/';

console.time('video')

const url = 'http://pi4/preview/0xf5b07252b1782936198987cbe0fb2a9d48f61ab5/618a387de837537de8437cd9/source/index.html';
// const path = './storage/temp/618a387de837537de8437cd9/';
const path = './storage/temp/618a387de837537de8437cd0/';

(async () => {
  const browser = await puppeteer.launch({
    // headless: false,
    defaultViewport: {
      deviceScaleFactor: 1,
      // width: 1920, height: 1080,
      width: 1280, height: 720,
    }
  })

  const page = await browser.newPage()
  const recorder = new PuppeteerScreenRecorder(page)

  await page.goto(url, { waitUntil: 'domcontentloaded' })

  await recorder.start(`${path}demo.mp4`)
  // await page.waitForTimeout(1000 * 30)
  await page.waitForTimeout(1000 * 5)
  await recorder.stop()

  await browser.close()
})().then(() => {
  console.timeEnd('video')
  console.time('frames')

  ffmpeg(`${path}demo.mp4`)
    .screenshots({
      folder: path,
      filename: 'preview.png',
      count: 9,
    })
    .on('end', function () {
      console.timeEnd('frames')
    })
})