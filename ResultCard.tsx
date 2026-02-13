import React, { useState } from 'react';
import { DiagnosisContent } from '../types';
import { User, Activity, Briefcase, Heart, Lightbulb, MessageCircle, Star, Sparkles, TrendingUp, Shield, Zap, Check, Search } from 'lucide-react';

interface ResultCardProps {
  animalNumber: number;
  animalName: string;
  groupCode: string;
  content: DiagnosisContent;
  onRetry?: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ animalNumber, animalName, groupCode, content, onRetry }) => {
  const [copied, setCopied] = useState(false);
  const accentColor = "text-[#336d99]";
  const bgAccentColor = "bg-[#336d99]";
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getTypeLabel = (code: string) => {
    if (!code) return "";
    const prefix = code.charAt(0).toUpperCase();
    if (prefix === 'F') return "共感・調和タイプ";
    if (prefix === 'A') return "即断・即実行タイプ";
    if (prefix === 'M') return "納得・理論タイプ";
    return "";
  };

  const typeLabel = getTypeLabel(groupCode);

  if (!content) return null;

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in-up">
      
      {/* Dashboard Header */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-500 mb-3 tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Analysis Complete
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight flex flex-wrap items-end gap-3">
            本質分析レポート
            {typeLabel && (
              <span className="text-lg md:text-xl font-bold text-[#336d99] bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                あなたは{typeLabel}
              </span>
            )}
          </h2>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2" onClick={() => window.print()}>
             <span className="w-4 h-4 border-2 border-slate-400 rounded-full"></span> 保存
           </button>
           <button 
             onClick={handleShare}
             className={`px-4 py-2 ${bgAccentColor} text-white rounded-lg text-sm font-bold shadow-md shadow-blue-900/20 hover:opacity-90 transition-all flex items-center gap-2 min-w-[100px] justify-center`}
           >
             {copied ? (
               <><Check className="w-4 h-4" /> コピー完了</>
             ) : (
               <><Sparkles className="w-4 h-4" /> シェア</>
             )}
           </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* 1. Main Insight (Top Left - Large) */}
        <div className="md:col-span-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <User className="w-32 h-32 text-[#336d99]" />
          </div>
          <h3 className={`text-xl font-bold ${accentColor} mb-4 flex items-center gap-2`}>
            <Sparkles className="w-5 h-5" /> 基本的な性格・特性
          </h3>
          <p className="text-slate-700 leading-8 text-lg text-justify relative z-10">
            {content.basicPersonality || "データの解析に時間がかかっています。"}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">#本質的傾向</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">#行動パターン</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">#意思決定</span>
          </div>
        </div>

        {/* 2. Key Stats / Life Trend (Top Right - Tall) */}
        <div className="md:col-span-4 bg-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
          
          <h3 className="text-lg font-bold text-blue-200 mb-6 flex items-center gap-2 z-10">
            <Activity className="w-5 h-5" /> 人生のバイオリズム
          </h3>
          <p className="text-slate-300 leading-relaxed text-sm text-justify z-10 flex-grow">
            {content.lifeTrend || "データなし"}
          </p>
          {/* Status section removed as requested */}
        </div>

        {/* 3. Gender Traits (Middle Row) */}
        <div className="md:col-span-6 bg-gradient-to-br from-pink-50 to-white rounded-3xl p-6 border border-pink-100 shadow-sm">
           <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-pink-400"></span> 女性的側面
           </h3>
           <p className="text-slate-600 text-sm leading-7 text-justify">{content.femaleTraits || "データなし"}</p>
        </div>
        <div className="md:col-span-6 bg-gradient-to-br from-blue-50 to-white rounded-3xl p-6 border border-blue-100 shadow-sm">
           <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-blue-400"></span> 男性的側面
           </h3>
           <p className="text-slate-600 text-sm leading-7 text-justify">{content.maleTraits || "データなし"}</p>
        </div>

        {/* 4. Work & Career (Full Width) */}
        <div className="md:col-span-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-start">
           <div className="shrink-0 p-4 bg-emerald-100 text-emerald-700 rounded-2xl">
             <Briefcase className="w-8 h-8" />
           </div>
           <div>
             <h3 className="text-xl font-bold text-slate-800 mb-3">ビジネス適性とキャリア戦略</h3>
             <p className="text-slate-600 leading-relaxed text-justify">{content.work || "データなし"}</p>
           </div>
        </div>

        {/* 5. Deep Analysis Grid (Small Cards) - Using optional chaining for safety */}
        <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide text-rose-500">
            <Heart className="w-4 h-4" /> 深層心理
          </h4>
          <p className="text-slate-600 text-sm leading-relaxed">{content.psychegram?.features || "-"}</p>
        </div>

        <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide text-indigo-500">
            <User className="w-4 h-4" /> 対人対応
          </h4>
          <p className="text-slate-600 text-sm leading-relaxed">{content.psychegram?.interpersonal || "-"}</p>
        </div>

        <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide text-orange-500">
            <Zap className="w-4 h-4" /> 行動特性
          </h4>
          <p className="text-slate-600 text-sm leading-relaxed">{content.psychegram?.action || "-"}</p>
        </div>
        
        <div className="md:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide text-teal-500">
            <MessageCircle className="w-4 h-4" /> コミュニケーション・表現
          </h4>
          <p className="text-slate-600 text-sm leading-relaxed">{content.psychegram?.expression || "-"}</p>
        </div>

        <div className="md:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide text-yellow-600">
            <Lightbulb className="w-4 h-4" /> 才能・センス
          </h4>
          <p className="text-slate-600 text-sm leading-relaxed">{content.psychegram?.talent || "-"}</p>
        </div>

      </div>
    </div>
  );
};

export default ResultCard;
