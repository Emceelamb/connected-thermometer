// my secrets shhhhh
const SECRETS = require('./secrets');

// analog => digital
const mcpadc = require('mcp-spi-adc');

// server stuffoo
const https = require('https');
const sampleRate = { speedHz: 2000 };

// rotary encoder
const rotaryEncoder = require('onoff-rotary');
const myEncoder = rotaryEncoder(2,3);

// MCP Analog => Serial
let device = {};
let channels=[];


let tempSensor = mcpadc.open(0, sampleRate, addNewChannel);
channels.push(tempSensor);

let pot = mcpadc.open(2, sampleRate, addNewChannel);
channels.push(pot);

let newTemp;
let payload={
    "temperature": 0,
    "pot":0
}

function addNewChannel(error) {
    if (error) throw error;
}

function checkSensors() {
    function getTemp(error,reading) {
        if (error) throw error;
        device["temperature"] = (reading.value * 3.3-0.5) * 100;
        payload.temperature=device.temperature;
    }

    function getKnob(error, reading) {
        if(error) throw error;
        device["pot"] = reading.value;
        payload.pot=reading.value;
    }
    
    if(channels.length>1){
        tempSensor.read(getTemp);
        pot.read(getKnob);
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
        'data':`{"temperature":${payload.temperature},"pot":${payload.pot}}`
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
    if(direction > 0) {
        console.log('encoder rotated left');
       } else {
           console.log('encoder rotated right');
       }
});

// check sensor x seconds
setInterval(checkSensors,2000);
setInterval(sendIt, 5000);
