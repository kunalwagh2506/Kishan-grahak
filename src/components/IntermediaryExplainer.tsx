import React, { useState } from 'react';
import { 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Percent, 
  Sparkles,
  Layers,
  IndianRupee,
  Scale
} from 'lucide-react';
import { IntermediaryLayer, MandiComparison, LanguageCode } from '../types';
import { translations } from '../data/translations';

interface IntermediaryExplainerProps {
  layers: IntermediaryLayer[];
  comparisons: MandiComparison[];
  language: LanguageCode;
}

export const IntermediaryExplainer: React.FC<IntermediaryExplainerProps> = ({
  layers,
  comparisons,
  language,
}) => {
  const t = translations[language] || translations.en;
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const [calcQuantity, setCalcQuantity] = useState(1000); // 1000 kg default
  const [viewMode, setViewMode] = useState<'comparison' | 'layers' | 'rupeeFlow'>('rupeeFlow');

  const activeCrop = comparisons[selectedCropIndex] || comparisons[0];

  // Calculations for chosen crop and quantity
  const apmcTotalFarmerEarnings = activeCrop ? activeCrop.apmcFarmerPrice * calcQuantity : 0;
  const directTotalFarmerEarnings = activeCrop ? activeCrop.directFarmerPrice * calcQuantity : 0;
  const farmerExtraGain = directTotalFarmerEarnings - apmcTotalFarmerEarnings;

  const retailTotalConsumerSpend = activeCrop ? activeCrop.retailStorePrice * calcQuantity : 0;
  const directTotalConsumerSpend = activeCrop ? activeCrop.directConsumerPrice * calcQuantity : 0;
  const consumerTotalSavings = retailTotalConsumerSpend - directTotalConsumerSpend;

  return (
    <div className="space-y-8">
      {/* Banner explaining the core economic problem - Vibrant Palette Theme */}
      <div className="bg-white rounded-[36px] sm:rounded-[40px] p-6 sm:p-8 shadow-xl border-b-8 border-emerald-200 relative overflow-hidden">
        <div className="max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3 border border-emerald-200">
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            The Agricultural Middleman Crisis in India
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-950 mb-3">
            {t.howMiddlemenHurt}
          </h2>
          <p className="text-emerald-700 font-semibold text-sm sm:text-base leading-relaxed mb-6">
            In standard Indian APMC mandis, a crop passes through <strong>5 to 7 tiers of middlemen (dalals, commission agents, wholesalers)</strong> before reaching the consumer. By the time it arrives in city kitchens, prices balloon by <strong>200% to 400%</strong>, while the hardworking farmer who bore the climate, seed, and labor risks receives as little as <strong>25% to 30%</strong> of the final price.
          </p>

          {/* Tab buttons to explore */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={() => setViewMode('rupeeFlow')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all ${
                viewMode === 'rupeeFlow'
                  ? 'bg-emerald-600 text-white shadow-md border-b-4 border-emerald-800'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border-2 border-emerald-100'
              }`}
            >
              <IndianRupee className="w-4 h-4" />
              Where Does ₹100 Go? (₹100 का सफर)
            </button>

            <button
              type="button"
              onClick={() => setViewMode('comparison')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all ${
                viewMode === 'comparison'
                  ? 'bg-emerald-600 text-white shadow-md border-b-4 border-emerald-800'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border-2 border-emerald-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Live Mandi vs Direct Rates
            </button>

            <button
              type="button"
              onClick={() => setViewMode('layers')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all ${
                viewMode === 'layers'
                  ? 'bg-emerald-600 text-white shadow-md border-b-4 border-emerald-800'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border-2 border-emerald-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              The 6 Middlemen Tiers Explained
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: ₹100 Rupee Note Journey Comparison */}
      {viewMode === 'rupeeFlow' && (
        <div className="bg-white rounded-[36px] p-6 sm:p-8 border-b-8 border-emerald-200 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-950">
              When a Consumer Spends ₹100 on Food in India
            </h3>
            <p className="text-emerald-700 font-semibold text-sm mt-1">
              Side-by-side comparison of value capture in Traditional Mandi vs. KisanDirect
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traditional Mandi Model */}
            <div className="rounded-[28px] p-6 bg-rose-50/70 border-2 border-rose-200 border-b-6 border-rose-300 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <XCircle className="w-6 h-6 text-rose-600" />
                  <span className="font-black text-stone-900 text-lg">
                    Traditional APMC Mandi
                  </span>
                </div>
                <span className="bg-rose-100 text-rose-800 text-xs px-3 py-1 rounded-full font-black border border-rose-200">
                  5-7 Middlemen Tiers
                </span>
              </div>

              <p className="text-xs text-stone-600 mb-6 font-medium">
                Produces heavy price distortions, delay in payments, weight rigging, and 50%+ margins captured by non-producers.
              </p>

              {/* Progress bar breakdown */}
              <div className="h-9 w-full rounded-2xl overflow-hidden flex shadow-inner mb-4 bg-stone-200">
                <div 
                  className="bg-emerald-600 flex items-center justify-center text-white text-xs font-black px-1"
                  style={{ width: '28%' }}
                  title="Farmer Share: ₹28"
                >
                  ₹28 (28%)
                </div>
                <div 
                  className="bg-rose-500 flex items-center justify-center text-white text-xs font-black px-1"
                  style={{ width: '54%' }}
                  title="Middlemen Share: ₹54"
                >
                  ₹54 (54%) Dalals
                </div>
                <div 
                  className="bg-amber-500 flex items-center justify-center text-amber-950 text-xs font-black px-1"
                  style={{ width: '18%' }}
                  title="Transit Waste: ₹18"
                >
                  ₹18 Waste
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-rose-200 shadow-sm">
                  <span className="text-stone-700 font-bold">Farmer receives in hand:</span>
                  <span className="text-rose-700 font-black text-xl">₹28</span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-rose-200 shadow-sm">
                  <span className="text-stone-700 font-bold">Dalals, commission & markups:</span>
                  <span className="text-rose-600 font-black text-lg">₹54</span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-rose-200 shadow-sm">
                  <span className="text-stone-700 font-bold">Multiple loading & spoilage losses:</span>
                  <span className="text-stone-800 font-black text-base">₹18</span>
                </div>
              </div>

              <div className="mt-4 p-3.5 rounded-2xl bg-rose-100 text-xs text-rose-900 leading-relaxed font-semibold">
                ⚠️ <strong>Result:</strong> Farmer struggles with debt despite high harvest yields; consumer pays inflated prices for days-old produce.
              </div>
            </div>

            {/* KisanSetu Direct Model */}
            <div className="rounded-[28px] p-6 bg-emerald-50 border-2 border-emerald-300 border-b-6 border-emerald-500 relative overflow-hidden shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <span className="font-black text-emerald-950 text-lg">
                    Direct Farm Network
                  </span>
                </div>
                <span className="bg-emerald-200 text-emerald-900 text-xs px-3 py-1 rounded-full font-black border border-emerald-300">
                  Zero Middlemen
                </span>
              </div>

              <p className="text-xs text-emerald-800 mb-6 font-medium">
                Direct farm-gate to consumer/kirana connection with single-leg rural transport and instant direct UPI settlement.
              </p>

              {/* Progress bar breakdown */}
              <div className="h-9 w-full rounded-2xl overflow-hidden flex shadow-inner mb-4 bg-emerald-200">
                <div 
                  className="bg-emerald-600 flex items-center justify-center text-white text-xs font-black px-1"
                  style={{ width: '82%' }}
                  title="Farmer Share: ₹82"
                >
                  ₹82 (82%) To Farmer
                </div>
                <div 
                  className="bg-teal-700 flex items-center justify-center text-white text-xs font-black px-1"
                  style={{ width: '18%' }}
                  title="Direct Logistics: ₹18"
                >
                  ₹18 Transport
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-sm">
                  <span className="text-emerald-950 font-bold">Farmer receives in hand:</span>
                  <div className="text-right">
                    <span className="text-emerald-700 font-black text-xl">₹82</span>
                    <span className="block text-[11px] text-emerald-600 font-black">+192% Extra Earning</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-sm">
                  <span className="text-emerald-950 font-bold">Middlemen / Dalal cut:</span>
                  <span className="text-emerald-700 font-black text-lg">₹0 (Zero)</span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-sm">
                  <span className="text-emerald-950 font-bold">Single-leg direct delivery:</span>
                  <span className="text-emerald-950 font-black text-base">₹18</span>
                </div>
              </div>

              <div className="mt-4 p-3.5 rounded-2xl bg-emerald-100 text-xs text-emerald-900 leading-relaxed font-bold border border-emerald-200">
                🌟 <strong>Win-Win:</strong> Farmer earns nearly <strong>3X more</strong> per harvest, and the consumer gets farm-fresh produce <strong>25-35% cheaper</strong>!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Comparison & Interactive Calculator */}
      {viewMode === 'comparison' && (
        <div className="bg-white rounded-[36px] p-6 sm:p-8 border-b-8 border-emerald-200 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-950">
                Live Indian Crop Rate Benchmark
              </h3>
              <p className="text-emerald-700 font-semibold text-xs sm:text-sm">
                Real benchmark comparisons: APMC trader bid vs Retail Store vs Direct Fair Price
              </p>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 p-2 rounded-2xl border-2 border-emerald-200">
              <span className="text-xs font-black text-emerald-900 pl-2">Quantity:</span>
              <select
                id="quantity-simulator-select"
                value={calcQuantity}
                onChange={(e) => setCalcQuantity(Number(e.target.value))}
                className="bg-white text-emerald-950 font-black text-xs py-1.5 px-3 rounded-xl border-2 border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                <option value={100}>100 kg (Small Kirana / Joint Family)</option>
                <option value={500}>500 kg (Apartment Society Batch)</option>
                <option value={1000}>1,000 kg (1 Tonne - Small Farmer Lot)</option>
                <option value={3000}>3,000 kg (3 Tonnes - 1 Tractor Load)</option>
              </select>
            </div>
          </div>

          {/* Quick crop selector chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {comparisons.map((c, idx) => (
              <button
                key={c.cropName}
                type="button"
                onClick={() => setSelectedCropIndex(idx)}
                className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCropIndex === idx
                    ? 'bg-emerald-600 text-white shadow-md border-b-4 border-emerald-800'
                    : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border-2 border-emerald-100'
                }`}
              >
                <span>{c.cropName}</span>
                <span className="text-[10px] opacity-80">({c.district})</span>
              </button>
            ))}
          </div>

          {/* Interactive Calculator Cards */}
          {activeCrop && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Farmer Impact Card */}
              <div className="bg-emerald-50 rounded-[28px] p-6 border-2 border-emerald-200 border-b-6 border-emerald-400 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                      🌾
                    </div>
                    <div>
                      <h4 className="font-black text-emerald-950 text-sm">Farmer Earnings on {calcQuantity} kg</h4>
                      <p className="text-xs text-emerald-800 font-bold">{activeCrop.cropName} ({activeCrop.state})</p>
                    </div>
                  </div>
                  <span className="bg-emerald-200 text-emerald-950 text-xs px-3 py-1 rounded-full font-black border border-emerald-300">
                    +{activeCrop.farmerGainPercent}% Extra
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-sm">
                    <span className="text-[11px] text-stone-500 font-bold block">APMC Trader gives:</span>
                    <span className="text-base font-black text-rose-600">₹{activeCrop.apmcFarmerPrice}/kg</span>
                    <span className="text-xs font-bold text-stone-800 block mt-1">
                      Total: ₹{apmcTotalFarmerEarnings.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="bg-emerald-600 text-white p-3.5 rounded-2xl shadow-md border-b-4 border-emerald-800">
                    <span className="text-[11px] text-emerald-100 font-bold block">Direct Price:</span>
                    <span className="text-base font-black text-amber-300">₹{activeCrop.directFarmerPrice}/kg</span>
                    <span className="text-xs font-bold text-white block mt-1">
                      Total: ₹{directTotalFarmerEarnings.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border-2 border-emerald-300 flex items-center justify-between shadow-sm">
                  <span className="text-xs font-bold text-emerald-950">Farmer Net Extra In-Hand:</span>
                  <span className="text-emerald-700 font-black text-lg">
                    +₹{farmerExtraGain.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Consumer Impact Card */}
              <div className="bg-amber-50 rounded-[28px] p-6 border-2 border-amber-200 border-b-6 border-amber-400 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-2xl bg-amber-500 text-amber-950 flex items-center justify-center font-black text-base shadow-sm">
                      🛒
                    </div>
                    <div>
                      <h4 className="font-black text-amber-950 text-sm">Consumer Spend on {calcQuantity} kg</h4>
                      <p className="text-xs text-amber-900 font-bold">Direct vs Supermarket</p>
                    </div>
                  </div>
                  <span className="bg-amber-200 text-amber-950 text-xs px-3 py-1 rounded-full font-black border border-amber-300">
                    Save {activeCrop.consumerSavingsPercent}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-sm">
                    <span className="text-[11px] text-stone-500 font-bold block">City Supermarket:</span>
                    <span className="text-base font-black text-stone-700">₹{activeCrop.retailStorePrice}/kg</span>
                    <span className="text-xs font-bold text-stone-900 block mt-1">
                      Total: ₹{retailTotalConsumerSpend.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="bg-amber-500 text-amber-950 p-3.5 rounded-2xl shadow-md border-b-4 border-amber-700">
                    <span className="text-[11px] text-amber-950 font-bold block">Direct Price:</span>
                    <span className="text-base font-black text-amber-950">₹{activeCrop.directConsumerPrice}/kg</span>
                    <span className="text-xs font-bold text-amber-950 block mt-1">
                      Total: ₹{directTotalConsumerSpend.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border-2 border-amber-300 flex items-center justify-between shadow-sm">
                  <span className="text-xs font-bold text-amber-950">Consumer Family Savings:</span>
                  <span className="text-emerald-700 font-black text-lg">
                    -₹{consumerTotalSavings.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Full Rate Comparison Table */}
          <div className="overflow-x-auto rounded-[24px] border-2 border-emerald-100 mt-4 overflow-hidden">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-emerald-100/80 text-emerald-950 font-black border-b-2 border-emerald-200">
                  <th className="p-3.5">Crop / Mandi Region</th>
                  <th className="p-3.5 text-rose-700">APMC Trader Rate</th>
                  <th className="p-3.5 text-emerald-800">Direct Network</th>
                  <th className="p-3.5 text-stone-600">City Retail Store</th>
                  <th className="p-3.5 text-emerald-800 font-black">Farmer Extra</th>
                  <th className="p-3.5 text-amber-800 font-black">Consumer Saves</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 bg-white">
                {comparisons.map((c) => (
                  <tr key={c.cropName} className="hover:bg-emerald-50/50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-black text-emerald-950">{c.cropName}</div>
                      <div className="text-[11px] text-emerald-700 font-semibold">{c.district}, {c.state}</div>
                    </td>
                    <td className="p-3.5 text-rose-700 font-bold">₹{c.apmcFarmerPrice}/kg</td>
                    <td className="p-3.5 text-emerald-700 font-black">₹{c.directFarmerPrice}/kg</td>
                    <td className="p-3.5 text-stone-600 font-semibold">₹{c.retailStorePrice}/kg</td>
                    <td className="p-3.5 font-black text-emerald-700">+{c.farmerGainPercent}%</td>
                    <td className="p-3.5 font-black text-amber-700">{c.consumerSavingsPercent}% Off</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: Detailed Breakdown of the 6 Intermediaries */}
      {viewMode === 'layers' && (
        <div className="bg-white rounded-[36px] p-6 sm:p-8 border-b-8 border-emerald-200 shadow-xl space-y-6">
          <div className="max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-950">
              The 6 Middlemen Layers Between Farm and Plate
            </h3>
            <p className="text-emerald-700 font-semibold text-sm mt-1">
              Here is exactly how every layer adds non-value-added costs and squeezes farmers in India:
            </p>
          </div>

          <div className="space-y-4">
            {layers.map((layer, index) => (
              <div 
                key={layer.title}
                className="p-5 rounded-[24px] border-2 border-emerald-100 bg-emerald-50/40 hover:bg-white hover:border-emerald-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-8 border-l-emerald-500 shadow-sm"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-7 h-7 rounded-xl bg-emerald-700 text-white text-xs flex items-center justify-center font-black shadow-sm">
                      {index + 1}
                    </span>
                    <h4 className="font-black text-emerald-950 text-base">
                      {layer.title}
                    </h4>
                  </div>
                  <p className="text-stone-800 text-xs sm:text-sm font-semibold mb-1">
                    {layer.role}
                  </p>
                  <p className="text-stone-500 text-xs italic font-medium">
                    {layer.explanation}
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-emerald-200 pt-3 md:pt-0 md:pl-5">
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-black text-stone-400 block">Margin Cut</span>
                    <span className="text-base sm:text-lg font-black text-rose-600">
                      {layer.traditionalCutPercent}%
                    </span>
                  </div>

                  <div>
                    {layer.eliminatedInDirect ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3.5 py-1.5 rounded-2xl text-xs font-black">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Eliminated
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-stone-200 text-stone-700 px-3.5 py-1.5 rounded-2xl text-xs font-bold">
                        Optimized
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
