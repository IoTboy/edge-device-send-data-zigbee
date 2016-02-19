var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');
var groveSensor = require('jsupm_grove');

var temp = new groveSensor.GroveTemp(0);

var C = xbee_api.constants;

var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 1
});

var serialport = new SerialPort("/dev/ttyMFD1", {
  baudrate: 9600,
  parser: xbeeAPI.rawParser()
});

serialport.on("open", function() {
  console.log('serial port opened');
  setInterval(sendTemperatureData, 3000);
});

function sendTemperatureData(){

var celsius = temp.value();
var fahrenheit = Math.round(celsius * 9.0/5.0 + 32.0);

console.log('Temperature - ', celsius, '°C or ', fahrenheit,'°F');

var frame_obj = { // AT Request to be sent to
    type: C.FRAME_TYPE.TX_REQUEST_16,
    id: 0x01,
    destination16: "0000",
    options: 0x00,
    data: fahrenheit.toString()
  };

  serialport.write(xbeeAPI.buildFrame(frame_obj));
};


