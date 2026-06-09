import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  StatusBar,
} from 'react-native';
import Svg, { Line as SvgLine, Path as SvgPath } from 'react-native-svg';
import { useKrog } from '../context/KrogStateContext';
import { WISDOM_POOL } from '../constants';
import { playClickVibe, playChiselVibe } from '../utils/vibe';
import { Volume2Icon, VolumeXIcon, FlameIcon } from '../components/icons';

interface FireFloat {
  id: number;
  text: string;
  x: number;
  y: number;
}

// Particle Ember Component
function EmberParticle({ delay }: { delay: number }) {
  const animY = useRef(new Animated.Value(0)).current;
  const animX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let active = true;
    const runEmber = () => {
      if (!active) return;
      animY.setValue(0);
      animX.setValue(0);
      opacity.setValue(0);

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(animY, {
            toValue: -100 - Math.random() * 60,
            duration: 1800 + Math.random() * 800,
            useNativeDriver: true,
          }),
          Animated.timing(animX, {
            toValue: (Math.random() - 0.5) * 60,
            duration: 1800 + Math.random() * 800,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.8,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start(() => {
        if (active) {
          runEmber();
        }
      });
    };
    runEmber();
    return () => {
      active = false;
    };
  }, [animY, animX, opacity, delay]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 50,
        width: 3 + Math.random() * 3,
        height: 3 + Math.random() * 3,
        borderRadius: 2,
        backgroundColor: '#f97316',
        transform: [{ translateY: animY }, { translateX: animX }],
        opacity: opacity,
        zIndex: 6,
      }}
    />
  );
}

// Animated floating text component (smoke/spark float style)
function SparkFloatText({ text, x, y }: { text: string; x: number; y: number }) {
  const animY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animY, {
        toValue: -90,
        duration: 1400,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [animY, opacity]);

  return (
    <Animated.View
      style={[
        styles.sparkFloat,
        {
          left: x,
          top: y,
          opacity: opacity,
          transform: [{ translateY: animY }],
        },
      ]}
    >
      <Text style={styles.sparkText}>{text}</Text>
    </Animated.View>
  );
}

