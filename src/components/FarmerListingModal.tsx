import React, { useState } from 'react';
import { 
  X, 
  Sprout, 
  Mic, 
  MicOff, 
  Upload, 
  IndianRupee, 
  Sparkles, 
  Check, 
  HelpCircle,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { CropListing, CropCategory, UnitType, FarmingType, CropGrade, LanguageCode } from '../types';
import { translations } from '../data/translations';

interface FarmerListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCrop: (crop: Partial<CropListing>) => void;
  language: LanguageCode;
}

const COMMON_INDIAN_CROPS = [
  { name: 'Red Onion (लाल प्याज)', hindi: 'लाल प्याज', category: 'Vegetables' as CropCategory, unit: 'kg' as UnitType, mandiEst: 14, fairEst: 28, img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fresh Tomato (टमाटर)', hindi: 'ताजा टमाटर', category: 'Vegetables' as CropCategory, unit: 'kg' as UnitType, mandiEst: 9, fairEst: 22, img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
  { name: 'Potato (आलू)', hindi: 'आलू', category: 'Vegetables' as CropCategory, unit: 'kg' as UnitType, mandiEst: 8, fairEst: 18, img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80' },
  { name: 'Sharbati Wheat (गेहूं)', hindi: 'शरबती गेहूं', category: 'Grains' as CropCategory, unit: 'bag (50kg)' as UnitType, mandiEst: 1300, fairEst: 1950, img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80' },
  { name: 'Basmati Rice (बासमती चावल)', hindi: 'बासमती चावल', category: 'Grains' as CropCategory, unit: 'bag (50kg)' as UnitType, mandiEst: 2600, fairEst: 4200, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
  { name: 'Red Chilli (सूखी मिर्च)', hindi: 'लाल मिर्च', category: 'Spices' as CropCategory, unit: 'kg' as UnitType, mandiEst: 120, fairEst: 190, img: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80' },
  { name: 'Mango / Hapus (आम)', hindi: 'हापूस आम', category: 'Fruits' as CropCategory, unit: 'crate (25kg)' as UnitType, mandiEst: 1100, fairEst: 2200, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80' },
  { name: 'Garlic / Lahsun (लहसुन)', hindi: 'देसी लहसुन', category: 'Spices' as CropCategory, unit: 'kg' as UnitType, mandiEst: 80, fairEst: 140, img: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80' },
];

export const FarmerListingModal: React.FC<FarmerListingModalProps> = ({
  isOpen,
  onClose,
  onAddCrop,
  language,
}) => {
  const t = translations[language] || translations.en;

  const [cropName, setCropName] = useState('');
  const [variety, setVariety] = useState('');
  const [category, setCategory] = useState<CropCategory>('Vegetables');
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [quantity, setQuantity] = useState<number>(500);
  const [unit, setUnit] = useState<UnitType>('kg');
  const [minOrder, setMinOrder] = useState<number>(10);
  const [farmerPrice, setFarmerPrice] = useState<number>(25);
  const [mandiPrice, setMandiPrice] = useState<number>(12);
  const [retailPrice, setRetailPrice] = useState<number>(40);
  const [farmingType, setFarmingType] = useState<FarmingType>('Natural (प्राकृतिक)');
  const [grade, setGrade] = useState<CropGrade>('Grade A (उत्तम)');
  const [upiId, setUpiId] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80');
  const [description, setDescription] = useState('');
  const [isListening, setIsListening] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof COMMON_INDIAN_CROPS[0]) => {
    setCropName(preset.name);
    setCategory(preset.category);
    setUnit(preset.unit);
    setMandiPrice(preset.mandiEst);
    setFarmerPrice(preset.fairEst);
    setRetailPrice(Math.round(preset.fairEst * 1.5));
    setImageUrl(preset.img);
  };

  // Voice speech-to-text recognition for farmer ease
  const toggleSpeechRecognition = () => {
    const windowWithSpeech = window as any;
    const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice dictation is supported in Chrome/Safari/Edge browsers.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName || !farmerName || !farmerPrice) {
      alert('कृपया फसल का नाम, आपका नाम और सीधा भाव अवश्य भरें।');
      return;
    }

    onAddCrop({
      cropName,
      cropNameHindi: cropName,
      variety: variety || 'Desi Grade A',
      category,
      farmerName,
      farmerPhone: farmerPhone || '+91 98000 12345',
      location: {
        village: village || 'Gramin Kshetra',
        district: district || 'Nashik',
        state: state || 'Maharashtra',
      },
      quantityAvailable: Number(quantity),
      minOrderQuantity: Number(minOrder),
      unit,
      farmerPricePerUnit: Number(farmerPrice),
      mandiApmcPricePerUnit: Number(mandiPrice) || Math.round(Number(farmerPrice) * 0.55),
      retailMarketPricePerUnit: Number(retailPrice) || Math.round(Number(farmerPrice) * 1.5),
      farmingType,
      grade,
      upiId: upiId || `${farmerName.toLowerCase().replace(/\s+/g, '')}@upi`,
      imageUrl,
      description: description || 'Fresh farm harvested produce. Zero chemical ripening.',
      harvestDate: new Date().toISOString().split('T')[0],
      verifiedKisan: true,
    });

    onClose();
  };

  const estimatedExtraGain = (Number(farmerPrice) - Number(mandiPrice)) * Number(quantity);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-emerald-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                {t.listHarvestBtn}
              </h2>
              <p className="text-xs text-emerald-200">
                सीधा बेचें • बिना मंडी दलाली व बिना कमीशन
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Crop Presets for Indian Farmers */}
        <div className="bg-amber-50/80 p-4 border-b border-amber-200">
          <span className="text-xs font-bold text-amber-900 block mb-2">
            ⚡ Quick Crop Selector (एक क्लिक में फसल चुनें):
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {COMMON_INDIAN_CROPS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  cropName === preset.name
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-amber-100'
                }`}
              >
                {preset.hindi}
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Crop & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                फसल का नाम (Crop Name) *
              </label>
              <input
                id="form-crop-name"
                type="text"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="उदा. लाल प्याज (Red Onion)"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                श्रेणी (Category)
              </label>
              <select
                id="form-crop-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as CropCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Vegetables">Vegetables (सब्जियां)</option>
                <option value="Grains">Grains (अनाज व गेहूं/चावल)</option>
                <option value="Fruits">Fruits (फल)</option>
                <option value="Spices">Spices (मसाले)</option>
                <option value="Pulses">Pulses (दालें)</option>
              </select>
            </div>
          </div>

          {/* Variety & Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                किस्म / वैरायटी (Variety)
              </label>
              <input
                id="form-crop-variety"
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="उदा. नासिक गरवा, 1121"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                खेती का तरीका (Method)
              </label>
              <select
                id="form-farming-type"
                value={farmingType}
                onChange={(e) => setFarmingType(e.target.value as FarmingType)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Natural (प्राकृतिक)">Natural (प्राकृतिक)</option>
                <option value="Organic (जैविक)">Organic (जैविक)</option>
                <option value="Conventional (पारंपरिक)">Conventional (पारंपरिक)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                ग्रेड (Quality Grade)
              </label>
              <select
                id="form-crop-grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value as CropGrade)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Grade A (उत्तम)">Grade A (उत्तम)</option>
                <option value="Grade B (मध्यम)">Grade B (मध्यम)</option>
                <option value="Standard (सामान्य)">Standard (सामान्य)</option>
              </select>
            </div>
          </div>

          {/* Farmer Contact & Location */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
            <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700" />
              किसान व खेत की जानकारी (Farmer Details):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  आपका शुभ नाम (Farmer Full Name) *
                </label>
                <input
                  id="form-farmer-name"
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="उदा. ज्ञानेश्वर पाटिल"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  मोबाइल नंबर (Direct Calling / WhatsApp) *
                </label>
                <input
                  id="form-farmer-phone"
                  type="tel"
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  placeholder="+91 98234 56712"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  गाँव (Village)
                </label>
                <input
                  id="form-village"
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="लासलगांव"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  जिला (District)
                </label>
                <input
                  id="form-district"
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="नासिक"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  राज्य (State)
                </label>
                <select
                  id="form-state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-stone-300 text-xs"
                >
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Rajasthan">Rajasthan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quantity & Units */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                उपलब्ध मात्रा (Total Quantity) *
              </label>
              <input
                id="form-quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                इकाई (Unit)
              </label>
              <select
                id="form-unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value as UnitType)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="kg">Kilogram (किग्रा)</option>
                <option value="quintal">Quintal (क्विंटल - 100kg)</option>
                <option value="bag (50kg)">Bag (50kg बोरी)</option>
                <option value="crate (25kg)">Crate (25kg क्रेट)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                न्यूनतम आर्डर (Min Order)
              </label>
              <input
                id="form-min-order"
                type="number"
                min="1"
                value={minOrder}
                onChange={(e) => setMinOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Pricing Section: Fair direct vs APMC benchmark */}
          <div className="bg-emerald-50 p-4 sm:p-5 rounded-2xl border border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-emerald-700" />
                कीमत व मुनाफा निर्धारण (Fair Pricing Calculation)
              </span>
              <span className="bg-emerald-200 text-emerald-950 text-[11px] font-bold px-2 py-0.5 rounded-full">
                0% Commission
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  आपका सीधा भाव (Your Direct Selling Price ₹/{unit}) *
                </label>
                <input
                  id="form-farmer-price"
                  type="number"
                  min="1"
                  value={farmerPrice}
                  onChange={(e) => setFarmerPrice(Number(e.target.value))}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-emerald-600 bg-white text-lg font-black text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <span className="text-[11px] text-stone-500 block mt-1">
                  यही पूरा पैसा सीधे आपके हाथ या बैंक में आएगा।
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  मंडी में दलाल का भाव (APMC Trader Bid ₹/{unit})
                </label>
                <input
                  id="form-mandi-price"
                  type="number"
                  value={mandiPrice}
                  onChange={(e) => setMandiPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-100 text-sm font-bold text-rose-700"
                />
                <span className="text-[11px] text-stone-400 block mt-1">
                  पारंपरिक आढ़तिया की तुलना के लिए
                </span>
              </div>
            </div>

            {/* Extra Profit Highlight */}
            {estimatedExtraGain > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-600 text-white flex items-center justify-between shadow">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-300" />
                  <span className="text-xs font-bold">
                    किसानसेतु पर सीधा बेचकर आपकी अतिरिक्त कमाई:
                  </span>
                </div>
                <span className="text-base sm:text-lg font-black text-amber-300">
                  +₹{estimatedExtraGain.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          {/* Description & Voice Dictation Assist */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-stone-700">
                फसल का विवरण (Crop Details & Quality Notes)
              </label>
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                    : 'bg-stone-100 text-emerald-800 border-stone-300 hover:bg-stone-200'
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isListening ? 'बोलिए (Listening)...' : 'बोलकर लिखें (Voice Input)'}</span>
              </button>
            </div>
            <textarea
              id="form-crop-description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="फसल की ताजगी, कोई रासायनिक छिड़काव नहीं, भंडारण क्षमता आदि लिखें..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* UPI ID for Direct Payment */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              सीधा UPI आईडी या बैंक खाता (Direct Buyer Payment UPI)
            </label>
            <input
              id="form-upi-id"
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="उदा. 9823456712@sbi या patilfarms@okhdfcbank"
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm font-medium"
            />
            <span className="text-[11px] text-stone-500">
              खरीदार का पैसा बिना किसी बिचौलिए के सीधे आपके खाते में क्रेडिट होगा।
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              id="submit-crop-listing-btn"
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black py-3.5 px-6 rounded-2xl text-base shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>सीधी बिक्री के लिए लिस्ट करें (Publish Direct Listing)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
