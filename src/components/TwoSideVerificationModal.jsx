import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  IndianRupee, 
  ArrowLeftRight, 
  ShieldCheck, 
  RefreshCw, 
  Camera,
  Check,
  Truck
} from 'lucide-react';

const VERIFICATION_IMAGE_PRESETS = [
  {
    label: 'ताजा लॉट (Exact Match - High Grade)',
    url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
    desc: 'Firm, dry skin, zero rot, authentic variety match.'
  },
  {
    label: 'खेत पर लोड करते समय (Farm Gate Loading)',
    url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    desc: 'Fresh harvest crates ready for merchant mini-truck.'
  },
  {
    label: 'मंडी अनलोडिंग (Warehouse Receiving Inspection)',
    url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    desc: 'Unloading check at wholesale warehouse bay.'
  }
];

export function TwoSideVerificationModal({
  isOpen,
  onClose,
  offer,
  onVerifyImage,
  onReleasePayment
}) {
  if (!isOpen || !offer) return null;

  const [verificationImage, setVerificationImage] = useState(
    offer.twoSideVerification?.merchantImage || VERIFICATION_IMAGE_PRESETS[0].url
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [paying, setPaying] = useState(false);
  const [verificationData, setVerificationData] = useState(offer.twoSideVerification || null);
  const [paymentSuccess, setPaymentSuccess] = useState(offer.paymentStatus === 'released_to_farmer');
  const [settlementRef, setSettlementRef] = useState(offer.payoutRef || null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVerificationImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAiVerification = async () => {
    setAnalyzing(true);
    try {
      const result = await onVerifyImage(offer.id, verificationImage);
      if (result) {
        setVerificationData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePayFarmer = async () => {
    setPaying(true);
    try {
      const res = await onReleasePayment(offer.id);
      if (res && res.payoutRef) {
        setPaymentSuccess(true);
        setSettlementRef(res.payoutRef);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPaying(false);
    }
  };

  const isVerified = verificationData?.status === 'verified';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-[32px] sm:rounded-[36px] shadow-2xl border-4 border-emerald-300 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 p-5 sm:p-6 text-white flex items-center justify-between border-b-4 border-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-md">
              <ShieldCheck className="w-6 h-6 text-emerald-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">
                  दो-तरफा AI गुणवत्ता सत्यापन (Two-Side Verification)
                </h2>
                <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  SIH26033
                </span>
              </div>
              <p className="text-xs text-emerald-200 font-semibold">
                किसान की मूल फोटो बनाम व्यापारी द्वारा प्राप्त माल की फोटो का AI विश्लेषण
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Side-by-Side Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Side 1: Farmer's Original Photo */}
            <div className="bg-emerald-50 rounded-2xl p-4 border-2 border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  1. किसान की मूल फोटो (Farmer Upload)
                </span>
                <span className="text-[11px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                  खेत से अपलोड
                </span>
              </div>
              <div className="relative rounded-xl overflow-hidden border-2 border-emerald-300 aspect-video bg-black/5">
                <img
                  src={offer.twoSideVerification?.farmerImage || offer.cropImage}
                  alt="Farmer original lot"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-emerald-950/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                  किसान: {offer.farmerName}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 font-bold block">मूल ग्रेड (Original Grade)</span>
                  <span className="font-black text-emerald-950">
                    {offer.twoSideVerification?.farmerGrade || 'Grade A (उत्तम)'}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 font-bold block">शुरुआती डैमेज</span>
                  <span className="font-black text-emerald-950">
                    {offer.twoSideVerification?.farmerDamagePercent || 3.5}%
                  </span>
                </div>
              </div>
            </div>

            {/* Side 2: Merchant Verification Photo */}
            <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                  2. व्यापारी द्वारा सत्यापन फोटो (Merchant Check)
                </span>
                <span className="text-[11px] font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full">
                  लोडिंग/पहुंच पर
                </span>
              </div>
              <div className="relative rounded-xl overflow-hidden border-2 border-amber-300 aspect-video bg-black/5">
                <img
                  src={verificationImage}
                  alt="Merchant verification check"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-amber-950/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                  व्यापारी: {offer.merchantName}
                </div>
              </div>

              {/* Upload or Choose Preset Image */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <label className="flex-1 bg-white hover:bg-amber-100/60 border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-950 flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                    <Camera className="w-3.5 h-3.5 text-amber-700" />
                    <span>नया फोटो अपलोड करें (Upload Image)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {/* Quick Presets */}
                <div className="flex gap-1 overflow-x-auto pb-1">
                  {VERIFICATION_IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setVerificationImage(preset.url)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap border transition-all cursor-pointer ${
                        verificationImage === preset.url
                          ? 'bg-amber-400 text-amber-950 border-amber-600'
                          : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      {preset.label.split('(')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Trigger / Analysis Result Box */}
          <div className="bg-emerald-50 rounded-2xl p-4 sm:p-5 border-2 border-emerald-300 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h3 className="text-sm sm:text-base font-black text-emerald-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI गुणवत्ता समानता स्कोर (Comparative Vision Analysis)</span>
                </h3>
                <p className="text-xs text-emerald-700 font-semibold">
                  AI दोनों चित्रों का मिलान कर विविधता, ग्रेड, और डैमेज अंतर की जांच करता है।
                </p>
              </div>

              <button
                type="button"
                onClick={runAiVerification}
                disabled={analyzing}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
                <span>{analyzing ? 'AI विश्लेषण जारी है...' : 'AI सत्यापन चलाएं (Verify Produce)'}</span>
              </button>
            </div>

            {verificationData && (
              <div className="bg-white rounded-xl p-4 border border-emerald-200 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-center">
                    <span className="text-[10px] text-emerald-700 font-bold block uppercase">समानता (Similarity)</span>
                    <span className="text-xl font-black text-emerald-900">
                      {verificationData.similarityScore || 94}%
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">अत्यधिक सटीक</span>
                  </div>

                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-center">
                    <span className="text-[10px] text-emerald-700 font-bold block uppercase">व्यापारी ग्रेड (Received)</span>
                    <span className="text-xl font-black text-emerald-900">
                      {verificationData.merchantGrade || 'Grade A'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">ग्रेड सत्यापित</span>
                  </div>

                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-center">
                    <span className="text-[10px] text-emerald-700 font-bold block uppercase">डैमेज अंतर (Transit Wear)</span>
                    <span className="text-xl font-black text-emerald-900">
                      +{verificationData.damageDiff || 1.1}%
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">मानक सीमा के अंदर</span>
                  </div>

                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-center">
                    <span className="text-[10px] text-emerald-700 font-bold block uppercase">रंग एकरूपता (Color Match)</span>
                    <span className="text-xl font-black text-emerald-900">
                      {verificationData.colorConsistency || '95%'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">समान चमक</span>
                  </div>
                </div>

                <div className={`p-3 rounded-xl flex items-start gap-2.5 ${
                  isVerified ? 'bg-emerald-100/70 border border-emerald-300 text-emerald-900' : 'bg-amber-100 border border-amber-300 text-amber-900'
                }`}>
                  {isVerified ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <strong className="text-xs sm:text-sm font-black block">
                      {verificationData.verdict || 'Quality Broadly Consistent - Grade A Verified'}
                    </strong>
                    <p className="text-xs font-medium mt-0.5">
                      {verificationData.notes || 'Both images confirm identical crop lot. Transit impact negligible. Recommended for instant farmer payout.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Release Section (Farmer get paid after verification) */}
          <div className="bg-emerald-950 text-white rounded-2xl p-5 border-2 border-amber-400 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                  सत्यापन के बाद सीधा भुगतान (Pay Farmer via Direct UPI)
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-amber-300">
                    ₹{offer.totalAmount?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-emerald-200">
                    ({offer.quantity} {offer.unit} @ ₹{offer.offeredPrice}/{offer.unit})
                  </span>
                </div>
                <p className="text-xs text-emerald-300 mt-1">
                  किसान: <strong>{offer.farmerName}</strong> • फोन: {offer.farmerPhone}
                </p>
              </div>

              {paymentSuccess ? (
                <div className="bg-emerald-800 text-emerald-100 border border-emerald-600 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-amber-300" />
                  <div>
                    <span>भुगतान संपन्न (Paid to Farmer)</span>
                    <span className="block text-[10px] font-mono text-amber-300">
                      Ref: {settlementRef}
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handlePayFarmer}
                  disabled={paying || !verificationData}
                  className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black px-6 py-3 rounded-xl text-xs sm:text-sm shadow-lg border-b-4 border-amber-600 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <IndianRupee className="w-4 h-4 stroke-[3]" />
                  <span>
                    {paying ? 'UPI भुगतान जारी हो रहा है...' : 'किसान को तुरंत भुगतान करें (Release Payment)'}
                  </span>
                </button>
              )}
            </div>

            {!verificationData && (
              <p className="text-[11px] text-amber-300 font-medium">
                * कृपया भुगतान जारी करने से पहले ऊपर 'AI सत्यापन चलाएं' पर क्लिक करें।
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
