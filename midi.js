"use strict";

if (navigator.requestMIDIAccess){
    navigator.requestMIDIAccess().then( onMIDIInit, onMIDIReject );
}
else{
    console.error("DOH! No MIDI support present in your browser.");
}

function onMIDIInit (midi){
    // midi.inputs
    // midi.onstatechange
    // midi.outputs
    // midi.sysexEnabled
    console.log("Successfully Initialized MIDI");
    // var foundString = "Found " + midi.inputs.size + " inputs and " + midi.outputs.size + " outputs.";
    // console.log(foundString);
    // console.log("Sysex is", midi.sysexEnabled ? "enabled" : "disabled");
    
    midi.outputs.forEach(function(output){
      console.log("Output id:", output.id, output);
      if (output.manufacturer === "Teensyduino"){
        console.log("Found Teensy", output);
        window.teensy = output;
        output.open();
      }
    });
    
    midi.inputs.forEach(function(input){
      onMIDIConect(input);
    })


    midi.onstatechange = function(event){
      console.log("MIDIConnectionEvent on port", event.port);
      if (event.port.type === 'input' && event.port.connection === "open"){
        onMIDIConect(event.port);
      }else if (event.port.type === 'output' && event.port.connection === "closed" && event.port.manufacturer === "Teensyduino"){
        console.log("Found Teensy", event.port);
        window.teensy = event.port;
        event.port.open();
      }
    }
}

function onMIDIConect(input){
  console.log("Input id:", input.id, input);
  input.onmidimessage = function(event){
    var channel = (event.data[0]-176)+1;
    console.log("Parsed", channel);
    triggerPlayer(channel);
  }
}

function onMIDIReject (error){
    console.error(error);
    return;
}

function makeMidiMsg(ch, state){
	var controlByte = 0x01;
	var stateByte = state ? 0x7F : 0x00;
	var channelByte = 0xB0 + ch;
	return [channelByte, controlByte, stateByte]
}

window.switchOnLED = function(ch){
  console.log('setting led', ch);
	if (window.teensy && typeof window.teensy.send === 'function'){
		var channels = [0,1,2];
		channels.forEach(function(thisCh){
			window.teensy.send(makeMidiMsg(thisCh,thisCh === ch), window.performance.now())
		});
	}else{
		console.log("couldn't find teensy", teensy);
	}
}
