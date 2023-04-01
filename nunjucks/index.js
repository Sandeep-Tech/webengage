const express = require('express');
const nunjucks = require('nunjucks');
const request = require('request');


const promisedRequest = (url) => new Promise(
  (resolve, reject) => {
    request(
      url,
      { json: true },
      (error, response, body) => {
      if (error) reject(error);
      resolve(body);
    });
  }
);


const app = express();
nunjucks
  .configure('templates', {
    autoescape: true,
    express: app,
  })
  .addFilter(
    'intersect',
    (arr1, arr2) => arr1.filter(value => arr2.includes(value)),
  );

app.set('view engine', 'html');

const PORT = '8000';

app.get('/', async (req, res) => {
  try {
    const items = await promisedRequest('https://jsonplaceholder.typicode.com/users');
    res.render('task.html', { items });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong!');
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
