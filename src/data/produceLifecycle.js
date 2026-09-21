const SHELF_LIFE_RULES = [
  { match: /tomato|टमाटर/i, days: 3 },
  { match: /leafy|spinach|पालक|मेथी|coriander|धनिया/i, days: 2 },
  { match: /mango|आम|banana|केला|papaya|पपीता/i, days: 5 },
  { match: /potato|आलू|carrot|गाजर/i, days: 14 },
  { match: /onion|प्याज|garlic|लहसुन/i, days: 21 },
  { match: /wheat|गेहूं|rice|चावल|pulse|dal|दाल/i, days: 90 },
  { match: /chilli|मिर्च|spice|मसाला/i, days: 60 },
];

export function getShelfLifeDays(crop) {
  const text = `${crop.cropName || ''} ${crop.cropNameHindi || ''} ${crop.category || ''}`;
  return SHELF_LIFE_RULES.find((rule) => rule.match.test(text))?.days || 7;
}

export function getCropExpiryDate(crop) {
  const harvestDate = new Date(`${crop.harvestDate || crop.createdAt || new Date().toISOString().split('T')[0]}T00:00:00`);
  harvestDate.setDate(harvestDate.getDate() + Number(crop.shelfLifeDays || getShelfLifeDays(crop)));
  return harvestDate;
}

export function isCropExpired(crop) {
  return getCropExpiryDate(crop).getTime() < new Date().setHours(0, 0, 0, 0);
}

export function formatCropExpiry(crop) {
  return getCropExpiryDate(crop).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}