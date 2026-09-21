import React, { useState } from 'react';
import { Check, Handshake, X } from 'lucide-react';

export function HamiBhawPanel({ negotiations = [], role, onRespond, onCheckout }) {
  const [counterPrices, setCounterPrices] = useState({});
  if (!negotiations.length) return null;

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 border-b-8 border-amber-300 shadow-xl space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center"><Handshake className="w-6 h-6" /></div>
        <div><h2 className="text-xl font-black text-amber-950">Hami Bhaw Negotiations</h2><p className="text-xs text-amber-800 font-semibold">Internal peer-to-peer price agreements, not official MSP or mandi prices.</p></div>
      </div>
      <div className="space-y-3">
        {negotiations.map((negotiation) => {
          const latest = negotiation.history?.[negotiation.history.length - 1];
          const canRespond = role === 'farmer' ? negotiation.status === 'PENDING_FARMER' : negotiation.status === 'PENDING_CONSUMER';
          return (
            <div key={negotiation.id} className="rounded-2xl border-2 border-amber-100 bg-amber-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-black text-amber-950">{negotiation.crop?.cropName || negotiation.productId}</span>
                <span className="rounded-full bg-amber-200 px-2 py-1 font-black text-amber-950">{negotiation.status}</span>
              </div>
              <p className="text-xs font-bold text-emerald-900">Latest offer: ₹{latest?.pricePerUnit}/{negotiation.crop?.unit || 'unit'} × {negotiation.requestedQuantity}</p>
              {canRespond && (
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => onRespond(negotiation.id, 'ACCEPT')} className="bg-emerald-600 text-white rounded-xl px-3 py-2 text-xs font-black flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Accept</button>
                  <button type="button" onClick={() => onRespond(negotiation.id, 'REJECT')} className="bg-stone-200 text-stone-700 rounded-xl px-3 py-2 text-xs font-black flex items-center gap-1"><X className="w-3.5 h-3.5" /> Reject</button>
                  <input type="number" min="1" placeholder="Counter price" value={counterPrices[negotiation.id] || ''} onChange={(event) => setCounterPrices((previous) => ({ ...previous, [negotiation.id]: event.target.value }))} className="min-w-28 flex-1 rounded-xl border border-amber-300 px-3 py-2 text-xs font-bold" />
                  <button type="button" onClick={() => onRespond(negotiation.id, 'COUNTER', Number(counterPrices[negotiation.id]))} className="bg-amber-400 text-amber-950 rounded-xl px-3 py-2 text-xs font-black">Counter</button>
                </div>
              )}
              {negotiation.status === 'ACCEPTED' && role === 'consumer' && <button type="button" onClick={() => onCheckout(negotiation)} className="bg-emerald-700 text-white rounded-xl px-4 py-2 text-xs font-black">Pay at Agreed Price</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
