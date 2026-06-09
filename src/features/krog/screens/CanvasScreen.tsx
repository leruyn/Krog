import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useKrog } from '../context/KrogStateContext';
import { playClickVibe, playScratchVibe } from '../utils/vibe';
import {
  RotateCcwIcon,
  RotateCwIcon,
  Trash2Icon,
} from '../components/icons';
import { LineStroke } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function CanvasScreen() {
  const { purchasedIds, soundEnabled } = useKrog();

  const [lines, setLines] = useState<LineStroke[]>([]);
  const [currentLine, setCurrentLine] = useState<LineStroke | null>(null);
  const [selectedColor, setSelectedColor] = useState('#2a2521');
  const [selectedWidth, setSelectedWidth] = useState(6);
  const [canvasCleared, setCanvasCleared] = useState(false);

  // Undo/Redo stacks
  const [strokeHistory, setStrokeHistory] = useState<LineStroke[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const premiumPaintUnlocked = purchasedIds.includes('ancient_paint');

  const baseColors = [
    { name: 'Than Củi (Charcoal)', value: '#2a2521' },
    { name: 'Đất Sét Đỏ (Ochre)', value: '#aa4d3d' },
    { name: 'Rêu Phong (Moss)', value: '#436130' },
    { name: 'Vỏ Sò Trắng (Chalk)', value: '#faf8f5' },
  ];

  const colors = premiumPaintUnlocked
    ? [
        ...baseColors,
        { name: 'Quả Mâm Xôi (Raspberry Pink)', value: '#c21d7b' },
        { name: 'Hoàng Tổ Kim (Tribal Amber)', value: '#d97706' },
        { name: 'Lam Ngọc Bích (Teal)', value: '#06b6d4' },
        { name: 'Mắc Ma (Volcano Orange)', value: '#f97316' },
      ]
    : baseColors;

  const widths = [
    { label: 'Thanh', value: 3 },
    { label: 'Vừa', value: 6 },
    { label: 'Thô', value: 12 },
  ];

  // Store selections in refs for PanResponder closures
  const colorRef = useRef(selectedColor);
  const widthRef = useRef(selectedWidth);
  const activePointsRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    colorRef.current = selectedColor;
  }, [selectedColor]);

  useEffect(() => {
    widthRef.current = selectedWidth;
  }, [selectedWidth]);

  // Convert points to SVG Path
  const pointsToPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    return points
      .map((p, idx) => {
        if (idx === 0) return `M ${p.x} ${p.y}`;
        return `L ${p.x} ${p.y}`;
      })
      .join(' ');
  };

  // PanResponder to track gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        activePointsRef.current = [{ x: locationX, y: locationY }];
        setCurrentLine({
          points: activePointsRef.current,
          color: colorRef.current,
          width: widthRef.current,
        });
        playScratchVibe(soundEnabled);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const lastPt = activePointsRef.current[activePointsRef.current.length - 1];

        // Only add points if moved slightly to save drawing overhead
        if (lastPt) {
          const dist = Math.hypot(locationX - lastPt.x, locationY - lastPt.y);
          if (dist > 3) {
            activePointsRef.current = [
              ...activePointsRef.current,
              { x: locationX, y: locationY },
            ];
            setCurrentLine({
              points: activePointsRef.current,
              color: colorRef.current,
              width: widthRef.current,
            });
            if (Math.random() < 0.25) {
              playScratchVibe(soundEnabled);
            }
          }
        }
      },
      onPanResponderRelease: () => {
        if (activePointsRef.current.length > 0) {
          const newLine: LineStroke = {
            points: activePointsRef.current,
            color: colorRef.current,
            width: widthRef.current,
          };
          setLines((prev) => {
            const next = [...prev, newLine];
            // Push to history
            const newHistory = strokeHistory.slice(0, historyIndex + 1);
            newHistory.push(next);
            setStrokeHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
            return next;
          });
        }
        setCurrentLine(null);
        activePointsRef.current = [];
      },
    })
  ).current;

  const handleUndo = () => {
    if (historyIndex > 0) {
      playClickVibe(soundEnabled);
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setLines(strokeHistory[nextIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < strokeHistory.length - 1) {
      playClickVibe(soundEnabled);
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setLines(strokeHistory[nextIndex]);
    }
  };

  const handleClear = () => {
    playClickVibe(soundEnabled);
    const updatedLines: LineStroke[] = [];
    setLines(updatedLines);

    const newHistory = strokeHistory.slice(0, historyIndex + 1);
    newHistory.push(updatedLines);
    setStrokeHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    setCanvasCleared(true);
    setTimeout(() => setCanvasCleared(false), 1000);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Screen Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Vách Đá Tự Sự</Text>
            <Text style={styles.headerSubtitle}>Khắc ý nghĩ lơ lửng của Krog...</Text>
          </View>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={handleUndo}
              disabled={historyIndex === 0}
              style={[styles.actionBtn, historyIndex === 0 && styles.disabledBtn]}
            >
              <RotateCcwIcon color="#78350f" size={16} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRedo}
              disabled={historyIndex === strokeHistory.length - 1}
              style={[
                styles.actionBtn,
                historyIndex === strokeHistory.length - 1 && styles.disabledBtn,
              ]}
            >
              <RotateCwIcon color="#78350f" size={16} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleClear} style={styles.actionBtn}>
              <Trash2Icon color="#b91c1c" size={16} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Board Canvas */}
        <View
          collapsable={false}
          {...panResponder.panHandlers}
          style={styles.canvasContainer}
        >
          {/* Background Grid Pattern (Simulates rock texturing/drawing lines) */}
          <View style={styles.backgroundTexturing}>
            {Array.from({ length: 15 }).map((_, i) => (
              <View
                key={`h-${i}`}
                style={[styles.gridLineH, { top: i * 30 }]}
              />
            ))}
            {Array.from({ length: 15 }).map((_, i) => (
              <View
                key={`v-${i}`}
                style={[styles.gridLineV, { left: i * 30 }]}
              />
            ))}
          </View>

          {/* SVG Vector Drawing */}
          <Svg style={StyleSheet.absoluteFill}>
            {lines.map((line, idx) => (
              <Path
                key={idx}
                d={pointsToPath(line.points)}
                stroke={line.color}
                strokeWidth={line.width}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {currentLine && (
              <Path
                d={pointsToPath(currentLine.points)}
                stroke={currentLine.color}
                strokeWidth={currentLine.width}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </Svg>

          {/* Canvas Cleared Overlay Popup */}
          {canvasCleared && (
            <View style={styles.popupOverlay}>
              <Text style={styles.popupText}>✨ ĐÃ LAU SẠCH VÁCH HANG</Text>
            </View>
          )}

          {/* Empty State Help Text */}
          {lines.length === 0 && !currentLine && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>🐚</Text>
              <Text style={styles.emptyStateText}>
                Vẽ bất cứ thứ gì bạn muốn quăng đi. Lau bằng nút đỏ.
              </Text>
            </View>
          )}
        </View>

        {/* Color and Thickness controls */}
        <View style={styles.controlsSection}>
          {/* Color selectors */}
          <View style={styles.pickerRow}>
            <View style={styles.pickerLabelContainer}>
              <Text style={styles.pickerLabel}>Màu sắc:</Text>
              {premiumPaintUnlocked && (
                <Text style={styles.premiumBadge}>✨ VIP</Text>
              )}
            </View>

            <View style={styles.colorPalette}>
              {colors.map((color) => {
                const isSelected = selectedColor === color.value;
                return (
                  <TouchableOpacity
                    key={color.value}
                    onPress={() => {
                      setSelectedColor(color.value);
                      playClickVibe(soundEnabled);
                    }}
                    style={[
                      styles.colorCircle,
                      {
                        backgroundColor: color.value,
                        borderColor: isSelected ? '#78350f' : 'rgba(0,0,0,0.1)',
                        transform: [{ scale: isSelected ? 1.2 : 1.0 }],
                      },
                    ]}
                  >
                    {isSelected && <View style={styles.selectedInnerDot} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Width selectors */}
          <View style={styles.pickerRow}>
            <Text style={styles.pickerLabel}>Cỡ nét:</Text>
            <View style={styles.widthsContainer}>
              {widths.map((w) => {
                const isSelected = selectedWidth === w.value;
                return (
                  <TouchableOpacity
                    key={w.value}
                    onPress={() => {
                      setSelectedWidth(w.value);
                      playClickVibe(soundEnabled);
                    }}
                    style={[
                      styles.widthOption,
                      {
                        backgroundColor: isSelected ? '#78350f' : '#eae5d8',
                        borderColor: isSelected ? '#451a03' : 'rgba(120,53,4,0.1)',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.widthOptionText,
                        { color: isSelected ? '#fef3c7' : '#78350f' },
                      ]}
                    >
                      {w.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#451a03',
  },
  headerSubtitle: {
    fontFamily: 'sans-serif',
    fontSize: 10,
    color: '#78350f',
    fontStyle: 'italic',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(120,53,4,0.06)',
    padding: 4,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(120,53,4,0.1)',
  },
  actionBtn: {
    padding: 6,
    marginHorizontal: 2,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.25,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: '#f5f2e9',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(120,53,4,0.15)',
    borderStyle: 'dashed',
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundTexturing: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(42,37,33,0.03)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(42,37,33,0.03)',
  },
  popupOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(250,248,245,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  popupText: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#78350f',
    letterSpacing: 1,
  },
  emptyState: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    pointerEvents: 'none',
  },
  emptyStateEmoji: {
    fontSize: 28,
    marginBottom: 8,
    opacity: 0.35,
  },
  emptyStateText: {
    fontFamily: 'monospace',
    fontSize: 10.5,
    color: '#78350f',
    textAlign: 'center',
    opacity: 0.45,
    lineHeight: 16,
    maxWidth: 220,
  },
  controlsSection: {
    marginTop: 16,
    backgroundColor: '#f4f1ea',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(120,53,4,0.08)',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  pickerLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerLabel: {
    fontFamily: 'monospace',
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#78350f',
    textTransform: 'uppercase',
  },
  premiumBadge: {
    fontFamily: 'serif',
    fontSize: 8,
    fontWeight: 'bold',
    color: '#ea580c',
    marginLeft: 4,
  },
  colorPalette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    maxWidth: SCREEN_WIDTH - 120,
  },
  colorCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginHorizontal: 3,
    marginVertical: 3,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  selectedInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  widthsContainer: {
    flexDirection: 'row',
  },
  widthOption: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    marginLeft: 6,
  },
  widthOptionText: {
    fontFamily: 'monospace',
    fontSize: 9.5,
    fontWeight: 'bold',
  },
});
