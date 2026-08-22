/** Латиница, совпадающая с кириллицей на номерах РБ (СТБ 1019). */
export const BY_PLATE_LETTERS = "ABCEHIKMOPTXY" as const;

const CYR_VOWELS = "аеёиоуыэюяіў";
const LAT_VOWELS = "aeiouy";
const KEYBOARD_ROWS = [
  "йцукенгшщзхъ",
  "фывапролджэ",
  "ячсмитьбю",
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
];

export function hasVowel(value: string) {
  return new RegExp(`[${CYR_VOWELS}${LAT_VOWELS}]`, "i").test(value);
}

export function hasTripleRepeat(value: string) {
  return /(.)\1{2,}/i.test(value.replace(/[\s-]/g, ""));
}

export function hasRepeatingChunk(value: string) {
  return value
    .toLowerCase()
    .split(/[\s-]+/)
    .filter(Boolean)
    .some((word) => /(.{3,6})\1/.test(word));
}

export function isKeyboardMash(word: string) {
  const normalized = word.toLowerCase().replace(/ё/g, "е").replace(/ў/g, "у");
  if (normalized.length < 3) return false;
  return KEYBOARD_ROWS.some((row) => row.includes(normalized));
}

export function formatFullName(raw: string) {
  return raw
    .replace(/[^A-Za-zА-Яа-яЁёІіЎў\s-]/g, "")
    .replace(/-+/g, "-")
    .replace(/\s+/g, " ")
    .replace(/[A-Za-zА-Яа-яЁёІіЎў]+/g, (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
}

export function validateFullName(value: string): string | null {
  const name = formatFullName(value).trim();
  if (!name) return "Укажите фамилию и имя";

  const words = name.split(" ");
  if (words.length < 2 || words.length > 3) {
    return "Укажите фамилию и имя, отчество — по желанию";
  }

  for (const word of words) {
    if (word.startsWith("-") || word.endsWith("-")) {
      return "ФИО только из букв, пробелов и дефиса";
    }
    const parts = word.split("-").filter(Boolean);
    if (parts.length === 0) return "Некорректное ФИО";
    for (const part of parts) {
      if (part.length < 2) return "Каждое слово должно содержать минимум 2 буквы";
      if (!/^[A-Za-zА-Яа-яЁёІіЎў]+$/.test(part)) {
        return "ФИО только из букв, пробелов и дефиса";
      }
      if (!hasVowel(part)) return "ФИО должно содержать гласные буквы";
      if (isKeyboardMash(part)) return "ФИО похоже на случайный набор символов";
    }
  }

  if (hasTripleRepeat(name)) return "Уберите повторяющиеся буквы подряд";
  if (hasRepeatingChunk(name)) return "ФИО похоже на случайный набор символов";
  return null;
}

export function formatByPhone(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("80")) digits = `375${digits.slice(2)}`;
  if (digits.startsWith("375")) digits = digits.slice(3);
  digits = digits.slice(0, 9);

  const op = digits.slice(0, 2);
  const a = digits.slice(2, 5);
  const b = digits.slice(5, 7);
  const c = digits.slice(7, 9);

  if (digits.length === 0) return "+375 (";

  let result = `+375 (${op}`;
  if (digits.length >= 2) result += ")";
  if (a) result += ` ${a}`;
  if (b) result += `-${b}`;
  if (c) result += `-${c}`;
  return result;
}

/** Формат РБ: +375 (25|29|33|44) XXX-XX-XX */
export const BY_PHONE_REGEX = /^\+375\s?\(?(25|29|33|44)\)?\s?\d{3}-?\d{2}-?\d{2}$/;

export function validateByPhone(value: string): string | null {
  const formatted = formatByPhone(value);
  if (!BY_PHONE_REGEX.test(formatted)) {
    return "Телефон в формате +375 (29) 123-45-67, оператор 25, 29, 33 или 44";
  }
  const local = formatted.replace(/\D/g, "").slice(3);
  if (/(\d)\1{3,}/.test(local)) {
    return "Номер не должен содержать повторяющиеся цифры подряд";
  }
  return null;
}

export function formatByPlate(raw: string) {
  let digits = "";
  let letters = "";
  let region = "";

  for (const char of raw.toUpperCase()) {
    if (digits.length < 4 && letters.length === 0 && /\d/.test(char)) {
      digits += char;
    } else if (letters.length < 2 && (BY_PLATE_LETTERS as string).includes(char)) {
      letters += char;
    } else if (letters.length === 2 && region.length < 2 && /\d/.test(char)) {
      region += char;
    }
  }

  let result = digits;
  if (letters) result += `${result ? " " : ""}${letters}`;
  if (region) result += `-${region}`;
  return result;
}

/**
 * Гражданский номер РБ: 4 цифры + 2 буквы + регион 0–7 (иногда 2 цифры).
 * Пример: 1234 AB-7
 */
export const BY_PLATE_REGEX = new RegExp(
  `^\\d{4}\\s[${BY_PLATE_LETTERS}]{2}-\\d{1,2}$`,
);

export function validateByPlate(value: string): string | null {
  const plate = formatByPlate(value);
  if (!BY_PLATE_REGEX.test(plate)) {
    return "Госномер в формате 1234 AB-7 (буквы A B C E H I K M O P T X Y)";
  }
  const serial = plate.replace(/\D/g, "").slice(0, 4);
  if (/^(\d)\1{3}$/.test(serial)) {
    return "Некорректный госномер: слишком много одинаковых цифр";
  }
  return null;
}

export function validateCarBrand(value: string, allowed: string[]): string | null {
  const brand = value.trim();
  if (!brand || brand === "Другое") return "Укажите марку автомобиля";
  if (allowed.includes(brand)) return null;
  if (!/^[A-Za-zА-Яа-яЁёІі0-9][A-Za-zА-Яа-яЁёІі0-9\s.-]{1,39}$/.test(brand)) {
    return "Марка только из букв, цифр, пробела, точки и дефиса";
  }
  if (hasTripleRepeat(brand) || hasRepeatingChunk(brand) || !hasVowel(brand) || isKeyboardMash(brand.replace(/\s/g, ""))) {
    return "Укажите реальную марку автомобиля";
  }
  return null;
}

export function validateOptionalEmail(value: string): string | null {
  const email = value.trim();
  if (!email) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Укажите корректный email";
  return null;
}
