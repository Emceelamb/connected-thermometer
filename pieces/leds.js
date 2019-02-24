const Gpio = require('onoff').Gpio;

let blue_led = new Gpio(21,'out');
let yell_led = new Gpio(20,'out');
let red_led = new Gpio(16,'out');

const rotaryleft = new Gpio(26,'in','both');
const rotary_right = new Gpio(19,'in','both');

//const rotaryEncoder = require('onoff-rotary');
//const myEncoder = new rotaryEncoder(26,19);


function listenRot(err, val){
    if(err){throw err};
    blue_led.writeSync(1);
    console.log(val);
};

rotary_right.readSync((err,val)=>{
    if(err){throw err};
    console.log("right!");
});

rotaryleft.watch((err,value)=>{
    if(err){throw error}
    if(val===0){
        console.log("left");
    } else {
        console.log("right");
    }
    
})
