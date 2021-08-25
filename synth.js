
var wavetype = "sine";
var synth = new Tone.MonoSynth({
    oscillator: {
        type : wavetype
    },
    envelope:{
        attack: 1,
        decay: 0.2,
        sustian: 0.1,
        release: 0.2
    }
}).toDestination();

console.log(synth.envelope.release); 

var notes = ['C','D','E','F','G','A','B'];

var numberOfDelays=3;

var currentOctave = 4;

var startVolume = -20;

drawPiano();

updateMasterVolume(0);

function drawPiano(){
    var html = "";
    for(octave = 0; octave < 2; octave++){
        for (var i = 0; i < notes.length; i++)
        {
            var note = notes[i];
            var hasSharp = true;
        
            if(note == 'E'|| note == 'B'){
                hasSharp = false;
            }
        
            html += `   <div class='whitenote'
                        onmousedown='noteDown(this, false)'
                        onmouseUp='noteUp(this, false)' 
                        onmouseleave='noteUp(this, false)' 
                        data-note='${note + (octave+currentOctave)}'>`;
        
            if(hasSharp){
            html += `       <div class="blacknote"
                            onmousedown='noteDown(this, true)' 
                            onmouseUp='noteUp(this, true)' 
                            onmouseleave='noteUp(this, true)' 
                            data-note='${note + '#' + (octave+currentOctave)}'></div>`;
            }
        
            html += '</div>';
            
        }
    }
    document.getElementById('container').innerHTML = html;
    console.log("done");
}



//-----------------------------NotePressed---------------------------------------------
function noteDown(elem, isSharp){
    var note = elem.dataset.note;
    elem.style.background = isSharp ? 'black' : 'grey';
    synth.triggerAttackRelease(note, "16n");
    event.stopPropagation();

}

function noteUp(elem, isSharp){
    elem.style.background = isSharp ? 'rgb(47, 49, 80)' : 'white';
}


//------------------------------Effects-----------------------------------------------
function upOctave(){
    currentOctave += 1;
    drawPiano();

}
function downOctave(){
    currentOctave -= 1;
    drawPiano();
}

function updateDistortion(value){
    var distortion = new Tone.Distortion(value/100).toDestination();
    
    if(value==0){
       synth.disconnect();

    } 

    synth.connect(distortion);
}

function updateReverb(value){
    
        var reverb = new Tone.Reverb(value/10).toDestination();
        synth.connect(reverb);
}



function updateDelay(delayTime){
    var delay = new Tone.FeedbackDelay(delayTime, 0.2).toDestination();
    delay.maxDelay=numberOfDelays;
    synth.connect(delay);
    if(delayTime==0){
        synth.disconnect();
    }
}

function updateNumberOfDelay(value){
    numberOfDelays=Number(value);
}


//------------------------------ADSR---------------------------------------------------
function updateRelease(newValue){
    
    synth.envelope.release = Number(newValue)/10;
    
}

function updateMasterVolume(volume){
    var input = document.getElementById("volumeSlider")
    synth.volume.value = (Number(startVolume)+Number(input.value));
}
function changeWaveType(wavetype){
    synth.oscillator.type= wavetype;   
}