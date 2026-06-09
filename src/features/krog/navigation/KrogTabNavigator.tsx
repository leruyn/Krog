import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { WisdomScreen } from '../screens/WisdomScreen';
import { CanvasScreen } from '../screens/CanvasScreen';
import { CrusherScreen } from '../screens/CrusherScreen';
import { DiaryScreen } from '../screens/DiaryScreen';
import {
  FlameIcon,
  PenToolIcon,
  HammerIcon,
  FeatherIcon,
} from '../components/icons';

export type KrogTabParamList = {
  Wisdom: undefined;
  Canvas: undefined;
  Crusher: undefined;
  Diary: undefined;
};

const Tab = createBottomTabNavigator<KrogTabParamList>();

export function KrogTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#78350f',
        tabBarInactiveTintColor: 'rgba(120,53,4,0.4)',
        tabBarStyle: {
          backgroundColor: '#faf7f0',
          borderTopWidth: 1,
          borderTopColor: 'rgba(26,20,16,0.15)',
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontFamily: 'monospace',
          fontSize: 8,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          marginTop: -4,
        },
      }}
    >
      <Tab.Screen
        name="Wisdom"
        component={WisdomScreen}
        options={{
          tabBarLabel: 'Lời Răn',
          tabBarIcon: ({ color }) => <FlameIcon color={color} size={20} />,
        }}
      />
      <Tab.Screen
        name="Canvas"
        component={CanvasScreen}
        options={{
          tabBarLabel: 'Vẽ Bậy',
          tabBarIcon: ({ color }) => <PenToolIcon color={color} size={20} />,
        }}
      />
      <Tab.Screen
        name="Crusher"
        component={CrusherScreen}
        options={{
          tabBarLabel: 'Đập Đá',
          tabBarIcon: ({ color }) => <HammerIcon color={color} size={20} />,
        }}
      />
      <Tab.Screen
        name="Diary"
        component={DiaryScreen}
        options={{
          tabBarLabel: 'Nhật Ký',
          tabBarIcon: ({ color }) => <FeatherIcon color={color} size={20} />,
        }}
      />
    </Tab.Navigator>
  );
}
export default KrogTabNavigator;
