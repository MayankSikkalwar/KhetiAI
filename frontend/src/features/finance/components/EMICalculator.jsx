import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '../../../components/common/Card'
import { Button } from '../../../components/common/Button'
import { IndianRupee, Calendar, Percent, ArrowRight } from 'lucide-react'

export function EMICalculator() {
  const [amount, setAmount] = useState(100000)
  const [rate, setRate] = useState(7)
  const [tenure, setTenure] = useState(24) // in months
  const [emi, setEmi] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)

  useEffect(() => {
    const p = amount
    const r = rate / 12 / 100
    const n = tenure
    
    if (r === 0) {
      setEmi(p / n)
      setTotalInterest(0)
      return
    }

    const emiValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    setEmi(emiValue)
    setTotalInterest((emiValue * n) - p)
  }, [amount, rate, tenure])

  return (
    <Card className="border-green-100 shadow-xl overflow-hidden">
      <div className="bg-green-600 p-6 text-white text-center">
        <p className="text-green-100 text-sm font-medium uppercase tracking-wider mb-2">Estimated Monthly EMI</p>
        <h3 className="text-4xl font-bold flex items-center justify-center gap-1">
          <IndianRupee className="w-8 h-8" />
          {Math.round(emi).toLocaleString('en-IN')}
        </h3>
      </div>
      
      <CardContent className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
             <div>
                <label className="text-sm font-semibold text-green-900 mb-2 block flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-green-600" />
                  Loan Amount (₹)
                </label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-green-950 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all font-medium"
                />
                <input 
                  type="range" 
                  min="10000" 
                  max="1000000" 
                  step="5000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-1.5 bg-green-100 rounded-lg appearance-none cursor-pointer accent-green-600 mt-4"
                />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-sm font-semibold text-green-900 mb-2 block flex items-center gap-2">
                    <Percent className="w-4 h-4 text-green-600" />
                    Interest (%)
                  </label>
                  <input 
                    type="number" 
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-green-950 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
                  />
                </div>
                <div>
                   <label className="text-sm font-semibold text-green-900 mb-2 block flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    Tenure (Months)
                  </label>
                  <input 
                    type="number" 
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-green-950 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
                  />
                </div>
             </div>
          </div>

          {/* Results Summary */}
          <div className="bg-green-50/50 rounded-2xl p-6 border border-green-100 space-y-6 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <span className="text-green-800/70 text-sm font-medium">Principal Amount</span>
              <span className="text-green-950 font-bold">₹{amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-800/70 text-sm font-medium">Total Interest</span>
              <span className="text-green-950 font-bold">₹{Math.round(totalInterest).toLocaleString('en-IN')}</span>
            </div>
            <div className="h-px bg-green-200/50" />
            <div className="flex items-center justify-between">
              <span className="text-green-800 font-bold text-lg">Total Payable</span>
              <span className="text-green-600 font-bold text-xl">₹{Math.round(amount + totalInterest).toLocaleString('en-IN')}</span>
            </div>
            
            <div className="pt-4">
              <div className="w-full h-3 bg-green-200 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-green-600" 
                  style={{ width: `${(amount / (amount + totalInterest)) * 100}%` }}
                />
                <div 
                  className="h-full bg-yellow-400" 
                  style={{ width: `${(totalInterest / (amount + totalInterest)) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-700 uppercase tracking-wider">
                  <div className="w-2 h-2 bg-green-600 rounded-full" /> Principal
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-yellow-700 uppercase tracking-wider">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" /> Interest
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
