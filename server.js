require('webduino-blockly');
require('webduino-bit-modules');
var express = require('express');
var request = require('request');
var app = express();

app.get('/', function (req, res) {
  let deviceID = req.query.deviceID;
  let color = req.query.color || '999';
  let t = req.query.time || 0;
  console.log(req.query);

  if (deviceID) {
    let matrix, timer;
    let a = -1;

    boardReady({ board: 'Bit', device: deviceID, transport: 'mqtt' }, function (board) {
      board.samplingInterval = 250;
      matrix = getMatrix(board, 4, 25);
      if (t == 0) {
        matrix.setColor(color);
      } else {
        timer = setInterval(() => {
          a = a * -1;
          if (a < 0) {
            matrix.setColor('000');
          } else {
            matrix.setColor(color);
          }
        }, t);
      }
      board.on('error', function (err) {
        console.log('裝置錯誤 or 連線異常');
        clearInterval(timer);
      });
    });
    console.log(deviceID + '連線成功，開始閃爍');
    res.status(200).send(deviceID + '連線成功，開始閃爍');

    var post_options = {
      host: 'closure-compiler.appspot.com',
      port: '80',
      path: '/compile',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    // Set up the request
    var post_req = http.request(post_options, function (res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('Response: ' + chunk);
      });
    });
    post_req.write(post_data);
    post_req.end();


  } else {
    res.status(200).send('裝置錯誤 or 連線異常');
    request.post('https://script.google.com/macros/s/AKfycbyU4o4Wlp-n75mvYU7NX9PT5KebShp7aWnSuhZijffdIPYFx9E/exec', { form: { message: '裝置錯誤 or 連線異常' } });
  }
});

app.listen(8080, function () {
  console.log('伺服器啟動！');
  request.post('https://script.google.com/macros/s/AKfycbyU4o4Wlp-n75mvYU7NX9PT5KebShp7aWnSuhZijffdIPYFx9E/exec', { form: { message: '伺服器啟動' } });
});