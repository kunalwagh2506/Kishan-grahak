import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initial authentic mock crop listings demonstrating the direct farmer-to-consumer bridge
let cropListings = [
  {
    id: 'crop-1',
    cropName: 'Red Onion (लाल प्याज)',
    cropNameHindi: 'लाल प्याज (Garwa)',
    variety: 'Nashik Garwa Quality',
    category: 'Vegetables',
    farmerName: 'Dnyaneshwar Patil (ज्ञानेश्वर पाटील)',
    farmerPhone: '+91 98234 56712',
    location: {
      village: 'Lasalgaon',
      district: 'Nashik',
      state: 'Maharashtra',
    },
    quantityAvailable: 1800,
    minOrderQuantity: 10,
    unit: 'kg',
    farmerPricePerUnit: 28, // Farmer gets ₹28/kg direct (vs ₹13 at APMC Mandi)
    mandiApmcPricePerUnit: 13, // APMC trader offers only ₹13
    retailMarketPricePerUnit: 45, // City consumer pays ₹45 in Mumbai/Pune
    harvestDate: '2026-08-28',
    farmingType: 'Natural (प्राकृतिक)',
    grade: 'Grade A (उत्तम)',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
    description: 'Dry cured Lasalgaon onions with thick purple-red skin, sun dried for 12 days. Zero cold-storage chemicals. Long shelf life (3-4 months).',
    upiId: 'patilfarms@oksbi',
    verifiedKisan: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'crop-2',
    cropName: 'Desi Roma Tomato (देसी टमाटर)',
    cropNameHindi: 'ताजा देसी टमाटर',
    variety: 'Hybrid Roma Red',
    category: 'Vegetables',
    farmerName: 'Ramesh Reddy (रमेश रेड्डी)',
    farmerPhone: '+91 94481 23901',
    location: {
      village: 'Bethamangala',
      district: 'Kolar',
      state: 'Karnataka',
    },
    quantityAvailable: 1200,
    minOrderQuantity: 5,
    unit: 'kg',
    farmerPricePerUnit: 22, // Farmer gets ₹22 direct (vs ₹8 in APMC auction)
    mandiApmcPricePerUnit: 8,
    retailMarketPricePerUnit: 38, // Bengaluru retail charges ₹38
    harvestDate: '2026-09-02',
    farmingType: 'Organic (जैविक)',
    grade: 'Grade A (उत्तम)',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    description: 'Vine-ripened organic tomatoes plucked this morning. Juicy, rich in lycopene, free from chemical wax coating used by city wholesalers.',
    upiId: 'kolarreddy@ybl',
    verifiedKisan: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'crop-3',
    cropName: 'Sharbati Wheat (शरबती गेहूं)',
    cropNameHindi: 'गोल्डन शरबती गेहूं',
    variety: 'Sehore Golden King C-306',
    category: 'Grains',
    farmerName: 'Harpreet Singh & Balram Kushwaha',
    farmerPhone: '+91 98765 43210',
    location: {
      village: 'Ichhawar',
      district: 'Sehore',
      state: 'Madhya Pradesh',
    },
    quantityAvailable: 85,
    minOrderQuantity: 1,
    unit: 'bag (50kg)',
    farmerPricePerUnit: 1950, // ₹39/kg to farmer (vs ₹25/kg at Mandi)
    mandiApmcPricePerUnit: 1300, // ₹26/kg
    retailMarketPricePerUnit: 2800, // Branded atta/grain costs ₹56/kg in stores
    harvestDate: '2026-08-15',
    farmingType: 'Conventional (पारंपरिक)',
    grade: 'Grade A (उत्तम)',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    description: 'Famous Sehore Sharbati wheat, heavy golden grains that make super-soft chapatis. Machine cleaned and double stone-sorted.',
    upiId: 'balramk@hdfcbank',
    verifiedKisan: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'crop-4',
    cropName: 'Chipsona Potato (आलू)',
    cropNameHindi: 'आगरा चिपसोना आलू',
    variety: 'Chipsona 1 White Pulp',
    category: 'Vegetables',
    farmerName: 'Suresh Chandra Sharma',
    farmerPhone: '+91 97191 88450',
    location: {
      village: 'Fatehabad',
      district: 'Agra',
      state: 'Uttar Pradesh',
    },
    quantityAvailable: 3500,
    minOrderQuantity: 20,
    unit: 'kg',
    farmerPricePerUnit: 18, // Farmer gets ₹18 (vs ₹7 at local mandi cold storage)
    mandiApmcPricePerUnit: 7,
    retailMarketPricePerUnit: 32, // Delhi NCR retail charges ₹32
    harvestDate: '2026-08-20',
    farmingType: 'Conventional (पारंपरिक)',
    grade: 'Standard (सामान्य)',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    description: 'Low sugar, high solid matter Chipsona potatoes. Ideal for cooking curries or crisp frying. Zero sprout inhibitor spray.',
    upiId: 'sharmafarms@icici',
    verifiedKisan: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'crop-5',
    cropName: 'Traditional Basmati 1121 Rice (बासमती चावल)',
    cropNameHindi: 'सुगंधित बासमती 1121',
    variety: 'Pusa 1121 Long Grain Raw',
    category: 'Grains',
    farmerName: 'Gurpreet Singh Mann',
    farmerPhone: '+91 98140 99231',
    location: {
      village: 'Taraori',
      district: 'Karnal',
      state: 'Haryana',
    },
    quantityAvailable: 60,
    minOrderQuantity: 1,
    unit: 'bag (50kg)',
    farmerPricePerUnit: 4200, // ₹84/kg (vs ₹54/kg mandi rate)
    mandiApmcPricePerUnit: 2700,
    retailMarketPricePerUnit: 6500, // ₹130/kg in city grocery store
    harvestDate: '2026-08-10',
    farmingType: 'Organic (जैविक)',
    grade: 'Grade A (उत्तम)',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    description: 'Aged 18 months, 8.4mm slender grain that elongates to double upon cooking with rich aroma. Direct from Karnal paddy fields.',
    upiId: 'mannagro@barodampay',
    verifiedKisan: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'crop-6',
    cropName: 'Alphonso Mango Pulp & Fruit (हापूस आम)',
    cropNameHindi: 'रत्नागिरी ओरिजिनल हापूस',
    variety: 'Devgad Geographical Indication (GI)',
    category: 'Fruits',
    farmerName: 'Santosh Sawant (संतोष सावंत)',
    farmerPhone: '+91 94220 55198',
    location: {
      village: 'Devgad',
      district: 'Sindhudurg',
      state: 'Maharashtra',
    },
    quantityAvailable: 150,
    minOrderQuantity: 2,
    unit: 'crate (25kg)',
    farmerPricePerUnit: 2200, // Direct price to farmer
    mandiApmcPricePerUnit: 1100, // Vashi APMC middleman takes 50%
    retailMarketPricePerUnit: 3400, // Mumbai luxury consumer price
    harvestDate: '2026-09-01',
    farmingType: 'Natural (प्राकृतिक)',
    grade: 'Grade A (उत्तम)',
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
    description: 'Authentic coastal GI-tagged Devgad Alphonso with saffron golden flesh. Naturally hay-ripened without calcium carbide.',
    upiId: 'sawantmango@axl',
    verifiedKisan: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'crop-7',
    cropName: 'Teja Hot Red Chilli (गुंटूर लाल मिर्च)',
    cropNameHindi: 'गुंटूर तेजा सूखी मिर्च',
    variety: 'Guntur Teja S17 Stemless',
    category: 'Spices',
    farmerName: 'Koteswara Rao',
    farmerPhone: '+91 98480 34120',
    location: {
      village: 'Tenali',
      district: 'Guntur',
      state: 'Andhra Pradesh',
    },
    quantityAvailable: 800,
    minOrderQuantity: 5,
    unit: 'kg',
    farmerPricePerUnit: 190, // ₹190/kg direct vs ₹115 mandi commission
    mandiApmcPricePerUnit: 115,
    retailMarketPricePerUnit: 280, // City consumer pays ₹280
    harvestDate: '2026-08-25',
    farmingType: 'Conventional (पारंपरिक)',
    grade: 'Grade A (उत्तम)',
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
    description: 'Pungent, high color value (SHU 75,000+), sun-dried on tarpaulins. Free from synthetic red coloring agents.',
    upiId: 'gunturchilli@sbi',
    verifiedKisan: true,
    createdAt: new Date().toISOString(),
  }
];