export function WisdomScreen() {
  const {
    stones,
    shells,
    purchasedIds,
    soundEnabled,
    setSoundEnabled,
  } = useKrog();

  const [todayWisdom, setTodayWisdom] = useState(WISDOM_POOL[0]);
  const [dayOfYear, setDayOfYear] = useState(1);
  const [customQuoteIndex, setCustomQuoteIndex] = useState<number | null>(null);
  const [flameIntensity, setFlameIntensity] = useState(1.0);
  const [fireFloats, setFireFloats] = useState<FireFloat[]>([]);
  const [dinoTalk, setDinoTalk] = useState('');

  const hasVipCave = purchasedIds.includes('vip_cave_cert');
  const hasWarmBonfire = purchasedIds.includes('warm_bonfire');
  const hasMammoth = purchasedIds.includes('roasted_mammoth');
  const hasDino = purchasedIds.includes('funny_dino');

  // Multi-layered flame animation values (independent flickering & sways)
  const flameScaleOuter = useRef(new Animated.Value(1.0)).current;
  const flameScaleMiddle = useRef(new Animated.Value(1.0)).current;
  const flameScaleInner = useRef(new Animated.Value(1.0)).current;

  const flameSwayOuter = useRef(new Animated.Value(0)).current;
  const flameSwayMiddle = useRef(new Animated.Value(0)).current;

  // Spring surge animation when clicked
  const clickSurge = useRef(new Animated.Value(1.0)).current;

  // Companion animations
  const dinoBounceAnim = useRef(new Animated.Value(0)).current;
  const mammothSpin = useRef(new Animated.Value(0)).current;

  // Calculate day of year
  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);

    setDayOfYear(day);
    const index = day % WISDOM_POOL.length;
    setTodayWisdom(WISDOM_POOL[index]);
  }, []);

  // Multi-phase flame flickering & swaying loops
  useEffect(() => {
    let active = true;

    const loopOuterScale = () => {
      if (!active) return;
      Animated.sequence([
        Animated.timing(flameScaleOuter, {
          toValue: 0.95 + Math.random() * 0.15,
          duration: 250 + Math.random() * 150,
          useNativeDriver: true,
        }),
        Animated.timing(flameScaleOuter, {
          toValue: 1.0,
          duration: 250 + Math.random() * 150,
          useNativeDriver: true,
        }),
      ]).start(() => loopOuterScale());
    };

    const loopMiddleScale = () => {
      if (!active) return;
      Animated.sequence([
        Animated.timing(flameScaleMiddle, {
          toValue: 0.9 + Math.random() * 0.2,
          duration: 180 + Math.random() * 100,
          useNativeDriver: true,
        }),
        Animated.timing(flameScaleMiddle, {
          toValue: 1.0,
          duration: 180 + Math.random() * 100,
          useNativeDriver: true,
        }),
      ]).start(() => loopMiddleScale());
    };

    const loopInnerScale = () => {
      if (!active) return;
      Animated.sequence([
        Animated.timing(flameScaleInner, {
          toValue: 0.85 + Math.random() * 0.25,
          duration: 120 + Math.random() * 80,
          useNativeDriver: true,
        }),
        Animated.timing(flameScaleInner, {
          toValue: 1.0,
          duration: 120 + Math.random() * 80,
          useNativeDriver: true,
        }),
      ]).start(() => loopInnerScale());
    };

    const loopOuterSway = () => {
      if (!active) return;
      Animated.sequence([
        Animated.timing(flameSwayOuter, {
          toValue: -6 + Math.random() * 12,
          duration: 600 + Math.random() * 400,
          useNativeDriver: true,
        }),
        Animated.timing(flameSwayOuter, {
          toValue: 0,
          duration: 600 + Math.random() * 400,
          useNativeDriver: true,
        }),
      ]).start(() => loopOuterSway());
    };

    const loopMiddleSway = () => {
      if (!active) return;
      Animated.sequence([
        Animated.timing(flameSwayMiddle, {
          toValue: -10 + Math.random() * 20,
          duration: 400 + Math.random() * 300,
          useNativeDriver: true,
        }),
        Animated.timing(flameSwayMiddle, {
          toValue: 0,
          duration: 400 + Math.random() * 300,
          useNativeDriver: true,
        }),
      ]).start(() => loopMiddleSway());
    };

    loopOuterScale();
    loopMiddleScale();
    loopInnerScale();
    loopOuterSway();
    loopMiddleSway();

    return () => {
      active = false;
    };
  }, []);

  // Roasted mammoth rotation loop
  useEffect(() => {
    if (hasMammoth) {
      let active = true;
      const runMammoth = () => {
        if (!active) return;
        Animated.sequence([
          Animated.timing(mammothSpin, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(mammothSpin, {
            toValue: -1,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]).start(() => runMammoth());
      };
      runMammoth();
      return () => {
        active = false;
      };
    }
  }, [hasMammoth]);

  const handleFlameClick = () => {
    playClickVibe(soundEnabled);

    // Dynamic fire scale growth on tap
    setFlameIntensity((prev) => (prev >= 1.6 ? 1.0 : prev + 0.15));

    // Flare spring burst animation on click
    clickSurge.setValue(1.35);
    Animated.spring(clickSurge, {
      toValue: 1.0,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();

    const fireSparksText = [
      'Bộp! Lửa cháy to dữ dằn! 🔥',
      'Tí tách... Ấm quá xèo xèo! 🪵',
      'Thổi mạnh, quăng thêm củi nào!',
      'Krog xua tan sương mù núi Alps! ⛰️',
      'Sáng rực cả căn hang đá cổ rồi!',
      'Lửa reo tí tách sưởi ấm linh hồn krog! ✨',
      'Xèo xèo bùng cháy rực rỡ! 🔥',
    ];

    const randomText = fireSparksText[Math.floor(Math.random() * fireSparksText.length)];
    const id = Date.now() + Math.random();
    const newFloat: FireFloat = {
      id,
      text: randomText,
      x: 20 + Math.random() * 60,
      y: 60 + Math.random() * 30,
    };

    setFireFloats((prev) => [...prev, newFloat]);

    setTimeout(() => {
      setFireFloats((prev) => prev.filter((item) => item.id !== id));
    }, 1500);
  };

  const handleDinoClick = () => {
    playClickVibe(soundEnabled);

    // Jump bounce animation
    Animated.sequence([
      Animated.timing(dinoBounceAnim, {
        toValue: -15,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(dinoBounceAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(dinoBounceAnim, {
        toValue: -8,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(dinoBounceAnim, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();

    const dinoQuotes = [
      'Éc Éc! Krog bớt lười đi đập đá! 🦖',
      'Graoo! Sò bướng rơi ra mau! 🐚',
      'Éc éc! Sưởi ké mông ấm quá đi! 🔥',
      'Chụt chụt! Thèm thịt voi nướng cực! 🍖',
      'T-Rex nhí bái kiến Triệu Phú Krog! 👑',
      'Graoo! Đá nứt rồi, đập mạnh rầm rầm!',
    ];
    const rq = dinoQuotes[Math.floor(Math.random() * dinoQuotes.length)];
    setDinoTalk(rq);
    setTimeout(() => {
      setDinoTalk('');
    }, 2500);
  };

  const handleNextQuote = () => {
    playChiselVibe(soundEnabled);
    const currentIndex = customQuoteIndex !== null ? customQuoteIndex : (dayOfYear % WISDOM_POOL.length);
    const nextIndex = (currentIndex + 1) % WISDOM_POOL.length;
    setCustomQuoteIndex(nextIndex);
    setTodayWisdom(WISDOM_POOL[nextIndex]);
  };

  const handleResetToToday = () => {
    playClickVibe(soundEnabled);
    const index = dayOfYear % WISDOM_POOL.length;
    setCustomQuoteIndex(null);
    setTodayWisdom(WISDOM_POOL[index]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: '#120c08' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#120c08" animated />
      {/* App HUD Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🪓</Text>
          <View>
            <Text style={styles.logoSubtitle}>KROG</Text>
            <Text style={styles.logoTitle}>Hang Đá Ấm Cúng</Text>
          </View>
        </View>

        {/* Resources HUD */}
        <View style={styles.hudContainer}>
          <View style={styles.hudItem}>
            <Text style={styles.hudText}>🪨 {stones}</Text>
          </View>
          <View style={[styles.hudItem, { marginLeft: 8 }]}>
            <Text style={[styles.hudText, { color: '#6ee7b7' }]}>🐚 {shells}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            const nextState = !soundEnabled;
            setSoundEnabled(nextState);
            playClickVibe(nextState);
          }}
          style={styles.soundButton}
        >
          {soundEnabled ? (
            <Volume2Icon color="#f59e0b" size={18} />
          ) : (
            <VolumeXIcon color="#6b7280" size={18} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Bonfire Simulator Section */}
        <View style={styles.bonfireSection}>
          {/* Section Info Header */}
          <View style={styles.sectionInfo}>
            <View style={styles.flameBadge}>
              <FlameIcon color="#f59e0b" size={12} strokeWidth={2.5} />
              <Text style={styles.flameBadgeText}>
                {hasVipCave ? 'CUNG ĐIỆN NÚI LỬA 🌋' : 'HANG SƯỞI CỔ ĐẠI ⛺'}
              </Text>
            </View>
            <Text style={styles.sectionTitle}>
              {hasWarmBonfire ? '🔥 ĐỐNG LỬA VĨNH HẰNG' : 'MỒI LỬA NHÓM CỦI'}
            </Text>
          </View>

          {/* Interactive Bonfire Canvas */}
          <View style={styles.bonfireCanvas}>
            {/* Glowing Aura (Ambient Pulsing Heat) */}
            <Animated.View
              style={[
                styles.glowAura,
                {
                  transform: [
                    {
                      scale: flameScaleOuter.interpolate({
                        inputRange: [0.8, 1.2],
                        outputRange: [
                          flameIntensity * (hasWarmBonfire ? 1.55 : 1.1) * 0.9,
                          flameIntensity * (hasWarmBonfire ? 1.55 : 1.1) * 1.1,
                        ],
                      }),
                    },
                  ],
                  opacity: flameScaleOuter.interpolate({
                    inputRange: [0.8, 1.2],
                    outputRange: [0.45, 0.75],
                  }),
                },
              ]}
            />

            {/* Ember Particles */}
            <EmberParticle delay={0} />
            <EmberParticle delay={350} />
            <EmberParticle delay={700} />
            <EmberParticle delay={1050} />

            {/* Hearth Logs */}
            <View style={styles.logsContainer}>
              <Svg width="130" height="35" viewBox="0 0 100 25" style={styles.svgFlames}>
                <SvgLine x1="10" y1="18" x2="90" y2="18" stroke="#4a3728" strokeWidth="8" strokeLinecap="round" />
                <SvgLine x1="15" y1="20" x2="85" y2="13" stroke="#322216" strokeWidth="6" strokeLinecap="round" />
                <SvgLine x1="45" y1="22" x2="55" y2="10" stroke="#23170e" strokeWidth="5" strokeLinecap="round" />
              </Svg>
            </View>

            {/* FLAME STACK ENGINE (5 Flickering Layers) */}
            <View style={styles.flameContainer}>

              {/* Layer 1: Left Spark Flame */}
              <Animated.View
                style={[
                  styles.flameLayer,
                  {
                    width: 35,
                    height: 45,
                    left: 20,
                    bottom: 15,
                    opacity: 0.8,
                    transform: [
                      { scale: clickSurge },
                      {
                        translateY: flameScaleMiddle.interpolate({
                          inputRange: [0.8, 1.2],
                          outputRange: [3, -7],
                        }),
                      },
                      {
                        scale: flameScaleOuter.interpolate({
                          inputRange: [0.8, 1.2],
                          outputRange: [0.75, 1.25],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Svg viewBox="0 0 100 100" style={styles.svgFlames}>
                  <SvgPath
                    d="M30,25 C50,40 60,55 50,85 C40,95 25,95 15,85 C5,55 15,40 30,25 Z"
                    fill="#ea580c"
                  />
                </Svg>
              </Animated.View>

              {/* Layer 2: Right Spark Flame */}
              <Animated.View
                style={[
                  styles.flameLayer,
                  {
                    width: 35,
                    height: 45,
                    right: 20,
                    bottom: 15,
                    opacity: 0.8,
                    transform: [
                      { scale: clickSurge },
                      {
                        translateY: flameScaleInner.interpolate({
                          inputRange: [0.8, 1.2],
                          outputRange: [4, -6],
                        }),
                      },
                      {
                        scale: flameScaleMiddle.interpolate({
                          inputRange: [0.8, 1.2],
                          outputRange: [0.7, 1.3],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Svg viewBox="0 0 100 100" style={styles.svgFlames}>
                  <SvgPath
                    d="M70,25 C85,40 95,55 85,85 C75,95 60,95 50,85 C40,55 50,40 70,25 Z"
                    fill="#ea580c"
                  />
                </Svg>
              </Animated.View>

              {/* Layer 3: Main Outer Flame (Deep Orange) */}
              <Animated.View
                style={[
                  styles.flameLayer,
                  {
                    width: 100,
                    height: 110,
                    zIndex: 3,
                    transform: [
                      { translateX: flameSwayOuter },
                      { scaleY: clickSurge },
                      { scaleX: clickSurge },
                      {
                        scaleY: flameScaleOuter.interpolate({
                          inputRange: [0.8, 1.2],
                          outputRange: [
                            flameIntensity * (hasWarmBonfire ? 1.35 : 1.0) * 0.82,
                            flameIntensity * (hasWarmBonfire ? 1.35 : 1.0) * 1.18,
                          ],
                        }),
                      },
                      {
                        scaleX: flameScaleOuter.interpolate({
                          inputRange: [0.8, 1.2],
                          outputRange: [
                            (hasWarmBonfire ? 1.2 : 1.0) * 0.88,
                            (hasWarmBonfire ? 1.2 : 1.0) * 1.12,
                          ],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Svg viewBox="0 0 100 100" style={styles.svgFlames}>
                  <SvgPath
                    d="M50,3 C70,33 78,52 66,82 C56,92 44,92 34,82 C22,52 30,33 50,3 Z"
                    fill="#f97316"
                    opacity={0.88}
                  />
                </Svg>
              </Animated.View>

              {/* Layer 4: Middle Flame (Warm Golden Yellow) */}
              <Animated.View
                style={[
                  styles.flameLayer,
                  {
                    width: 80,
                    height: 90,
                    zIndex: 4,
                    transform: [
                      { translateX: flameSwayMiddle },
                      { scaleY: clickSurge },
                      { scaleX: clickSurge },
                      {
                        scaleY: flameScaleMiddle.interpolate({
                          inputRange: [0.8, 1.2],
                          outputRange: [
                            flameIntensity * (hasWarmBonfire ? 1.3 : 1.0) * 0.8,
                            flameIntensity * (hasWarmBonfire ? 1.3 : 1.0) * 1.2,
                          ],
                        }),
                      },
                      {
                        scaleX: flameScaleMiddle.interpolate({
                          inputRange: [0.8, 1.2],
                          outputRange: [
                            (hasWarmBonfire ? 1.15 : 1.0) * 0.85,
                            (hasWarmBonfire ? 1.15 : 1.0) * 1.15,
                          ],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Svg viewBox="0 0 100 100" style={styles.svgFlames}>
                  <SvgPath
                    d="M50,8 C66,36 71,50 63,78 C54,84 46,84 37,78 C29,50 34,36 50,8 Z"
                    fill="#f59e0b"
                    opacity={0.92}
                  />
                </Svg>
              </Animated.View>

              {/* Layer 5: Inner Core (Hot Light Yellow/White) */}
              <Animated.View
                style={[
                  styles.flameLayer,
                  {
                    width: 55,
                    height: 65,
                    zIndex: 5,
                    transform: [
                      { scaleY: clickSurge },
                      {
                        scaleY: flameScaleInner.interpolate({
                          inputRange: [0.8, 1.2],
                          outputRange: [
                            flameIntensity * 0.78,
                            flameIntensity * 1.22,
                          ],
                        }),
                      },
                      {
                        scaleX: flameScaleInner.interpolate({
                          inputRange: [0.8, 1.2],
                          outputRange: [0.82, 1.18],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Svg viewBox="0 0 100 100" style={styles.svgFlames}>
                  <SvgPath
                    d="M50,15 C60,40 64,52 58,75 C52,80 48,80 42,75 C36,52 40,40 50,15 Z"
                    fill="#fef08a"
                  />
                </Svg>
              </Animated.View>

            </View>

            {/* Mammoth Meat Roasting */}
            {hasMammoth && (
              <Animated.View
                style={[
                  styles.mammothContainer,
                  {
                    transform: [
                      {
                        rotate: mammothSpin.interpolate({
                          inputRange: [-1, 1],
                          outputRange: ['-8deg', '8deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {/* Visual support logs for the roasting spit */}
                <View style={styles.spitLine} />
                <Text style={styles.mammothEmoji}>🍖</Text>
                <View style={styles.mammothBadge}>
                  <Text style={styles.mammothText}>MAMÚT ĐANG NƯỚNG</Text>
                </View>
              </Animated.View>
            )}

            {/* Transparent Touch area exactly on top of flame zone */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={handleFlameClick}
              style={styles.touchFlameCover}
            />

            {/* Spark floats */}
            {fireFloats.map((float) => (
              <SparkFloatText
                key={float.id}
                text={float.text}
                x={float.x}
                y={float.y}
              />
            ))}

            {/* Dino Companion */}
            {hasDino && (
              <Animated.View
                style={[
                  styles.dinoContainer,
                  {
                    transform: [{ translateY: dinoBounceAnim }],
                  },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleDinoClick}
                  style={{ alignItems: 'center' }}
                >
                  {dinoTalk !== '' && (
                    <View style={styles.dinoBubble}>
                      <Text style={styles.dinoBubbleText}>{dinoTalk}</Text>
                    </View>
                  )}
                  <Text style={styles.dinoEmoji}>🦖</Text>
                  <View style={styles.dinoBadge}>
                    <Text style={styles.dinoText}>KHỦNG LONG ÉC</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>

          <Text style={styles.hintText}>
            🔥 {hasWarmBonfire ? 'Quăng thêm củi sưởi ấm hang Krog' : 'Nhấp nhẹ để đống lửa cháy to hơn'}
          </Text>
        </View>

        {/* Chipped Stone Tablet (Bia Đá Lời Răn) */}
        <View style={styles.quoteTablet}>
          <View style={styles.rockChippingTop} />
          <View style={styles.rockChippingBottom} />

          <Text style={styles.quoteQuoteOpen}>“</Text>
          <Text style={styles.quoteText}>{todayWisdom.content}</Text>
          <Text style={styles.quoteQuoteClose}>”</Text>

          <View style={styles.quoteFooterLine} />
          <Text style={styles.quoteDayText}>
            🌅 Bình minh ngày thứ {dayOfYear} của Krog
          </Text>
        </View>

        {/* Wooden Quote controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleNextQuote}
            style={styles.woodButton}
          >
            <View style={styles.woodButtonInner}>
              <Text style={styles.woodButtonText}>BẤM XIN QUẺ KHÁC ☘️</Text>
            </View>
          </TouchableOpacity>

          {customQuoteIndex !== null && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleResetToToday}
              style={styles.buttonReset}
            >
              <Text style={styles.buttonResetText}>VỀ HÔM NAY 🦕</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#251810',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 22,
    marginRight: 8,
  },
  logoSubtitle: {
    fontFamily: 'Pangolin-Regular',
    fontSize: 10,
    color: '#f59e0b',
    letterSpacing: 1,
  },
  logoTitle: {
    fontFamily: 'Pangolin-Regular',
    fontSize: 15,
    color: '#fef3c7',
    fontWeight: 'bold',
  },
  hudContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hudItem: {
    backgroundColor: '#251810',
    borderColor: '#4a321f',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  hudText: {
    fontFamily: 'Pangolin-Regular',
    fontSize: 12,
    color: '#fbbf24',
    fontWeight: 'bold',
  },
  soundButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4a321f',
    backgroundColor: '#251810',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  bonfireSection: {
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#3a271a',
    backgroundColor: '#1d120c',
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  sectionInfo: {
    alignItems: 'center',
    marginBottom: 8,
  },
  flameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#251810',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#f59e0b',
    marginBottom: 6,
  },
  flameBadgeText: {
    fontSize: 9,
    fontFamily: 'Pangolin-Regular',
    color: '#fef3c7',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  sectionTitle: {
    fontFamily: 'Pangolin-Regular',
    fontSize: 15,
    color: '#fef3c7',
    fontWeight: 'bold',
  },
  bonfireCanvas: {
    width: '100%',
    height: 230,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    paddingBottom: 15,
  },
  glowAura: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(251,146,60,0.18)',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 35,
    zIndex: 1,
    alignSelf: 'center',
    bottom: 25,
  },
  logsContainer: {
    width: 130,
    height: 35,
    zIndex: 2,
    position: 'absolute',
    bottom: 15,
  },
  flameContainer: {
    width: 140,
    height: 140,
    position: 'absolute',
    bottom: 25,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  flameLayer: {
    position: 'absolute',
    bottom: 12,
  },
  touchFlameCover: {
    position: 'absolute',
    width: 150,
    height: 150,
    bottom: 15,
    zIndex: 15,
  },
  svgFlames: {
    width: '100%',
    height: '100%',
  },
  hintText: {
    fontFamily: 'Pangolin-Regular',
    fontSize: 10,
    color: '#f59e0b',
    opacity: 0.7,
    marginTop: 8,
    textAlign: 'center',
  },
  mammothContainer: {
    position: 'absolute',
    top: 10,
    alignItems: 'center',
    zIndex: 10,
  },
  mammothEmoji: {
    fontSize: 26,
    zIndex: 11,
  },
  mammothBadge: {
    backgroundColor: '#451a03',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  mammothText: {
    color: '#fef3c7',
    fontSize: 7,
    fontFamily: 'Pangolin-Regular',
    fontWeight: 'bold',
  },
  spitLine: {
    position: 'absolute',
    top: 12,
    left: -60,
    right: -60,
    height: 4,
    backgroundColor: '#5c4e43',
    borderRadius: 2,
  },
  dinoContainer: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    alignItems: 'center',
    zIndex: 10,
  },
  dinoEmoji: {
    fontSize: 34,
  },
  dinoBadge: {
    backgroundColor: '#064e3b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
    borderWidth: 1.5,
    borderColor: '#34d399',
  },
  dinoText: {
    color: '#ecfdf5',
    fontSize: 7.5,
    fontFamily: 'Pangolin-Regular',
    fontWeight: 'bold',
  },
  dinoBubble: {
    position: 'absolute',
    top: -42,
    backgroundColor: '#251810',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#f59e0b',
    width: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  dinoBubbleText: {
    color: '#fef3c7',
    fontSize: 8.5,
    fontFamily: 'Pangolin-Regular',
    textAlign: 'center',
    lineHeight: 12,
  },
  sparkFloat: {
    position: 'absolute',
    backgroundColor: '#ffedd5',
    borderColor: '#f97316',
    borderWidth: 1.5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 20,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  sparkText: {
    color: '#431407',
    fontSize: 9,
    fontFamily: 'Pangolin-Regular',
    fontWeight: 'bold',
  },
  quoteTablet: {
    backgroundColor: '#dfdcd6',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#8c7f73',
    padding: 22,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  rockChippingTop: {
    position: 'absolute',
    top: -5,
    left: '20%',
    right: '20%',
    height: 8,
    backgroundColor: '#8c7f73',
    borderRadius: 4,
    opacity: 0.3,
  },
  rockChippingBottom: {
    position: 'absolute',
    bottom: -5,
    left: '30%',
    right: '30%',
    height: 8,
    backgroundColor: '#8c7f73',
    borderRadius: 4,
    opacity: 0.3,
  },
  quoteQuoteOpen: {
    fontFamily: 'Pangolin-Regular',
    fontSize: 56,
    fontWeight: 'bold',
    color: 'rgba(140,127,115,0.18)',
    position: 'absolute',
    top: 5,
    left: 15,
  },
  quoteQuoteClose: {
    fontFamily: 'Pangolin-Regular',
    fontSize: 56,
    fontWeight: 'bold',
    color: 'rgba(140,127,115,0.18)',
    position: 'absolute',
    bottom: -20,
    right: 15,
  },
  quoteText: {
    fontFamily: 'Pangolin-Regular',
    fontSize: 15,
    lineHeight: 23,
    color: '#382f28',
    textAlign: 'center',
    paddingHorizontal: 12,
    zIndex: 2,
  },
  quoteFooterLine: {
    width: 70,
    height: 2,
    backgroundColor: 'rgba(140,127,115,0.3)',
    marginTop: 14,
    marginBottom: 8,
  },
  quoteDayText: {
    fontFamily: 'Pangolin-Regular',
    fontSize: 9.5,
    color: '#8c7f73',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  woodButton: {
    backgroundColor: '#7c2d12',
    borderWidth: 3,
    borderColor: '#451a03',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 3,
  },
  woodButtonInner: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  woodButtonText: {
    fontFamily: 'Pangolin-Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fef3c7',
    letterSpacing: 0.5,
  },
  buttonReset: {
    marginLeft: 16,
  },
  buttonResetText: {
    fontFamily: 'Pangolin-Regular',
    fontSize: 11,
    color: '#f59e0b',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
