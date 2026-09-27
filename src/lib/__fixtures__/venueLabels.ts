// GENERATED from the translated corpus — the oracle for FIELD_ALIASES.
//
// Deliberately NOT derived from FIELD_ALIASES: a table-driven test that reads
// the table under test passes by construction, which an earlier version of this
// file did.
//
// The generator aligns each locale's bullets POSITIONALLY against the English
// ones and skips venues whose bullet count differs. That has two blind spots,
// so every row carries the locales it came from and can be audited by hand:
//   * a translation that SUBSTITUTES a field (same bullet count, different
//     meaning) would be recorded against the English field it displaced
//   * a translation that ADDS a bullet makes the whole venue skip, so a label
//     unique to it never reaches this file
// A row attested by several locales is strong; a single-locale row is the one
// to check by eye.
export const CORPUS_LABELS: Array<[string, string]> = [
  ["Abụọ abụọ", "pairs"],  // ig
  ["Akoko Idogo", "depositTime"],  // yo
  ["Atsu kple asi", "pairs"],  // ee
  ["Awọn atilẹyin", "support"],  // yo
  ["Açıklama", "description"],  // tr
  ["Bere a Wɔde Sie", "depositTime"],  // ak
  ["Bere a Wɔde Siesie Nneɛma", "depositTime"],  // ak
  ["Bere a Wɔde Sika Siesie", "depositTime"],  // ak
  ["Beschreibung", "description"],  // de
  ["Compatible con", "support"],  // es
  ["Coppie", "pairs"],  // it
  ["Descripción", "description"],  // es
  ["Description", "description"],  // ak,ee,fr
  ["Descrizione", "description"],  // it
  ["Descrição", "description"],  // pt
  ["Destekler", "support"],  // tr
  ["Délai de dépôt", "depositTime"],  // fr
  ["Ebe nrụọrụ weebụ", "url"],  // ig
  ["Einzahlungszeit", "depositTime"],  // de
  ["Handelspaare", "pairs"],  // de
  ["Igi irin", "ironwood"],  // yo
  ["Inasaidia", "support"],  // sw
  ["Intanɛt so", "url"],  // ak
  ["Ironwood", "ironwood"],  // ak,ar,de,ee,es,fr,hi,ig,it,ja,ko,pt,ru,sw,tr,uk,yo,zh
  ["Jozi", "pairs"],  // sw
  ["Kpekpeɖeŋunana", "support"],  // ee
  ["Maelezo", "description"],  // sw
  ["Mmoa", "support"],  // ak
  ["Muda wa Kuweka Amana", "depositTime"],  // sw
  ["Muda wa Kuweka Pesa", "depositTime"],  // sw
  ["Nkowasi", "description"],  // ig
  ["Nkwado", "support"],  // ig
  ["Nkọwa", "description"],  // ig
  ["Nneɛma a wɔboa", "support"],  // ak
  ["Nnipa baanu", "pairs"],  // ak
  ["Nnua abien", "pairs"],  // ak
  ["Nu si wòfia", "description"],  // ee
  ["Numeɖeɖe", "description"],  // ee
  ["Nyatakakadzraɖoƒe", "url"],  // ee
  ["Oge Mgbazinye Ego", "depositTime"],  // ig
  ["Oge Nkwụnye Ego", "depositTime"],  // ig
  ["Oge nkwụnye ego", "depositTime"],  // ig
  ["Oju opo wẹẹbu", "url"],  // yo
  ["Ojú-ìwé", "url"],  // yo
  ["Paires", "pairs"],  // fr
  ["Pares", "pairs"],  // es,pt
  ["Prend en charge", "support"],  // fr
  ["Site web", "url"],  // fr
  ["Sitio web", "url"],  // es
  ["Sito web", "url"],  // it
  ["Suporta", "support"],  // pt
  ["Supporta", "support"],  // it
  ["Tempo de depósito", "depositTime"],  // pt
  ["Tempo di deposito", "depositTime"],  // it
  ["Tiempo de depósito", "depositTime"],  // es
  ["Tovuti", "url"],  // sw
  ["Unterstützt", "support"],  // de
  ["Usaidizi", "support"],  // sw
  ["Web sitesi", "url"],  // tr
  ["Website", "url"],  // de,pt
  ["Weebụsaịtị", "url"],  // ig
  ["Wɛbsaet", "url"],  // ak
  ["Yatırma Süresi", "depositTime"],  // tr
  ["Àkókò Ìdókòwò", "depositTime"],  // yo
  ["Àkókò Ìfipamọ́", "depositTime"],  // yo
  ["Àlàyé", "description"],  // yo
  ["Àpèjúwe", "description"],  // yo
  ["Àwọn méjì", "pairs"],  // yo
  ["Àwọn méjì-méjì", "pairs"],  // yo
  ["Àwọn Àtìlẹ́yìn", "support"],  // yo
  ["İşlem çiftleri", "pairs"],  // tr
  ["Ŋutinya", "description"],  // ee
  ["Ɣeyiɣi si Woade Gadzraɖoƒe", "depositTime"],  // ee
  ["Ɣeyiɣi si Woatsɔ Ade Asie", "depositTime"],  // ee
  ["Ɣeyiɣi si Woatsɔ Ade Gadzraɖoƒe", "depositTime"],  // ee
  ["Ɣeyiɣi si Woatsɔ Ga De Asi", "depositTime"],  // ee
  ["Ɣeyiɣi si Woatsɔ Gade Asi", "depositTime"],  // ee
  ["Ɣeyiɣi si Wotsɔ De Gadzraɖoƒe", "depositTime"],  // ee
  ["Веб-сайт", "url"],  // ru
  ["Вебсайт", "url"],  // uk
  ["Время зачисления", "depositTime"],  // ru
  ["Опис", "description"],  // uk
  ["Описание", "description"],  // ru
  ["Пари", "pairs"],  // uk
  ["Пары", "pairs"],  // ru
  ["Поддержка", "support"],  // ru
  ["Підтримка", "support"],  // uk
  ["Час депозиту", "depositTime"],  // uk
  ["الأزواج", "pairs"],  // ar
  ["الموقع الإلكتروني", "url"],  // ar
  ["الوصف", "description"],  // ar
  ["وقت الإيداع", "depositTime"],  // ar
  ["يدعم", "support"],  // ar
  ["जमा समय", "depositTime"],  // hi
  ["जोड़े", "pairs"],  // hi
  ["विवरण", "description"],  // hi
  ["वेबसाइट", "url"],  // hi
  ["समर्थित", "support"],  // hi
  ["ウェブサイト", "url"],  // ja
  ["交易对", "pairs"],  // zh
  ["充值时间", "depositTime"],  // zh
  ["入金時間", "depositTime"],  // ja
  ["取引ペア", "pairs"],  // ja
  ["対応", "support"],  // ja
  ["描述", "description"],  // zh
  ["支持", "support"],  // zh
  ["网站", "url"],  // zh
  ["説明", "description"],  // ja
  ["거래쌍", "pairs"],  // ko
  ["설명", "description"],  // ko
  ["웹사이트", "url"],  // ko
  ["입금 시간", "depositTime"],  // ko
  ["지원", "support"],  // ko
];