let directOrders = [
  {
    id: 'ord-101',
    cropId: 'crop-1',
    cropName: 'Red Onion (लाल प्याज)',
    farmerName: 'Dnyaneshwar Patil',
    farmerPhone: '+91 98234 56712',
    buyerName: 'Pooja Sharma (Household Buyer)',
    buyerPhone: '+91 98200 44123',
    buyerAddress: 'Flat 402, Green Meadows, Kothrud, Pune, Maharashtra 411038',
    buyerType: 'Consumer (घर के लिए)',
    quantity: 25,
    unit: 'kg',
    unitPrice: 28,
    totalAmount: 700,
    deliveryType: 'Direct Rural Express Delivery',
    paymentMode: 'Direct UPI to Farmer',
    status: 'delivered',
    createdAt: '2026-09-02T10:30:00Z',
  },
  {
    id: 'ord-102',
    cropId: 'crop-2',
    cropName: 'Desi Roma Tomato (देसी टमाटर)',
    farmerName: 'Ramesh Reddy',
    farmerPhone: '+91 94481 23901',
    buyerName: 'Sri Venkateshwara Fresh Store (Kirana)',
    buyerPhone: '+91 99001 88234',
    buyerAddress: 'Shop 14, 8th Main, Indiranagar, Bengaluru, Karnataka 560038',
    buyerType: 'Kirana / Retailer (दुकानदार)',
    quantity: 150,
    unit: 'kg',
    unitPrice: 22,
    totalAmount: 3300,
    deliveryType: 'Direct Rural Express Delivery',
    paymentMode: 'Direct UPI to Farmer',
    status: 'dispatched',
    createdAt: '2026-09-03T14:15:00Z',
  },
  {
    id: 'ord-103',
    cropId: 'crop-3',
    cropName: 'Sharbati Wheat (शरबती गेहूं)',
    farmerName: 'Harpreet Singh & Balram Kushwaha',
    farmerPhone: '+91 98765 43210',
    buyerName: 'Gaurav Agarwal (Apartment Collective - 12 Families)',
    buyerPhone: '+91 98111 67200',
    buyerAddress: 'Tower B, Mahagun Moderne, Sector 78, Noida, Uttar Pradesh 201301',
    buyerType: 'Consumer (घर के लिए)',
    quantity: 12,
    unit: 'bag (50kg)',
    unitPrice: 1950,
    totalAmount: 23400,
    deliveryType: 'Community Collective Drop',
    paymentMode: 'Bank Transfer (IMPS/NEFT)',
    status: 'confirmed',
    createdAt: '2026-09-04T08:00:00Z',
  }
];

