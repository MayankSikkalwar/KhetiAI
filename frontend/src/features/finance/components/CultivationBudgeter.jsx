import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '../../../components/common/Card'
import { Sprout, Ruler, Droplets, Wheat, ChevronDown } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { CROP_DATA, CROP_CATEGORIES } from '../data/crops'

export function CultivationBudgeter() {
  const [acres, setAcres] = useState(1)
  const [fertility, setFertility] = useState('medium')
  const [selectedCropId, setSelectedCropId] = useState('rice')
  const [costs, setCosts] = useState({ seeds: 0, fertilizer: 0, labor: 0, irrigation: 0 })
  const [total, setTotal] = useState(0)

  const handleCropChange = (cropId) => {
    setSelectedCropId(cropId)
    const crop = CROP_DATA.find(c => c.id === cropId)
    if (crop) {
      setCosts({
        seeds: crop.seeds,
        fertilizer: crop.fertilizer,
        labor: crop.labor,
        irrigation: crop.irrigation
      })
    }
  }

  const handleCostChange = (key, value) => {
    setCosts(prev => ({ ...prev, [key]: Number(value) }))
  }

  useEffect(() => {
    handleCropChange('rice')
  }, [])

  useEffect(() => {
    const fertilityMultiplier = { low: 1.3, medium: 1.0, high: 0.8 }
    const calculatedFertilizer = costs.fertilizer * fertilityMultiplier[fertility]
    const baseTotalPerAcre = costs.seeds + calculatedFertilizer + costs.labor + costs.irrigation
    setTotal(baseTotalPerAcre * acres)
  }, [acres, fertility, costs])

  return (
    <Card className="border-green-100 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-green-700 p-6 text-white flex items-center justify-between">
        <div className="flex-1">
          <p className="text-green-200 text-xs font-bold uppercase tracking-widest mb-1">Total Estimated Budget</p>
          <h3 className="text-4xl font-black tracking-tight">₹{Math.round(total).toLocaleString('en-IN')}</h3>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
            <Wheat className="w-8 h-8" />
          </div>
          {selectedCropId && (
            <span className="text-[10px] font-bold bg-green-600/50 px-2 py-0.5 rounded-full border border-white/20 uppercase tracking-tighter">
              {CROP_DATA.find(c => c.id === selectedCropId)?.category}
            </span>
          )}
        </div>
      </div>

      <CardContent className="p-8">
        <div className="grid md:grid-cols-2 gap-10">

          {/* Left Column: Controls */}
          <div className="space-y-6">

            {/* Crop Selector */}
            <div>
              <label className="text-sm font-bold text-green-950 mb-3 flex items-center gap-2 block">
                <Sprout className="w-4 h-4 text-green-600" />
                Select Crop
              </label>
              <div className="relative">
                <select
                  value={selectedCropId}
                  onChange={(e) => handleCropChange(e.target.value)}
                  className="w-full appearance-none bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-green-950 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all font-bold text-base cursor-pointer"
                >
                  {Object.entries(CROP_CATEGORIES).map(([key, category]) => (
                    <optgroup key={key} label={category}>
                      {CROP_DATA.filter(c => c.category === category).map(crop => (
                        <option key={crop.id} value={crop.id}>{crop.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600 pointer-events-none" />
              </div>
            </div>

            {/* Land & Fertility Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-green-950 mb-3 flex items-center gap-2 block">
                  <Ruler className="w-4 h-4 text-green-600" />
                  Land Area (Acres)
                </label>
                <input
                  type="number"
                  value={acres}
                  onChange={(e) => setAcres(Number(e.target.value))}
                  className="w-full bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-green-950 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all font-bold text-lg"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-green-950 mb-3 flex items-center gap-2 block">
                  <Droplets className="w-4 h-4 text-green-600" />
                  Soil Fertility
                </label>
                <div className="flex gap-1 bg-green-50 p-1 rounded-xl border border-green-100">
                  {['low', 'medium', 'high'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFertility(f)}
                      className={cn(
                        "flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all",
                        fertility === f
                          ? "bg-white text-green-700 shadow-sm"
                          : "text-green-800/40 hover:text-green-800/60"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Base Costs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-green-800/40 uppercase tracking-widest">Base Costs (Per Acre)</h4>
              <div className="grid grid-cols-2 gap-4">
                <CostInput label="Seeds" value={costs.seeds} onChange={(v) => handleCostChange('seeds', v)} />
                <CostInput label="Fertilizer" value={costs.fertilizer} onChange={(v) => handleCostChange('fertilizer', v)} />
                <CostInput label="Labor" value={costs.labor} onChange={(v) => handleCostChange('labor', v)} />
                <CostInput label="Irrigation" value={costs.irrigation} onChange={(v) => handleCostChange('irrigation', v)} />
              </div>
            </div>
          </div>

          {/* Right Column: Breakdown */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-green-800/40 uppercase tracking-widest mb-2">Budget Breakdown</h4>
            <BreakdownRow label="Seed Investment" value={costs.seeds * acres} color="bg-blue-500" />
            <BreakdownRow
              label="Nutrient Supply (Soil Adjusted)"
              value={(costs.fertilizer * (fertility === 'low' ? 1.3 : fertility === 'high' ? 0.8 : 1)) * acres}
              color="bg-green-500"
            />
            <BreakdownRow label="Labor & Machinery" value={costs.labor * acres} color="bg-orange-500" />
            <BreakdownRow label="Water Resources" value={costs.irrigation * acres} color="bg-cyan-500" />

            <div className="mt-auto p-5 bg-green-50 rounded-2xl border border-dashed border-green-200">
              <p className="text-xs text-green-800/70 leading-relaxed italic">
                * Budget estimated for {acres} acre{acres > 1 ? 's' : ''} with {fertility} soil fertility.
                Actual costs may vary by region and season.
              </p>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}

function CostInput({ label, value, onChange }) {
  return (
    <div className="bg-white border border-green-50 p-3 rounded-xl shadow-sm">
      <span className="text-[10px] font-bold text-green-800/40 uppercase mb-1 block">{label}</span>
      <div className="flex items-center text-green-900">
        <span className="text-sm font-bold mr-1 opacity-40">₹</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none font-bold text-sm"
        />
      </div>
    </div>
  )
}

function BreakdownRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/40 border-b border-green-100/50">
      <div className="flex items-center gap-3">
        <div className={cn("w-2 h-2 rounded-full", color)} />
        <span className="text-xs font-semibold text-green-900">{label}</span>
      </div>
      <span className="text-sm font-bold text-green-950">₹{Math.round(value).toLocaleString('en-IN')}</span>
    </div>
  )
}
