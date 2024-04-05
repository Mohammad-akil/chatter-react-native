export type ObjectValues<T extends object> = T[keyof T];
export type ObjectKeysMatching<T extends Record<string, unknown>, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
export type NonEmptyArray<T> = [T, ...T[]];