// Middlemen breakdown data explaining the multiple intermediary problem in India
const intermediaryLayers = [
  {
    title: '1. Village Aggregator / Kachha Arhatiya (कच्चा आढ़तिया)',
    titleHindi: 'गाँव का बिचौलिया',
    role: 'Buys at farm gate with manipulated weigh scales and cash advances tied to high interest debts.',
    traditionalCutPercent: 12,
    eliminatedInDirect: true,
    explanation: 'Deducts 8-15% of farmer revenue for early cash advance and unfair weight measurements.',
  },
  {
    title: '2. APMC Mandi Commission Agent (पक्का आढ़तिया व दलाल)',
    titleHindi: 'मंडी कमीशन एजेंट व पल्लेदार टैक्स',
    role: 'Charges statutory mandi fee, commission, labor, un-loading charges, and secret bidding cartels.',
    traditionalCutPercent: 14,
    eliminatedInDirect: true,
    explanation: 'Farmer pays 6-8% commission + 2% mandi cess + handling cuts even before an open price is determined.',
  },
  {
    title: '3. Inter-District Transporter & Wastage Trader (परिवहन दलाल)',
    titleHindi: 'परिवहन व लोडिंग बिचौलिया',
    role: 'Charges exorbitant freight rates, adds packing markups, and writes off 10-15% produce as fake rot/damage.',
    traditionalCutPercent: 11,
    eliminatedInDirect: true,
    explanation: 'Charges excessive margins while squeezing both farmer and downstream buyer.',
  },
  {
    title: '4. City Wholesaler / Subzi Mandi Trader (शहर का थोक व्यापारी)',
    titleHindi: 'शहर का थोक आढ़ती (Azadpur / Vashi / Kalasipalyam)',
    role: 'Warehouses produce in city terminals, controls daily release rates to artificially inflate local market prices.',
    traditionalCutPercent: 15,
    eliminatedInDirect: true,
    explanation: 'Buys bulk cheap from distressed farmers and hoards in godowns, pocketing a guaranteed 15-20% margin.',
  },
  {
    title: '5. Secondary Wholesaler / Semi-Wholesale Distributor',
    titleHindi: 'सेमी-होलसेलर व एरिया सप्लायर',
    role: 'Supplies local neighborhood mandis, hotels, and retail carts with another compounding margin.',
    traditionalCutPercent: 10,
    eliminatedInDirect: true,
    explanation: 'Adds another layer of transport, sorting markup, and financing fee.',
  },
  {
    title: '6. Final Retail Cart / Supermarket Margin',
    titleHindi: 'अंतिम रिटेल दुकान / सुपरमार्केट मार्जिन',
    role: 'Front-end selling markup to end consumer.',
    traditionalCutPercent: 20,
    eliminatedInDirect: false,
    explanation: 'On KisanSetu, direct consumers buy at wholesale farm price + minimal delivery fee, saving 25-40% compared to supermarkets.',
  }
];

