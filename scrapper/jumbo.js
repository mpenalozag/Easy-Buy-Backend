import puppeteer from "puppeteer";
let code = "7801620852955";
let code2 = "7802910083509";


const minimal_args = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
]

export async function startBrowser() {
  console.log("Iniciando browser...")
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: null,
    args: minimal_args,
  });
  const page = await browser.newPage();
  await page.setRequestInterception(true)
  page.on('request', (request) => {
    if (request.resourceType() === 'image' || request.resourceType() === 'font') request.abort()
    else request.continue()
  })
  await page.goto("https://www.jumbo.cl/", {
    waitUntil: 'domcontentloaded'
  });
  return { browser, page };
}

export async function stopBrowser(browser) {
  console.log("Deteniendo browser...");
  await browser.close();
}

async function searchProduct(productCode, page) {
  await page.waitForSelector(".new-header-search-input");
  await page.type(".new-header-search-input", productCode);
  await page.click(".new-header-search-submit");
  await page.waitForSelector(".new-header-search-input");
  await page.click(".new-header-search-input", { clickCount: 3 });
  await page.keyboard.press("Backspace");
}

async function extractProductInfo(page) {
  const errorPromise = new Promise(async (resolve, reject) => {
    try {
      await page.waitForSelector(".error-404-subtitle");
    } catch (err) {
      //
    }
    resolve("ProductNotFound");
  });
  const productPromise = new Promise(async (resolve, reject) => {
    try {
      await page.waitForSelector(".product-info");
    } catch (err) {
      //
    }
    resolve("ProductFound");
  });
  const promises = [errorPromise, productPromise];
  const result = await Promise.any(promises);
  if (result === "ProductNotFound") {
    return {
      productName: "Producto no encontrado",
      productPrice: null,
      productImage: null
    };
  }
  else {
    const data = await page.evaluate(() => {
      const productInfo = document.querySelector(".product-info");
      const productName = productInfo.querySelector(".product-name").innerText;
      const productPrice = productInfo.querySelector(".prices-main-price").innerText;
      const productImage = productInfo.querySelector(".zoomed-image").getAttribute("style").split(" ")[5].split("\"")[1];
      return {
        productName,
        productPrice,
        productImage
      };
    });
    return data;
  }
}

export async function getProductFromJumbo(productCode, browser, page) {
  await searchProduct(productCode, page);
  const productInfo = await extractProductInfo(page);
  return productInfo;
}

