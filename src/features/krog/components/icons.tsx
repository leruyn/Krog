import React from 'react';
import Svg, { Path, Circle, Polyline, Line, Polygon } from 'react-native-svg';

interface IconProps {
  color?: string;
  size?: number;
  strokeWidth?: number;
  style?: any;
}

export function FlameIcon({ color = '#000', size = 24, strokeWidth = 2, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </Svg>
  );
}

export function PenToolIcon({ color = '#000', size = 24, strokeWidth = 2, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <Path d="m12 8-4 4 4 4m4-4H8" />
    </Svg>
  );
}

export function HammerIcon({ color = '#000', size = 24, strokeWidth = 2, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Path d="m15 5 4 4" />
      <Path d="M21.5 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 15.5l.5-.5 1.5 1.5 2-2-.5-.5-1.5-1.5L8.5 9l.5.5 1.5 1.5 2-2-.5-.5-1.5-1.5L14.5 5l.5.5 1.5 1.5 2-2 .5-.5-1.5-1.5z" />
      <Path d="M16 16v1a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-1" />
      <Path d="M12 2v4" />
      <Path d="M11 3h2" />
    </Svg>
  );
}

export function FeatherIcon({ color = '#000', size = 24, strokeWidth = 2, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <Line x1="16" y1="8" x2="2" y2="22" />
      <Line x1="17.5" y1="15" x2="9" y2="15" />
    </Svg>
  );
}

export function Trash2Icon({ color = '#000', size = 24, strokeWidth = 2, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Polyline points="3 6 5 6 21 6" />
      <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <Line x1="10" y1="11" x2="10" y2="17" />
      <Line x1="14" y1="11" x2="14" y2="17" />
    </Svg>
  );
}

export function RotateCcwIcon({ color = '#000', size = 24, strokeWidth = 2, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <Polyline points="3 3 3 8 8 8" />
    </Svg>
  );
}

export function RotateCwIcon({ color = '#000', size = 24, strokeWidth = 2, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <Polyline points="21 3 21 8 16 8" />
    </Svg>
  );
}

export function HelpCircleIcon({ color = '#000', size = 24, strokeWidth = 2, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Circle cx="12" cy="12" r="10" />
      <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <Line x1="12" y1="17" x2="12.01" y2="17" />
    </Svg>
  );
}

export function Volume2Icon({ color = '#000', size = 24, strokeWidth = 2, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <Path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </Svg>
  );
}

export function VolumeXIcon({ color = '#000', size = 24, strokeWidth = 2, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <Line x1="23" y1="9" x2="17" y2="15" />
      <Line x1="17" y1="9" x2="23" y2="15" />
    </Svg>
  );
}

export function HistoryIcon({ color = '#000', size = 24, strokeWidth = 2, style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <Polyline points="3 3 3 8 8 8" />
      <Line x1="12" y1="7" x2="12" y2="12" />
      <Line x1="12" y1="12" x2="16" y2="14" />
    </Svg>
  );
}
