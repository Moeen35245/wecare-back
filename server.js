require('dotenv').config();
const http = require('http');
const PORT = process.env.PORT || 3000;
const app = require('./app');
const server = http.createServer(app);
console.log(`Server Started at Port ${PORT}`);
server.listen(PORT);
