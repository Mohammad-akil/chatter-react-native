import { PixelRatio, Dimensions } from 'react-native';

const standardWidth = 393; // iphone 15 viewport as a standart
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const scale = SCREEN_WIDTH > 600 ? SCREEN_WIDTH / 800 : SCREEN_WIDTH / standardWidth;
export const minNormalizeValue = 10;

export function normalize(size: number) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}
