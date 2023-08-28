const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.API_PORT || 3000;

const authRouter = require('./routers/auth');


app.use(express.json());
app.use(cors());

// Routers
app.use('/auth', authRouter)



app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`API running on port ${port}`)
})