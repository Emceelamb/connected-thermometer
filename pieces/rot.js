const Gpio = require('onoff').Gpio;
const rotaryEncoder = require('onoff-rotary');
const myEncoder = rotaryEncoder(2, 3); // Using BCM 5 & BCM 6 on the PI

let feelingStates=[0,1,2]
let feeling=1;

let blue_led = new Gpio(21,'out');
let yell_led = new Gpio(20,'out');
let red_led = new Gpio(16,'out');

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
        }
        if(feeling===1){
            blue_led.writeSync(0);
            yell_led.writeSync(1);
            red_led.writeSync(0);
        }
        if(feeling===2){
            blue_led.writeSync(0);
            yell_led.writeSync(0);
            red_led.writeSync(1);
        }
});
