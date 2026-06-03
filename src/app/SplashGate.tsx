import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, View} from 'react-native';

/**
 * SplashGate
 *
 * Renders a Lottie splash animation overlay on top of the app content.
 * Fade out once animation completes (with minimum visible time).
 *
 * Usage:
 *   <SplashGate>
 *     <AppNavigator />
 *   </SplashGate>
 *
 * To customize:
 *   1. Replace `animationSource` with your project's Lottie file.
 *   2. Update SPLASH_BG to match your brand color.
 *   3. If not using Lottie, remove the LottieView and use an Image instead.
 */

// Uncomment when you have a Lottie animation file:
// import LottieView from 'lottie-react-native';
// const animationSource = require('@assets/animations/splash.json');

const SPLASH_FALLBACK_MS = 3000;
const SPLASH_FADE_OUT_MS = 300;
const SPLASH_MIN_VISIBLE_MS = 800;
const SPLASH_BG = '#111827'; // Replace with your brand color

type Props = {
  children: React.ReactNode;
};

export function SplashGate({children}: Props) {
  const [splashDone, setSplashDone] = useState(false);
  const [showSplashLayer, setShowSplashLayer] = useState(true);
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const hasStartedExit = useRef(false);
  const mountedAt = useRef(Date.now());

  // Fallback: hide splash after SPLASH_FALLBACK_MS even if animation doesn't fire
  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), SPLASH_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleAnimationFinish = useCallback(() => {
    setSplashDone(true);
  }, []);

  // Fade out once splash is done
  useEffect(() => {
    if (!splashDone || hasStartedExit.current) return;
    hasStartedExit.current = true;

    const elapsed = Date.now() - mountedAt.current;
    const delay = Math.max(SPLASH_MIN_VISIBLE_MS - elapsed, 0);

    const startFade = () => {
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: SPLASH_FADE_OUT_MS,
        useNativeDriver: true,
      }).start(() => setShowSplashLayer(false));
    };

    if (delay > 0) {
      const t = setTimeout(startFade, delay);
      return () => clearTimeout(t);
    }
    startFade();
  }, [splashDone, splashOpacity]);

  return (
    <View style={[styles.root, {backgroundColor: SPLASH_BG}]}>
      {children}
      {showSplashLayer && (
        <Animated.View style={[styles.overlay, {opacity: splashOpacity, backgroundColor: SPLASH_BG}]}>
          {/*
            Replace this View with your Lottie animation:
            <LottieView
              source={animationSource}
              style={StyleSheet.absoluteFill}
              autoPlay
              loop={false}
              onAnimationFinish={handleAnimationFinish}
            />
          */}
          {/* Placeholder - remove once you add real animation */}
          <View style={styles.placeholder} onLayout={handleAnimationFinish} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, overflow: 'hidden'},
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  placeholder: {flex: 1},
});
