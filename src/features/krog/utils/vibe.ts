import { Vibration } from 'react-native';

let lastSmashVibeTime = 0;
let lastScratchVibeTime = 0;

export function playClickVibe(enabled: boolean = true) {
  if (!enabled) return;
  Vibration.vibrate(8);
}

export function playChiselVibe(enabled: boolean = true) {
  if (!enabled) return;
  Vibration.vibrate(15);
}

export function playSmashVibe(enabled: boolean = true) {
  if (!enabled) return;
  const now = Date.now();
  if (now - lastSmashVibeTime > 100) {
    Vibration.vibrate(35);
    lastSmashVibeTime = now;
  }
}

export function playScratchVibe(enabled: boolean = true) {
  if (!enabled) return;
  const now = Date.now();
  if (now - lastScratchVibeTime > 100) {
    Vibration.vibrate(5);
    lastScratchVibeTime = now;
  }
}
