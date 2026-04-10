export const CROP_CATEGORIES = {
  GRAINS: 'Grains & Cereals',
  PULSES: 'Pulses & Oilseeds',
  COMMERCIAL: 'Commercial Crops',
  FRUITS: 'Fruits & Horticulture'
};

export const CROP_DATA = [
  // Grains
  { id: 'rice', name: 'Rice (Paddy)', category: CROP_CATEGORIES.GRAINS, seeds: 4000, fertilizer: 9000, labor: 15000, irrigation: 5000 },
  { id: 'wheat', name: 'Wheat', category: CROP_CATEGORIES.GRAINS, seeds: 3500, fertilizer: 7000, labor: 8000, irrigation: 4000 },
  { id: 'bajra', name: 'Bajra (Pearl Millet)', category: CROP_CATEGORIES.GRAINS, seeds: 1500, fertilizer: 3000, labor: 4000, irrigation: 1500 },
  { id: 'maize', name: 'Maize (Corn)', category: CROP_CATEGORIES.GRAINS, seeds: 5000, fertilizer: 8000, labor: 7000, irrigation: 3000 },
  { id: 'jowar', name: 'Jowar (Sorghum)', category: CROP_CATEGORIES.GRAINS, seeds: 2000, fertilizer: 4000, labor: 5000, irrigation: 2000 },
  { id: 'ragi', name: 'Ragi (Finger Millet)', category: CROP_CATEGORIES.GRAINS, seeds: 1800, fertilizer: 3500, labor: 6000, irrigation: 1500 },
  
  // Pulses & Oilseeds
  { id: 'tuar', name: 'Tuar (Arhar)', category: CROP_CATEGORIES.PULSES, seeds: 3000, fertilizer: 5000, labor: 8000, irrigation: 2000 },
  { id: 'moong', name: 'Moong (Green Gram)', category: CROP_CATEGORIES.PULSES, seeds: 2500, fertilizer: 3000, labor: 6000, irrigation: 1500 },
  { id: 'urad', name: 'Urad (Black Gram)', category: CROP_CATEGORIES.PULSES, seeds: 2500, fertilizer: 3000, labor: 6000, irrigation: 1500 },
  { id: 'gram', name: 'Gram (Chickpea)', category: CROP_CATEGORIES.PULSES, seeds: 4500, fertilizer: 4000, labor: 7000, irrigation: 2500 },
  { id: 'groundnut', name: 'Groundnut', category: CROP_CATEGORIES.PULSES, seeds: 8000, fertilizer: 6000, labor: 9000, irrigation: 4000 },
  { id: 'soybean', name: 'Soybean', category: CROP_CATEGORIES.PULSES, seeds: 6000, fertilizer: 5000, labor: 7000, irrigation: 3000 },
  { id: 'mustard', name: 'Mustard', category: CROP_CATEGORIES.PULSES, seeds: 1500, fertilizer: 4000, labor: 5000, irrigation: 2500 },

  // Commercial
  { id: 'cotton', name: 'Cotton', category: CROP_CATEGORIES.COMMERCIAL, seeds: 6000, fertilizer: 12000, labor: 15000, irrigation: 6000 },
  { id: 'sugarcane', name: 'Sugarcane', category: CROP_CATEGORIES.COMMERCIAL, seeds: 25000, fertilizer: 20000, labor: 35000, irrigation: 15000 },

  // Fruits (Annual Maintenance Est.)
  { id: 'apple', name: 'Apple', category: CROP_CATEGORIES.FRUITS, seeds: 2000, fertilizer: 15000, labor: 30000, irrigation: 10000 },
  { id: 'mango', name: 'Mango', category: CROP_CATEGORIES.FRUITS, seeds: 1000, fertilizer: 8000, labor: 12000, irrigation: 5000 },
  { id: 'banana', name: 'Banana', category: CROP_CATEGORIES.FRUITS, seeds: 25000, fertilizer: 25000, labor: 40000, irrigation: 20000 },
  { id: 'grapes', name: 'Grapes', category: CROP_CATEGORIES.FRUITS, seeds: 5000, fertilizer: 30000, labor: 50000, irrigation: 25000 },
  { id: 'pomegranate', name: 'Pomegranate', category: CROP_CATEGORIES.FRUITS, seeds: 3000, fertilizer: 12000, labor: 20000, irrigation: 8000 },
  { id: 'papaya', name: 'Papaya', category: CROP_CATEGORIES.FRUITS, seeds: 15000, fertilizer: 15000, labor: 25000, irrigation: 12000 },
  { id: 'guava', name: 'Guava', category: CROP_CATEGORIES.FRUITS, seeds: 2000, fertilizer: 7000, labor: 10000, irrigation: 4000 }
];
