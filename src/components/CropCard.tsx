import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  Volume2, 
  TrendingUp, 
  Sparkles,
  ShoppingBag,
  Info
} from 'lucide-react';
import { CropListing, LanguageCode } from '../types';
import { translations } from '../data/translations';

interface CropCardProps {
  crop: CropListing;
  language: LanguageCode;
  onSelectCropForOrder: (crop: CropListing) => void;
}

export const CropCard: React.FC<CropCardProps> = ({
  crop,
  language,
  onSelectCropForOrder,
}) => {
  const t = translations[language] || translations.en;
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Calculate percentages
  const farmerExtraPercent = Math.round(
    ((crop.farmerPricePerUnit - crop.mandiApmcPricePerUnit) / crop.mandiApmcPricePerUnit) * 100
  );

  const consumerSavePercent = Math.round(
    ((crop.retailMarketPricePerUnit - crop.farmerPricePerUnit) / crop.retailMarketPricePerUnit) * 100
  );

  const speakCropDetails = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    let text = '';
    if (language === 'hi') {
      text = `${crop.cropNameHindi}, किसान ${crop.farmerName}, गाँव ${crop.location.village}, जिला ${crop.location.district}। सीधा भाव ₹${crop.farmerPricePerUnit} प्रति ${crop.unit}। मंडी से किसान को ${farmerExtraPercent}% अधिक मुनाफा और आपको ${consumerSavePercent}% की सीधी बचत।`;
    } else if (language === 'mr') {
      text = `${crop.cropName}, शेतकरी ${crop.farmerName}, जिल्हा ${crop.location.district}. थेट दर ₹${crop.farmerPricePerUnit} प्रति ${crop.unit}. शेतकऱ्याला ${farmerExtraPercent}% ज्यादा नफा.`;
    } else {
      text = `${crop.cropName} by farmer ${crop.farmerName} from ${crop.location.district}, ${crop.location.state}. Direct farm price is rupees ${crop.farmerPricePerUnit} per ${crop.unit}. Farmer earns ${farmerExtraPercent}% more than mandi rate, and you save ${consumerSavePercent}%.`;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'mr') utterance.lang = 'mr-IN';
    else utterance.lang = 'en-IN';

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const cleanPhone = crop.farmerPhone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Namaste ${crop.farmerName} ji, I saw your ${crop.cropName} listing on KisanSetu. I want to buy direct without any middlemen.`
  )}`;

  return (
    <div className="bg-white rounded-[32px] border-2 border-emerald-100 border-b-8 border-emerald-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Image & Badges */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-emerald-50">
          <img
            src={crop.imageUrl}
            alt={crop.cropName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // fallback image if broken
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
            }}
          />

          {/* Top badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            <span className="bg-emerald-800/90 text-white text-[11px] font-black px-3 py-1 rounded-full shadow backdrop-blur-sm">
              {crop.category}
            </span>
            <span className="bg-amber-400 text-amber-950 text-[11px] font-black px-3 py-1 rounded-full shadow border-b-2 border-amber-600">
              {crop.farmingType}
            </span>
          </div>

          {/* Audio helper button right on the photo */}
          <button
            type="button"
            onClick={speakCropDetails}
            title="Listen in regional audio"
            className={`absolute top-2.5 right-2.5 p-2 rounded-full shadow backdrop-blur-sm transition-all ${
              isPlayingAudio
                ? 'bg-amber-400 text-amber-950 animate-bounce'
                : 'bg-white/90 text-emerald-900 hover:bg-white hover:scale-105'
            }`}
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Extra farmer profit ribbon */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
            <span className="bg-emerald-600 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow border-b-2 border-emerald-800 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
              Farmer gets +{farmerExtraPercent}% More
            </span>
            <span className="bg-amber-400 text-amber-950 text-[11px] font-black px-2.5 py-1.5 rounded-xl shadow border-b-2 border-amber-600">
              Save {consumerSavePercent}%
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {/* Title & Variety */}
          <div className="mb-2">
            <h3 className="font-black text-emerald-950 text-lg leading-snug">
              {crop.cropName}
            </h3>
            <p className="text-xs text-emerald-700 font-bold">
              {crop.variety} • <span className="text-emerald-800 font-black">{crop.grade}</span>
            </p>
          </div>

          {/* Farmer & Location Info */}
          <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100 mb-3 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-950 font-black">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{crop.farmerName}</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold ml-auto border border-emerald-200">
                Verified
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{crop.location.village}, {crop.location.district}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>Harvested: {crop.harvestDate}</span>
            </div>
          </div>

          {/* Price Transparency Breakdown with Vibrant signature border-l-8 */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border-l-8 border-emerald-500 border border-emerald-100 mb-3">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-xs font-black text-emerald-900 uppercase">Direct Price:</span>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-600">₹{crop.farmerPricePerUnit}</span>
                <span className="text-xs font-bold text-emerald-800"> /{crop.unit}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1.5 border-t border-emerald-200/80 font-medium">
              <div>
                <span className="block text-stone-400 font-bold uppercase text-[9px]">Mandi Dalal:</span>
                <span className="font-bold text-stone-400 line-through">₹{crop.mandiApmcPricePerUnit}/{crop.unit}</span>
              </div>
              <div className="text-right">
                <span className="block text-stone-400 font-bold uppercase text-[9px]">City Supermarket:</span>
                <span className="font-bold text-stone-600">₹{crop.retailMarketPricePerUnit}/{crop.unit}</span>
              </div>
            </div>
          </div>

          {/* Quantity & Stock info */}
          <div className="flex items-center justify-between text-xs text-stone-600 mb-2 px-1 font-semibold">
            <span>
              Available: <strong className="text-emerald-950 font-black">{crop.quantityAvailable} {crop.unit}</strong>
            </span>
            <span>
              Min Order: <strong className="text-emerald-950 font-black">{crop.minOrderQuantity} {crop.unit}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer with Vibrant buttons */}
      <div className="p-5 pt-0 space-y-2.5">
        {/* Main Buy Button */}
        <button
          id={`buy-crop-${crop.id}`}
          type="button"
          onClick={() => onSelectCropForOrder(crop)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-4 rounded-2xl text-sm transition-all shadow-md border-b-4 border-emerald-800 hover:scale-[0.99] active:scale-95 flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t.buyDirectBtn}</span>
        </button>

        {/* Peer to Peer direct connect */}
        <div className="grid grid-cols-2 gap-2">
          <a
            id={`call-farmer-${crop.id}`}
            href={`tel:${crop.farmerPhone}`}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl border-2 border-emerald-200 bg-emerald-50 text-xs font-black text-emerald-900 hover:bg-emerald-100 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.callFarmerBtn}</span>
          </a>

          <a
            id={`chat-farmer-${crop.id}`}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl border-2 border-emerald-200 bg-emerald-50 text-xs font-black text-emerald-900 hover:bg-emerald-100 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.chatFarmerBtn}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
