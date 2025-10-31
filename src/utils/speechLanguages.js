/**
 * Language mapping for speech recognition
 * Maps user-friendly language names to speech recognition language codes
 */

export const SPEECH_LANGUAGES = {
  // Top 10 most spoken languages with their speech recognition codes
  'English (English)': 'en-US',
  'Español (Spanish)': 'es-ES',
  '한국어 (Korean)': 'ko-KR',
  '普通话 (Mandarin Chinese)': 'zh-CN',
  '繁體中文 (Traditional Chinese)': 'zh-TW',
  'हिन्दी (Hindi)': 'hi-IN',
  'العربية (Arabic)': 'ar-SA',
  'Português (Portuguese)': 'pt-BR',
  'Русский (Russian)': 'ru-RU',
  '日本語 (Japanese)': 'ja-JP',
  'Français (French)': 'fr-FR',
  'Deutsch (German)': 'de-DE',
  'Italiano (Italian)': 'it-IT',
  'Nederlands (Dutch)': 'nl-NL',
  'Polski (Polish)': 'pl-PL',
  'Türkçe (Turkish)': 'tr-TR',
  'Українська (Ukrainian)': 'uk-UA',
  'فارسی (Persian)': 'fa-IR',
  'Bahasa Indonesia (Indonesian)': 'id-ID',
  'ไทย (Thai)': 'th-TH',
  'Tiếng Việt (Vietnamese)': 'vi-VN',
  'Svenska (Swedish)': 'sv-SE',
  'Norsk (Norwegian)': 'nb-NO',
  'Dansk (Danish)': 'da-DK',
  'Suomi (Finnish)': 'fi-FI',
  'Ελληνικά (Greek)': 'el-GR',
  'עברית (Hebrew)': 'he-IL',
  'Čeština (Czech)': 'cs-CZ',
  'Magyar (Hungarian)': 'hu-HU',
  'Română (Romanian)': 'ro-RO',
  'Български (Bulgarian)': 'bg-BG',
  'Hrvatski (Croatian)': 'hr-HR',
  'Srpski (Serbian)': 'sr-RS',
  'Slovenčina (Slovak)': 'sk-SK',
  'Slovenščina (Slovenian)': 'sl-SI',
  'Lietuvių (Lithuanian)': 'lt-LT',
  'Latviešu (Latvian)': 'lv-LV',
  'Eesti (Estonian)': 'et-EE',
  'Català (Catalan)': 'ca-ES',
  'Euskara (Basque)': 'eu-ES',
  'Galego (Galician)': 'gl-ES',
  'Afrikaans (Afrikaans)': 'af-ZA',
  'Kiswahili (Swahili)': 'sw-KE',
  'isiZulu (Zulu)': 'zu-ZA',
  'Amharic (አማርኛ)': 'am-ET',
  'বাংলা (Bengali)': 'bn-BD',
  'اردو (Urdu)': 'ur-PK',
  'ਪੰਜਾਬੀ (Punjabi)': 'pa-IN',
  'मराठी (Marathi)': 'mr-IN',
  'తెలుగు (Telugu)': 'te-IN',
  'தமிழ் (Tamil)': 'ta-IN',
  'ગુજરાતી (Gujarati)': 'gu-IN',
  'ಕನ್ನಡ (Kannada)': 'kn-IN',
  'മലയാളം (Malayalam)': 'ml-IN',
  'Bahasa Melayu (Malay)': 'ms-MY',
  'Filipino (Filipino)': 'fil-PH',
  'Mongolian (Монгол хэл)': 'mn-MN'
};

