const http = require('http');
const fs = require('fs');
const url = require('url');
const slugify = require('slugify');
const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const replaceFun = (template, data) => {
  let temp = template.replace(/{productName}/g, data.productName);
  temp = temp.replace(/{image}/g, data.image);
  temp = temp.replace(/{price}/g, data.price);
  temp = temp.replace(/{quantity}/g, data.quantity);
  temp = temp.replace(/{id}/g, data.id);
  temp = temp.replace(/{nutrients}/g, data.nutrients);
  temp = temp.replace(/{from}/g, data.from);
  temp = temp.replace(/{description}/g, data.description);
  if (!data.organic) temp = temp.replace(/{notOrganic}/g, 'not-organic');
  return temp;
};
const productsSlugs = dataObj.map((product) => slugify(product.productName, { lower: true, strict: false }));
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // Api
  if (pathname === '/api') {
    res.writeHead(200, {
      'content-type': 'text/html',
    });
    res.end(tempOverview);
  }
  // Product
  else if (pathname === '/product') {
    res.writeHead(200, { 'content-type': 'text/html' });
    const product = dataObj[query.id];
    const renderCart = replaceFun(tempProduct, product);
    res.end(renderCart);
  }
  // Overview
  else if (pathname === '/' || pathname === '/overview') {
    const tempCardArr = dataObj.map((el) => replaceFun(tempCard, el)).join('');
    const tempArr = tempOverview.replace(/{productCards}/g, tempCardArr);

    res.writeHead(200, {
      'content-type': 'text/html',
    });
    res.end(tempArr);
  }
  // Not Found
  else {
    res.writeHead(404, {
      'content-type': 'text/html',
    });
    res.end('<h1> Page Not Found! </h1>');
  }
});

server.listen(8000, '127.0.0.2', () => {
  console.log('listening');
});
