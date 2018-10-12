require('webduino-blockly');
require('webduino-bit-modules');
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  
  let deviceID = req.query.deviceID;  
  let color = req.query.color;
  console.log(req.query);
  
  if( deviceID ){
    let matrix;
    let a = -1;
    boardReady({board: 'Bit', device: deviceID, transport: 'mqtt'}, function (board) {
      board.samplingInterval = 250;
      matrix = getMatrix(board, 4, 25);
      setInterval(()=>{
        a = a*-1;
        if(a<0){
          matrix.setColor('000');
        }else{
          matrix.setColor(color);
        }
      },10000);
    });

    res.status(200).send('Success');
  }else{
    res.status(200).send('裝置錯誤');
  }
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});