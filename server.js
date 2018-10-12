require('webduino-blockly');
require('webduino-bit-modules');
var express = require('express');
var app = express();

app.get('/', function (req, res) {

  let deviceID = req.query.deviceID;
  let color = req.query.color || '555';
  let t = req.query.time || 5000;
  console.log(req.query);

  if (deviceID) {
    let matrix, pin;
    let a = -1;
    let timer;
    boardReady({ board: 'Bit', device: deviceID, transport: 'mqtt' }, function (board) {
      board.samplingInterval = 250;
      matrix = getMatrix(board, 4, 25);
      if (t == 0) {
        matrix.setColor(color);
      } else {
        timer = setInterval(() => {
          pin = -1;
          pin = getPin(board, bitGPIO(1));
          if(pin<0){
            console.log('裝置錯誤 or 連線異常');
            clearInterval(timer);
          }else{
            a = a * -1;
            if (a < 0) {
              matrix.setColor('000');
            } else {
              matrix.setColor(color);
            }
          } 
        }, t);
      }
      board.on('error', function (err) {
        console.log('裝置錯誤 or 連線異常');
        console.log(err);
        clearInterval(timer);
      });
    });
    console.log(deviceID + '連線成功，開始閃爍');
    res.status(200).send(deviceID + '連線成功，開始閃爍');
  } else {
    res.status(200).send('裝置錯誤 or 連線異常');
  }
});

app.listen(8080, function () {
  console.log('伺服器啟動！');
});