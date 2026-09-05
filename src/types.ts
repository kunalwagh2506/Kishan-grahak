export type CropCategory = 'Vegetables' | 'Grains' | 'Fruits' | 'Spices' | 'Pulses' | 'Oilseeds';

export type FarmingType = 'Organic (जैविक)' | 'Natural (प्राकृतिक)' | 'Conventional (पारंपरिक)';

export type CropGrade = 'Grade A (उत्तम)' | 'Grade B (मध्यम)' | 'Standard (सामान्य)';

export type UnitType = 'kg' | 'quintal' | 'crate (25kg)' | 'bag (50kg)';

export interface CropListing {
  id: string;
  cropName: string;
  cropNameHindi: string;
  variety: string;
  category: CropCategory;
  farmerName: string;
  farmerPhone: string;
  location: {
    village: string;
    district: string;
    state: string;
  };
  quantityAvailable: number;
  minOrderQuantity: number;
  unit: UnitType;
  farmerPricePerUnit: number; // What farmer receives
  mandiApmcPricePerUnit: number; // What APMC dalals would give farmer
  retailMarketPricePerUnit: number; // What city consumers normally pay in stores
  harvestDate: string;
  farmingType: FarmingType;
  grade: CropGrade;
  imageUrl: string;
  description: string;
  upiId?: string;
  verifiedKisan: boolean;
  createdAt: string;
}

export interface DirectOrder {
  id: string;
  cropId: string;
  cropName: string;
  farmerName: string;
  farmerPhone: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  buyerType: 'Consumer (घर के लिए)' | 'Kirana / Retailer (दुकानदार)' | 'Restaurant / Bulk (होटल/थोक)';
  quantity: number;
  unit: UnitType;
  unitPrice: number;
  totalAmount: number;
  deliveryType: 'Farm Gate Pickup' | 'Direct Rural Express Delivery' | 'Community Collective Drop';
  paymentMode: 'Direct UPI to Farmer' | 'Cash on Delivery' | 'Bank Transfer (IMPS/NEFT)';
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered';
  createdAt: string;
}

export interface MandiComparison {
  cropName: string;
  cropNameHindi: string;
  state: string;
  district: string;
  apmcFarmerPrice: number; // Farmer gets in APMC (₹/kg)
  middlemenCost: number;   // Cut swallowed by 5 tiers of dalals (₹/kg)
  retailStorePrice: number;// Consumer pays in retail (₹/kg)
  directFarmerPrice: number; // Farmer gets on KisanSetu (₹/kg)
  directConsumerPrice: number; // Consumer pays on KisanSetu (₹/kg)
  farmerGainPercent: number; // +X% more for farmer
  consumerSavingsPercent: number; // -X% saved for consumer
}

export type LanguageCode = 'en' | 'hi' | 'mr' | 'pa' | 'te';

export interface IntermediaryLayer {
  title: string;
  titleHindi: string;
  role: string;
  traditionalCutPercent: number;
  eliminatedInDirect: boolean;
  explanation: string;
}
