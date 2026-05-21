import {defineRouting} from 'next-intl/routing';
import { LANGUAGES } from './config';

const locales = LANGUAGES.map((lang) => lang.code)

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,
 
  // Used when no locale matches
  defaultLocale: 'en'
});