const mandiComparisons = [
  {
    cropName: 'Nashik Red Onion',
    cropNameHindi: 'नासिक लाल प्याज',
    state: 'Maharashtra',
    district: 'Nashik',
    apmcFarmerPrice: 13,
    middlemenCost: 20,
    retailStorePrice: 45,
    directFarmerPrice: 28,
    directConsumerPrice: 32,
    farmerGainPercent: 115,
    consumerSavingsPercent: 29,
  },
  {
    cropName: 'Kolar Fresh Tomato',
    cropNameHindi: 'कोलार ताजा टमाटर',
    state: 'Karnataka',
    district: 'Kolar',
    apmcFarmerPrice: 8,
    middlemenCost: 22,
    retailStorePrice: 38,
    directFarmerPrice: 22,
    directConsumerPrice: 26,
    farmerGainPercent: 175,
    consumerSavingsPercent: 32,
  },
  {
    cropName: 'Agra Potato',
    cropNameHindi: 'आगरा आलू',
    state: 'Uttar Pradesh',
    district: 'Agra',
    apmcFarmerPrice: 7,
    middlemenCost: 17,
    retailStorePrice: 32,
    directFarmerPrice: 18,
    directConsumerPrice: 22,
    farmerGainPercent: 157,
    consumerSavingsPercent: 31,
  },
  {
    cropName: 'Sehore Sharbati Wheat',
    cropNameHindi: 'सीहोर शरबती गेहूं',
    state: 'Madhya Pradesh',
    district: 'Sehore',
    apmcFarmerPrice: 26,
    middlemenCost: 22,
    retailStorePrice: 56,
    directFarmerPrice: 39,
    directConsumerPrice: 44,
    farmerGainPercent: 50,
    consumerSavingsPercent: 21,
  },
  {
    cropName: 'Guntur Red Chilli',
    cropNameHindi: 'गुंटूर लाल मिर्च',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    apmcFarmerPrice: 115,
    middlemenCost: 110,
    retailStorePrice: 280,
    directFarmerPrice: 190,
    directConsumerPrice: 215,
    farmerGainPercent: 65,
    consumerSavingsPercent: 23,
  },
  {
    cropName: 'Devgad Alphonso Mango',
    cropNameHindi: 'देवगड हापूस आम',
    state: 'Maharashtra',
    district: 'Sindhudurg',
    apmcFarmerPrice: 44, // per piece equivalent
    middlemenCost: 68,
    retailStorePrice: 140,
    directFarmerPrice: 88,
    directConsumerPrice: 100,
    farmerGainPercent: 100,
    consumerSavingsPercent: 29,
  }
];

// API Endpoints

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'KisanSetu Direct Farmer-to-Consumer Engine is running healthy',
    timestamp: new Date().toISOString(),
  });
});

