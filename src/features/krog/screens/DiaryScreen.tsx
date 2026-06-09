import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useKrog } from '../context/KrogStateContext';
import { KROG_DICTIONARY } from '../constants';
import { playClickVibe, playChiselVibe } from '../utils/vibe';
import {
  HelpCircleIcon,
  Trash2Icon,
  HistoryIcon,
} from '../components/icons';

export function DiaryScreen() {
  const {
    diaries,
    addDiaryEntry,
    deleteDiaryEntry,
    soundEnabled,
  } = useKrog();

  const [inputText, setInputText] = useState('');
  const [showHelper, setShowHelper] = useState(false);

  // Translate logic using Krog dictionary
  const translateToKrog = (text: string): string => {
    let translated = text;

    // Sort dictionary keys by length (longest first)
    const keys = Object.keys(KROG_DICTIONARY).sort((a, b) => b.length - a.length);

    keys.forEach((key) => {
      const krogWord = KROG_DICTIONARY[key];
      // Regex boundary match supporting Vietnamese Unicode letters
      // Note: \b doesn't match Vietnamese letters perfectly, so we replace using word boundaries or simple matching
      // Since it's a simple dictionary, we replace all case-insensitive occurrences
      // To prevent substring issues (e.g. replacing 'làm' inside 'làm việc' before 'làm việc' is replaced),
      // we sorted keys longest first. A regex with word-like boundaries or global search is perfect:
      // We can use a regex that matches the word, ensuring it's not preceded or followed by other characters, 
      // or simply rely on substring search since we sorted by length.
      // In JavaScript:
      const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(?<=^|[^a-zA-Z0-9àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ])(${escapedKey})(?=$|[^a-zA-Z0-9àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ])`, 'gi');
      
      translated = translated.replace(regex, krogWord);
    });

    return translated;
  };

  const handleCarve = () => {
    if (!inputText.trim()) return;

    playChiselVibe(soundEnabled);
    const krogTranslated = translateToKrog(inputText);
    addDiaryEntry(inputText, krogTranslated);
    setInputText('');
  };

  const handleDelete = (id: string) => {
    playClickVibe(soundEnabled);
    deleteDiaryEntry(id);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <View style={styles.container}>
          {/* Header Row */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Nhật Ký Vách Đá</Text>
              <Text style={styles.headerSubtitle}>
                Trút nỗi niềm văn phòng. Đá ma thuật tự dịch...
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                playClickVibe(soundEnabled);
                setShowHelper(!showHelper);
              }}
              style={styles.helpBtn}
            >
              <HelpCircleIcon color="#78350f" size={18} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} bounces={true}>
            {/* Dictionary Guide help panel */}
            {showHelper && (
              <View style={styles.helperPanel}>
                <Text style={styles.helperPanelTitle}>🪨 DANH TỪ CỔ KHUYÊN DÙNG:</Text>
                <View style={styles.helperGrid}>
                  <View style={styles.helperRow}>
                    <Text style={styles.helperOrigin}>• đi làm, làm việc</Text>
                    <Text style={styles.helperKrog}>→ săn bắn, bẩy đá</Text>
                  </View>
                  <View style={styles.helperRow}>
                    <Text style={styles.helperOrigin}>• lương, tiền</Text>
                    <Text style={styles.helperKrog}>→ vỏ sò tươi/lấp lánh</Text>
                  </View>
                  <View style={styles.helperRow}>
                    <Text style={styles.helperOrigin}>• sếp, quản lý</Text>
                    <Text style={styles.helperKrog}>→ tộc trưởng/krog giám sát</Text>
                  </View>
                  <View style={styles.helperRow}>
                    <Text style={styles.helperOrigin}>• deadline</Text>
                    <Text style={styles.helperKrog}>→ thú dữ đuổi dồn dập</Text>
                  </View>
                  <View style={styles.helperRow}>
                    <Text style={styles.helperOrigin}>• stress, mệt</Text>
                    <Text style={styles.helperKrog}>→ đầu bốc khói, lưng mỏi</Text>
                  </View>
                  <View style={styles.helperRow}>
                    <Text style={styles.helperOrigin}>• máy tính, điện thoại</Text>
                    <Text style={styles.helperKrog}>→ phiến đá phát sáng/nhỏ</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Form to submit */}
            <View style={styles.formCard}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Hôm nay đi làm gặp sếp giục deadline stress mệt..."
                placeholderTextColor="rgba(120,53,4,0.35)"
                style={styles.input}
                maxLength={140}
                multiline={false}
              />
              <TouchableOpacity
                onPress={handleCarve}
                disabled={!inputText.trim()}
                style={[styles.submitBtn, !inputText.trim() && styles.submitBtnDisabled]}
              >
                <Text style={styles.submitBtnText}>Khắc Đá 🪓</Text>
              </TouchableOpacity>
            </View>

            {/* List of previously carved stones */}
            <View style={styles.historySection}>
              <View style={styles.historyTitleRow}>
                <HistoryIcon color="rgba(120,53,4,0.6)" size={14} />
                <Text style={styles.historyTitle}>Lịch sử bia đá</Text>
              </View>

              {diaries.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    Vách đá nhẵn thín. Chưa ghi khắc điều chi.
                  </Text>
                </View>
              ) : (
                diaries.map((diary) => (
                  <View key={diary.id} style={styles.diaryCard}>
                    <View style={styles.diaryCardHeader}>
                      <Text style={styles.diaryTimestamp}>🦕 {diary.timestamp}</Text>
                      <TouchableOpacity
                        onPress={() => handleDelete(diary.id)}
                        style={styles.deleteBtn}
                      >
                        <Trash2Icon color="rgba(120,53,4,0.4)" size={14} />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.diaryKrogText}>"{diary.krogText}"</Text>
                    <Text style={styles.diaryOriginText} numberOfLines={1}>
                      Gốc: {diary.originalText}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </ScrollView>

          <Text style={styles.footerNote}>
            Mọi nhật ký được khắc chìm hoàn toàn vào bộ nhớ cục bộ thiết bị.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#faf8f5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
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
  helpBtn: {
    padding: 6,
    borderRadius: 18,
    backgroundColor: 'rgba(120,53,4,0.06)',
  },
  scrollArea: {
    flex: 1,
  },
  helperPanel: {
    backgroundColor: 'rgba(254,243,199,0.7)',
    borderColor: 'rgba(120,53,4,0.15)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  helperPanelTitle: {
    fontFamily: 'monospace',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#7c2d12',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(120,53,4,0.15)',
    paddingBottom: 4,
    marginBottom: 6,
  },
  helperGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  helperRow: {
    width: '50%',
    marginVertical: 3,
    paddingRight: 4,
  },
  helperOrigin: {
    fontFamily: 'monospace',
    fontSize: 8,
    color: '#451a03',
  },
  helperKrog: {
    fontFamily: 'monospace',
    fontSize: 8,
    color: '#92400e',
    fontWeight: 'bold',
    marginTop: 1,
  },
  formCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(244,241,234,0.5)',
    borderColor: 'rgba(120,53,4,0.2)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 6,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontFamily: 'sans-serif',
    fontSize: 11,
    color: '#2d251e',
    paddingHorizontal: 8,
    height: 38,
  },
  submitBtn: {
    backgroundColor: '#78350f',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.4,
  },
  submitBtnText: {
    fontFamily: 'monospace',
    color: '#fef3c7',
    fontSize: 9.5,
    fontWeight: 'bold',
  },
  historySection: {
    paddingBottom: 20,
  },
  historyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyTitle: {
    fontFamily: 'monospace',
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#92400e',
    textTransform: 'uppercase',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontStyle: 'italic',
    color: 'rgba(120,53,4,0.4)',
    textAlign: 'center',
  },
  diaryCard: {
    backgroundColor: 'rgba(244,241,234,0.3)',
    borderColor: 'rgba(120,53,4,0.1)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  diaryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(120,53,4,0.05)',
    paddingBottom: 4,
    marginBottom: 6,
  },
  diaryTimestamp: {
    fontFamily: 'monospace',
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#92400e',
  },
  deleteBtn: {
    padding: 2,
  },
  diaryKrogText: {
    fontFamily: 'serif',
    fontSize: 11.5,
    lineHeight: 18,
    color: '#2d251e',
    fontStyle: 'italic',
  },
  diaryOriginText: {
    fontFamily: 'monospace',
    fontSize: 8,
    color: 'rgba(120,53,4,0.4)',
    marginTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(120,53,4,0.05)',
    paddingTop: 4,
  },
  footerNote: {
    fontFamily: 'monospace',
    fontSize: 8.5,
    color: '#92400e',
    opacity: 0.5,
    textAlign: 'center',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(120,53,4,0.05)',
    paddingTop: 10,
    marginTop: 8,
  },
});
