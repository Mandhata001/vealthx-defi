import { useState } from "react";

const LanguageToggle = () => {
  const [currentLang, setCurrentLang] = useState("en");

  const languages = {
    en: {
      flag: "🇺🇸",
      name: "English",
      code: "EN",
    },
    hi: {
      flag: "🇮🇳",
      name: "हिंदी",
      code: "हि",
    },
  };

  const toggleLanguage = () => {
    const newLang = currentLang === "en" ? "hi" : "en";
    setCurrentLang(newLang);
    // Here you would typically update your i18n context
    // For demo purposes, we'll just show the toggle
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/80 hover:bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 text-sm font-medium"
      title={`Switch to ${languages[currentLang === "en" ? "hi" : "en"].name}`}
    >
      <span className="text-lg">{languages[currentLang].flag}</span>
      <span className="text-gray-700">{languages[currentLang].code}</span>
      <svg
        className="w-4 h-4 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16l-4-4m0 0l4-4m-4 4h18"
        />
      </svg>
    </button>
  );
};

export default LanguageToggle;
