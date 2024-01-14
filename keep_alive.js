const express = require('express')
const app = express();
const port = 3000;
app.get('/', (req, res) => {
  res.send('im alive')
})
app.listen(port, () => {
  console.log(`This app is listening at http://localhost:${port}`)
})