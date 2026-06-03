/**
 * Global type declarations.
 *
 * Add global augmentations and module declarations here.
 */

// SVG imports
declare module '*.svg' {
  import React from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

// Lottie JSON
declare module '*.json' {
  const value: any;
  export default value;
}

// PNG / JPG images
declare module '*.png' {
  const value: number;
  export default value;
}
declare module '*.jpg' {
  const value: number;
  export default value;
}
