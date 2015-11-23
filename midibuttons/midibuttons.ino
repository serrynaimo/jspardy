/* Pushbutton, Teensyduino Tutorial #3
   http://www.pjrc.com/teensy/tutorial3.html

   This example code is in the public domain.
*/
#include <Bounce.h>
#include <TimerOne.h>

#define BUTTON_INPUT_CH_1 10
#define BUTTON_INPUT_CH_2 11
#define BUTTON_INPUT_CH_3 12

#define BUTTON_OUTPUT_CH_1 16
#define BUTTON_OUTPUT_CH_2 15
#define BUTTON_OUTPUT_CH_3 14

Bounce pushbutton1 = Bounce(BUTTON_INPUT_CH_1, 10);  // 10 ms debounce
Bounce pushbutton2 = Bounce(BUTTON_INPUT_CH_2, 10);  // 10 ms debounce
Bounce pushbutton3 = Bounce(BUTTON_INPUT_CH_3, 10);  // 10 ms debounce

void setup() {
  pinMode(BUTTON_INPUT_CH_1, INPUT_PULLUP);
  pinMode(BUTTON_INPUT_CH_2, INPUT_PULLUP);
  pinMode(BUTTON_INPUT_CH_3, INPUT_PULLUP);

  pinMode(BUTTON_OUTPUT_CH_1, OUTPUT);
  pinMode(BUTTON_OUTPUT_CH_2, OUTPUT);
  pinMode(BUTTON_OUTPUT_CH_3, OUTPUT);

  pinMode(13, OUTPUT);

  digitalWrite(BUTTON_OUTPUT_CH_1, LOW);
  digitalWrite(BUTTON_OUTPUT_CH_2, LOW);
  digitalWrite(BUTTON_OUTPUT_CH_2, LOW);

  Timer1.initialize(150000);
  Timer1.attachInterrupt(blinkLEDComplete); // blinkLED to run every 0.15 seconds
  Timer1.stop();

  usbMIDI.setHandleControlChange(OnControlChange);
}

void loop()
{
  if (pushbutton1.update()) {
    if (pushbutton1.risingEdge()) {
      usbMIDI.sendControlChange(1, 127, 1);
    }
  }
  if (pushbutton2.update()) {
    if (pushbutton2.risingEdge()) {
      usbMIDI.sendControlChange(1, 127, 2);
    }
  }
  if (pushbutton3.update()) {
    if (pushbutton3.risingEdge()) {
      usbMIDI.sendControlChange(1, 127, 3);
    }
  }
  usbMIDI.read();
  delay(30);
}

void blinkLED(void)
{
  digitalWrite(13, HIGH);
  Timer1.restart();
}

void blinkLEDComplete(void)
{
  digitalWrite(13, LOW);
  Timer1.stop();
}


void OnControlChange(byte channel, byte control, byte value){
  if (control == 1){
    if (channel == 1){
      digitalWrite(BUTTON_OUTPUT_CH_1, value > 63 ? HIGH : LOW);
      blinkLED();
    }else if (channel == 2){
      digitalWrite(BUTTON_OUTPUT_CH_2, value > 63 ? HIGH : LOW);
      blinkLED();
    }else if (channel == 3){
      digitalWrite(BUTTON_OUTPUT_CH_3, value > 63 ? HIGH : LOW);
      blinkLED();
    }
  }
}

