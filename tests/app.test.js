const http = require('http');
const app = require('../app');

let server;

beforeAll((done) => {
  server = app.listen(0, '127.0.0.1', done);
});

afterAll((done) => {
  server.close(done);
});

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.get({
      hostname: '127.0.0.1',
      port: server.address().port,
      path
    }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, body });
      });
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(3000, () => {
      req.destroy(new Error('Request timed out'));
    });
  });
}

test('GET / returns 200 and Hello World!', async () => {
  const response = await get('/');
  expect(response.status).toBe(200);
  expect(response.body).toBe('Hello World!');
});

test('GET /missing-page returns 404', async () => {
  const response = await get('/missing-page');
  expect(response.status).toBe(404);
});
