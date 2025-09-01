import { useState } from 'react';
import { Box, IconButton, InputBase, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const languages = [
  // East Asia
  '한국어 (Korean)',
  '普通话 (Mandarin Chinese)',
  '繁體中文 (Traditional Chinese)',
  '粵語 (Cantonese)',
  '日本語 (Japanese)',
  'Монгол хэл (Mongolian)',

  // South & Southeast Asia
  'हिन्दी (Hindi)',
  'বাংলা (Bengali)',
  'اردو (Urdu)',
  'ਪੰਜਾਬੀ (Punjabi)',
  'मराठी (Marathi)',
  'తెలుగు (Telugu)',
  'தமிழ் (Tamil)',
  'ગુજરાતી (Gujarati)',
  'ಕನ್ನಡ (Kannada)',
  'മലയാളം (Malayalam)',
  'සිංහල (Sinhala)',
  'नेपाली (Nepali)',
  'Bahasa Indonesia (Indonesian)',
  'Bahasa Melayu (Malay)',
  'မြန်မာ (Burmese)',
  'ខ្មែរ (Khmer)',
  'ລາວ (Lao)',
  'ไทย (Thai)',
  'Tiếng Việt (Vietnamese)',
  'Filipino (Filipino)',

  // Middle East & Central Asia
  'العربية (Arabic)',
  'فارسی (Persian)',
  'پښتو (Pashto)',
  'کوردی (Kurdish)',
  'Türkçe (Turkish)',
  'Azərbaycan dili (Azerbaijani)',
  'Қазақша (Kazakh)',
  'Oʻzbekcha (Uzbek)',
  'Тоҷикӣ (Tajik)',
  'Հայերեն (Armenian)',
  'ქართული (Georgian)',
  'עברית (Hebrew)',

  // Africa
  'Kiswahili (Swahili)',
  'Yorùbá (Yoruba)',
  'Igbo (Igbo)',
  'Hausa (Hausa)',
  'isiZulu (Zulu)',
  'isiXhosa (Xhosa)',
  'Af Soomaali (Somali)',
  'Afrikaans (Afrikaans)',
  'Amharic (አማርኛ)',

  // Europe
  'English (English)',
  'Français (French)',
  'Deutsch (German)',
  'Español (Spanish)',
  'Português (Portuguese)',
  'Italiano (Italian)',
  'Nederlands (Dutch)',
  'Polski (Polish)',
  'Українська (Ukrainian)',
  'Русский (Russian)',
  'Română (Romanian)',
  'Ελληνικά (Greek)',
  'Čeština (Czech)',
  'Magyar (Hungarian)',
  'Slovenčina (Slovak)',
  'Slovenščina (Slovenian)',
  'Hrvatski (Croatian)',
  'Srpski (Serbian)',
  'Български (Bulgarian)',
  'Lietuvių (Lithuanian)',
  'Latviešu (Latvian)',
  'Eesti (Estonian)',
  'Svenska (Swedish)',
  'Dansk (Danish)',
  'Norsk (Norwegian)',
  'Suomi (Finnish)',
  'Català (Catalan)',
  'Euskara (Basque)',
  'Galego (Galician)'
];

export default function Language() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const goBack = () => {
    if (window.history.length > 2) navigate(-1);
    else navigate('/');
  };

  const onSelect = (label) => {
    try {
      localStorage.setItem('preferredLanguage', label);
    } catch {}
    goBack();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <IconButton aria-label="Back" onClick={goBack} size="small">
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Language</Typography>
      </Box>

      {/* Search */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, borderRadius: 999, boxShadow: '0px 4px 12px rgba(0,0,0,0.12)', bgcolor: '#fff' }}>
          <SearchIcon sx={{ color: 'text.disabled' }} />
          <InputBase
            placeholder="Search languages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ fontSize: 14, width: '100%' }}
          />
        </Box>
      </Box>

      {/* List */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {languages
          .filter((l) => l.toLowerCase().includes(query.toLowerCase()))
          .map((label, idx, arr) => (
            <Box
              key={label}
              onClick={() => onSelect(label)}
              sx={{ px: 2, py: 1.75, borderBottom: idx < arr.length - 1 ? '1px solid' : 'none', borderColor: 'divider', cursor: 'pointer', '&:hover': { bgcolor: 'grey.50' } }}
            >
              <Typography sx={{ fontSize: 14 }}>{label}</Typography>
            </Box>
          ))}
      </Box>
    </Box>
  );
}
