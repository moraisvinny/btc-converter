const request = require('request');

const url = 'https://apiv2.bitcoinaverage.com/convert/global?from=BTC&to=USD&amount=1';
request(url, (err, resp, body) => {
  let apiResponse = JSON.parse(body);
  console.log(apiResponse);
});
