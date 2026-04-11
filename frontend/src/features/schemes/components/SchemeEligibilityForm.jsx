import React from 'react';
import { Card, CardContent } from '../../../components/common/Card';
import { useLanguage } from '../../../context/LanguageContext';
import translations from '../../../i18n/translations';
import { User, IndianRupee, MapPin, CheckCircle2 } from 'lucide-react';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", 
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", 
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export function SchemeEligibilityForm({ profile, onChange, onCheck }) {
  const { language } = useLanguage();
  const t = translations[language];

  const handleInputChange = (field, value) => {
    onChange({ ...profile, [field]: value });
  };

  return (
    <Card className="border-green-100 shadow-xl shadow-green-900/5 bg-white overflow-hidden">
      <div className="bg-green-600 p-6 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">{t.elig_title}</h2>
        <p className="text-green-100/80 text-sm max-w-sm mx-auto">{t.elig_subtitle}</p>
      </div>
      
      <CardContent className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Age */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-green-800/40 uppercase tracking-widest flex items-center gap-2">
              <User className="w-3 h-3" />
              {t.elig_age}
            </label>
            <input 
              type="number"
              value={profile.age}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value) || '')}
              className="w-full px-4 py-3 bg-green-50 border border-green-100 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-green-950 font-medium"
              placeholder="e.g. 35"
            />
          </div>

          {/* Income */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-green-800/40 uppercase tracking-widest flex items-center gap-2">
              <IndianRupee className="w-3 h-3" />
              {t.elig_income}
            </label>
            <input 
              type="number"
              value={profile.income}
              onChange={(e) => handleInputChange('income', parseInt(e.target.value) || '')}
              className="w-full px-4 py-3 bg-green-50 border border-green-100 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-green-950 font-medium"
              placeholder="e.g. 150000"
            />
          </div>
        </div>

        {/* State Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-green-800/40 uppercase tracking-widest flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            {t.elig_state}
          </label>
          <select 
            value={profile.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className="w-full px-4 py-3 bg-green-50 border border-green-100 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-green-950 font-medium appearance-none"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <ToggleButton 
            label={t.elig_citizen} 
            active={profile.isIndian} 
            onClick={() => handleInputChange('isIndian', !profile.isIndian)} 
          />
          <ToggleButton 
            label={t.elig_aadhar} 
            active={profile.isAadharLinked} 
            onClick={() => handleInputChange('isAadharLinked', !profile.isAadharLinked)} 
          />
          <ToggleButton 
            label={t.elig_farmer} 
            active={profile.isActiveFarmer} 
            onClick={() => handleInputChange('isActiveFarmer', !profile.isActiveFarmer)} 
          />
        </div>

        <button 
          onClick={onCheck}
          className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold shadow-lg shadow-green-900/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          {t.elig_check_btn}
        </button>
      </CardContent>
    </Card>
  );
}

function ToggleButton({ label, active, onClick }) {
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-green-900/40 uppercase tracking-widest px-1">{label}</label>
      <button 
        onClick={onClick}
        className={`w-full py-2.5 rounded-xl border-2 transition-all font-bold text-xs ${
          active 
          ? "bg-green-100 border-green-200 text-green-700" 
          : "bg-gray-50 border-gray-100 text-gray-400"
        }`}
      >
        {active ? t.elig_yes : t.elig_no}
      </button>
    </div>
  );
}
