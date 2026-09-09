import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  IndianRupee, 
  MapPin, 
  ShieldCheck, 
  Check, 
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { translations } from '../data/translations.js';

export function MakeOfferModal({
  isOpen,
  onClose,
  crop,
  merchantInfo,
  onSubmitOffer,
  language
}) {
  if (!isOpen || !crop) return null;

  const t = translations[language] || translations.en;

  const [offeredPrice, setOfferedPrice] = useState(crop.farmerPricePerUnit || 25);
  const [quantity, setQuantity] = useState(Math.min(crop.quantityAvailable, 500));
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [vehicleType, setVehicleType] = useState('Tata Ace Gold (1.5 Ton Mini-Truck)');
  const [vehicleNo, setVehicleNo] = useState('MH-15-AB-7890');
  const [driverName, setDriverName] = useState('Raju Gavit');
  const [driverPhone, setDriverPhone] = useState('+91 98230 45612');
  const [pickupTime, setPickupTime] = useState('09:30 AM');
  const [notes, setNotes] = useState('Direct procurement for wholesale retail distribution. Immediate settlement upon visual AI verification.');
  const [submitting, setSubmitting] = useState(false);

  const totalAmount = Number(offeredPrice) * Number(quantity);
  const priceDiff = Number(offeredPrice) - crop.farmerPricePerUnit;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmitOffer({
        cropId: crop.id,
        offeredPrice: Number(offeredPrice),
        quantity: Number(quantity),
        pickupDate,
        notes,
        merchantId: merchantInfo.id,
        merchantName: merchantInfo.name,
        merchantOwner: merchantInfo.owner,
        merchantPhone: merchantInfo.phone,
        merchantLocation: merchantInfo.location,
        distanceKm: crop.distanceKm || 22,
        vehicleType,
        vehicleNo,
        driverName,
        driverPhone,
        pickupTime,
        pickupLocation: `${crop.location.village}, ${crop.location.district}`
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-[32px] sm:rounded-[36px] shadow-2xl border-4 border-amber-300 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-5 sm:p-6 text-amber-950 flex items-center justify-between border-b-4 border-amber-700">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white text-amber-800 flex items-center justify-center font-black shadow-md">
              <Truck className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-950">
                व्यापारी खरीद प्रस्ताव (Apply for Produce)
              </h2>
              <p className="text-xs text-amber-900 font-bold">
                SIH26033: Direct Farmer-to-Merchant Procurement
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-amber-700/20 hover:bg-amber-700/40 text-amber-950 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Crop Summary */}
        <div className="bg-amber-50/80 p-4 sm:p-5 border-b border-amber-200 flex items-center gap-4">
          <img
            src={crop.imageUrl}
            alt={crop.cropName}
            referrerPolicy="no-referrer"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-300 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-emerald-950 truncate">
                {crop.cropName}
              </h3>
              <span className="bg-emerald-100 text-emerald-900 text-[11px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                {crop.grade || 'Grade A'}
              </span>
            </div>
            <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{crop.location.village}, {crop.location.district} ({crop.distanceKm || 22} km)</span>
            </p>
            <div className="flex items-center gap-3 mt-1.5 text-xs">
              <span className="text-emerald-900 font-bold">
                किसान का अपेक्षित भाव: <strong className="text-emerald-700">₹{crop.farmerPricePerUnit}/{crop.unit}</strong>
              </span>
              <span className="text-emerald-700 font-medium">
                उपलब्ध: <strong>{crop.quantityAvailable} {crop.unit}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Offer Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {/* Price & Quantity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-emerald-950 uppercase tracking-wider mb-1.5">
                आपकी बोली दर (Offered Rate per {crop.unit}) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-900 font-black text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  required
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(e.target.value)}
                  className="w-full bg-emerald-50 border-2 border-emerald-300 rounded-2xl pl-8 pr-4 py-2.5 text-base font-black text-emerald-950 focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <p className="text-[11px] font-bold mt-1 text-emerald-700">
                {priceDiff >= 0 ? (
                  <span className="text-emerald-700">किसान के भाव से +₹{priceDiff} अधिक (स्वीकृति की संभावना उच्च)</span>
                ) : (
                  <span className="text-amber-800">किसान के भाव से ₹{Math.abs(priceDiff)} कम</span>
                )}
              </p>
            </div>

            <div>
              <label className="block text-xs font-black text-emerald-950 uppercase tracking-wider mb-1.5">
                मांग मात्रा (Quantity) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={crop.quantityAvailable}
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-emerald-50 border-2 border-emerald-300 rounded-2xl px-4 py-2.5 text-base font-black text-emerald-950 focus:border-emerald-600 focus:outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-700">
                  {crop.unit}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-emerald-600 mt-1">
                अधिकतम: {crop.quantityAvailable} {crop.unit}
              </p>
            </div>
          </div>

          {/* Transport Arrangement Section (Crucial requirement: Transport is handled by merchant) */}
          <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-300 space-y-3">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-700" />
              <div>
                <h4 className="text-xs sm:text-sm font-black text-amber-950">
                  परिवहन व्यापारी द्वारा (Transport Arranged by Merchant)
                </h4>
                <p className="text-[11px] text-amber-800 font-semibold">
                  किसान से माल उठाने (Pickup) का खर्च व वाहन पूरी तरह व्यापारी की जिम्मेदारी है।
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-amber-950 mb-1">
                  वाहन का प्रकार (Vehicle Type)
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-950 focus:outline-none"
                >
                  <option value="Tata Ace Gold (1.5 Ton Mini-Truck)">Tata Ace Gold (1.5 Ton)</option>
                  <option value="Mahindra Bolero Maxi Truck (2 Ton)">Mahindra Bolero Maxi Truck (2 Ton)</option>
                  <option value="Eicher Pro 2049 (3.5 Ton)">Eicher Pro 2049 (3.5 Ton)</option>
                  <option value="Merchant Tempo / Auto Carrier">Merchant Tempo / Local Carrier</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-amber-950 mb-1">
                  वाहन नंबर (Vehicle No.)
                </label>
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  placeholder="MH-15-AB-7890"
                  className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-amber-950 mb-1">
                  ड्राइवर का नाम व फोन
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="नाम"
                    className="w-1/2 bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-amber-950 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    placeholder="फोन"
                    className="w-1/2 bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-amber-950 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-amber-950 mb-1">
                  पिकअप तारीख व समय
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-3/5 bg-white border border-amber-300 rounded-xl px-2 py-1.5 text-xs font-bold text-amber-950 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-2/5 bg-white border border-amber-300 rounded-xl px-2 py-1.5 text-xs font-bold text-amber-950 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Offer Total Calculation & Terms */}
          <div className="bg-emerald-900 text-white rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-300 font-bold block uppercase tracking-wider">
                कुल खरीद राशि (Total Deal Amount)
              </span>
              <span className="text-2xl font-black text-amber-300">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-emerald-200 block font-semibold">
                सत्यापन के बाद सीधा किसान UPI भुगतान
              </span>
              <span className="text-xs bg-emerald-800 text-emerald-100 font-bold px-2 py-0.5 rounded-full inline-block mt-1">
                Zero Middlemen Fee
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black text-emerald-900 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              रद्द करें (Cancel)
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-black px-6 py-2.5 rounded-2xl text-xs sm:text-sm shadow-lg border-b-4 border-amber-700 transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{submitting ? 'प्रस्ताव भेजा जा रहा है...' : 'किसान को खरीद ऑफर भेजें (Submit Offer)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
