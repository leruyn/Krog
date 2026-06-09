import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiaryEntry } from '../types';

interface KrogContextProps {
  stones: number;
  shells: number;
  purchasedIds: string[];
  soundEnabled: boolean;
  diaries: DiaryEntry[];
  loading: boolean;
  addStones: (amount: number) => void;
  addShells: (amount: number) => void;
  purchaseItem: (id: string, stoneCost: number, shellCost: number) => boolean;
  addDiaryEntry: (original: string, translated: string) => void;
  deleteDiaryEntry: (id: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  resetAll: () => void;
}

const KrogContext = createContext<KrogContextProps | undefined>(undefined);

export const KrogStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stones, setStonesState] = useState<number>(0);
  const [shells, setShellsState] = useState<number>(0);
  const [purchasedIds, setPurchasedIdsState] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [diaries, setDiariesState] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load state from AsyncStorage on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const [
          savedStones,
          savedShells,
          savedPurchases,
          savedSound,
          savedDiaries,
        ] = await Promise.all([
          AsyncStorage.getItem('@krog/stones'),
          AsyncStorage.getItem('@krog/shells'),
          AsyncStorage.getItem('@krog/purchased_items'),
          AsyncStorage.getItem('@krog/sound_enabled'),
          AsyncStorage.getItem('@krog/diaries'),
        ]);

        if (savedStones !== null) setStonesState(parseInt(savedStones, 10));
        if (savedShells !== null) setShellsState(parseInt(savedShells, 10));
        if (savedPurchases !== null) setPurchasedIdsState(JSON.parse(savedPurchases));
        if (savedSound !== null) setSoundEnabledState(savedSound === 'true');
        if (savedDiaries !== null) {
          setDiariesState(JSON.parse(savedDiaries));
        } else {
          // Add a default diary entry on fresh load
          setDiariesState([
            {
              id: 'default-1',
              originalText: 'Đi làm gặp sếp giao việc dồn dập, deadline sát nút làm tôi rất stress mệt mỏi.',
              krogText: 'Vác rìu đi săn bắn 🪓 gặp tộc trưởng hung dữ 👹 mài rìu bẩy đá 🪨 dồn dập, thú dữ đuổi cắn sau mông 🦖 sát gáy làm tôi rất đầu Krog bốc khói núi lửa 🔥 tay bủn rủn, lưng đau nhừ 🪵.',
              timestamp: 'Bình minh xa xưa',
            },
          ]);
        }
      } catch (e) {
        console.error('Error loading Krog state from storage', e);
      } finally {
        setLoading(false);
      }
    };

    loadState();
  }, []);

  // Save stones & shells to storage in a debounced way to prevent bridge flooding
  useEffect(() => {
    if (loading) return;
    const saveTimeout = setTimeout(() => {
      AsyncStorage.multiSet([
        ['@krog/stones', stones.toString()],
        ['@krog/shells', shells.toString()],
      ]).catch((err) => console.error('Failed to save stones/shells:', err));
    }, 800);
    return () => clearTimeout(saveTimeout);
  }, [stones, shells, loading]);

  const addStones = (amount: number) => {
    setStonesState((prev) => prev + amount);
  };

  const addShells = (amount: number) => {
    setShellsState((prev) => prev + amount);
  };

  const purchaseItem = (id: string, stoneCost: number, shellCost: number): boolean => {
    if (stones < stoneCost || shells < shellCost) {
      return false;
    }

    setStonesState((prev) => prev - stoneCost);
    setShellsState((prev) => prev - shellCost);

    setPurchasedIdsState((prev) => {
      const next = [...prev, id];
      AsyncStorage.setItem('@krog/purchased_items', JSON.stringify(next));
      return next;
    });

    return true;
  };

  const addDiaryEntry = (original: string, translated: string) => {
    const today = new Date();
    const formattedDate = `Bình minh ngày ${today.getDate()}/${today.getMonth() + 1}`;
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      originalText: original,
      krogText: translated,
      timestamp: formattedDate,
    };

    setDiariesState((prev) => {
      const next = [newEntry, ...prev];
      AsyncStorage.setItem('@krog/diaries', JSON.stringify(next));
      return next;
    });
  };

  const deleteDiaryEntry = (id: string) => {
    setDiariesState((prev) => {
      const next = prev.filter((d) => d.id !== id);
      AsyncStorage.setItem('@krog/diaries', JSON.stringify(next));
      return next;
    });
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    AsyncStorage.setItem('@krog/sound_enabled', enabled ? 'true' : 'false');
  };

  const resetAll = () => {
    setStonesState(0);
    setShellsState(0);
    setPurchasedIdsState([]);
    setDiariesState([]);
    AsyncStorage.removeItem('@krog/stones');
    AsyncStorage.removeItem('@krog/shells');
    AsyncStorage.removeItem('@krog/purchased_items');
    AsyncStorage.removeItem('@krog/diaries');
  };

  return (
    <KrogContext.Provider
      value={{
        stones,
        shells,
        purchasedIds,
        soundEnabled,
        diaries,
        loading,
        addStones,
        addShells,
        purchaseItem,
        addDiaryEntry,
        deleteDiaryEntry,
        setSoundEnabled,
        resetAll,
      }}
    >
      {children}
    </KrogContext.Provider>
  );
};

export const useKrog = () => {
  const context = useContext(KrogContext);
  if (context === undefined) {
    throw new Error('useKrog must be used within a KrogStateProvider');
  }
  return context;
};
