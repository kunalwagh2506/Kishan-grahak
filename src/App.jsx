import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Sprout, 
  CheckCircle2 
} from 'lucide-react';
import { translations } from './data/translations.js';
import { Navbar } from './components/Navbar.jsx';
import { CropCard } from './components/CropCard.jsx';
import { IntermediaryExplainer } from './components/IntermediaryExplainer.jsx';
import { FarmerListingModal } from './components/FarmerListingModal.jsx';
import { OrderModal } from './components/OrderModal.jsx';
import { OrdersTracker } from './components/OrdersTracker.jsx';
import { FarmerDashboard } from './components/FarmerDashboard.jsx';
import { AiPricingAdvisory } from './components/AiPricingAdvisory.jsx';
import { MerchantPortal } from './components/MerchantPortal.jsx';

export default function App() {
  const [currentTab, setCurrentTab] = useState('buyer');
  const [language, setLanguage] = useState('hi'); // Default to Hindi for Indian farmers

  const [crops, setCrops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [offers, setOffers] = useState([]);
  const [mandiRates, setMandiRates] = useState([]);
  const [layers, setLayers] = useState([]);

  const [merchantInfo, setMerchantInfo] = useState({
    id: 'mer-1',
    name: 'Nashik Agro-Fresh Wholesale Mart',
    owner: 'Suresh Patil & Sons',
    phone: '+91 98221 44556',
    location: 'APMC Market Yard, Nashik, Maharashtra',
    fleetType: 'Mini Truck Fleet (1-3 Ton)'
  });

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');

  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [orderTargetCrop, setOrderTargetCrop] = useState(null);
  const [notification, setNotification] = useState(null);

  const t = translations[language] || translations.en;

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Load initial data from Express API
  const loadData = async () => {
    try {
      setLoading(true);
      const [cropsRes, ordersRes, mandiRes, breakdownRes, offersRes] = await Promise.all([
        fetch('/api/crops'),
        fetch('/api/orders'),
        fetch('/api/mandi-rates'),
        fetch('/api/intermediary-breakdown'),
        fetch('/api/offers'),
      ]);

      if (cropsRes.ok) {
        const data = await cropsRes.json();
        setCrops(data);
      }
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data);
      }
      if (offersRes && offersRes.ok) {
        const data = await offersRes.json();
        setOffers(data);
      }
      if (mandiRes.ok) {
        const data = await mandiRes.json();
        setMandiRates(data);
      }
      if (breakdownRes.ok) {
        const data = await breakdownRes.json();
        setLayers(data.layers || []);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle submitting merchant offer
  const handleSubmitOffer = async (offerPayload) => {
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerPayload),
      });

      if (res.ok) {
        const created = await res.json();
        setOffers((prev) => [created, ...prev]);
        showToast('व्यापारी खरीद प्रस्ताव किसान को सफलतापूर्वक भेजा गया!');
        return created;
      }
    } catch (err) {
      console.error(err);
      showToast('ऑफर भेजने में त्रुटि हुई।');
    }
  };

  // Handle farmer accepting offer
  const handleAcceptOffer = async (offerId) => {
    try {
      const res = await fetch(`/api/offers/${offerId}/accept`, {
        method: 'PATCH',
      });
      if (res.ok) {
        const updated = await res.json();
        setOffers((prev) => prev.map((o) => (o.id === offerId ? updated : o)));
        showToast('ऑफर स्वीकार किया गया! व्यापारी का वाहन माल उठाने के लिए रवाना होगा।');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle farmer rejecting offer
  const handleRejectOffer = async (offerId) => {
    try {
      const res = await fetch(`/api/offers/${offerId}/reject`, {
        method: 'PATCH',
      });
      if (res.ok) {
        const updated = await res.json();
        setOffers((prev) => prev.map((o) => (o.id === offerId ? updated : o)));
        showToast('ऑफर अस्वीकार किया गया।');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle updating transport
  const handleUpdateTransport = async (offerId, transportPayload) => {
    try {
      const res = await fetch(`/api/offers/${offerId}/transport`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transportPayload),
      });
      if (res.ok) {
        const updated = await res.json();
        setOffers((prev) => prev.map((o) => (o.id === offerId ? updated : o)));
        showToast('परिवहन जानकारी अपडेट की गई।');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle AI two-side verification image
  const handleVerifyOfferImage = async (offerId, merchantImageUrl) => {
    try {
      const res = await fetch(`/api/offers/${offerId}/verify-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantImageUrl: !merchantImageUrl.startsWith('data:image') ? merchantImageUrl : null,
          merchantImageBase64: merchantImageUrl.startsWith('data:image') ? merchantImageUrl : null,
        }),
      });
      if (res.ok) {
        const result = await res.json();
        setOffers((prev) =>
          prev.map((o) =>
            o.id === offerId
              ? {
                  ...o,
                  twoSideVerification: result.verification,
                  transportStatus: 'verified_at_destination',
                }
              : o
          )
        );
        showToast('दो-तरफा AI गुणवत्ता सत्यापन संपन्न! अब आप किसान को भुगतान जारी कर सकते हैं।');
        return result.verification;
      }
    } catch (err) {
      console.error(err);
      showToast('AI सत्यापन में त्रुटि हुई।');
    }
  };

  // Handle releasing payment
  const handleReleaseOfferPayment = async (offerId) => {
    try {
      const res = await fetch(`/api/offers/${offerId}/release-payment`, {
        method: 'POST',
      });
      if (res.ok) {
        const result = await res.json();
        setOffers((prev) =>
          prev.map((o) =>
            o.id === offerId
              ? {
                  ...o,
                  paymentStatus: 'released_to_farmer',
                  transportStatus: 'delivered',
                  payoutRef: result.payoutRef,
                }
              : o
          )
        );
        showToast(`सीधा UPI भुगतान सफल! किसान को ₹${result.amount.toLocaleString('en-IN')} ट्रांसफर कर दिया गया।`);
        return result;
      }
    } catch (err) {
      console.error(err);
      showToast('भुगतान जारी करने में त्रुटि हुई।');
    }
  };

  // Filter crops for buyer view
  const filteredCrops = crops.filter((crop) => {
    const matchesSearch = 
      crop.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.cropNameHindi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.location.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.location.state.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || crop.category === selectedCategory;
    const matchesState = selectedState === 'All' || crop.location.state === selectedState;

    return matchesSearch && matchesCategory && matchesState;
  });

  // Handle adding new crop
  const handleAddCrop = async (newCropData) => {
    try {
      const res = await fetch('/api/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCropData),
      });

      if (res.ok) {
        const created = await res.json();
        setCrops((prev) => [created, ...prev]);
        showToast('फसल सफलतापूर्वक लिस्ट हो गई! खरीदार अब सीधे आपसे संपर्क कर सकते हैं।');
      }
    } catch (err) {
      console.error(err);
      showToast('Error listing harvest. Please try again.');
    }
  };

  // Handle deleting a crop
  const handleDeleteCrop = async (id) => {
    try {
      await fetch(`/api/crops/${id}`, { method: 'DELETE' });
      setCrops((prev) => prev.filter((c) => c.id !== id));
      showToast('Crop listing removed.');
    } catch (err) {
      console.error(err);
    }
  };

  // Handle submitting order
  const handleSubmitOrder = async (orderData) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const created = await res.json();
        setOrders((prev) => [created, ...prev]);
        // Update local available stock
        setCrops((prev) =>
          prev.map((c) =>
            c.id === created.cropId
              ? { ...c, quantityAvailable: Math.max(0, c.quantityAvailable - created.quantity) }
              : c
          )
        );
        showToast('सीधा आर्डर सफलतापूर्वक दर्ज हो गया! किसान को सूचना भेज दी गई है।');
        setCurrentTab('orders');
      }
    } catch (err) {
      console.error(err);
      showToast('Error placing order. Please try again.');
    }
  };

  // Handle updating order status
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
        showToast(`Order status updated to ${status}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const indianStates = [
    'All',
    'Maharashtra',
    'Karnataka',
    'Madhya Pradesh',
    'Uttar Pradesh',
    'Haryana',
    'Andhra Pradesh',
    'Punjab',
    'Gujarat',
  ];

  return (
    <div className="min-h-screen bg-emerald-50 text-stone-900 flex flex-col font-sans selection:bg-amber-300 selection:text-emerald-950">
      {/* Top Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-emerald-400 flex items-center gap-3 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
          <span className="text-xs sm:text-sm font-black">{notification}</span>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        onSelectLanguage={setLanguage}
        onOpenListingModal={() => setIsListingModalOpen(true)}
        orderCount={orders.length}
        offersCount={offers.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* BUYER / DIRECT CATALOG VIEW */}
        {currentTab === 'buyer' && (
          <div className="space-y-6">
            {/* Mission Hero Card - Vibrant Palette Theme */}
            <div className="bg-white rounded-[36px] sm:rounded-[40px] p-6 sm:p-8 shadow-xl border-b-8 border-emerald-200 relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                <div className="max-w-2xl space-y-3">
                  <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-200">
                    <Sprout className="w-4 h-4 text-emerald-600" />
                    सीधा किसान से • बिचौलियों का कोई कमीशन नहीं
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight leading-tight">
                    {t.tagline}
                  </h1>
                  <p className="text-emerald-700 font-semibold text-sm sm:text-base leading-relaxed">
                    {t.taglineSub}
                  </p>
                </div>

                {/* 3 Chunky Metric cards from Vibrant Palette */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0 lg:w-auto">
                  <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100">
                    <span className="text-emerald-600 font-bold text-xs uppercase block mb-1">
                      किसान अधिक आय
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-900">
                      +40% - 75%
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                      सीधा किसान के खाते में
                    </span>
                  </div>

                  <div className="bg-amber-50 p-5 rounded-3xl border border-amber-100">
                    <span className="text-amber-600 font-bold text-xs uppercase block mb-1">
                      उपभोक्ता बचत
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-amber-900">
                      25% - 35%
                    </span>
                    <span className="text-[11px] text-amber-700 font-semibold block mt-1">
                      सस्ता ताजा अनाज व सब्जी
                    </span>
                  </div>

                  <div className="bg-sky-50 p-5 rounded-3xl border border-sky-100">
                    <span className="text-sky-600 font-bold text-xs uppercase block mb-1">
                      दलाल फीस
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-sky-900">
                      ₹0
                    </span>
                    <span className="text-[11px] text-sky-700 font-semibold block mt-1">
                      Zero Mandi Dalal Cuts
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar with Vibrant rounded styling */}
            <div className="bg-white rounded-[32px] p-5 sm:p-6 border-b-4 border-emerald-200 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="search-crops-input"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="फसल, किसान का नाम या जिला खोजें (e.g. Onion, Tomato, Nashik, Kolar)..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-emerald-100 text-xs sm:text-sm font-bold focus:outline-none focus:border-emerald-500 bg-emerald-50/40 text-emerald-950 placeholder:text-emerald-700/50"
                  />
                </div>

                {/* State selector */}
                <div className="flex items-center gap-2 sm:w-56 bg-emerald-50/50 rounded-2xl border-2 border-emerald-100 px-3 py-1">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                  <select
                    id="state-filter-select"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full py-2 bg-transparent text-xs sm:text-sm font-black text-emerald-900 focus:outline-none cursor-pointer"
                  >
                    {indianStates.map((s) => (
                      <option key={s} value={s}>
                        {s === 'All' ? 'All States (सभी राज्य)' : s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category selector chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
                {[
                  { id: 'All', label: t.filterAll },
                  { id: 'Vegetables', label: t.vegetables },
                  { id: 'Grains', label: t.grains },
                  { id: 'Fruits', label: t.fruits },
                  { id: 'Spices', label: t.spices },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-600 text-white shadow-md border-b-2 border-emerald-800'
                        : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Produce Grid */}
            {filteredCrops.length === 0 ? (
              <div className="bg-white rounded-[36px] p-12 text-center border-b-8 border-emerald-200 shadow-xl">
                <Sprout className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                <h3 className="text-base font-black text-emerald-950">No produce matching your search</h3>
                <p className="text-xs text-emerald-700 mt-1 font-medium">
                  Try clearing search filters or search by another crop name.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCrops.map((crop) => (
                  <CropCard
                    key={crop.id}
                    crop={crop}
                    language={language}
                    onSelectCropForOrder={(c) => setOrderTargetCrop(c)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TRANSPARENCY & MIDDLEMEN RADAR VIEW */}
        {currentTab === 'transparency' && (
          <IntermediaryExplainer
            layers={layers}
            comparisons={mandiRates}
            language={language}
          />
        )}

        {/* FARMER DASHBOARD VIEW */}
        {currentTab === 'farmer' && (
          <FarmerDashboard
            crops={crops}
            orders={orders}
            offers={offers}
            onAcceptOffer={handleAcceptOffer}
            onRejectOffer={handleRejectOffer}
            onOpenListingModal={() => setIsListingModalOpen(true)}
            onDeleteCrop={handleDeleteCrop}
            onOpenOrderModal={(c) => setOrderTargetCrop(c)}
            language={language}
          />
        )}

        {/* MERCHANT DIRECT PROCUREMENT PORTAL (SIH26033) */}
        {currentTab === 'merchant' && (
          <MerchantPortal
            crops={crops}
            offers={offers}
            merchantInfo={merchantInfo}
            onUpdateMerchantInfo={setMerchantInfo}
            onSubmitOffer={handleSubmitOffer}
            onUpdateTransport={handleUpdateTransport}
            onVerifyImage={handleVerifyOfferImage}
            onReleasePayment={handleReleaseOfferPayment}
            language={language}
          />
        )}

        {/* KRISHI MITRA ADVISOR VIEW */}
        {currentTab === 'advisor' && (
          <AiPricingAdvisory language={language} />
        )}

        {/* DIRECT ORDERS VIEW */}
        {currentTab === 'orders' && (
          <OrdersTracker
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            language={language}
          />
        )}
      </main>

      {/* Listing Modal for Farmers */}
      <FarmerListingModal
        isOpen={isListingModalOpen}
        onClose={() => setIsListingModalOpen(false)}
        onAddCrop={handleAddCrop}
        language={language}
      />

      {/* Direct Order Modal for Buyers */}
      <OrderModal
        crop={orderTargetCrop}
        isOpen={!!orderTargetCrop}
        onClose={() => setOrderTargetCrop(null)}
        onSubmitOrder={handleSubmitOrder}
        language={language}
      />

      {/* Footer - Vibrant Palette Dark Theme */}
      <footer className="bg-emerald-950 text-emerald-300 text-xs font-bold uppercase tracking-wider py-8 border-t-4 border-emerald-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow border-b-2 border-emerald-800">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-white text-sm tracking-tight block">
                KISAN DIRECT • Farm-to-Consumer Network
              </span>
              <span className="text-[11px] text-emerald-400 normal-case font-medium">
                Eliminating middlemen dalals from Indian agriculture
              </span>
            </div>
          </div>

          <div className="text-center sm:text-right text-emerald-400 normal-case font-medium">
            <span className="block text-[11px] text-emerald-300 uppercase tracking-widest font-bold">
              © 2024 Kisan Direct - Cutting out the middleman
            </span>
            <span className="text-[10px] text-emerald-500">
              Direct fair market prices & instant digital settlement
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
