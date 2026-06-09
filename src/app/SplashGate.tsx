import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import BootSplash from 'react-native-bootsplash';

/**
 * SplashGate
 *
 * Renders a custom splash screen overlay with the bonfire logo on top of the app content,
 * coordinates with the native react-native-bootsplash screen, and fades out smoothly
 * once the JS context is ready (with a minimum visible time of 1.5s).
 *
 * Usage:
 *   <SplashGate>
 *     <AppNavigator />
 *   </SplashGate>
 */

const SPLASH_FADE_OUT_MS = 350;
const SPLASH_MIN_VISIBLE_MS = 1500; // Let the beautiful fire animation display for a bit
const SPLASH_BG = '#F3D299'; // Matches the sand background color of BootSplash

type Props = {
  children: React.ReactNode;
};

export function SplashGate({children}: Props) {
  const [showSplashLayer, setShowSplashLayer] = useState(true);
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const flameAnim = useRef(new Animated.Value(0)).current;
  const mountedAt = useRef(Date.now());

  useEffect(() => {
    // Loop animation for the flickering flame
    // We sequence multiple timing stages to generate a natural, organic campfire flicker
    const flickerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(flameAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(flameAnim, {
          toValue: 0.3,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(flameAnim, {
          toValue: 0.9,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(flameAnim, {
          toValue: 0.1,
          duration: 140,
          useNativeDriver: true,
        }),
        Animated.timing(flameAnim, {
          toValue: 0.6,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(flameAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ])
    );

    flickerAnimation.start();

    const initSplashExit = async () => {
      // Hide the native splash screen immediately when JS is ready
      await BootSplash.hide({ fade: false });

      // Ensure the splash screen is visible for at least SPLASH_MIN_VISIBLE_MS
      const elapsed = Date.now() - mountedAt.current;
      const delay = Math.max(SPLASH_MIN_VISIBLE_MS - elapsed, 0);

      setTimeout(() => {
        Animated.timing(splashOpacity, {
          toValue: 0,
          duration: SPLASH_FADE_OUT_MS,
          useNativeDriver: true,
        }).start(() => {
          flickerAnimation.stop();
          setShowSplashLayer(false);
        });
      }, delay);
    };

    initSplashExit().catch((error) => {
      console.error('Failed to hide BootSplash:', error);
      setShowSplashLayer(false);
    });
  }, [splashOpacity, flameAnim]);

  // Interpolations for the flickering (bập bùng) effect:
  // 1. Scale bounces slightly between 0.94 and 1.08
  const flameScale = flameAnim.interpolate({
    inputRange: [0, 0.3, 0.6, 0.8, 1],
    outputRange: [0.94, 1.05, 0.97, 1.08, 1.0],
  });

  // 2. Opacity flickers between 0.85 and 1.0
  const flameOpacity = flameAnim.interpolate({
    inputRange: [0, 0.3, 0.6, 0.8, 1],
    outputRange: [0.85, 0.97, 0.9, 1.0, 0.95],
  });

  // 3. Subtle horizontal swaying (wind wobble)
  const flameTranslateX = flameAnim.interpolate({
    inputRange: [0, 0.3, 0.6, 0.8, 1],
    outputRange: [0, -2, 1.5, -1, 2],
  });

  // 4. Subtle vertical jumping (rising heat effect)
  const flameTranslateY = flameAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -4, 1],
  });

  return (
    <View style={[styles.root, {backgroundColor: SPLASH_BG}]}>
      {children}
      {showSplashLayer && (
        <Animated.View style={[styles.overlay, {opacity: splashOpacity, backgroundColor: SPLASH_BG}]}>
          <Animated.Image
            source={require('@assets/flame.png')}
            style={[
              styles.logo,
              {
                opacity: flameOpacity,
                transform: [
                  {scale: flameScale},
                  {translateX: flameTranslateX},
                  {translateY: flameTranslateY},
                ],
              },
            ]}
            resizeMode="contain"
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, overflow: 'hidden'},
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 160,
  },
});
