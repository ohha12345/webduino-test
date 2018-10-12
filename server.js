require('webduino-blockly');
require('webduino-bit-modules');
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  
  let deviceID = req.query.deviceID;  
  let color = req.query.color;
  console.log(req.query);
  
  if( deviceID ){
    var matrix;

    boardReady({board: 'Bit', device: deviceID, transport: 'mqtt'}, function (board) {
      board.samplingInterval = 250;
      matrix = getMatrix(board, 4, 25);
      matrix.setColor(color);
    });

    res.status(200).send('Success');
  }else{
    res.status(200).send('裝置錯誤');
  }
});

app.listen(8080, function () {
  console.log('Example app listening on port 3000!');
});