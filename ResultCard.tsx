import React from 'react';
import { DiagnosisContent } from '../types';
import { 
  Zap, 
  Target, 
  Briefcase, 
  Sparkles, 
  MessageSquare, 
  Activity, 
  Heart,
  Users,
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';

interface ResultCardProps {
  animalNumber: number;
  animalName: string;
  groupCode: string;
  content: DiagnosisContent;
  gender: 'male' | 'female'; // App.tsxから性別を受け取る
  onRetry: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  animalName, 
  groupCode, 
  content, 
  gender,
  onRetry 
}) => {
  const accentColor = "text-[#336d99]";
  const bgAccentColor = "bg-[#336d99]";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* 1. Header Card */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden text-center md:text-left">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-20 -mt-20 z-0"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#336d99] text-xs font-black tracking-widest mb-6 border border-blue-100 shadow-sm uppercase">
            Personal Audit Report
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
            あなたの本質と<br className="md:hidden" />行動戦略
          </h2>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className={`px-6 py-3 rounded-2xl ${bgAccentColor} text-white font-bold text-lg shadow-lg shadow-blue-900/20`}>
              行動特性分析
            </div>
          </div>
        </div>
      </div>

      {/* 2. Core Personality Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#336d99]">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">基本特性と強み</h3>
          </div>
          <p className="text-slate-600 leading-relaxed font-medium">{content.basicPersonality}</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">人生の戦略トレンド</h3>
          </div>
          <p className="text-slate-600 leading-relaxed font-medium">{content.lifeTrend}</p>
        </div>
      </div>

      {/* 3. Gender Specific Analysis (条件分岐で片方のみ表示) */}
      <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
        <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#336d99]">
            <Users className="w-4 h-4" />
          </div>
          <span>対人傾向と本質的資質</span>
        </h4>
        
        <div className="grid md:grid-cols-1 gap-6">
          {gender === 'female' ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-l-rose-400">
              <h5 className="font-bold text-rose-500 mb-4 text-lg flex items-center gap-2">
                <Heart className="w-5 h-5" /> <span>女性的側面から見た資質</span>
              </h5>
              <p className="text-slate-600 leading-relaxed font-medium">{content.femaleTraits}</p>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-l-blue-400">
              <h5 className="font-bold text-blue-500 mb-4 text-lg flex items-center gap-2">
                <Zap className="w-5 h-5" /> <span>男性的側面から見た資質</span>
              </h5>
              <p className="text-slate-600 leading-relaxed font-medium">{content.maleTraits}</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Business Talent Analysis */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/40 border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
            <Briefcase className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">ビジネス適性とキャリアプラン</h3>
        </div>
        <p className="text-slate-600 leading-loose text-lg font-medium">{content.work}</p>
      </div>

      {/* 5. Deep Psychology (カラーライン入り) */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm border-l-4 border-l-rose-500">
          <h4 className="font-bold text-rose-500 mb-3 flex items-center gap-2 text-sm uppercase">
            <Heart className="w-4 h-4" /> 深層心理
          </h4>
          <p className="text-slate-600 text-sm leading-relaxed">{content.psychegram.features}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm border-l-4 border-l-indigo-500">
          <h4 className="font-bold text-indigo-500 mb-3 flex items-center gap-2 text-sm uppercase">
            <Users className="w-4 h-4" /> 対人対応
          </h4>
          <p className="text-slate-600 text-sm leading-relaxed">{content.psychegram.interpersonal}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm border-l-4 border-l-orange-500">
          <h4 className="font-bold text-orange-500 mb-3 flex items-center gap-2 text-sm uppercase">
            <Zap className="w-5 h-5" /> 行動特性
          </h4>
          <p className="text-slate-600 text-sm leading-relaxed">{content.psychegram.action}</p>
        </div>

        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm border-l-4 border-l-teal-500">
          <h4 className="font-bold text-teal-500 mb-3 flex items-center gap-2 text-sm uppercase">
            <MessageSquare className="w-4 h-4" /> コミュニケーション
          </h4>
          <p className="text-slate-600 text-sm leading-relaxed">{content.psychegram.expression}</p>
        </div>

        <div className="md:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm border-l-4 border-l-yellow-400">
          <h4 className="font-bold text-yellow-600 mb-3 flex items-center gap-2 text-sm uppercase">
            <Award className="w-4 h-4" /> 才能・センス
          </h4>
          <p className="text-slate-600 text-sm leading-relaxed">{content.psychegram.talent}</p>
        </div>
      </div>

      {/* Footer / Action */}
      <div className="text-center pt-8 pb-12">
        <button onClick={onRetry} className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-xl">
          <span>別の生年月日で分析する</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
