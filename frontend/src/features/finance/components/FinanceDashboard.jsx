import React from 'react'
import { EMICalculator } from './EMICalculator'
import { CultivationBudgeter } from './CultivationBudgeter'
import { cn } from '../../../utils/cn'

export function FinanceDashboard() {
  const [activeTab, setActiveTab] = React.useState('emi')

  return (
    <div className="space-y-6">
      <div className="grid w-full grid-cols-2 mb-8 bg-green-100/50 p-1 rounded-xl">
        <button 
          onClick={() => setActiveTab('emi')}
          className={cn(
            "rounded-lg transition-all py-2.5 text-sm font-semibold",
            activeTab === 'emi' ? "bg-white text-green-700 shadow-sm" : "text-green-800/60 hover:text-green-800"
          )}
        >
          Loan EMI Calculator
        </button>
        <button 
          onClick={() => setActiveTab('cultivation')}
          className={cn(
            "rounded-lg transition-all py-2.5 text-sm font-semibold",
            activeTab === 'cultivation' ? "bg-white text-green-700 shadow-sm" : "text-green-800/60 hover:text-green-800"
          )}
        >
          Cultivation Budgeter
        </button>
      </div>
      
      {activeTab === 'emi' ? <EMICalculator /> : <CultivationBudgeter />}
    </div>
  )
}
