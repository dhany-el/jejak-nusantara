// Web Audio API Sound Synthesizer for Jejak Nusantara
let audioCtx = null;
let ambientOsc1 = null;
let ambientOsc2 = null;
let ambientGain = null;
let filterNode = null;
let isAmbientPlaying = false;
let isMuted = false;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
}

export function toggleAmbientSound() {
  initAudio();
  if (!audioCtx) return false;

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (isAmbientPlaying) {
    stopAmbient();
    return false;
  } else {
    startAmbient();
    return true;
  }
}

function startAmbient() {
  if (!audioCtx) return;
  
  // Create lowpass filter for warm atmospheric sound
  filterNode = audioCtx.createBiquadFilter();
  filterNode.type = 'lowpass';
  filterNode.frequency.setValueAtTime(320, audioCtx.currentTime);

  ambientGain = audioCtx.createGain();
  ambientGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  ambientGain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 3);

  // Warm pentatonic Gamelan-inspired drone notes (A2 = 110Hz, E3 = 164.81Hz)
  ambientOsc1 = audioCtx.createOscillator();
  ambientOsc1.type = 'triangle';
  ambientOsc1.frequency.setValueAtTime(110, audioCtx.currentTime);

  ambientOsc2 = audioCtx.createOscillator();
  ambientOsc2.type = 'sine';
  ambientOsc2.frequency.setValueAtTime(164.81, audioCtx.currentTime);

  ambientOsc1.connect(filterNode);
  ambientOsc2.connect(filterNode);
  filterNode.connect(ambientGain);
  ambientGain.connect(audioCtx.destination);

  ambientOsc1.start();
  ambientOsc2.start();

  isAmbientPlaying = true;
}

function stopAmbient() {
  if (ambientGain && audioCtx) {
    ambientGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);
    setTimeout(() => {
      if (ambientOsc1) { ambientOsc1.stop(); ambientOsc1.disconnect(); }
      if (ambientOsc2) { ambientOsc2.stop(); ambientOsc2.disconnect(); }
      isAmbientPlaying = false;
    }, 1600);
  }
}

export function playChime(freq = 587.33) { // D5 pitch
  if (isMuted) return;
  initAudio();
  if (!audioCtx) return;

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.8);
}
