import express from 'express';
import { startBrowser, stopBrowser, getProductFromJumbo } from './jumbo.js';
const app = express();
const port = 5000;

const {browser, page} = await startBrowser();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/product/:productCode', async (req, res) => {
  const productCode = req.params.productCode;
  const productInfo = await getProductFromJumbo(productCode, browser, page);
  res.send(productInfo);
})

app.listen(port, () => {
  console.log(`Scrapper running on port ${port}`)
})