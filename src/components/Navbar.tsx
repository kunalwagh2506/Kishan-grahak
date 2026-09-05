import React, { useState } from 'react';
import { Sprout, ShoppingBag, BarChart3, Package, Sparkles, Volume2, Globe, PhoneCall } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';

interface NavbarProps {
  currentTab: 'farmer' | 'buyer' | 'transparency' | 'orders' | 'advisor';
  onSelectTab: (tab: 'farmer' | 'buyer' | 'transparency' | 'orders' | 'advisor') => void;
  language: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onOpenListingModal: () => void;
  orderCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  language,
  onSelectLanguage,
  onOpenListingModal,
  orderCount,
}) => {
  const t = translations[language] || translations.en;
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakWelcome = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    let textToSpeak = '';
    if (language === 'hi') {
      textToSpeak = 'किसानसेतु में आपका स्वागत है। यहां आप बिना दलालों के सीधे खेत से ताजी फसल खरीद और बेच सकते हैं। किसान को मिलेगा पूरा हक, ग्राहक को मिलेगा सस्ता व शुद्ध अनाज।';
    } else if (language === 'mr') {
      textToSpeak = 'किसानसेतू मध्ये आपले स्वागत आहे. मध्यस्थांशिवाय थेट शेतातून खरेदी आणि विक्री करा. शेतकऱ्याला जास्त नफा, ग्राहकाला रास्त दर.';
    } else {
      textToSpeak = 'Welcome to KisanSetu. Direct farm-to-consumer trade eliminating multiple middlemen to empower Indian farmers and save consumers money.';
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'mr') utterance.lang = 'mr-IN';
    else utterance.lang = 'en-IN';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b-4 border-emerald-500 shadow-md">
      {/* Top mission strip */}
      <div className="bg-emerald-950 px-4 py-1.5 text-xs text-emerald-200 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-amber-300">Direct Farm Network:</span>
            <span>Eliminating 5-7 middlemen dalal layers • Zero APMC commission • Real-time UPI settlement</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-300 text-xs">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              Kisan Helpline: <strong className="text-white">1800-180-1551</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo and Brand */}
          <div 
            onClick={() => onSelectTab('buyer')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-md border-b-4 border-emerald-800 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-emerald-900">
                  {t.appName}
                </span>
                <span className="bg-amber-400 text-amber-950 text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border-b-2 border-amber-600">
                  DIRECT
                </span>
              </div>
              <p className="text-xs text-emerald-700 font-semibold hidden sm:block">
                खेत से सीधा रसोई • No Middlemen
              </p>
            </div>
          </div>

          {/* Action items: Live buyers badge, Voice helper, Language, Add Listing, Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Buyers Nearby Pill Badge */}
            <div className="hidden lg:flex items-center gap-2 bg-emerald-100 px-3.5 py-1.5 rounded-full text-emerald-800 font-bold text-xs border border-emerald-200">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>4 Buyers Online Nearby</span>
            </div>

            {/* Audio Voice Assistant Button */}
            <button
              id="voice-assist-btn"
              type="button"
              onClick={speakWelcome}
              title={t.voiceHelpText}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border-2 transition-all ${
                isSpeaking
                  ? 'bg-amber-400 text-amber-950 border-amber-500 animate-pulse shadow'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Volume2 className="w-4 h-4 text-emerald-700" />
              <span className="hidden md:inline">{t.voiceAssistance}</span>
            </button>

            {/* Language Dropdown */}
            <div className="flex items-center bg-emerald-50 rounded-2xl px-2 py-1.5 border-2 border-emerald-200">
              <Globe className="w-3.5 h-3.5 text-emerald-700 mr-1" />
              <select
                id="language-select"
                value={language}
                onChange={(e) => onSelectLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-emerald-900 text-xs font-bold focus:outline-none pr-1 cursor-pointer"
              >
                <option value="hi">हिन्दी</option>
                <option value="en">English</option>
                <option value="mr">मराठी</option>
                <option value="pa">ਪੰਜਾਬੀ</option>
                <option value="te">తెలుగు</option>
              </select>
            </div>

            {/* Farmer Direct Listing Button with chunky vibrant button styling */}
            <button
              id="farmer-list-harvest-btn"
              type="button"
              onClick={onOpenListingModal}
              className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-black px-4 py-2 rounded-2xl text-sm shadow-md border-b-4 border-amber-600 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span className="text-lg leading-none">+</span>
              <span className="hidden sm:inline">{t.listHarvestBtn}</span>
              <span className="sm:hidden">फसल बेचें</span>
            </button>

            {/* Avatar Pill */}
            <div className="w-10 h-10 bg-amber-400 rounded-full border-2 border-amber-500 flex items-center justify-center text-amber-950 font-black text-sm shadow-sm">
              KS
            </div>
          </div>
        </div>

        {/* Navigation Tabs bar with chunky rounded styling */}
        <div className="mt-3 pt-2.5 border-t-2 border-emerald-100 flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none">
          <button
            id="tab-buyer"
            type="button"
            onClick={() => onSelectTab('buyer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all ${
              currentTab === 'buyer'
                ? 'bg-emerald-600 text-white shadow-md border-b-4 border-emerald-800'
                : 'text-emerald-900/80 hover:text-emerald-950 hover:bg-emerald-100/70'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.buyerTab}</span>
          </button>

          <button
            id="tab-transparency"
            type="button"
            onClick={() => onSelectTab('transparency')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all ${
              currentTab === 'transparency'
                ? 'bg-emerald-600 text-white shadow-md border-b-4 border-emerald-800'
                : 'text-emerald-900/80 hover:text-emerald-950 hover:bg-emerald-100/70'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{t.transparencyTab}</span>
          </button>

          <button
            id="tab-farmer"
            type="button"
            onClick={() => onSelectTab('farmer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all ${
              currentTab === 'farmer'
                ? 'bg-emerald-600 text-white shadow-md border-b-4 border-emerald-800'
                : 'text-emerald-900/80 hover:text-emerald-950 hover:bg-emerald-100/70'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>{t.farmerTab}</span>
          </button>

          <button
            id="tab-advisor"
            type="button"
            onClick={() => onSelectTab('advisor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all ${
              currentTab === 'advisor'
                ? 'bg-emerald-600 text-white shadow-md border-b-4 border-emerald-800'
                : 'text-emerald-900/80 hover:text-emerald-950 hover:bg-emerald-100/70'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t.advisoryTitle.split('-')[0].trim()}</span>
          </button>

          <button
            id="tab-orders"
            type="button"
            onClick={() => onSelectTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all ${
              currentTab === 'orders'
                ? 'bg-emerald-600 text-white shadow-md border-b-4 border-emerald-800'
                : 'text-emerald-900/80 hover:text-emerald-950 hover:bg-emerald-100/70'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{t.ordersTab}</span>
            {orderCount > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                currentTab === 'orders' ? 'bg-amber-400 text-amber-950' : 'bg-emerald-200 text-emerald-900'
              }`}>
                {orderCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
