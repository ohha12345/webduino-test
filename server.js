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
    let matrix;
    let a = -1;
    let timer;
    boardReady({ board: 'Bit', device: deviceID, transport: 'mqtt' }, function (board) {
      board.samplingInterval = 250;
      matrix = getMatrix(board, 4, 25);
      timer = setInterval(() => {
        try {
          a = a * -1;
          if (a < 0) {
            matrix.setColor('000');
          } else {
            matrix.setColor(color);
          }
        } catch (error) {
          clearInterval(timer);
          console.log('連線異常');
        }
      }, t);
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