// Regional variants for better accuracy
export const REGIONAL_VARIANTS = {
  'en-US': ['en-US', 'en-CA', 'en-AU', 'en-GB', 'en-IN', 'en-NZ', 'en-ZA'],
  'es-ES': ['es-ES', 'es-MX', 'es-AR', 'es-CO', 'es-CL', 'es-PE', 'es-VE'],
  'pt-BR': ['pt-BR', 'pt-PT'],
  'fr-FR': ['fr-FR', 'fr-CA', 'fr-BE', 'fr-CH'],
  'de-DE': ['de-DE', 'de-AT', 'de-CH'],
  'ar-SA': ['ar-SA', 'ar-EG', 'ar-AE', 'ar-MA', 'ar-DZ', 'ar-TN'],
  'zh-CN': ['zh-CN', 'zh-HK', 'zh-TW'],
  'ko-KR': ['ko-KR'],
  'ja-JP': ['ja-JP'],
  'hi-IN': ['hi-IN'],
  'ru-RU': ['ru-RU'],
  'it-IT': ['it-IT', 'it-CH'],
  'nl-NL': ['nl-NL', 'nl-BE'],
  'tr-TR': ['tr-TR'],
  'pl-PL': ['pl-PL'],
  'uk-UA': ['uk-UA'],
  'sv-SE': ['sv-SE'],
  'da-DK': ['da-DK'],
  'nb-NO': ['nb-NO'],
  'fi-FI': ['fi-FI'],
  'cs-CZ': ['cs-CZ'],
  'hu-HU': ['hu-HU'],
  'el-GR': ['el-GR'],
  'he-IL': ['he-IL'],
  'th-TH': ['th-TH'],
  'vi-VN': ['vi-VN'],
  'id-ID': ['id-ID'],
  'ms-MY': ['ms-MY'],
  'fil-PH': ['fil-PH'],
  'fa-IR': ['fa-IR'],
  'bn-BD': ['bn-BD', 'bn-IN'],
  'ur-PK': ['ur-PK', 'ur-IN'],
  'ta-IN': ['ta-IN', 'ta-LK'],
  'te-IN': ['te-IN'],
  'mr-IN': ['mr-IN'],
  'gu-IN': ['gu-IN'],
  'kn-IN': ['kn-IN'],
  'ml-IN': ['ml-IN'],
  'pa-IN': ['pa-IN'],
  'sw-KE': ['sw-KE', 'sw-TZ'],
  'zu-ZA': ['zu-ZA'],
  'af-ZA': ['af-ZA'],
  'am-ET': ['am-ET']
};

/**
 * Get speech recognition language code from display name
 * @param {string} displayName - The user-friendly language name
 * @returns {string} Speech recognition language code
 */
export const getSpeechLanguageCode = (displayName) => {
  return SPEECH_LANGUAGES[displayName] || 'en-US';
};

/**
 * Get display name from speech recognition code
 * @param {string} languageCode - Speech recognition language code
 * @returns {string} User-friendly display name
 */
export const getLanguageDisplayName = (languageCode) => {
  return Object.keys(SPEECH_LANGUAGES).find(
    key => SPEECH_LANGUAGES[key] === languageCode
  ) || 'English (English)';
};

/**
 * Check if a language is supported for speech recognition
 * @param {string} displayName - The user-friendly language name
 * @returns {boolean} Whether the language is supported
 */
export const isSpeechLanguageSupported = (displayName) => {
  return displayName in SPEECH_LANGUAGES;
};

/**
 * Get all supported speech recognition languages
 * @returns {Array} Array of {displayName, code} objects
 */
export const getAllSupportedLanguages = () => {
  return Object.entries(SPEECH_LANGUAGES).map(([displayName, code]) => ({
    displayName,
    code
  }));
};

/**
 * Get regional variants for a language code
 * @param {string} languageCode - Base language code
 * @returns {Array} Array of regional variant codes
 */
export const getRegionalVariants = (languageCode) => {
  return REGIONAL_VARIANTS[languageCode] || [languageCode];
};

/**
 * Get the best speech recognition language code with fallback
 * @param {string} preferredLanguage - User's preferred language display name
 * @returns {string} Best available language code
 */
export const getBestSpeechLanguage = (preferredLanguage) => {
  if (isSpeechLanguageSupported(preferredLanguage)) {
    return getSpeechLanguageCode(preferredLanguage);
  }
  
  // Fallback to English if not supported
  console.warn(`Speech recognition not supported for ${preferredLanguage}, falling back to English`);
  return 'en-US';
};

const speechLanguagesModule = {
  SPEECH_LANGUAGES,
  REGIONAL_VARIANTS,
  getSpeechLanguageCode,
  getLanguageDisplayName,
  isSpeechLanguageSupported,
  getAllSupportedLanguages,
  getRegionalVariants,
  getBestSpeechLanguage
};

export default speechLanguagesModule;