const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.API_PORT;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`API running on port ${port}`)
})