const http = require('http');
const port = process.env.PORT || 8080;

http.createServer(function (req, res) {
  res.write('Hello wim!');
  res.end();
}).listen(port);

console.log(`server listening on port ${port}`);
