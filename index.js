const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/users',createProxyMiddleware({
    target:'http://localhost:3001/api/v1',
    changeOrigin:true
}));

// Start the gateway server
app.listen(8080, () => {
    console.log('API Gateway listening on port 8080');
});