const express = require('express');
const enableWs = require('express-ws');
const si = require('systeminformation');

const app = express();
enableWs(app);

// device-realtime?device_id=223528
app.ws('/device-realtime', (ws) => {
    setInterval(async () => {
        const deviceInfo = JSON.stringify([{device_id: 223528, device_address: 182526, customer_id: 435, serial_number: 5015377, name: '5015377 Ly Tu Trong - Camera', hardware_type_name: 'esave_SLC_ASIA'}])
        ws.send(deviceInfo);
    }, 5000);

    ws.on('message', msg => {
        ws.send(msg)
    })

    ws.on('close', () => {
        console.log('WebSocket was closed')
    })
})

// echo
app.ws('/echo', (ws, req) => {
    setInterval(async () => {
        const cpuTemp = JSON.stringify(await si.currentLoad());
        ws.send(cpuTemp);
    }, 5000);

    ws.on('message', msg => {
        ws.send(msg)
    })

    ws.on('close', () => {
        console.log('WebSocket was closed')
    })
});



app.listen(8000)