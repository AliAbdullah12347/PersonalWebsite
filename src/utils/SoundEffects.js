// Web Audio API Retro Sound Synthesizer (Zero asset size)
let audioCtx = null;
let isMuted = false;

function initCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export const SoundEffects = {
  setMuted(muted) {
    isMuted = muted;
  },

  playKeystroke() {
    if (isMuted) return;
    try {
      initCtx();
      
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      // Randomize pitch slightly for keyboard typing realism
      const pitch = 800 + Math.random() * 400;
      osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
      
      // Very fast decay for click sound
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
      
      osc.type = 'triangle';
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      console.warn('Audio Context block:', e);
    }
  },

  playBoot() {
    if (isMuted) return;
    try {
      initCtx();
      const now = audioCtx.currentTime;
      
      // Note 1
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.frequency.setValueAtTime(523.25, now); // C5
      gain1.gain.setValueAtTime(0.1, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      osc1.start(now);
      osc1.stop(now + 0.2);

      // Note 2 slightly offset
      setTimeout(() => {
        if (isMuted) return;
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
        gain2.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.25);
      }, 80);

      // Note 3
      setTimeout(() => {
        if (isMuted) return;
        const osc3 = audioCtx.createOscillator();
        const gain3 = audioCtx.createGain();
        osc3.connect(gain3);
        gain3.connect(audioCtx.destination);
        osc3.frequency.setValueAtTime(783.99, audioCtx.currentTime); // G5
        gain3.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain3.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
        osc3.start();
        osc3.stop(audioCtx.currentTime + 0.35);
      }, 160);
    } catch (e) {
      console.warn(e);
    }
  },

  playAlert() {
    if (isMuted) return;
    try {
      initCtx();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.type = 'sawtooth';
      // Alarm sweep: start high, go low
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.warn(e);
    }
  },

  playSuccess() {
    if (isMuted) return;
    try {
      initCtx();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.25);
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.25);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (e) {
      console.warn(e);
    }
  },

  playToggle() {
    if (isMuted) return;
    try {
      initCtx();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.type = 'sine';
      const up = Math.random() > 0.5;
      osc.frequency.setValueAtTime(up ? 440 : 330, audioCtx.currentTime);
      osc.frequency.setValueAtTime(up ? 550 : 220, audioCtx.currentTime + 0.08);
      
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.warn(e);
    }
  },

  playScan() {
    if (isMuted) return;
    try {
      initCtx();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(100, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2000, audioCtx.currentTime + 1.2);
      
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.25);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 1.3);
    } catch (e) {
      console.warn(e);
    }
  }
};
