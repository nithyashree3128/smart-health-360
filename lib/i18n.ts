export type Lang = "en" | "ta" | "hi" | "te"

export const LANGUAGES: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
]

// Bilingual dictionary: each key maps to English + localized script placeholders.
// The localized entries are structural mock indicators to demonstrate multilingual UI.
type Entry = Record<Lang, string>

const DICT: Record<string, Entry> = {
  appName: {
    en: "Smart Health 360",
    ta: "ஸ்மார்ட் ஹெல்த் 360",
    hi: "स्मार्ट हेल्थ 360",
    te: "స్మార్ట్ హెల్త్ 360",
  },
  tagline: {
    en: "Predict. Prevent. Optimize.",
    ta: "முன்னறிவி. தடு. மேம்படுத்து.",
    hi: "अनुमान. रोकथाम. अनुकूलन.",
    te: "అంచనా. నివారణ. అనుకూలీకరణ.",
  },
  aiHealthAssistant: {
    en: "AI Health Assistant",
    ta: "AI உடல்நல உதவியாளர்",
    hi: "AI स्वास्थ्य सहायक",
    te: "AI ఆరోగ్య సహాయకుడు",
  },
  bedFinder: {
    en: "Real-Time Bed Finder",
    ta: "நேரடி படுக்கை தேடல்",
    hi: "रीयल-टाइम बेड फाइंडर",
    te: "రియల్-టైమ్ బెడ్ ఫైండర్",
  },
  grievanceBox: {
    en: "Grievance / Complaint Box",
    ta: "குறை / புகார் பெட்டி",
    hi: "शिकायत / कंप्लेंट बॉक्स",
    te: "ఫిర్యాదు / కంప్లైంట్ బాక్స్",
  },
  digitalProfile: {
    en: "Digital Health Profile",
    ta: "டிஜிட்டல் சுகாதார சுயவிவரம்",
    hi: "डिजिटल स्वास्थ्य प्रोफ़ाइल",
    te: "డిజిటల్ ఆరోగ్య ప్రొఫైల్",
  },
  patientQueue: {
    en: "Patient Queue",
    ta: "நோயாளர் வரிசை",
    hi: "मरीज़ कतार",
    te: "రోగుల క్యూ",
  },
  inventoryLedger: {
    en: "Inventory Ledger",
    ta: "சரக்கு பேரேடு",
    hi: "इन्वेंटरी लेजर",
    te: "ఇన్వెంటరీ లెడ్జర్",
  },
  redistribution: {
    en: "AI Resource Redistribution Engine",
    ta: "AI வள மறுபகிர்வு இயந்திரம்",
    hi: "AI संसाधन पुनर्वितरण इंजन",
    te: "AI వనరుల పునఃపంపిణీ ఇంజిన్",
  },
  grievancePanel: {
    en: "Active Patient Grievances",
    ta: "செயலில் உள்ள நோயாளர் குறைகள்",
    hi: "सक्रिय मरीज़ शिकायतें",
    te: "క్రియాశీల రోగుల ఫిర్యాదులు",
  },
  signIn: {
    en: "Sign In",
    ta: "உள்நுழை",
    hi: "साइन इन",
    te: "సైన్ ఇన్",
  },
  emergencySOS: {
    en: "SOS Emergency",
    ta: "SOS அவசரம்",
    hi: "SOS आपातकाल",
    te: "SOS అత్యవసరం",
  },
  commandCenter: {
    en: "Command Center",
    ta: "கட்டளை மையம்",
    hi: "कमांड सेंटर",
    te: "కమాండ్ సెంటర్",
  },
  overview: {
    en: "Overview",
    ta: "மேலோட்டம்",
    hi: "अवलोकन",
    te: "అవలోకనం",
  },
}

/** Returns "English / localized" bilingual string. For English it returns just English. */
export function t(key: keyof typeof DICT, lang: Lang): string {
  const entry = DICT[key]
  if (!entry) return String(key)
  if (lang === "en") return entry.en
  return `${entry.en} / ${entry[lang]}`
}

/** Single-language lookup (no bilingual join). */
export function tl(key: keyof typeof DICT, lang: Lang): string {
  return DICT[key]?.[lang] ?? String(key)
}
