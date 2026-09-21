import React, { useState, useEffect } from 'react';
import { Search, MapPin, Sprout, ShoppingBag, CheckCircle2, Sprout as FarmerIcon, Store } from 'lucide-react';
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
import { RoleAuth } from './components/RoleAuth.jsx';
import { HamiBhawModal } from './components/HamiBhawModal.jsx';
import { HamiBhawPanel } from './components/HamiBhawPanel.jsx';
import { isCropExpired } from './data/produceLifecycle.js';

export default function App() {
  const getTabFromHash = () => {
    if (window.location.hash === '#about') return 'about';
    if (window.location.hash === '#farmer-profile' || window.location.hash === '#farmer-products') return 'farmer';
    return 'buyer';
  };
  const [currentTab, setCurrentTab] = useState(getTabFromHash);
  const [authUser, setAuthUser] = useState(null);
  const [language, setLanguage] = useState('hi'); // Default to Hindi for Indian farmers

  const [crops, setCrops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [offers, setOffers] = useState([]);
  const [hamiBhawNegotiations, setHamiBhawNegotiations] = useState([]);
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
  const [editingCrop, setEditingCrop] = useState(null);
  const [orderTargetCrop, setOrderTargetCrop] = useState(null);
  const [hamiBhawTargetCrop, setHamiBhawTargetCrop] = useState(null);
  const [notification, setNotification] = useState(null);

  const t = translations[language] || translations.en;

  const handleTabSelection = (tab) => {
    if ((tab === 'farmer' || tab === 'merchant') && authUser?.role !== tab) {
      setAuthUser(null);
    }
    setCurrentTab(tab);
    if (tab === 'about') {
      window.history.pushState({}, '', '#about');
    } else if (window.location.hash === '#about') {
      window.history.pushState({}, '', window.location.pathname + window.location.search);
    }
  };

  useEffect(() => {
    const handleHashChange = () => setCurrentTab(getTabFromHash());
    window.addEventListener('popstate', handleHashChange);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handleHashChange);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const roleNeedsLogin =
    (currentTab === 'farmer' || currentTab === 'merchant') && authUser?.role !== currentTab;

  const handleAuthenticated = (user) => {
    setAuthUser(user);
    setCurrentTab(user.role);
  };

  const handleProtectedAction = (role, action) => {
    if (authUser?.role !== role) {
      setCurrentTab(role);
      showToast(`Please login as a ${role} to continue.`);
      return;
    }
    action();
  };

  const handleLogout = () => {
    setAuthUser(null);
    setCurrentTab('buyer');
    setIsListingModalOpen(false);
    setEditingCrop(null);
    setOrderTargetCrop(null);
    setHamiBhawTargetCrop(null);
  };

  const handleSubmitHamiBhaw = async (proposal) => {
    try {
      const res = await fetch('/api/v1/hami-bhaw/propose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-role': 'consumer',
          'x-username': authUser?.username || 'consumer',
        },
        body: JSON.stringify(proposal),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Unable to send Hami Bhaw proposal.');
        return;
      }
      setHamiBhawTargetCrop(null);
      showToast('Hami Bhaw proposal sent to the farmer.');
    } catch (err) {
      console.error(err);
      showToast('Unable to send Hami Bhaw proposal.');
    }
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Load initial data from Express API
  const loadData = async (user = authUser) => {
    try {
      setLoading(true);
      const accountHeaders = user?.role
        ? { 'x-role': user.role, 'x-username': user.username }
        : {};
      const [cropsRes, ordersRes, mandiRes, breakdownRes, offersRes] = await Promise.all([
        fetch('/api/crops', { headers: accountHeaders }),
        fetch('/api/orders', { headers: accountHeaders }),
        fetch('/api/mandi-rates'),
        fetch('/api/intermediary-breakdown'),
        fetch('/api/offers', { headers: accountHeaders }),
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
    loadData(authUser);
  }, [authUser]);

  useEffect(() => {
    if (authUser?.role !== 'farmer') {
      setHamiBhawNegotiations([]);
      return;
    }
    fetch('/api/v1/hami-bhaw/my-negotiations', {
      headers: { 'x-role': 'farmer', 'x-username': authUser.username },
    })
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => setHamiBhawNegotiations(data.items || []))
      .catch((err) => console.error('Error loading Hami Bhaw negotiations:', err));
  }, [authUser]);

  const handleHamiBhawResponse = async (negotiationId, action, pricePerUnit) => {
    try {
      const res = await fetch(`/api/v1/hami-bhaw/${negotiationId}/respond`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-role': 'farmer',
          'x-username': authUser?.username || '',
        },
        body: JSON.stringify({ action, pricePerUnit }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Unable to update Hami Bhaw negotiation.');
        return;
      }
      setHamiBhawNegotiations((previous) => previous.map((item) => item.id === data.id ? { ...item, ...data } : item));
      showToast(`Hami Bhaw offer ${action.toLowerCase()}ed.`);
    } catch (err) {
      console.error(err);
      showToast('Unable to update Hami Bhaw negotiation.');
    }
  };

  // Handle submitting merchant offer
  const handleSubmitOffer = async (offerPayload) => {
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-role': 'merchant',
          'x-username': authUser?.username || '',
        },
        body: JSON.stringify({
          ...offerPayload,
          merchantId: authUser?.username === 'merchant' ? 'mer-1' : authUser?.username,
        }),
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
  const handleReleaseOfferPayment = async (offerId, paymentDetails) => {
    try {
      const res = await fetch(`/api/offers/${offerId}/release-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentDetails),
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
                  paymentMethod: result.paymentMethod,
                  paymentProof: result.paymentProof,
                  paymentNote: result.paymentNote,
                  paidAt: result.settledAt,
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
    if (isCropExpired(crop)) return false;
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
        headers: {
          'Content-Type': 'application/json',
          'x-role': 'farmer',
          'x-username': authUser?.username || '',
        },
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

  const handleEditCrop = async (cropId, cropData) => {
    try {
      const res = await fetch(`/api/crops/${cropId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-role': 'farmer',
          'x-username': authUser?.username || '',
        },
        body: JSON.stringify(cropData),
      });
      if (!res.ok) {
        showToast('फसल की जानकारी अपडेट नहीं हो सकी।');
        return;
      }
      const updated = await res.json();
      setCrops((previous) => previous.map((crop) => crop.id === cropId ? updated : crop));
      setEditingCrop(null);
      setIsListingModalOpen(false);
      showToast('फसल की जानकारी सफलतापूर्वक अपडेट हो गई।');
    } catch (err) {
      console.error(err);
      showToast('फसल की जानकारी अपडेट नहीं हो सकी।');
    }
  };

  // Handle deleting a crop
  const handleDeleteCrop = async (id) => {
    try {
      await fetch(`/api/crops/${id}`, {
        method: 'DELETE',
        headers: { 'x-role': 'farmer', 'x-username': authUser?.username || '' },
      });
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
        setCurrentTab(authUser?.role === 'merchant' ? 'merchant' : 'orders');
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
    <div className="min-h-screen overflow-x-hidden bg-emerald-50 text-stone-900 flex flex-col font-sans selection:bg-amber-300 selection:text-emerald-950">
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
        onSelectTab={handleTabSelection}
        language={language}
        onSelectLanguage={setLanguage}
        onOpenPortalLogin={() => setCurrentTab('login')}
        authUser={authUser}
        onLogout={handleLogout}
        orderCount={orders.length}
        offersCount={offers.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
        {currentTab === 'login' ? (
          <div className="max-w-3xl mx-auto space-y-5">
            <div className="text-center">
              <h1 className="text-3xl font-black text-emerald-950">Login to your portal</h1>
              <p className="mt-1 text-sm font-semibold text-emerald-700">Choose how you use KisanSetu.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setCurrentTab('farmer')}
                className="rounded-3xl bg-white p-7 text-left shadow-xl border-b-8 border-emerald-200 hover:border-emerald-400 transition-colors"
              >
                <FarmerIcon className="mb-4 h-10 w-10 text-emerald-600" />
                <h2 className="text-xl font-black text-emerald-950">Farmer Login</h2>
                <p className="mt-1 text-sm font-semibold text-emerald-700">List harvest and manage farmer orders.</p>
              </button>
              <button
                type="button"
                onClick={() => setCurrentTab('merchant')}
                className="rounded-3xl bg-white p-7 text-left shadow-xl border-b-8 border-amber-200 hover:border-amber-400 transition-colors"
              >
                <Store className="mb-4 h-10 w-10 text-amber-600" />
                <h2 className="text-xl font-black text-emerald-950">Merchant Login</h2>
                <p className="mt-1 text-sm font-semibold text-emerald-700">Buy directly and manage merchant offers.</p>
              </button>
            </div>
          </div>
        ) : roleNeedsLogin ? (
          <RoleAuth role={currentTab} onAuthenticated={handleAuthenticated} />
        ) : (
          <>
        {/* ABOUT KISANSETU PAGE */}
        {currentTab === 'about' && (
          <div className="space-y-6">
            <section className="bg-emerald-950 rounded-[36px] p-6 sm:p-10 text-white shadow-xl border-b-8 border-amber-400">
              <span className="inline-flex items-center rounded-full bg-emerald-800 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-300">
                About KisanSetu
              </span>
              <h1 className="mt-4 max-w-4xl text-3xl sm:text-5xl font-black leading-tight">
                किसान और खरीदार के बीच सीधा पुल
              </h1>
              <p className="mt-4 max-w-3xl text-sm sm:text-lg font-semibold leading-relaxed text-emerald-100">
                KisanSetu किसानों को उनकी फसल सीधे बेचने और खरीदारों को बिना अनावश्यक दलालों के ताजा उत्पाद खरीदने में मदद करता है। हमारा उद्देश्य उचित दाम, साफ जानकारी और भरोसेमंद भुगतान प्रक्रिया उपलब्ध कराना है।
              </p>
            </section>

            <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-3xl p-6 shadow-lg border-b-4 border-emerald-300">
                <Sprout className="w-8 h-8 text-emerald-600 mb-4" />
                <h2 className="text-xl font-black text-emerald-950">किसानों के लिए</h2>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-emerald-700">अपनी फसल, मात्रा, भाव और गुणवत्ता की जानकारी डालें। अपनी listings संपादित करें, merchant offers स्वीकार करें और अतिरिक्त कमाई देखें।</p>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-lg border-b-4 border-amber-300">
                <ShoppingBag className="w-8 h-8 text-amber-600 mb-4" />
                <h2 className="text-xl font-black text-emerald-950">खरीदारों के लिए</h2>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-emerald-700">सीधे farm products देखें, मंडी और retail भाव की तुलना करें और पारदर्शी कीमत पर खरीदारी करें।</p>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-lg border-b-4 border-sky-300">
                <CheckCircle2 className="w-8 h-8 text-sky-600 mb-4" />
                <h2 className="text-xl font-black text-emerald-950">भरोसेमंद प्रक्रिया</h2>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-emerald-700">Verified listings, offer tracking, delivery details, AI quality checks और UPI या offline payment proof।</p>
              </div>
            </section>

            <section className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xl border-b-8 border-emerald-200">
              <h2 className="text-2xl font-black text-emerald-950">हमारा उद्देश्य</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm font-bold text-emerald-900">
                <div className="rounded-2xl bg-emerald-50 p-4">किसान को उचित और सीधा भाव</div>
                <div className="rounded-2xl bg-amber-50 p-4">खरीदार को ताजा और सही कीमत</div>
                <div className="rounded-2xl bg-sky-50 p-4">दलालों के बिना पारदर्शी व्यापार</div>
              </div>
              <button type="button" onClick={() => handleTabSelection('buyer')} className="mt-6 bg-emerald-600 text-white font-black px-5 py-3 rounded-2xl shadow-md border-b-4 border-emerald-800 cursor-pointer">
                🛒 Direct Produce Catalog पर जाएं
              </button>
            </section>

            <section className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xl border-b-8 border-amber-300">
              <h2 className="text-2xl font-black text-emerald-950">KisanSetu कैसे काम करता है?</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-emerald-50 p-5 border border-emerald-200">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-black">1</span>
                  <h3 className="mt-3 text-base font-black text-emerald-950">किसान फसल लिस्ट करता है</h3>
                  <p className="mt-2 text-xs font-semibold leading-relaxed text-emerald-700">किसान product details, quantity, quality, direct price और shelf life जोड़ता है।</p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-5 border border-amber-200">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-amber-950 font-black">2</span>
                  <h3 className="mt-3 text-base font-black text-emerald-950">खरीदार offer भेजता है</h3>
                  <p className="mt-2 text-xs font-semibold leading-relaxed text-emerald-700">Merchant farm pickup या delivery चुनकर place और delivery fee के साथ offer भेज सकता है।</p>
                </div>
                <div className="rounded-2xl bg-sky-50 p-5 border border-sky-200">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white font-black">3</span>
                  <h3 className="mt-3 text-base font-black text-emerald-950">सत्यापन और भुगतान</h3>
                  <p className="mt-2 text-xs font-semibold leading-relaxed text-emerald-700">Farmer offer स्वीकार करता है, merchant quality verify करता है और UPI या offline proof से payment पूरा करता है।</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* BUYER / DIRECT CATALOG VIEW */}
        {currentTab === 'buyer' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-1 px-1">
              <h1 className="text-2xl sm:text-3xl font-black text-emerald-950">
                {t.buyerTab}
              </h1>
              <p className="text-sm font-semibold text-emerald-700">
                Browse direct farm produce and compare fair prices before you buy.
              </p>
            </div>

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

            <section aria-labelledby="about-kisan-setu-heading" className="bg-emerald-950 rounded-[32px] p-6 sm:p-8 text-white shadow-xl border-b-8 border-amber-400">
              <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-center">
                <div>
                  <span className="inline-flex items-center rounded-full bg-emerald-800 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-300">
                    About KisanSetu
                  </span>
                  <h2 id="about-kisan-setu-heading" className="mt-3 text-2xl sm:text-3xl font-black">
                    किसानसेतु: किसान और खरीदार के बीच सीधा पुल
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm sm:text-base font-semibold leading-relaxed text-emerald-100">
                    KisanSetu एक direct farm-to-market platform है, जहाँ किसान अपनी फसल सीधे बेच सकते हैं और खरीदार बिना अनावश्यक दलालों के ताजा उत्पाद खरीद सकते हैं। हमारा लक्ष्य किसान को उचित दाम, खरीदार को पारदर्शी कीमत और दोनों पक्षों को भरोसेमंद लेन-देन देना है।
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                  <div className="rounded-2xl border border-emerald-700 bg-emerald-900/70 p-4">
                    <strong className="block text-amber-300">किसान का पूरा हक</strong>
                    <span className="mt-1 block text-xs font-semibold text-emerald-200">Direct listings, fair rates और अतिरिक्त कमाई।</span>
                  </div>
                  <div className="rounded-2xl border border-emerald-700 bg-emerald-900/70 p-4">
                    <strong className="block text-amber-300">पारदर्शी खरीद</strong>
                    <span className="mt-1 block text-xs font-semibold text-emerald-200">मंडी, direct और delivery कीमतों की साफ जानकारी।</span>
                  </div>
                  <div className="rounded-2xl border border-emerald-700 bg-emerald-900/70 p-4">
                    <strong className="block text-amber-300">भरोसेमंद प्रक्रिया</strong>
                    <span className="mt-1 block text-xs font-semibold text-emerald-200">Verified products, offer tracking और secure payment proof।</span>
                  </div>
                </div>
                <button type="button" onClick={() => handleTabSelection('about')} className="w-fit rounded-2xl bg-amber-400 px-4 py-2.5 text-xs font-black text-emerald-950 shadow-md border-b-4 border-amber-600 cursor-pointer">
                  About KisanSetu page खोलें
                </button>
              </div>
            </section>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
                {filteredCrops.map((crop) => (
                  <CropCard
                    key={crop.id}
                    crop={crop}
                    language={language}
                    onSelectCropForOrder={(c) => handleProtectedAction('merchant', () => setOrderTargetCrop(c))}
                    onProposeHamiBhaw={(c) => handleProtectedAction('merchant', () => setHamiBhawTargetCrop(c))}
                  />
                ))}
              </div>
            )}

            <section aria-labelledby="middlemen-radar-heading" className="space-y-4 pt-4">
              <div className="px-1">
                <h2 id="middlemen-radar-heading" className="text-2xl sm:text-3xl font-black text-emerald-950">
                  {t.transparencyTab}
                </h2>
                <p className="text-sm font-semibold text-emerald-700">
                  See how direct pricing changes the farmer&apos;s share and your total cost.
                </p>
              </div>
              <IntermediaryExplainer
                layers={layers}
                comparisons={mandiRates}
                language={language}
              />
            </section>
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
          <>
            <HamiBhawPanel
              negotiations={hamiBhawNegotiations}
              role="farmer"
              onRespond={handleHamiBhawResponse}
              onCheckout={() => {}}
            />
            <FarmerDashboard
              crops={crops}
              orders={orders}
              offers={offers}
              onAcceptOffer={handleAcceptOffer}
              onRejectOffer={handleRejectOffer}
              onOpenListingModal={() => { setEditingCrop(null); setIsListingModalOpen(true); }}
              onDeleteCrop={handleDeleteCrop}
              onEditCrop={(crop) => { setEditingCrop(crop); setIsListingModalOpen(true); }}
              onOpenOrderModal={(c) => setOrderTargetCrop(c)}
              farmerUsername={authUser?.username}
              language={language}
            />
          </>
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
            merchantUsername={authUser?.username}
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
          </>
        )}
      </main>

      {/* Listing Modal for Farmers */}
      <FarmerListingModal
        isOpen={isListingModalOpen}
        onClose={() => { setIsListingModalOpen(false); setEditingCrop(null); }}
        onAddCrop={handleAddCrop}
        onUpdateCrop={handleEditCrop}
        editingCrop={editingCrop}
        farmerUsername={authUser?.role === 'farmer' ? authUser.username : undefined}
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

      <HamiBhawModal
        crop={hamiBhawTargetCrop}
        isOpen={!!hamiBhawTargetCrop}
        onClose={() => setHamiBhawTargetCrop(null)}
        onSubmit={handleSubmitHamiBhaw}
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
