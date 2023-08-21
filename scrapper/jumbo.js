import puppeteer from "puppeteer";
let code = "7801620852955";
let code2 = "7802910083509";

export async function startBrowser() {
  console.log("Iniciando browser...")
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: null,
    args: [
      '--no-sandbox',
    ],
  });
  const page = await browser.newPage();
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
  await page.waitForSelector(".product-info");
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
  console.log("La data del producto es: ", data);
  return data;
}

export async function getProductFromJumbo(productCode, browser, page) {
  await searchProduct(productCode, page);
  const productInfo = await extractProductInfo(page);
  return productInfo;
}

