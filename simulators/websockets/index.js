var WebSocketServer = require("ws").Server,
    express = require("express"),
    http = require("http"),
    app = express(),
    server = http.createServer(app);

app.get("/radar", radar)

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    setInterval(async () => {
        const cpuTemp = JSON.stringify(await si.currentLoad());
        ws.send(cpuTemp);
    }, 1000);

    ws.on('message', function message(data) {
        console.log('received : %s', data);
    });

    ws.send('something');
});