// 2. Get all crop listings
app.get('/api/crops', (req, res) => {
  const { category, search, state } = req.query;
  let filtered = [...cropListings];

  if (category && category !== 'All') {
    filtered = filtered.filter((c) => c.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (state && state !== 'All') {
    filtered = filtered.filter((c) => c.location.state.toLowerCase() === (state as string).toLowerCase());
  }

  if (search) {
    const s = (search as string).toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.cropName.toLowerCase().includes(s) ||
        c.cropNameHindi.toLowerCase().includes(s) ||
        c.farmerName.toLowerCase().includes(s) ||
        c.location.district.toLowerCase().includes(s) ||
        c.location.state.toLowerCase().includes(s)
    );
  }

  res.json(filtered);
});

// 3. Post a new crop listing (Farmer action)
app.post('/api/crops', (req, res) => {
  const data = req.body;
  if (!data.cropName || !data.farmerName || !data.farmerPricePerUnit) {
    return res.status(400).json({ error: 'Missing required crop details (name, farmer, price)' });
  }

  // Auto calculate reasonable benchmark if not provided
  const directPrice = Number(data.farmerPricePerUnit);
  const mandiPrice = data.mandiApmcPricePerUnit ? Number(data.mandiApmcPricePerUnit) : Math.round(directPrice * 0.55);
  const retailPrice = data.retailMarketPricePerUnit ? Number(data.retailMarketPricePerUnit) : Math.round(directPrice * 1.55);

  const newCrop = {
    id: `crop-${Date.now()}`,
    cropName: data.cropName,
    cropNameHindi: data.cropNameHindi || data.cropName,
    variety: data.variety || 'Local Desi Variety',
    category: data.category || 'Vegetables',
    farmerName: data.farmerName,
    farmerPhone: data.farmerPhone || '+91 98000 00000',
    location: {
      village: data.location?.village || 'Gram Panchayat',
      district: data.location?.district || 'District',
      state: data.location?.state || 'India',
    },
    quantityAvailable: Number(data.quantityAvailable) || 100,
    minOrderQuantity: Number(data.minOrderQuantity) || 5,
    unit: data.unit || 'kg',
    farmerPricePerUnit: directPrice,
    mandiApmcPricePerUnit: mandiPrice,
    retailMarketPricePerUnit: retailPrice,
    harvestDate: data.harvestDate || new Date().toISOString().split('T')[0],
    farmingType: data.farmingType || 'Natural (प्राकृतिक)',
    grade: data.grade || 'Grade A (उत्तम)',
    imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    description: data.description || 'Fresh harvested farm produce directly offered by farmer.',
    upiId: data.upiId || 'kisan@upi',
    verifiedKisan: true,
    createdAt: new Date().toISOString(),
  };

  cropListings.unshift(newCrop);
  res.status(201).json(newCrop);
});

// 4. Delete crop listing
app.delete('/api/crops/:id', (req, res) => {
  const { id } = req.params;
  cropListings = cropListings.filter((c) => c.id !== id);
  res.json({ success: true, message: 'Crop listing removed' });
});

// 5. Get orders
app.get('/api/orders', (req, res) => {
  res.json(directOrders);
});

// 6. Create new order (Buyer action)
app.post('/api/orders', (req, res) => {
  const data = req.body;
  if (!data.cropId || !data.buyerName || !data.quantity) {
    return res.status(400).json({ error: 'Incomplete order information' });
  }

  const crop = cropListings.find((c) => c.id === data.cropId);
  if (!crop) {
    return res.status(404).json({ error: 'Crop listing not found' });
  }

  const qty = Number(data.quantity);
  const total = qty * crop.farmerPricePerUnit;

  const newOrder = {
    id: `ord-${Date.now().toString().slice(-5)}`,
    cropId: crop.id,
    cropName: crop.cropName,
    farmerName: crop.farmerName,
    farmerPhone: crop.farmerPhone,
    buyerName: data.buyerName,
    buyerPhone: data.buyerPhone || '+91 99999 99999',
    buyerAddress: data.buyerAddress || 'City delivery point',
    buyerType: data.buyerType || 'Consumer (घर के लिए)',
    quantity: qty,
    unit: crop.unit,
    unitPrice: crop.farmerPricePerUnit,
    totalAmount: total,
    deliveryType: data.deliveryType || 'Direct Rural Express Delivery',
    paymentMode: data.paymentMode || 'Direct UPI to Farmer',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  // Reduce available quantity
  crop.quantityAvailable = Math.max(0, crop.quantityAvailable - qty);

  directOrders.unshift(newOrder);
  res.status(201).json(newOrder);
});

// 7. Update order status
app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = directOrders.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  order.status = status;
  res.json(order);
});

// 8. Get Mandi Comparison benchmarks
app.get('/api/mandi-rates', (req, res) => {
  res.json(mandiComparisons);
});

