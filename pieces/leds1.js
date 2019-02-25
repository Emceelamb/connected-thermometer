// my secrets shhhhh
const SECRETS = require('./secrets');

// analog => digital
const mcpadc = require('mcp-spi-adc');

// server stuffoo
const https = require('https');
const sampleRate = { speedHz: 2000 };

// rotary encoder
const Gpio = require('onoff').Gpio;
const rotaryEncoder = require('onoff-rotary');
const myEncoder = rotaryEncoder(2, 3);

// MCP Analog => Serial
let device = {};
let channels=[];


let tempSensor = mcpadc.open(0, sampleRate, addNewChannel);
channels.push(tempSensor);
channels.push = (myEncoder);
let newTemp;
let payload={
    "temperature": 0,
    "feel":"Just right!"
}

// how does it feel?
let feelingStates=[0,1,2]
let feeling=1;
let feel = "Just right!"
let blue_led = new Gpio(21,'out');
let yell_led = new Gpio(20,'out');
let red_led = new Gpio(16,'out');

yell_led.writeSync(1);
function addNewChannel(error) {
    if (error) throw error;
}

function checkSensors() {
    payload.feel=feel;
    function getTemp(error,reading) {
        if (error) throw error;
        device["temperature"] = (reading.value * 3.3-0.5) * 100;
        device.feel=feel;
        payload.temperature=device.temperature;
    }

    function getKnob(error, reading) {
        if(error) throw error;
        payload.feel=feel;
        device["feel"] = feel;
    }
    
    if(channels.length>0){
        tempSensor.read(getTemp);
        console.log(device);
    }

}

// https

//format response
function callback(response){
    let result = '';
    
    response.on('data', function(data){
        result += data;
    });
    response.on('end', function(){
        console.log(result);
    });

}

// send request
function sendIt(){
    let postData = JSON.stringify(
    {
        'macAddress': SECRETS.MAC,
        'sessionKey': SECRETS.UUID,
        'data':`{"temperature":${payload.temperature},"feel":\"${payload.feel}\"}`
    })

    let options={
        host: 'tigoe.io',
        //host: 'dweet.io',
        port: 443,
        path: '/data',
        //path: '/dweet/for/scandalous-cheese-hoarder',
            method: 'POST',
            headers: { 
                'User-Agent':'nodejs', 
                'Content-type': 'application/json',
                'Content-Length': postData.length
            }
    };

    let request = https.request(options, callback);
    request.write(postData,);
    request.end();
}

// rotary encoder 
myEncoder.on('rotation', direction => {
    console.log("feeling is: ", feeling);
    if (direction > 0) {
        console.log('Encoder rotated right');
        feeling++;
        if(feeling>2){
            feeling=0;
        }
     } else {
         console.log('Encoder rotated left');
         feeling--;
         if(feeling<0){
             feeling=3
         }
     }
     if(feeling===0){
        blue_led.writeSync(1);
        yell_led.writeSync(0);
        red_led.writeSync(0);
        feel="Too cold!";
      }
      if(feeling===1){
        blue_led.writeSync(0);
        yell_led.writeSync(1);
        red_led.writeSync(0);
        feel="Just right!";
     } 
      if(feeling===2){
        blue_led.writeSync(0);
        yell_led.writeSync(0);
        red_led.writeSync(1);
        feel="Too hot!";
       }
});

// check sensor x seconds
setInterval(checkSensors,1000);
//setInterval(checkSensors,1000*15*60);
//setInterval(sendIt, 1000 * 60 * 60);
