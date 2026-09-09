import React, { useState } from 'react';
import { 
  Store, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  IndianRupee, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Sparkles, 
  ArrowRight, 
  Camera, 
  Phone, 
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { MakeOfferModal } from './MakeOfferModal.jsx';
import { TwoSideVerificationModal } from './TwoSideVerificationModal.jsx';

export function MerchantPortal({
  crops,
  offers,
  merchantInfo,
  onUpdateMerchantInfo,
  onSubmitOffer,
  onUpdateTransport,
  onVerifyImage,
  onReleasePayment,
  language
}) {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'my-deals' | 'transport'
  const [searchCrop, setSearchCrop] = useState('');
  const [selectedCropForOffer, setSelectedCropForOffer] = useState(null);
  const [selectedOfferForVerify, setSelectedOfferForVerify] = useState(null);
  const [filterState, setFilterState] = useState('All');

  // Filter crops available for merchant procurement
  const filteredCrops = crops.filter((crop) => {
    const matchesSearch = 
      crop.cropName.toLowerCase().includes(searchCrop.toLowerCase()) ||
      crop.cropNameHindi?.toLowerCase().includes(searchCrop.toLowerCase()) ||
      crop.location.district.toLowerCase().includes(searchCrop.toLowerCase());
    const matchesState = filterState === 'All' || crop.location.state === filterState;
    return matchesSearch && matchesState;
  });

  // Merchant's own deals
  const myOffers = offers.filter((o) => o.merchantId === merchantInfo.id || !o.merchantId || o.merchantId === 'mer-1');
  const acceptedOffers = myOffers.filter((o) => o.status === 'accepted');
  const pendingOffers = myOffers.filter((o) => o.status === 'pending');
  const deliveredOffers = myOffers.filter((o) => o.transportStatus === 'delivered' || o.paymentStatus === 'released_to_farmer');

  return (
    <div className="space-y-6">
      {/* Top Merchant Identity & Summary Banner */}
      <div className="bg-white rounded-[36px] sm:rounded-[40px] p-6 sm:p-8 text-amber-950 shadow-xl border-b-8 border-amber-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-amber-300">
              <Store className="w-3.5 h-3.5 text-amber-700" />
              व्यापारी खरीद केंद्र (Merchant Direct Procurement)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-950">
              {merchantInfo.name}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-amber-800 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                {merchantInfo.location}
              </span>
              <span>•</span>
              <span>प्रोपराइटर: {merchantInfo.owner}</span>
              <span>•</span>
              <span>संपर्क: {merchantInfo.phone}</span>
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="bg-amber-50 px-4 py-3 rounded-2xl border-2 border-amber-200 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">सक्रिय बोलियां (Active Bids)</span>
              <span className="text-xl font-black text-amber-950">{myOffers.length}</span>
            </div>
            <div className="bg-emerald-50 px-4 py-3 rounded-2xl border-2 border-emerald-200 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">स्वीकृत सौदे (Accepted)</span>
              <span className="text-xl font-black text-emerald-950">{acceptedOffers.length}</span>
            </div>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="mt-6 pt-5 border-t border-amber-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('browse')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'browse'
                ? 'bg-amber-500 text-amber-950 shadow-md border-b-4 border-amber-700'
                : 'text-amber-900/80 hover:bg-amber-100/70'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>1. किसान फसलें खोजें व ऑफर भेजें (Browse & Apply)</span>
            <span className="bg-white/40 text-amber-950 px-2 py-0.5 rounded-full text-xs font-bold">
              {filteredCrops.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('my-deals')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'my-deals'
                ? 'bg-amber-500 text-amber-950 shadow-md border-b-4 border-amber-700'
                : 'text-amber-900/80 hover:bg-amber-100/70'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>2. परिवहन व दो-तरफा AI सत्यापन (Deals & Verification)</span>
            {acceptedOffers.length > 0 && (
              <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-xs font-black animate-pulse">
                {acceptedOffers.length} Active
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab 1: Browse Crops and Make Purchase Offer */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchCrop}
                onChange={(e) => setSearchCrop(e.target.value)}
                placeholder="फसल या जिले के नाम से खोजें (e.g. Onion, Nashik)..."
                className="w-full bg-emerald-50/70 border border-emerald-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-emerald-950 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-emerald-800 whitespace-nowrap">राज्य (State):</span>
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none"
              >
                <option value="All">सभी राज्य (All States)</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Punjab">Punjab</option>
              </select>
            </div>
          </div>

          {/* Crops Grid for Merchants */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCrops.map((crop) => {
              const pendingOffersForThisCrop = offers.filter((o) => o.cropId === crop.id && o.status === 'pending');
              const hasMyOffer = myOffers.some((o) => o.cropId === crop.id);

              return (
                <div
                  key={crop.id}
                  className="bg-white rounded-3xl p-5 shadow-md border-2 border-emerald-100 hover:border-amber-400 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Image & Badges */}
                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-black/5">
                      <img
                        src={crop.imageUrl}
                        alt={crop.cropName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-emerald-950/80 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-lg">
                        {crop.grade || 'Grade A (उत्तम)'}
                      </div>
                      <div className="absolute top-2.5 right-2.5 bg-amber-400 text-amber-950 text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm">
                        {crop.distanceKm || 18} km दूर
                      </div>
                      {crop.aiQualityScore && (
                        <div className="absolute bottom-2.5 left-2.5 bg-emerald-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          AI Quality: {crop.aiQualityScore}/100
                        </div>
                      )}
                    </div>

                    {/* Crop Name & Location */}
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base sm:text-lg font-black text-emerald-950">
                          {crop.cropName}
                        </h3>
                        <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                          {crop.category}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{crop.location.village}, {crop.location.district}, {crop.location.state}</span>
                      </p>
                      <p className="text-xs text-emerald-800 mt-1">
                        किसान: <strong>{crop.farmerName}</strong> ({crop.farmerPhone})
                      </p>
                    </div>

                    {/* Price & Quantity Comparison */}
                    <div className="bg-emerald-50/80 rounded-2xl p-3 border border-emerald-200 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-emerald-700 font-bold block uppercase">
                          किसान अपेक्षित भाव
                        </span>
                        <span className="text-base font-black text-emerald-950">
                          ₹{crop.farmerPricePerUnit}/{crop.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-700 font-bold block uppercase">
                          उपलब्ध स्टॉक
                        </span>
                        <span className="text-base font-black text-emerald-950">
                          {crop.quantityAvailable} {crop.unit}
                        </span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-emerald-200/80 flex items-center justify-between text-[11px] text-emerald-800">
                        <span>स्थानीय APMC भाव: ₹{crop.mandiApmcPricePerUnit || 14}/{crop.unit}</span>
                        <span>शहर रिटेल भाव: ₹{crop.retailMarketPricePerUnit || 40}/{crop.unit}</span>
                      </div>
                    </div>

                    {/* Active Bids Pill */}
                    {pendingOffersForThisCrop.length > 0 && (
                      <div className="bg-amber-100 text-amber-900 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-amber-300 flex items-center justify-between">
                        <span>कुल प्रतिस्पर्धी बोलियां (Bids):</span>
                        <span className="font-black text-xs">{pendingOffersForThisCrop.length} व्यापारी</span>
                      </div>
                    )}
                  </div>

                  {/* Apply Button */}
                  <div className="mt-4 pt-3 border-t border-emerald-100">
                    <button
                      type="button"
                      onClick={() => setSelectedCropForOffer(crop)}
                      className="w-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-black px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-md border-b-4 border-amber-600 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>खरीद के लिए आवेदन करें (Apply to Buy)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Merchant Deals, Transport Coordination & Two-Side Verification */}
      {activeTab === 'my-deals' && (
        <div className="space-y-6">
          <div className="bg-amber-50 p-4 sm:p-5 rounded-3xl border-2 border-amber-300 flex items-start gap-3">
            <Truck className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm sm:text-base font-black text-amber-950">
                परिवहन व सत्यापन प्रबंधन (Merchant Transport & Verification Hub)
              </h3>
              <p className="text-xs text-amber-800 font-semibold mt-0.5">
                1. किसान के स्वीकारने पर आपका वाहन खेत पर पहुंचेगा। 2. लोडिंग पर AI फोटो सत्यापन करें। 3. सत्यापन के तुरंत बाद किसान को UPI भुगतान भेजें।
              </p>
            </div>
          </div>

          {myOffers.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-emerald-200">
              <Store className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-base font-black text-emerald-950">
                अभी तक कोई सक्रिय खरीद ऑफर नहीं है
              </h3>
              <p className="text-xs text-emerald-700 mt-1">
                पहले टैब पर जाकर किसानों की फसलों पर अपनी खरीद बोली (Offer) लगाएं।
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className="mt-4 bg-emerald-600 text-white font-black px-5 py-2.5 rounded-2xl text-xs shadow-md cursor-pointer"
              >
                फसलें ब्राउज करें (Browse Produce)
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myOffers.map((offer) => {
                const isAccepted = offer.status === 'accepted';
                const isPending = offer.status === 'pending';
                const isDelivered = offer.transportStatus === 'delivered' || offer.paymentStatus === 'released_to_farmer';

                return (
                  <div
                    key={offer.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border-2 border-emerald-100 space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={offer.cropImage}
                          alt={offer.cropName}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-2xl object-cover border border-emerald-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base sm:text-lg font-black text-emerald-950">
                              {offer.cropName}
                            </h4>
                            <span className="text-[10px] font-mono text-emerald-600">
                              ID: {offer.id}
                            </span>
                          </div>
                          <p className="text-xs text-emerald-700 font-semibold">
                            किसान: <strong>{offer.farmerName}</strong> • {offer.farmerLocation}
                          </p>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {isAccepted && (
                          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            किसान द्वारा स्वीकृत (Accepted)
                          </span>
                        )}
                        {isPending && (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            किसान स्वीकृति लंबित (Pending Acceptance)
                          </span>
                        )}
                        {offer.status === 'rejected' && (
                          <span className="bg-rose-100 text-rose-900 border border-rose-300 px-3 py-1 rounded-full text-xs font-black">
                            अस्वीकृत (Rejected)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Deal Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 text-xs">
                      <div>
                        <span className="text-[10px] text-emerald-700 font-bold block uppercase">आपकी बोली दर</span>
                        <span className="text-base font-black text-emerald-950">₹{offer.offeredPrice}/{offer.unit}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-700 font-bold block uppercase">मात्रा (Quantity)</span>
                        <span className="text-base font-black text-emerald-950">{offer.quantity} {offer.unit}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-700 font-bold block uppercase">कुल सौदा राशि</span>
                        <span className="text-base font-black text-emerald-950">₹{offer.totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-700 font-bold block uppercase">दूरी (Distance)</span>
                        <span className="text-base font-black text-emerald-950">{offer.distanceKm || 18} km</span>
                      </div>
                    </div>

                    {/* Transport Coordination Box (Transport is merchant responsibility) */}
                    <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-300 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-amber-700" />
                          <span className="text-xs font-black text-amber-950">
                            परिवहन: व्यापारी द्वारा प्रबंधित (Merchant Transport)
                          </span>
                        </div>
                        <span className="text-[11px] font-bold bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-full">
                          स्थिति: {offer.transportStatus?.replace(/_/g, ' ') || 'Pending'}
                        </span>
                      </div>

                      {offer.transportDetails ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-white p-3 rounded-xl border border-amber-200">
                          <div>
                            <span className="text-[10px] text-amber-800 font-bold block">वाहन (Vehicle)</span>
                            <span className="font-bold text-amber-950">{offer.transportDetails.vehicleType}</span>
                            <span className="text-[10px] text-amber-700 block font-mono">{offer.transportDetails.vehicleNo}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-amber-800 font-bold block">ड्राइवर संपर्क</span>
                            <span className="font-bold text-amber-950">{offer.transportDetails.driverName}</span>
                            <span className="text-[10px] text-amber-700 block">{offer.transportDetails.driverPhone}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-amber-800 font-bold block">पिकअप समय व स्थान</span>
                            <span className="font-bold text-amber-950">{offer.pickupDate} ({offer.transportDetails.pickupTime || '10:00 AM'})</span>
                            <span className="text-[10px] text-amber-700 block truncate">{offer.transportDetails.pickupLocation}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-amber-800 font-semibold">
                          किसान के स्वीकार करने पर पिकअप वाहन आवंटित किया जाएगा।
                        </p>
                      )}
                    </div>

                    {/* AI Verification & Payout Action Area */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        {offer.twoSideVerification?.status === 'verified' ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            दो-तरफा AI सत्यापन पूर्ण (Grade A Verified - {offer.twoSideVerification.similarityScore}% Match)
                          </span>
                        ) : isAccepted ? (
                          <span className="text-xs text-amber-800 font-bold flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            माल प्राप्त करने के बाद दूसरी फोटो से AI सत्यापन करें।
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-2">
                        {isAccepted && (
                          <button
                            type="button"
                            onClick={() => setSelectedOfferForVerify(offer)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-4 py-2 rounded-2xl text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                          >
                            <Camera className="w-4 h-4" />
                            <span>
                              {offer.twoSideVerification?.merchantImage ? 'AI सत्यापन परिणाम देखें' : 'फोटो से AI सत्यापन करें (Verify)'}
                            </span>
                          </button>
                        )}

                        {isDelivered && (
                          <span className="bg-emerald-950 text-amber-300 text-xs font-black px-3 py-2 rounded-2xl border border-amber-400">
                            भुगतान संपन्न (₹{offer.totalAmount.toLocaleString('en-IN')})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Make Offer Modal */}
      {selectedCropForOffer && (
        <MakeOfferModal
          isOpen={!!selectedCropForOffer}
          onClose={() => setSelectedCropForOffer(null)}
          crop={selectedCropForOffer}
          merchantInfo={merchantInfo}
          onSubmitOffer={onSubmitOffer}
          language={language}
        />
      )}

      {/* Two-Side Verification Modal */}
      {selectedOfferForVerify && (
        <TwoSideVerificationModal
          isOpen={!!selectedOfferForVerify}
          onClose={() => setSelectedOfferForVerify(null)}
          offer={selectedOfferForVerify}
          onVerifyImage={onVerifyImage}
          onReleasePayment={onReleasePayment}
        />
      )}
    </div>
  );
}
