import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Check, 
  TrendingDown, 
  Phone, 
  MessageCircle, 
  QrCode 
} from 'lucide-react';
import { translations } from '../data/translations.js';

export function OrderModal({
  isOpen,
  onClose,
  crop,
  onPlaceOrder,
  onSubmitOrder,
  language,
}) {
  const t = translations[language] || translations.en;
  const submitOrderHandler = onPlaceOrder || onSubmitOrder;

  const [quantity, setQuantity] = useState(crop?.minOrderQuantity || 10);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [buyerType, setBuyerType] = useState('Consumer (घर के लिए)');
  const [deliveryType, setDeliveryType] = useState('Direct Rural Express Delivery');
  const [paymentMode, setPaymentMode] = useState('Direct UPI to Farmer');
  const [showUpiQr, setShowUpiQr] = useState(false);

  if (!isOpen || !crop) return null;

  const totalAmount = quantity * crop.farmerPricePerUnit;
  const storeRetailCost = quantity * crop.retailMarketPricePerUnit;
  const totalSaved = Math.max(0, storeRetailCost - totalAmount);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone) {
      alert('कृपया अपना नाम और मोबाइल नंबर दर्ज करें।');
      return;
    }

    if (submitOrderHandler) {
      submitOrderHandler({
        cropId: crop.id,
        cropName: crop.cropName,
        farmerName: crop.farmerName,
        farmerPhone: crop.farmerPhone,
        buyerName,
        buyerPhone,
        buyerAddress: buyerAddress || 'City Address',
        buyerType,
        quantity,
        unit: crop.unit,
        unitPrice: crop.farmerPricePerUnit,
        totalAmount,
        deliveryType,
        paymentMode,
        status: 'confirmed',
      });
    }

    onClose();
  };

  const cleanPhone = crop.farmerPhone.replace(/[^0-9]/g, '');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black">
                सीधा किसान से आर्डर करें
              </h2>
              <p className="text-xs text-emerald-200">
                Direct Purchase • Zero Middlemen Markup
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Selected Crop Summary strip */}
        <div className="bg-stone-50 p-4 border-b border-stone-200 flex items-center gap-3">
          <img
            src={crop.imageUrl}
            alt={crop.cropName}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-xl object-cover border border-stone-200 shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-stone-900 text-sm truncate">
              {crop.cropName}
            </h3>
            <p className="text-xs text-stone-500">
              Farmer: <strong className="text-stone-800">{crop.farmerName}</strong> ({crop.location.village}, {crop.location.district})
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-emerald-800 font-black text-sm">
                ₹{crop.farmerPricePerUnit}/{crop.unit}
              </span>
              <span className="text-stone-400 text-xs line-through">
                Retail: ₹{crop.retailMarketPricePerUnit}/{crop.unit}
              </span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[72vh] overflow-y-auto">
          {/* Quantity Stepper */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-800">
                मात्रा चुनें (Order Quantity in {crop.unit}) *
              </label>
              <span className="text-xs text-stone-500 font-medium">
                Min order: {crop.minOrderQuantity} {crop.unit} • Available: {crop.quantityAvailable} {crop.unit}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(crop.minOrderQuantity, q - (crop.unit.includes('bag') ? 1 : 5)))}
                className="w-11 h-11 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-lg border border-stone-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                -
              </button>

              <input
                id="order-quantity-input"
                type="number"
                min={crop.minOrderQuantity}
                max={crop.quantityAvailable}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(crop.minOrderQuantity, Number(e.target.value)))}
                className="flex-1 text-center font-black text-lg py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />

              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(crop.quantityAvailable, q + (crop.unit.includes('bag') ? 1 : 5)))}
                className="w-11 h-11 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-lg border border-stone-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Pricing calculation bill */}
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-700">
              <span>Farmer Direct Price ({quantity} {crop.unit} × ₹{crop.farmerPricePerUnit}):</span>
              <span className="font-bold text-stone-900">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Supermarket / City Store Equivalent:</span>
              <span className="line-through font-semibold">₹{storeRetailCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
              <span className="text-xs font-black text-emerald-950 flex items-center gap-1">
                <TrendingDown className="w-4 h-4 text-emerald-700" />
                आपकी कुल सीधी बचत (Your Savings):
              </span>
              <span className="text-base font-black text-emerald-700">
                ₹{totalSaved.toLocaleString('en-IN')} Saved
              </span>
            </div>
          </div>

          {/* Buyer Type Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              आप किस उद्देश्य से खरीद रहे हैं? (Buyer Type)
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'Consumer (घर के लिए)', label: 'घर के लिए (Consumer)' },
                { id: 'Kirana / Retailer (दुकानदार)', label: 'किराना स्टोर (Retailer)' },
                { id: 'Restaurant / Bulk (होटल/थोक)', label: 'सोसायटी / होटल (Collective)' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBuyerType(item.id)}
                  className={`p-2 rounded-xl text-left font-semibold border transition-all cursor-pointer ${
                    buyerType === item.id
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Buyer Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                आपका नाम (Buyer Name) *
              </label>
              <input
                id="order-buyer-name"
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="उदा. अमित वर्मा"
                required
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                मोबाइल नंबर (Phone Number) *
              </label>
              <input
                id="order-buyer-phone"
                type="tel"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                placeholder="+91 98000 00000"
                required
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1">
              डिलीवरी का पता / शहर (Delivery Address)
            </label>
            <input
              id="order-buyer-address"
              type="text"
              value={buyerAddress}
              onChange={(e) => setBuyerAddress(e.target.value)}
              placeholder="मकान नंबर, सोसायटी, सड़क, शहर व पिनकोड"
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Delivery & Payment Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                डिलीवरी विकल्प (Logistics)
              </label>
              <select
                id="order-delivery-type"
                value={deliveryType}
                onChange={(e) => setDeliveryType(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                <option value="Direct Rural Express Delivery">Direct Rural Express (सीधा टेम्पो)</option>
                <option value="Farm Gate Pickup">Farm Gate Pickup (खेत से खुद उठाएं)</option>
                <option value="Community Collective Drop">Community Collective Drop (सोसायटी ड्रॉप)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                भुगतान का तरीका (Payment Mode)
              </label>
              <select
                id="order-payment-mode"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                <option value="Direct UPI to Farmer">Direct UPI to Farmer (सीधा किसान के खाते में)</option>
                <option value="Cash on Delivery">Cash on Delivery / Pickup (नकद)</option>
                <option value="Bank Transfer (IMPS/NEFT)">Bank Transfer (IMPS/NEFT)</option>
              </select>
            </div>
          </div>

          {/* UPI Direct QR Code Preview button */}
          {paymentMode === 'Direct UPI to Farmer' && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-amber-700" />
                  Farmer UPI ID: <strong className="text-emerald-900">{crop.upiId || 'kisan@upi'}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setShowUpiQr(!showUpiQr)}
                  className="text-xs font-bold text-emerald-800 underline cursor-pointer"
                >
                  {showUpiQr ? 'Hide QR' : 'Show UPI QR'}
                </button>
              </div>

              {showUpiQr && (
                <div className="mt-3 text-center p-3 bg-white rounded-xl border border-stone-200 inline-block w-full">
                  <div className="w-36 h-36 mx-auto bg-stone-100 rounded-lg flex flex-col items-center justify-center border border-dashed border-stone-400 p-2">
                    <QrCode className="w-20 h-20 text-emerald-900" />
                    <span className="text-[10px] font-black text-stone-700 mt-1">₹{totalAmount} UPI QR</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-2">
                    Scan via PhonePe, GPay, Paytm to pay <strong>{crop.farmerName}</strong> directly.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Direct WhatsApp Call banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-100 text-xs text-stone-600">
            <span>Want to discuss harvest quality first?</span>
            <div className="flex items-center gap-2">
              <a
                href={`tel:${crop.farmerPhone}`}
                className="flex items-center gap-1 font-bold text-emerald-800 hover:underline"
              >
                <Phone className="w-3 h-3" /> Call
              </a>
              <span>•</span>
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-bold text-emerald-700 hover:underline"
              >
                <MessageCircle className="w-3 h-3" /> WhatsApp
              </a>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              id="confirm-direct-order-btn"
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3.5 px-6 rounded-2xl text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-5 h-5" />
              <span>सीधा आर्डर पुष्ट करें (Confirm Direct Order - ₹{totalAmount.toLocaleString('en-IN')})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