// 9. Get Intermediary breakdown analysis
app.get('/api/intermediary-breakdown', (req, res) => {
  res.json({
    layers: intermediaryLayers,
    traditionalFarmerSharePercent: 28, // In traditional APMC, farmer keeps only ~28%
    traditionalMiddlemenSharePercent: 54, // Middlemen swallow ~54%
    traditionalLogisticsWastePercent: 18, // Inefficient multiple handoffs waste ~18%
    directFarmerSharePercent: 82, // On KisanSetu, farmer keeps 82%
    directLogisticsSharePercent: 18, // Direct single-hop logistics
    directMiddlemenSharePercent: 0, // 0% to middlemen
  });
});

// 10. AI Smart Crop & Price Advisory (using Gemini if available, or smart agronomy algorithm)
app.post('/api/ai-advisory', async (req, res) => {
  const { cropName, quantity, district, state, currentOfferPrice, language } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are Krishi Mitra, an expert Indian agricultural economist and advisor dedicated to protecting farmers from exploitative middlemen (dalals and commission agents) in India.
      Farmer details:
      - Crop: ${cropName || 'Onion'}
      - Quantity: ${quantity || 1000} kg/units
      - Location: ${district || 'Nashik'}, ${state || 'Maharashtra'}
      - Middleman offer / local APMC bid: ₹${currentOfferPrice || 14} per kg/unit
      - Language preferred: ${language || 'Hindi and English mix'}

      Provide a concise, practical, highly encouraging response for this farmer with:
      1. Fair Direct Price Recommendation (what they should charge direct to consumers/kiranas to make 40-80% more profit).
      2. Middlemen Trap Warning (what commission agents will secretly deduct like karda, kat, hamali, dalali).
      3. Negotiation Tip / Storage Strategy (whether to sell immediately or hold).
      4. Direct selling target buyers (e.g. apartment societies, local kirana collective).

      Keep it direct, warm, respectful, and easy for an Indian farmer to understand.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return res.json({
        advice: response.text,
        recommendedDirectPrice: Math.round(Number(currentOfferPrice || 15) * 1.6),
        estimatedExtraEarnings: Math.round((Number(quantity || 1000) * Number(currentOfferPrice || 15)) * 0.6),
        source: 'Gemini 2.5 Flash Ag-Advisory Engine',
      });
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to Agronomy Expert Algorithm:', err.message);
    }
  }

  // Reliable Fallback Agronomy Rule Engine
  const basePrice = Number(currentOfferPrice || 16);
  const qty = Number(quantity || 1000);
  const directPriceRec = Math.round(basePrice * 1.65);
  const extraPerUnit = directPriceRec - basePrice;
  const totalExtra = extraPerUnit * qty;

  const adviceText = `🌾 **किसान भाइयों के लिए विशेष मंडी विश्लेषण (KisanSetu Advisory)**:

1. **सीधा बिक्री दाम (Direct Fair Price)**:
   - बिचौलियों का ऑफर: ₹${basePrice}/किग्रा
   - किसानसेतु पर अनुशंसित सीधा भाव: **₹${directPriceRec}/किग्रा** (आपको प्रति किलो ₹${extraPerUnit} का अतिरिक्त शुद्ध मुनाफा!)

2. **बिचौलियों (दलालों) की छुपी हुई कटौतियां**:
   - पारंपरिक APMC मंडी में आपकी फसल पर 6-8% कमीशन, 2-3% पल्लेदारी, और 4-6% वजन काट (कट/डैमेज) के नाम पर काटा जाता है।
   - सीधे खरीदार या किराना स्टोर को बेचकर आप ये सारे ₹${totalExtra.toLocaleString('en-IN')} अपने घर ला सकते हैं।

3. **सुझाव (Farmer Action Tip)**:
   - अपनी उपज की ग्रेडिंग करें (A-ग्रेड को अलग करें)।
   - हाउसिंग सोसायटियों और स्थानीय किराना दुकानदारों को सीधे 25-50 किग्रा के लॉट में ऑफर करें।
   - भुगतान तुरंत सीधे अपने बैंक खाते या UPI पर प्राप्त करें।`;

  return res.json({
    advice: adviceText,
    recommendedDirectPrice: directPriceRec,
    estimatedExtraEarnings: totalExtra,
    source: 'National e-NAM & APMC Benchmark Algorithm',
  });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 KisanSetu Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
