import React from 'react';
import { 
  Sprout, 
  TrendingUp, 
  Package, 
  Users, 
  IndianRupee, 
  Plus, 
  Trash2, 
  ShieldCheck,
  Truck,
  Store,
  Check,
  X,
  Sparkles,
  CheckCircle2,
  Clock,
  Phone
} from 'lucide-react';
import { translations } from '../data/translations.js';
import { formatCropExpiry, getShelfLifeDays, isCropExpired } from '../data/produceLifecycle.js';

export function FarmerDashboard({
  crops,
  orders,
  offers = [],
  onAcceptOffer,
  onRejectOffer,
  onOpenListingModal,
  onDeleteCrop,
  onEditCrop,
  farmerUsername,
  language,
}) {
  const t = translations[language] || translations.en;
  const [selectedProductId, setSelectedProductId] = React.useState(null);

  // Calculate statistics
  const activeCrops = crops.filter((crop) => !isCropExpired(crop));
  const expiredCrops = crops.filter(isCropExpired);
  const totalCropsCount = activeCrops.length;
  const totalStockKg = crops.reduce((acc, c) => acc + (c.unit === 'kg' ? c.quantityAvailable : c.quantityAvailable * 50), 0);
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  // Extra profit estimated across all orders
  const estimatedExtraProfit = Math.round(totalRevenue * 0.45);

  const pendingOffers = offers.filter((o) => o.status === 'pending');
  const acceptedOffers = offers.filter((o) => o.status === 'accepted');
  const profileCrop = crops.find((crop) => crop.farmerUsername === farmerUsername) || crops[0];

  return (
    <div className="space-y-6">
      {/* Top Banner with Stats - Vibrant Palette Theme */}
      <div id="farmer-profile" className="bg-white rounded-[36px] sm:rounded-[40px] p-6 sm:p-8 text-emerald-950 shadow-xl border-b-8 border-emerald-200 scroll-mt-40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              सरल किसान केंद्र (Farmer Empowerment Hub)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-emerald-950">
              नमस्ते किसान भाई! बिना बिचौलियों के सीधा व्यापार
            </h1>
            <p className="text-emerald-700 font-semibold text-xs sm:text-sm max-w-xl">
              यहाँ आपकी फसल का पूरा भाव सीधे आपको मिलता है। कोई मंडी दलाली नहीं, कोई वजन की कटौती नहीं।
            </p>
          </div>

          <button
            id="dashboard-add-harvest-btn"
            type="button"
            onClick={onOpenListingModal}
            className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black px-6 py-3.5 rounded-2xl text-sm sm:text-base shadow-lg border-b-4 border-amber-600 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>नई फसल की बिक्री डालें (Add New Crop)</span>
          </button>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600">Kisan Profile</span>
            <h2 className="text-lg font-black text-emerald-950 truncate">{profileCrop?.farmerName || farmerUsername || 'New Farmer'}</h2>
            <p className="text-xs font-semibold text-emerald-700">
              @{farmerUsername || 'farmer'} {profileCrop?.location ? `• ${profileCrop.location.village}, ${profileCrop.location.district}` : '• Add your first product to complete your profile'}
            </p>
          </div>
          <div className="sm:ml-auto grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl bg-white border border-emerald-200 px-3 py-2">
              <strong className="block text-lg font-black text-emerald-950">{activeCrops.length}</strong>
              <span className="text-[10px] font-bold text-emerald-700">Products listed</span>
            </div>
            <div className="rounded-xl bg-white border border-amber-200 px-3 py-2">
              <strong className="block text-lg font-black text-amber-950">{pendingOffers.length}</strong>
              <span className="text-[10px] font-bold text-amber-700">Buy requests</span>
            </div>
          </div>
        </div>

        {/* 4 Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-emerald-100">
          <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-100">
            <span className="text-[11px] text-emerald-700 font-bold block uppercase tracking-wider">
              कुल सक्रिय फसलें (Listings)
            </span>
            <span className="text-2xl font-black text-emerald-950 mt-1 block">
              {totalCropsCount}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">सत्यापित खेत लॉट</span>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-100">
            <span className="text-[11px] text-emerald-700 font-bold block uppercase tracking-wider">
              कुल सीधी बिक्री (Direct Orders)
            </span>
            <span className="text-2xl font-black text-emerald-950 mt-1 block">
              {totalOrdersCount}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">घर व किराना खरीदार</span>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-100">
            <span className="text-[11px] text-emerald-700 font-bold block uppercase tracking-wider">
              सीधा प्राप्त भुगतान (Total Volume)
            </span>
            <span className="text-2xl font-black text-emerald-700 mt-1 block">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">100% Direct UPI / Cash</span>
          </div>

          <div className="bg-amber-400 text-amber-950 p-4 rounded-2xl shadow-md border-b-4 border-amber-600">
            <span className="text-[11px] text-amber-950 font-bold block uppercase tracking-wider">
              किसान की अतिरिक्त सीधी कमाई
            </span>
            <span className="text-2xl font-black text-amber-950 mt-1 block">
              +₹{estimatedExtraProfit.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-amber-900 font-black">दलाल के भाव से अधिक लाभ</span>
          </div>
        </div>
      </div>

      {/* Incoming Merchant Offers & Deals (SIH26033) */}
      <div className="bg-white rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 border-b-8 border-amber-300 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-md">
              <Store className="w-6 h-6 text-amber-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-amber-950">
                  व्यापारी खरीद प्रस्ताव (Merchant Offers & Bids)
                </h2>
                {pendingOffers.length > 0 && (
                  <span className="bg-amber-500 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full animate-bounce">
                    {pendingOffers.length} New
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-800 font-semibold">
                व्यापारी सीधे आपकी फसल खरीदने का ऑफर दे रहे हैं। परिवहन की पूरी व्यवस्था व्यापारी की है।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
              परिवहन खर्च: <strong className="text-emerald-700">₹0 (व्यापारी द्वारा)</strong>
            </span>
          </div>
        </div>

        {offers.length === 0 ? (
          <div className="bg-amber-50/50 rounded-2xl p-6 text-center border border-dashed border-amber-300">
            <Truck className="w-10 h-10 text-amber-500 mx-auto mb-2 opacity-60" />
            <p className="text-xs sm:text-sm font-bold text-amber-900">
              फिलहाल कोई नया व्यापारी ऑफर नहीं है।
            </p>
            <p className="text-[11px] text-amber-700 mt-0.5">
              जैसे ही कोई थोक व्यापारी या किराना नेटवर्क आपकी फसल के लिए आवेदन करेगा, यहाँ दिखाई देगा।
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => {
              const isPending = offer.status === 'pending';
              const isAccepted = offer.status === 'accepted';
              const isRejected = offer.status === 'rejected';
              const isPaid = offer.paymentStatus === 'released_to_farmer';

              return (
                <div
                  key={offer.id}
                  className={`rounded-3xl p-5 border-2 transition-all ${
                    isAccepted
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : isPending
                      ? 'bg-amber-50/70 border-amber-300 shadow-md'
                      : 'bg-stone-50 border-stone-200 opacity-60'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Produce & Merchant Overview */}
                    <div className="flex items-start gap-4">
                      <img
                        src={offer.cropImage}
                        alt={offer.cropName}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-300 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base sm:text-lg font-black text-emerald-950">
                            {offer.cropName}
                          </h3>
                          <span className="text-xs bg-amber-200 text-amber-950 font-bold px-2 py-0.5 rounded-full">
                            मांग: {offer.quantity} {offer.unit}
                          </span>
                        </div>

                        <p className="text-xs text-amber-950 font-bold flex items-center gap-1">
                          <Store className="w-3.5 h-3.5 text-amber-700" />
                          <span>व्यापारी: <strong>{offer.merchantName}</strong> ({offer.merchantOwner || 'प्रोपराइटर'})</span>
                        </p>

                        <p className="text-xs text-amber-800 font-semibold flex items-center gap-2 flex-wrap">
                          <span>स्थान: {offer.merchantLocation}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {offer.merchantPhone}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Price & Deal Total */}
                    <div className="bg-white p-3.5 rounded-2xl border border-amber-200 grid grid-cols-2 gap-3 text-xs shrink-0">
                      <div>
                        <span className="text-[10px] text-amber-800 font-bold block uppercase">व्यापारी बोली दर</span>
                        <span className="text-lg font-black text-emerald-700">₹{offer.offeredPrice}/{offer.unit}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-800 font-bold block uppercase">कुल सौदा राशि</span>
                        <span className="text-lg font-black text-amber-950">₹{offer.totalAmount.toLocaleString('en-IN')}</span>
                        {offer.deliveryFee > 0 && <span className="block text-[10px] text-amber-700 font-bold">Delivery fee: ₹{offer.deliveryFee.toLocaleString('en-IN')}</span>}
                      </div>
                    </div>

                    {/* Action Controls for Farmer */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 justify-center">
                      {isPending && (
                        <>
                          <button
                            type="button"
                            onClick={() => onAcceptOffer(offer.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-5 py-2.5 rounded-2xl text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>प्रस्ताव स्वीकार करें (Accept Offer)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onRejectOffer(offer.id)}
                            className="bg-stone-200 hover:bg-rose-100 text-stone-700 hover:text-rose-700 font-bold px-4 py-2 rounded-2xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>अस्वीकार करें</span>
                          </button>
                        </>
                      )}

                      {isAccepted && (
                        <div className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span>आपने स्वीकार कर लिया (Accepted)</span>
                        </div>
                      )}

                      {isRejected && (
                        <span className="text-xs text-rose-700 font-bold px-3 py-1 bg-rose-50 rounded-xl">
                          अस्वीकृत (Declined)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Transport & AI Verification Progress Indicator */}
                  {isAccepted && (
                    <div className="mt-4 pt-3 border-t border-emerald-200 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 text-emerald-900 font-bold">
                          <Truck className="w-4 h-4 text-emerald-700" />
                          <span>
                            व्यापारी का वाहन: <strong>{offer.transportDetails?.vehicleType || 'Mini-Truck'} ({offer.transportDetails?.vehicleNo || 'MH-15-AB-7890'})</strong>
                          </span>
                          <span>•</span>
                          <span>ड्राइवर: {offer.transportDetails?.driverName || 'Raju'} ({offer.transportDetails?.driverPhone})</span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          पिकअप: {offer.pickupDate} ({offer.transportDetails?.pickupTime || 'Morning'})
                        </span>
                      </div>

                      {/* Payment & Verification status note */}
                      <div className="bg-white p-3 rounded-xl border border-emerald-200 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span className="text-emerald-950 font-semibold">
                            व्यापारी माल प्राप्त करते समय दूसरी फोटो से AI सत्यापन करेगा।
                          </span>
                        </div>

                        {isPaid ? (
                          <span className="bg-emerald-700 text-white font-black px-3 py-1 rounded-lg flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                            ₹{offer.totalAmount.toLocaleString('en-IN')} {offer.paymentMethod === 'offline' ? 'ऑफलाइन भुगतान से' : 'UPI से'} प्राप्त हुआ!
                            <span className="block text-[10px] font-medium text-emerald-100">
                              Ref: {offer.paymentMethod === 'offline' ? offer.paymentNote : offer.payoutRef}
                            </span>
                          </span>
                        ) : (
                          <span className="text-amber-800 font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            सत्यापन के बाद सीधा UPI भुगतान लंबित
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Listings Table / Cards */}
      <div id="farmer-products" className="bg-white rounded-[32px] p-6 sm:p-8 border-b-8 border-emerald-200 shadow-xl space-y-4 scroll-mt-40">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-emerald-950">
              आपकी लिस्ट की गई फसलें (Your Harvest Listings)
            </h2>
            <p className="text-xs text-emerald-700 font-semibold">
              खरीदार सीधे इन फसलों को देखकर आर्डर या कॉल कर सकते हैं
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenListingModal}
            className="text-xs font-black text-emerald-700 hover:text-emerald-900 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" /> नई फसल जोड़ें
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeCrops.map((crop) => {
            const gainPerKg = crop.farmerPricePerUnit - crop.mandiApmcPricePerUnit;
            const extraPercent = Math.round((gainPerKg / crop.mandiApmcPricePerUnit) * 100);
            const cropOffers = offers.filter((offer) => offer.cropId === crop.id);
            const isProductSelected = selectedProductId === crop.id;

            return (
              <div
                key={crop.id}
                className="p-4 rounded-[28px] border-2 border-emerald-100 hover:border-emerald-300 transition-all bg-emerald-50/40 border-b-6 border-emerald-200 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={crop.imageUrl}
                      alt={crop.cropName}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-emerald-950 text-sm truncate">
                        {crop.cropName}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium">
                        {crop.variety} • {crop.grade}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 border border-emerald-300">
                        {crop.farmingType}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 text-xs space-y-1.5 mb-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 font-semibold">आपका सीधा भाव:</span>
                      <strong className="text-emerald-700 font-black text-sm">
                        ₹{crop.farmerPricePerUnit}/{crop.unit}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 font-semibold">मंडी में आढ़तिया देता:</span>
                      <span className="line-through text-rose-600 font-bold">
                        ₹{crop.mandiApmcPricePerUnit}/{crop.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-emerald-700 font-black">
                      <span>अतिरिक्त लाभ:</span>
                      <span>+{extraPercent}% (₹{gainPerKg}/{crop.unit})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-600 px-1 mb-2 font-medium">
                    <span>उपलब्ध: <strong className="text-emerald-950 font-black">{crop.quantityAvailable} {crop.unit}</strong></span>
                    <span>स्थान: <strong className="text-emerald-950 font-black">{crop.location.district}</strong></span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProductId(isProductSelected ? null : crop.id)}
                    className={`w-full mb-2 rounded-xl px-3 py-2 text-xs font-black flex items-center justify-between border cursor-pointer ${isProductSelected ? 'bg-amber-400 text-amber-950 border-amber-500' : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'}`}
                  >
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> People applied to buy</span>
                    <span className="rounded-full bg-white/70 px-2 py-0.5">{cropOffers.length}</span>
                  </button>

                  {isProductSelected && (
                    <div className="mb-2 rounded-xl border border-amber-200 bg-amber-50/70 p-3 space-y-2">
                      {cropOffers.length === 0 ? (
                        <p className="text-[11px] font-bold text-amber-800">No merchant has applied for this product yet.</p>
                      ) : cropOffers.map((offer) => (
                        <div key={offer.id} className="flex items-center justify-between gap-2 rounded-lg bg-white border border-amber-200 px-2.5 py-2 text-[11px]">
                          <span className="font-black text-emerald-950 truncate">{offer.merchantName || 'Merchant'}</span>
                          <span className="font-bold text-amber-800 whitespace-nowrap">₹{offer.offeredPrice}/{offer.unit} • {offer.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-2.5 py-1.5 mb-2">
                    ताजगी अवधि: {getShelfLifeDays(crop)} दिन • बिक्री समाप्त: {formatCropExpiry(crop)}
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-stone-400 font-bold">
                    ID: #{crop.id.slice(-6)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEditCrop(crop)}
                      className="text-emerald-700 hover:text-emerald-900 text-xs font-black p-1 cursor-pointer"
                      title="Edit listing"
                    >
                      संपादित करें
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCrop(crop.id)}
                      className="text-rose-600 hover:text-rose-700 text-xs font-black flex items-center gap-1 p-1 cursor-pointer"
                      title="Remove listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>हटाएं</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-stone-100 rounded-[32px] p-6 sm:p-8 border-b-8 border-stone-300 shadow-xl space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-stone-900">डंप ज़ोन (Expired Products)</h2>
            <p className="text-xs text-stone-600 font-semibold">
              इन फसलों की shelf life पूरी हो गई है। ये खरीदारों और व्यापारियों को नहीं दिखतीं।
            </p>
          </div>
          <span className="bg-stone-200 text-stone-800 px-3 py-1.5 rounded-xl text-xs font-black">
            {expiredCrops.length} expired
          </span>
        </div>

        {expiredCrops.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-5 text-center text-xs font-bold text-stone-500">
            अभी कोई expired product नहीं है।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {expiredCrops.map((crop) => (
              <div key={crop.id} className="bg-white rounded-2xl border border-stone-300 p-4 flex items-center gap-3">
                <img src={crop.imageUrl} alt={crop.cropName} className="w-14 h-14 rounded-xl object-cover grayscale" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-stone-900 truncate">{crop.cropName}</h3>
                  <p className="text-[11px] text-rose-700 font-bold">Expired: {formatCropExpiry(crop)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteCrop(crop.id)}
                  className="text-rose-700 hover:text-rose-900 text-xs font-black flex items-center gap-1 p-1 cursor-pointer"
                  title="Delete expired product"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  हटाएं
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
