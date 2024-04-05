export function hasNumber(str: string) {
  return /\d/.test(str);
}

export function hasUppercaseCharacter(str: string) {
  return /[A-Z]/.test(str);
}

export function hasLowercaseCharacter(str: string) {
  return /[a-z]/.test(str);
}

export function onlyLatin(str: string) {
  return str.match(/[a-z\d]/i);
}
