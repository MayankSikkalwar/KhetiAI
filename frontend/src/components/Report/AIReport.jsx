import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../common/Card';
import { Bot, AlertTriangle, ShieldCheck, CheckCircle2, Factory } from 'lucide-react';
import { cn } from '../../utils/cn';

export function AIReport({ result, onReset }) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/generate-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            disease: result.disease,
            confidence: result.confidence
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to generate report');
        }
        
        setReportData(data.report);
      } catch (err) {
        console.error("Report Generation Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (result) {
      fetchReport();
    }
  }, [result]);

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto shadow-2xl animate-pulse">
        <div className="bg-green-600 rounded-t-2xl p-4 flex items-center gap-3">
          <Bot className="w-6 h-6 text-white" />
          <h2 className="text-xl font-bold text-white">AI Agronomist Report Generating...</h2>
        </div>
        <CardContent className="p-8 space-y-6">
          <div className="h-20 bg-green-50 rounded-xl" />
          <div className="h-64 bg-green-50 rounded-xl" />
          <div className="h-48 bg-green-50 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto shadow-2xl border-red-200">
        <CardContent className="p-8 flex flex-col items-center text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-red-900 mb-2">Report Generation Failed</h3>
          <p className="text-red-700/80 mb-6">{error}</p>
          <button 
            onClick={onReset}
            className="px-6 py-2 bg-red-100 text-red-700 hover:bg-red-200 font-semibold rounded-xl transition-colors"
          >
            Try Another Image
          </button>
        </CardContent>
      </Card>
    );
  }

  if (!reportData) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="shadow-xl overflow-hidden border-0">
        <div className="bg-green-600 p-4 flex items-center gap-3">
          <Bot className="w-6 h-6 text-white" />
          <h2 className="text-xl font-bold text-white tracking-wide">AI Agronomist Report</h2>
        </div>
        
        <div className="p-6 bg-white border-l-4 border-blue-500 m-6 rounded-r-xl shadow-sm">
          <p className="text-slate-700 leading-relaxed text-sm">
            Namaste! As an expert agronomist, I've reviewed your uploaded crop image. 
            Addressing health issues promptly prevents damage and ensures healthy yields. 
            Based on the analysis, here is a comprehensive actionable report:
          </p>
        </div>
      </Card>

      {/* 1. Integrated Diagnosis */}
      <Card className="shadow-lg border-l-4 border-green-500">
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold text-green-900 mb-6 tracking-tight flex items-center gap-2">
            1. Integrated Diagnosis
          </h3>
          
          <div className="space-y-6 text-sm text-slate-800 leading-relaxed">
            <div className="flex items-center flex-wrap gap-3">
              <span className="bg-green-100/70 text-green-800 font-semibold px-3 py-1 rounded-md border border-green-200">
                Disease Identified:
              </span>
              <span className="text-lg font-bold text-slate-900">
                {reportData.diagnosis?.disease}
              </span>
              <span className="text-sm font-medium text-slate-500">
                (Confidence: {reportData.diagnosis?.confidence})
              </span>
            </div>
            
            <p>
              <span className="bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded mr-2">Analysis:</span>
              {reportData.diagnosis?.analysis}
            </p>

            <div className="bg-green-50/50 p-4 border border-green-100 rounded-lg">
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded mr-2 text-xs">Summary:</span>
              <span className="text-slate-700">{reportData.diagnosis?.summary}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Immediate Action Plan (Organic) */}
      <Card className="shadow-lg border-l-4 border-lime-500">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-lime-900 mb-4 tracking-tight flex items-center gap-2">
            <SproutIcon /> 2. Immediate Action Plan (Organic)
          </h3>
          <p className="text-sm text-slate-600 mb-6">Focus on cultural practices and organic approved treatments before using synthetics.</p>
          
          <div className="space-y-6">
            {reportData.organic_plan?.steps?.map((step, idx) => (
              <div key={idx} className="pl-4 border-l-2 border-lime-100">
                <h4 className="font-bold text-lime-800 text-sm mb-2 hover:bg-lime-50 w-fit px-1 rounded">{step.title}</h4>
                <p className="text-sm text-slate-700 leading-relaxed mb-1">
                  <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-xs mr-2 border border-slate-200">Action:</span>
                  <span className="font-semibold text-slate-800 mr-2">{step.action}:</span>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. Immediate Action Plan (Chemical) */}
      <Card className="shadow-lg border-l-4 border-teal-500">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-teal-900 mb-4 tracking-tight flex items-center gap-2">
            <Factory className="w-5 h-5 text-teal-600"/> 3. Immediate Action Plan (Chemical)
          </h3>
          <p className="text-sm text-slate-600 mb-6">If organic methods are insufficient or the infection is severe, these chemical solutions provide robust control. Always use PPE.</p>
          
          <div className="bg-teal-50/50 rounded-xl p-5 space-y-4">
             <div>
               <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-2">Recommended Fungicides</h4>
               <div className="flex flex-wrap gap-2">
                 {reportData.chemical_plan?.fungicides?.map((f, i) => (
                   <span key={i} className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-1 rounded border border-teal-200">{f}</span>
                 ))}
               </div>
             </div>

             <div>
               <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-2">Instructions</h4>
               <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 ml-1">
                 {reportData.chemical_plan?.instructions?.map((inst, i) => (
                   <li key={i}>{inst}</li>
                 ))}
               </ul>
             </div>

             <div className="bg-red-50 p-3 rounded border border-red-100">
               <h4 className="text-xs font-bold uppercase tracking-wider text-red-800 mb-2 flex items-center gap-1">
                 <AlertTriangle className="w-4 h-4"/> Critical Warnings
               </h4>
               <ul className="list-disc list-inside space-y-1 text-sm text-red-900 ml-1">
                  {reportData.chemical_plan?.warnings?.map((warn, i) => (
                   <li key={i}>{warn}</li>
                 ))}
               </ul>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Long-Term Prevention */}
      <Card className="shadow-lg border-l-4 border-emerald-500">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-emerald-900 mb-4 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600"/> 4. Long-Term Prevention Strategy
          </h3>
          <p className="text-sm text-slate-600 mb-5">Prevention is key to managing outbreaks effectively over seasons.</p>
          
          <div className="space-y-4">
            {reportData.prevention?.strategies?.map((strat, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-slate-100 p-4 shadow-sm">
                <h4 className="font-bold text-emerald-800 text-sm mb-1">{strat.title}</h4>
                <p className="text-sm text-slate-700">
                   <span className="font-bold text-slate-900">{strat.action} </span>
                   {strat.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 5. Local Support */}
       <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-green-900 mb-4 tracking-tight">
            5. Local Agricultural Support (India)
          </h3>
          <p className="text-sm text-slate-700 mb-4">For tailored advice in your district, reach out to local experts:</p>
          
          <div className="space-y-3">
             {reportData.local_support?.map((support, idx) => (
                <div key={idx}>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <span className="font-bold text-green-800 bg-green-200/50 px-1 py-0.5 rounded shadow-sm mr-2">{support.title}:</span>
                    {support.description}
                  </p>
                </div>
             ))}
          </div>
          
          <div className="mt-8 text-center pt-6 border-t border-green-200">
             <button 
                onClick={onReset}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-8 rounded-full shadow-md transition-all hover:shadow-lg focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Analyze Another Crop
             </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SproutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lime-600">
      <path d="M7 20h10" />
      <path d="M10 20c5.5-2.5.8-6.4 3-10" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
    </svg>
  );
}
