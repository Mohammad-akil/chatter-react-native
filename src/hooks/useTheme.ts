import { useMemo, useCallback } from 'react';
import { useColorScheme, useWindowDimensions, StyleSheet } from 'react-native';

export type ThemeData = {
  colorScheme: 'light' | 'dark';
  dimensions: { height: number; width: number };
  scales: { scale: number; fontScale: number };
};
export type ThemeHookCallback<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>> = (
  styles: ThemeData,
) => T;

const useTheme = <T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  callback: ThemeHookCallback<T>,
): T => {
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  const stylesetCallback = useCallback(callback, []);
  const colorSchemePreference = useColorScheme();
  const { height, width, scale, fontScale } = useWindowDimensions();

  const dimensions = useMemo(() => ({ height, width }), [height, width]);
  const scales = useMemo(() => ({ scale, fontScale }), [scale, fontScale]);

  const colorScheme = colorSchemePreference ?? 'light'; // 'light' | 'dark'

  const theme = useMemo<T>(() => {
    if (typeof stylesetCallback !== 'function') {
      return StyleSheet.create({});
    }
    try {
      const styleset = stylesetCallback({ colorScheme, dimensions, scales });
      return StyleSheet.create(styleset);
    } catch (oe) {
      console.error(oe);
      return StyleSheet.create({});
    }
  }, [stylesetCallback, colorScheme, dimensions, scales]);

  return theme;
};

export default useTheme;
