import { Vibration } from 'react-native';

let lastSmashVibeTime = 0;
let lastScratchVibeTime = 0;

export function playClickVibe(enabled: boolean = true) {
  // Disabled for optimization (vibrate on rock smashing only)
}

export function playChiselVibe(enabled: boolean = true) {
  // Disabled for optimization (vibrate on rock smashing only)
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
  // Disabled for optimization (vibrate on rock smashing only)
}
