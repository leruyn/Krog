import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import Svg, { Polygon, Path } from 'react-native-svg';
import { useKrog } from '../context/KrogStateContext';
import { playClickVibe, playSmashVibe, playChiselVibe } from '../utils/vibe';
import { Particle, FloatText } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function CrusherScreen() {
  const {
    stones,
    addStones,
    shells,
    addShells,
    purchasedIds,
    purchaseItem,
    soundEnabled,
    resetAll,
  } = useKrog();

  const [activeSubView, setActiveSubView] = useState<'smash' | 'shop'>('smash');
  const [crackSeverity, setCrackSeverity] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatTexts, setFloatTexts] = useState<FloatText[]>([]);
  const [isHitting, setIsHitting] = useState(false);

  const expressions = [
    'Oải lắm! Đập thêm!',
    'Hả giáp! Rầm!',
    'Sếp la krog? Bốp!',
    'Yêu đơn phương? Cút!',
    'Rời phố về hang đập đá!',
    'Đá mẻ rồi, đập mạnh!',
    'Tránh ra, krog đang điên!',
  ];

  const shopItems = [
    {
      id: 'spoon',
      name: 'Thìa Đá Oog-Ruk',
      desc: 'Công cụ xúc đá tốc độ thấp. Đập đá +2 đá mỗi phát!',
      stoneCost: 20,
      shellCost: 0,
      emoji: '🥄',
    },
    {
      id: 'axe_bronze',
      name: 'Rìu Đồng Đại Tộc',
      desc: 'Hỏa lực siêu cấp. Đập đá +5 đá và tăng tỉ lệ lượm sò!',
      stoneCost: 50,
      shellCost: 5,
      emoji: '🪓',
    },
    {
      id: 'chisel_gold',
      name: 'Đục Thạch Anh Hoàng Gia',
      desc: 'Được chạm khắc sắc lẹm từ thạch anh núi lửa. Đập đá +10 đá mỗi phát!',
      stoneCost: 120,
      shellCost: 10,
      emoji: '🔱',
    },
    {
      id: 'drill_crystal',
      name: 'Khoan Kim Cương Sấm Sét',
      desc: 'Hàng tuyển sấm truyền thời đồ đá. Đập đá +25 đá một cú rầm rầm!',
      stoneCost: 300,
      shellCost: 25,
      emoji: '⚡',
    },
    {
      id: 'glove_infinity',
      name: 'Găng Tay Krog Vô Cực',
      desc: 'Bảo bối Thanos tối thượng thung lũng hoang dã. Đập đá +60 đá, sò rơi 95%!',
      stoneCost: 650,
      shellCost: 50,
      emoji: '🥊',
    },
    {
      id: 'roasted_mammoth',
      name: 'Thịt Voi Ma Mút',
      desc: 'Hương vị béo ngậy nướng lá dâu rừng thơm phức sưởi ấm bụng đói Krog.',
      stoneCost: 30,
      shellCost: 2,
      emoji: '🍖',
    },
    {
      id: 'warm_bonfire',
      name: 'Ngọn Lửa Sưởi Hang',
      desc: 'Bập bùng sưởi ấm, giúp vơi đi sương mù tối tăm cô độc thâm sâu lâu năm.',
      stoneCost: 45,
      shellCost: 3,
      emoji: '🔥',
    },
    {
      id: 'funny_dino',
      name: 'Bé Khủng Long T-Rex Éc Éc',
      desc: 'Một quả trứng nứt ra chú T-Rex siêu dễ thương đi loanh quanh hú ré động viên Krog.',
      stoneCost: 110,
      shellCost: 8,
      emoji: '🦖',
    },
    {
      id: 'tribal_gong',
      name: 'Chiêng Đồng Tộc Gọi Bầy',
      desc: 'Gõ phát rầm rầm kêu gọi anh em gom cổ vật, tăng tỉ lệ rớt vỏ sò thêm +10%!',
      stoneCost: 180,
      shellCost: 18,
      emoji: '🔔',
    },
    {
      id: 'vip_cave_cert',
      name: 'Sổ Đỏ Hang VIP',
      desc: 'Chủ sở hữu danh giá hang đá độc quyền có cách âm chống bão dông hú gió bấc.',
      stoneCost: 150,
      shellCost: 15,
      emoji: '🌋',
    },
    {
      id: 'ancient_paint',
      name: 'Cọ Vẽ Vẽ Bậy Tổ Tiên',
      desc: 'Nhựa quả mâm xôi để nguệch ngoạc hổ báo bờm ngựa lên vách hang xả trét hết sẩy.',
      stoneCost: 80,
      shellCost: 4,
      emoji: '🎨',
    },
    {
      id: 'title_billionaire',
      name: 'Danh Hiệu Triệu Phú Sò',
      desc: 'Khiến tộc nhân nể sợ, dâng hiến dưa hấu hoang mỗi buổi sáng.',
      stoneCost: 250,
      shellCost: 30,
      emoji: '👑',
    },
  ];

  // Upgrades configurations
  let clickMultiplier = 1;
  let shellChance = 0.3;
  let toolLabel = 'Đập tay không (1x)';
  let toolEmoji = '✊';

  if (purchasedIds.includes('glove_infinity')) {
    clickMultiplier = 60;
    shellChance = 0.9;
    toolLabel = '⚡ Găng Tay Krog Vô Cực (60x!)';
    toolEmoji = '🥊';
  } else if (purchasedIds.includes('drill_crystal')) {
    clickMultiplier = 25;
    shellChance = 0.75;
    toolLabel = '🌪️ Khoan Kim Cương Sấm (25x!)';
    toolEmoji = '⚡';
  } else if (purchasedIds.includes('chisel_gold')) {
    clickMultiplier = 10;
    shellChance = 0.61;
    toolLabel = '🔱 Đục Thạch Anh Hoàng Gia (10x!)';
    toolEmoji = '🔱';
  } else if (purchasedIds.includes('axe_bronze')) {
    clickMultiplier = 5;
    shellChance = 0.5;
    toolLabel = '🪓 Rìu Đồng đại tộc (5x!)';
    toolEmoji = '🪓';
  } else if (purchasedIds.includes('spoon')) {
    clickMultiplier = 2;
    shellChance = 0.4;
    toolLabel = '🥄 Thìa Oog-Ruk (2x!)';
    toolEmoji = '🥄';
  }

  if (purchasedIds.includes('tribal_gong')) {
    shellChance = Math.min(0.95, shellChance + 0.1);
  }

  // Particle updates loop (optimized with boolean dependency to prevent tearing down the animation frame)
  const hasParticles = particles.length > 0;
  useEffect(() => {
    if (!hasParticles) return;
    let frameId: number;
    const updatePhysics = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.6, // Gravity
            rotation: p.rotation + p.vx * 2.5,
          }))
          .filter((p) => p.y < 350 && p.x > -50 && p.x < SCREEN_WIDTH - 20)
      );
      frameId = requestAnimationFrame(updatePhysics);
    };
    frameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(frameId);
  }, [hasParticles]);

  const handleSmashPress = (event: any) => {
    playSmashVibe(soundEnabled);
    setIsHitting(true);
    setTimeout(() => setIsHitting(false), 90);

    const clickStones = clickMultiplier;
    const clickShells = Math.random() < shellChance ? 1 : 0;

    addStones(clickStones);
    if (clickShells > 0) {
      addShells(clickShells);
    }

    // Capture tap position inside bounding box
    const x = event.nativeEvent.locationX || 100;
    const y = event.nativeEvent.locationY || 100;

    setCrackSeverity((prev) => {
      const next = prev + 1;
      if (next >= 12) {
        setTimeout(() => setCrackSeverity(0), 400);
        return 12;
      }
      return next;
    });

    // Make particles (reduced to 3 per click, and capped at max 15 active particles to ensure UI smoothness)
    const nextParticles: Particle[] = [];
    for (let i = 0; i < 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      nextParticles.push({
        id: Date.now() + i + Math.random(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 4 + Math.random() * 6,
        rotation: Math.random() * 360,
      });
    }
    setParticles((prev) => {
      const combined = [...prev, ...nextParticles];
      if (combined.length > 15) {
        return combined.slice(combined.length - 15);
      }
      return combined;
    });

    // Floating text yield (capped at max 5 active floating texts)
    const funnyText =
      clickShells > 0 ? `+${clickStones} Đá & +1 Sò! 🐚` : `+${clickStones} Đá Rừng! 🪨`;
    const randomKrogSpeak = expressions[Math.floor(Math.random() * expressions.length)];
    const floatingMsg = Math.random() < 0.4 ? randomKrogSpeak : funnyText;

    const floatId = Date.now() + Math.random();
    setFloatTexts((prev) => {
      const combined = [
        ...prev,
        {
          id: floatId,
          x: x - 40,
          y: y - 25,
          text: floatingMsg,
        },
      ];
      if (combined.length > 5) {
        return combined.slice(combined.length - 5);
      }
      return combined;
    });

    setTimeout(() => {
      setFloatTexts((prev) => prev.filter((f) => f.id !== floatId));
    }, 1200);
  };

  const handleBuy = (item: typeof shopItems[0]) => {
    if (purchasedIds.includes(item.id)) return;

    if (stones < item.stoneCost || shells < item.shellCost) {
      Alert.alert(
        'Thất bại',
        'Krog chưa gom đủ đá núi hoặc vỏ sò lấp lánh rồi!',
        [{ text: 'Đóng' }]
      );
      return;
    }

    playChiselVibe(soundEnabled);
    purchaseItem(item.id, item.stoneCost, item.shellCost);

    Alert.alert(
      'Tậu đồ mới',
      `Chúc mừng Krog đã sở hữu thành công ${item.name}!`,
      [{ text: 'Hú hú!' }]
    );
  };

  const handleResetPocket = () => {
    Alert.alert(
      'Hỏi Tộc Trưởng',
      'Krog muốn trả hết đá, vỏ sò và đồ đạc Oog-Ruk về rừng xưa không?',
      [
        { text: 'Suy nghĩ lại', style: 'cancel' },
        {
          text: 'Trả hết!',
          style: 'destructive',
          onPress: () => {
            playClickVibe(soundEnabled);
            resetAll();
            setCrackSeverity(0);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Pocket stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statEmoji}>🪨</Text>
            <View>
              <Text style={styles.statLabel}>Đá lượm được</Text>
              <Text style={styles.statVal}>{stones}</Text>
            </View>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statEmoji}>🐚</Text>
            <View>
              <Text style={styles.statLabel}>Sò quý đổi thịt</Text>
              <Text style={styles.statVal}>{shells}</Text>
            </View>
          </View>
        </View>

        {/* Tab switch buttons */}
        <View style={styles.tabToggleRow}>
          <TouchableOpacity
            onPress={() => {
              playClickVibe(soundEnabled);
              setActiveSubView('smash');
            }}
            style={[styles.toggleBtn, activeSubView === 'smash' && styles.activeToggleBtn]}
          >
            <Text
              style={[
                styles.toggleBtnText,
                activeSubView === 'smash' && styles.activeToggleBtnText,
              ]}
            >
              🪨 Đập Đá Ngày Đêm
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              playClickVibe(soundEnabled);
              setActiveSubView('shop');
            }}
            style={[
              styles.toggleBtn,
              activeSubView === 'shop' && styles.activeToggleBtn,
              styles.shopToggleBtn,
            ]}
          >
            <Text
              style={[
                styles.toggleBtnText,
                activeSubView === 'shop' && styles.activeToggleBtnText,
              ]}
            >
              🏪 Tiệm Đồ Oog-Ruk
            </Text>
            {purchasedIds.length > 0 && (
              <View style={styles.shopCountBadge}>
                <Text style={styles.shopCountText}>{purchasedIds.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Dynamic Views */}
        {activeSubView === 'smash' ? (
          <View style={styles.smashWrapper}>
            <Text style={styles.toolTitle}>
              {clickMultiplier > 1 ? `⚒️ Đang cầm: ${toolLabel}` : 'Chạm liên tục để mài sắc tảng đá xả xì-trét'}
            </Text>

            {/* Clickable Rock Container */}
            <View style={styles.rockArea}>
              <View
                onTouchStart={handleSmashPress}
                style={[
                  styles.rockCircle,
                  {
                    transform: [{ scale: isHitting ? 0.92 : 1.05 }],
                  },
                ]}
              >
                <Svg viewBox="0 0 100 100" style={styles.svgRock}>
                  {/* Rock polygons */}
                  <Polygon
                    points="20,40 30,20 60,15 85,35 90,65 70,85 35,90 12,70"
                    fill="#7a7065"
                    stroke="#433b35"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                  />
                  <Polygon points="30,22 58,18 80,36 50,50" fill="#a39689" opacity="0.35" />
                  <Polygon points="32,87 70,82 85,65 60,65" fill="#2a2521" opacity="0.25" />

                  {/* Fissures */}
                  {crackSeverity > 0 && (
                    <Path d="M 50,50 L 30,35 M 50,50 L 70,40" stroke="#1c1815" strokeWidth="2.5" strokeLinecap="round" />
                  )}
                  {crackSeverity > 3 && (
                    <Path d="M 30,35 L 20,45 M 70,40 L 85,45 M 50,50 L 55,75" stroke="#1c1815" strokeWidth="2.5" strokeLinecap="round" />
                  )}
                  {crackSeverity > 6 && (
                    <Path d="M 55,75 L 35,85 M 55,75 L 75,82 M 30,35 L 45,20" stroke="#1c1815" strokeWidth="3" strokeLinecap="round" />
                  )}
                  {crackSeverity > 9 && (
                    <Path d="M 12,70 L 40,50 L 90,65" stroke="#0e0a08" strokeWidth="4" strokeLinecap="round" />
                  )}
                </Svg>

                {/* Tool Emoji inside */}
                <Text style={styles.toolEmojiOnRock}>{toolEmoji}</Text>

                {/* Shard Particles */}
                {particles.map((p) => (
                  <View
                    key={p.id}
                    style={[
                      styles.particleShard,
                      {
                        left: p.x,
                        top: p.y,
                        width: p.size,
                        height: p.size,
                        transform: [{ rotate: `${p.rotation}deg` }],
                      },
                    ]}
                  />
                ))}

                {/* Floating Texts */}
                {floatTexts.map((f) => (
                  <View
                    key={f.id}
                    style={[
                      styles.floatTextMsg,
                      {
                        left: f.x,
                        top: f.y,
                      },
                    ]}
                  >
                    <Text style={styles.floatTextMsgText}>{f.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : (
          /* Shop view list */
          <ScrollView style={styles.shopScroll} bounces={true}>
            <View style={styles.shopIntroBox}>
              <Text style={styles.shopIntroTitle}>⛺ Bộ Tộc Oog-Ruk Chào Bạn!</Text>
              <Text style={styles.shopIntroDesc}>
                Trao đổi vỏ sò lấp lánh và đá thô lượm trên núi để đổi lấy tư trang cực xịn sưởi ấm hang lạnh.
              </Text>
            </View>

            <View style={styles.shopList}>
              {shopItems.map((item) => {
                const isPurchased = purchasedIds.includes(item.id);
                const canAfford = stones >= item.stoneCost && shells >= item.shellCost;

                return (
                  <View
                    key={item.id}
                    style={[styles.shopItemCard, isPurchased && styles.shopItemCardPurchased]}
                  >
                    <View style={styles.shopItemLeft}>
                      <Text style={styles.shopItemEmoji}>{item.emoji}</Text>
                      <View style={styles.shopItemDetails}>
                        <View style={styles.shopItemTitleRow}>
                          <Text style={styles.shopItemName}>{item.name}</Text>
                          {isPurchased && (
                            <View style={styles.ownedBadge}>
                              <Text style={styles.ownedBadgeText}>SỞ HỮU</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.shopItemDesc}>{item.desc}</Text>
                        <Text style={styles.shopItemPrice}>
                          Giá: 🪨 {item.stoneCost}
                          {item.shellCost > 0 ? `  |  🐚 ${item.shellCost}` : ''}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleBuy(item)}
                      disabled={isPurchased}
                      style={[
                        styles.buyBtn,
                        isPurchased
                          ? styles.buyBtnPurchased
                          : canAfford
                          ? styles.buyBtnAfford
                          : styles.buyBtnCantAfford,
                      ]}
                    >
                      <Text
                        style={[
                          styles.buyBtnText,
                          isPurchased
                            ? styles.buyBtnTextPurchased
                            : canAfford
                            ? styles.buyBtnTextAfford
                            : styles.buyBtnTextCantAfford,
                        ]}
                      >
                        {isPurchased ? 'Sở hữu' : 'Đổi'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}

        {/* Footer controls row */}
        <View style={styles.footerRow}>
          <TouchableOpacity onPress={handleResetPocket} style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>Để Đá Lại Rừng 🏔️</Text>
          </TouchableOpacity>

          <Text style={styles.footerCount}>
            ✨ Đã sắm {purchasedIds.length}/{shopItems.length} bảo bối
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#faf8f5',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(120,53,4,0.06)',
    borderColor: 'rgba(120,53,4,0.1)',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 4,
  },
  statEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  statLabel: {
    fontFamily: 'monospace',
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#92400e',
    textTransform: 'uppercase',
  },
  statVal: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '900',
    color: '#451a03',
    marginTop: 2,
  },
  tabToggleRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(120,53,4,0.1)',
    padding: 2,
    borderRadius: 10,
    backgroundColor: 'rgba(244,241,234,0.6)',
    marginBottom: 12,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeToggleBtn: {
    backgroundColor: '#78350f',
  },
  shopToggleBtn: {
    flexDirection: 'row',
  },
  toggleBtnText: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    color: 'rgba(120,53,4,0.6)',
  },
  activeToggleBtnText: {
    color: '#fef3c7',
  },
  shopCountBadge: {
    backgroundColor: '#dc2626',
    borderRadius: 6,
    paddingHorizontal: 4,
    marginLeft: 4,
  },
  shopCountText: {
    color: '#fff',
    fontSize: 7,
    fontWeight: 'bold',
  },
  smashWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  toolTitle: {
    fontFamily: 'monospace',
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#92400e',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  rockArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rockCircle: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svgRock: {
    width: '100%',
    height: '100%',
  },
  toolEmojiOnRock: {
    position: 'absolute',
    fontSize: 22,
    zIndex: 10,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  particleShard: {
    position: 'absolute',
    backgroundColor: '#504840',
    borderColor: '#2a2521',
    borderWidth: 0.5,
    zIndex: 15,
  },
  floatTextMsg: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderColor: 'rgba(120,53,4,0.2)',
    borderWidth: 0.5,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  floatTextMsgText: {
    fontFamily: 'monospace',
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#5c4a3c',
  },
  shopScroll: {
    flex: 1,
  },
  shopIntroBox: {
    backgroundColor: '#ffedd5',
    borderColor: '#fed7aa',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  shopIntroTitle: {
    fontFamily: 'monospace',
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#7c2d12',
  },
  shopIntroDesc: {
    fontSize: 9,
    color: '#9a3412',
    lineHeight: 13,
    marginTop: 2,
  },
  shopList: {
    paddingBottom: 20,
  },
  shopItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(244,241,234,0.7)',
    borderColor: 'rgba(120,53,4,0.15)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    marginBottom: 8,
  },
  shopItemCardPurchased: {
    opacity: 0.65,
    backgroundColor: 'rgba(120,53,4,0.02)',
    borderColor: 'rgba(120,53,4,0.05)',
  },
  shopItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  shopItemEmoji: {
    fontSize: 24,
    backgroundColor: '#eae2d5',
    borderWidth: 1,
    borderColor: 'rgba(120,53,4,0.1)',
    borderRadius: 10,
    padding: 6,
    textAlign: 'center',
    overflow: 'hidden',
  },
  shopItemDetails: {
    marginLeft: 8,
    flex: 1,
  },
  shopItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopItemName: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#451a03',
  },
  ownedBadge: {
    backgroundColor: '#059669',
    borderRadius: 3,
    paddingHorizontal: 3,
    paddingVertical: 0.5,
    marginLeft: 4,
  },
  ownedBadgeText: {
    color: '#fff',
    fontSize: 6,
    fontWeight: 'bold',
  },
  shopItemDesc: {
    fontSize: 8.5,
    color: '#78350f',
    opacity: 0.8,
    marginTop: 1.5,
    lineHeight: 12,
  },
  shopItemPrice: {
    fontFamily: 'monospace',
    fontSize: 8,
    fontWeight: 'bold',
    color: '#92400e',
    marginTop: 4,
  },
  buyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  buyBtnPurchased: {
    backgroundColor: '#e5e7eb',
  },
  buyBtnAfford: {
    backgroundColor: '#ea580c',
  },
  buyBtnCantAfford: {
    backgroundColor: 'rgba(120,53,4,0.1)',
  },
  buyBtnText: {
    fontFamily: 'monospace',
    fontSize: 9,
    fontWeight: 'bold',
  },
  buyBtnTextPurchased: {
    color: '#9ca3af',
  },
  buyBtnTextAfford: {
    color: '#fff',
  },
  buyBtnTextCantAfford: {
    color: 'rgba(120,53,4,0.4)',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(120,53,4,0.08)',
    paddingTop: 10,
    marginTop: 8,
  },
  resetBtn: {
    backgroundColor: '#e8e3d5',
    borderColor: 'rgba(120,53,4,0.15)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  resetBtnText: {
    fontFamily: 'monospace',
    fontSize: 8.5,
    color: '#78350f',
    fontWeight: 'bold',
  },
  footerCount: {
    fontFamily: 'monospace',
    fontSize: 8.5,
    color: '#92400e',
    fontStyle: 'italic',
  },
});
