import express from 'express';
import { startBrowser, stopBrowser, getProductFromJumbo } from './jumbo.js';
const app = express();
const port = 5000;

app.use(express.json());

const {browser, page} = await startBrowser();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/product/:productCode', async (req, res) => {
  const productCode = req.params.productCode;
  try {
    const productInfo = await getProductFromJumbo(productCode, browser, page);
    res.json(productInfo);
  } catch (error) {
    console.log(error);
  }
})

app.listen(port, () => {
  console.log(`Scrapper running on port ${port}`)
})