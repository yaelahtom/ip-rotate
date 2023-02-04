'use strict'

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const { executablePath } = require('puppeteer');

const { proxies } = require('./proxies')

// const useProxy = require('puppeteer-page-proxy')

const url = 'https://httpbin.org/ip';



function getRandomProxy(proxies) {
  return proxies = proxies[Math.floor(Math.random() * proxies.length)]
}

console.log('proxy yang digunakan: ',getRandomProxy(proxies))

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    },
    args: [
      "--start-maximized",
      "--no-sandbox",
      "--disable-web-security",
      `--proxy-server=${getRandomProxy(proxies)}`
    ],
    executablePath: executablePath()
  })

  // new page
  const page = await browser.newPage()
  
  // await page.authenticate()

  // intercept response
  await page.setRequestInterception(true)
  page.on('request', async (req) => {
    await req.continue();
  });
  page.on('response', async response => {
    const data = await response.json()
    console.log(data)
  })


  await page.goto(url, {
    waitUntil: 'networkidle2'
  })

  // await sleep(10000)


  await page.screenshot({ path: 'ss.png', fullPage: true })

  await browser.close()

})().catch(err => console.error(err))