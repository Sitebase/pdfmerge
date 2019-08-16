var http = require('http');

http.createServer(function (req, res) {
  res.write('Hello wim!');
  res.end();
}).listen(8080);

console.log('server listening on port 8080');
