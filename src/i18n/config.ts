export type Locale = string;

export const i18n = {
  defaultLocale: 'en' as Locale,
  locales: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ar', 'zh', 'hi', 'ru', 'ja', 'ko', 'tr', 'uk', 'sw', 'yo', 'ig', 'ak', 'ee'] as Locale[],
} as const;

export interface Language {
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
  googleCode: string;
  dir?: 'ltr' | 'rtl';
}

export const LANGUAGES: Language[] = [
  { code: 'en',  label: 'English',    nativeLabel: 'English',    flag: '🇺🇸', googleCode: 'en'    },
  { code: 'es',  label: 'Spanish',    nativeLabel: 'Español',    flag: '🇪🇸', googleCode: 'es'    },
  { code: 'fr',  label: 'French',     nativeLabel: 'Français',   flag: '🇫🇷', googleCode: 'fr'    },
  { code: 'de',  label: 'German',     nativeLabel: 'Deutsch',    flag: '🇩🇪', googleCode: 'de'    },
  { code: 'it',  label: 'Italian',    nativeLabel: 'Italiano',   flag: '🇮🇹', googleCode: 'it'    },
  { code: 'pt',  label: 'Portuguese', nativeLabel: 'Português',  flag: '🇧🇷', googleCode: 'pt'    },
  { code: 'ar',  label: 'Arabic',     nativeLabel: 'العربية',    flag: '🇸🇦', googleCode: 'ar',   dir: 'rtl' },
  { code: 'zh',  label: 'Chinese',    nativeLabel: '中文',        flag: '🇨🇳', googleCode: 'zh-CN' },
  { code: 'hi',  label: 'Hindi',      nativeLabel: 'हिन्दी',      flag: '🇮🇳', googleCode: 'hi'    },
  { code: 'ru',  label: 'Russian',    nativeLabel: 'Русский',    flag: '🇷🇺', googleCode: 'ru'    },
  { code: 'ja',  label: 'Japanese',   nativeLabel: '日本語',      flag: '🇯🇵', googleCode: 'ja'    },
  { code: 'ko',  label: 'Korean',     nativeLabel: '한국어',      flag: '🇰🇷', googleCode: 'ko'    },
  { code: 'tr',  label: 'Turkish',    nativeLabel: 'Türkçe',     flag: '🇹🇷', googleCode: 'tr'    },
  { code: 'uk',  label: 'Ukrainian',  nativeLabel: 'Українська', flag: '🇺🇦', googleCode: 'uk'    },
  { code: 'sw',  label: 'Swahili',    nativeLabel: 'Kiswahili',  flag: '🇰🇪', googleCode: 'sw'    },
  { code: 'yo',  label: 'Yorùbá',     nativeLabel: 'Yorùbá',     flag: '🇳🇬', googleCode: 'yo'    },
  { code: 'ig',  label: 'Igbo',       nativeLabel: 'Igbo',       flag: '🇳🇬', googleCode: 'ig'    },
  { code: 'ak',  label: 'Twi (Akan)', nativeLabel: 'Twi',        flag: '🇬🇭', googleCode: 'ak'    },
  { code: 'ee',  label: 'Ewe',        nativeLabel: 'Eʋegbe',     flag: '🇬🇭', googleCode: 'ee'    },
];