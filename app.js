const express = require('express');
const greeting = require('./greeting');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', greeting);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
  });
}

module.exports = app;
