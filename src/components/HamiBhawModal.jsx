import React, { useState } from 'react';
import { Handshake, X } from 'lucide-react';

export function HamiBhawModal({ crop, isOpen, onClose, onSubmit }) {
  const [quantity, setQuantity] = useState(crop?.minNegotiationOrderQuantity || crop?.minOrderQuantity || 1);
  const [price, setPrice] = useState(crop?.farmerPricePerUnit || 1);
  const [note, setNote] = useState('');

  if (!isOpen || !crop) return null;

  const subtotal = Number(quantity || 0) * Number(price || 0);
  const submit = (event) => {
    event.preventDefault();
    onSubmit({ cropId: crop.id, requestedQuantity: Number(quantity), offeredUnitPrice: Number(price), note });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden">
        <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center"><Handshake className="w-6 h-6" /></div>
            <div><h2 className="text-xl font-black">Propose Hami Bhaw</h2><p className="text-xs text-emerald-200">Mutually agreed peer-to-peer price</p></div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-full text-emerald-300 hover:text-white hover:bg-emerald-800"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={submit} className="p-5 sm:p-6 space-y-4">
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
            <p className="font-black text-emerald-950">{crop.cropName}</p>
            <p className="text-xs text-emerald-700">This is an internal farmer-consumer agreement, not an official MSP or mandi price.</p>
          </div>
          <label className="block text-xs font-bold text-stone-700">Quantity ({crop.unit})
            <input type="number" min={crop.minNegotiationOrderQuantity || crop.minOrderQuantity} max={crop.quantityAvailable} value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-stone-300 font-bold" required />
          </label>
          <label className="block text-xs font-bold text-stone-700">Your offered price per {crop.unit}
            <input type="number" min="1" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-stone-300 font-bold" required />
          </label>
          <label className="block text-xs font-bold text-stone-700">Note (optional)
            <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-stone-300" rows="2" />
          </label>
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-center justify-between">
            <span className="text-xs font-black text-amber-950">Proposed subtotal</span><strong className="text-lg text-amber-950">₹{subtotal.toLocaleString('en-IN')}</strong>
          </div>
          <button type="submit" className="w-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-black py-3 rounded-2xl border-b-4 border-amber-600">Send Proposal</button>
        </form>
      </div>
    </div>
  );
}
