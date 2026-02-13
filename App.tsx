import React, { useState, useEffect, useRef, useCallback } from 'react';
import { calculateDiagnosis } from './services/calculator';
import ResultCard from './components/ResultCard';
import { DiagnosisContent } from './types';
import { TrendingUp, ShieldCheck, Users, Search, ChevronRight, AlertCircle } from 'lucide-react';

// --- Components ---
const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <img 
              src="https://drive.google.com/thumbnail?id=1z-0tpNxhNXjVJ8Iuhdh_PcOiAip6QC5X&sz=w400" 
              alt="Loading..." 
              className="w-32 h-32 object-contain animate-swing relative z-10 drop-shadow-2xl"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/128x128?text=Loading";
              }}
            />
          </div>
        </div>
        <div className="text-white text-lg font-bold tracking-widest animate-pulse flex flex-col items-center gap-3">
          <span>レポート生成中...</span>
          <span className="text-xs text-slate-400 font-normal">AIがあなたの本質を分析しています</span>
        </div>
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
    <div className="w-12 h-12 bg-[#336d99]/10 rounded-xl flex items-center justify-center text-[#336d99] mb-4">
      {icon}
    </div>
    <h3 className="font-bold text-slate-800 text-lg mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

// --- Main App ---
const App: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female'>('female'); 
  
  // 診断結果と、その時の性別をセットで保存する
  const [result, setResult] = useState<{
    number: number;
    animalName: string;
    groupCode: string;
    content: DiagnosisContent;
    gender: 'male' | 'female'; 
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const resultRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const accentColor = "text-[#336d99]";
  const bgAccentColor = "bg-[#336d99]";
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= 8) {
      setBirthDate(val);
    }
  };

  const getDiagnosisFromBackend = async (animalName: string, groupData: any, selectedGender: 'male' | 'female') => {
    const dataString = JSON.stringify(groupData, null, 2);
    const genderLabel = selectedGender === 'male' ? '男性' : '女性';
    const targetGenderKey = selectedGender === 'male' ? 'maleTraits' : 'femaleTraits';
    const oppositeGenderKey = selectedGender === 'male' ? 'femaleTraits' : 'maleTraits';

    const prompt = `あなたは「動物占い」のキャラクター性と「サイグラム」の構造的分析を融合させる、中小企業診断士の資格を持つ経営コンサルタントです。
    対象者は【${genderLabel}】です。以下の【診断用生データ】を読み込み、プロフェッショナルなプロファイリングレポートを作成してください。

    【診断用生データ】
    ${dataString}

    【レポート作成の絶対ルール】
    1. 出力テキスト内に「動物の名前」や「グループコード」を一切含めないでください。
    2. 対象者が【${genderLabel}】であることを踏まえ、生データの【${targetGenderKey}】を重点的に分析に反映させてください。
    3. 重要：今回は【${genderLabel}】の診断であるため、JSON内の【${oppositeGenderKey}】は必ず「空文字 ("")」にしてください。
    4. 各項目は、ビジネス・マネジメントの観点から要約・補完してください。
    5. JSONのキー名は以下を厳守してください。

    {
      "basicPersonality": "分析（250文字程度）",
      "lifeTrend": "アドバイス（200文字程度）",
      "femaleTraits": "${selectedGender === 'female' ? '分析（150文字程度）' : ''}",
      "maleTraits": "${selectedGender === 'male' ? '分析（150文字程度）' : ''}",
      "work": "プラン（250文字程度）",
      "psychegram": {
        "features": "特徴",
        "interpersonal": "対人",
        "action": "行動",
        "expression": "表現",
        "talent": "才能"
      }
    }`;

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) throw new Error('Backend response was not ok');
    const data = await response.json();
    return JSON.parse(data.text);
  };

  const runDiagnosis = useCallback(async (dateStr: string, currentGender: 'male' | 'female') => {
    if (!dateStr || !/^\d{8}$/.test(dateStr)) {
      setError('8桁の生年月日を入力してください');
      return;
    }

    const year = parseInt(dateStr.substring(0, 4), 10);
    const month = parseInt(dateStr.substring(4, 6), 10);
    const day = parseInt(dateStr.substring(6, 8), 10);

    const calcResult = calculateDiagnosis(year, month, day);
    
    if (calcResult) {
      setError('');
      setLoading(true);
      setResult(null); 
      
      try {
        const content = await getDiagnosisFromBackend(calcResult.animalName, calcResult.groupData, currentGender);
        
        if (!content) throw new Error("Invalid response format");

        setResult({
          number: calcResult.number,
          animalName: calcResult.animalName,
          groupCode: calcResult.groupCode,
          content: content,
          gender: currentGender 
        });

        setTimeout(() => {
          setLoading(false);
          setTimeout(() => {
             resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }, 1500);

      } catch (e: any) {
        console.error("Diagnosis Error:", e);
        setError('診断レポートの作成に失敗しました。');
        setLoading(false);
      }
    } else {
      setError('診断可能な期間か確認してください。');
      setLoading(false);
    }
  }, []);

  const handleDiagnoseClick = () => {
    if (loading) return; 
    runDiagnosis(birthDate, gender);
  };

  const handleReset = () => {
    setBirthDate('');
    setGender('female');
    setResult(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get('d');
    if (dateParam && /^\d{8}$/.test(dateParam)) {
      setBirthDate(dateParam);
      runDiagnosis(dateParam, gender);
    }
  }, [runDiagnosis, gender]);

  return (
    <div className="min-h-screen font-['Zen_Maru_Gothic'] text-slate-700 bg-white">
      {loading && <LoadingOverlay />}
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 lg:py-28 relative z-10">
            <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-20">
              <div className="flex-1 w-full text-center xl:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#336d99] text-xs font-bold mb-6 border border-blue-200">
                  <span className="w-2 h-2 rounded-full bg-[#336d99] animate-pulse"></span>
                  Professional Edition v2.0
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-slate-900 leading-[1.2] tracking-tight mb-6">
                  <span className={`${accentColor}`}>Kajicon Profiler</span>
                </h1>
                
                <p className="text-base sm:text-lg text-slate-500 leading-relaxed mb-10 max-w-2xl mx-auto xl:mx-0 font-medium">
                  独自の統計データとAIを融合し、あなたの隠れた才能、行動特性を導き出します。
                </p>
                
                {/* 2段構成の入力フォーム */}
                <div className="flex flex-col gap-3 w-full max-w-2xl mx-auto xl:mx-0">
                  
                  {/* 1段目：生年月日入力欄 */}
                  <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 transition-transform hover:scale-[1.01]">
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="生年月日 (例: 19850815)" 
                        maxLength={8}
                        value={birthDate}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                           if (e.key === 'Enter' && !loading) handleDiagnoseClick();
                        }}
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 hover:bg-white focus:bg-white rounded-xl outline-none text-slate-800 font-bold text-lg tracking-widest placeholder:font-normal placeholder:tracking-normal border border-transparent focus:border-blue-200 focus:ring-4 focus:ring-blue-50 transition-all"
                      />
                    </div>
                  </div>

                  {/* 2段目：性別選択 と 無料診断ボタン */}
                  <div className="flex gap-3 w-full">
                    <div className="flex-1 relative bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 transition-transform hover:scale-[1.01]">
                      <div className="relative h-full flex items-center">
                        <select 
                          value={gender}
                          onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                          className="w-full bg-slate-50 border border-slate-100 text-[#336d99] font-bold py-4 pl-4 pr-10 rounded-xl outline-none appearance-none text-center h-full text-lg cursor-pointer transition-all focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="female">女性</option>
                          <option value="male">男性</option>
                        </select>
                        <div className="absolute right-4 pointer-events-none">
                          <span className="text-[#336d99] text-[10px] transform scale-x-125 inline-block">▼</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleDiagnoseClick}
                      disabled={loading}
                      className={`flex-1 ${bgAccentColor} hover:bg-[#254e6e] text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap text-lg disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                      無料診断
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-bold inline-flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                  </div>
                )}
                
                <p className="text-xs text-slate-400 mt-4 font-medium text-center xl:text-left">
                  ※ 入力情報は分析のみに使用され、保存されません
                </p>
              </div>

              {/* カジコン紹介 */}
              <div className="w-full max-w-lg xl:max-w-xl shrink-0 relative mt-8 xl:mt-0">
                <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50">
                  <div className="flex items-center gap-4 mb-6">
                    <img src="https://drive.google.com/thumbnail?id=1vq9POr6PHLYr7Z0pYFIF5PwrCvpuzUfp&sz=w400&v=3" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" alt="Profile" />
                    <div>
                      <div className="font-bold text-slate-800 text-xl leading-tight mb-1">カジコン</div>
                      <div className="text-sm font-bold text-[#336d99] bg-blue-50 px-3 py-1 rounded-full inline-block border border-blue-100">中小企業診断士 / 監修</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    500社以上の現場を改善。組織運営に役立つあなたの『本質』を分析します。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-3 gap-8 text-center">
            <FeatureItem icon={<TrendingUp className="w-6 h-6" />} title="キャリア戦略" desc="自分の勝ちパターンを知り成果を出す。" />
            <FeatureItem icon={<Users className="w-6 h-6" />} title="組織マネジメント" desc="他者との違いを理解し生産性を最大化。" />
            <FeatureItem icon={<ShieldCheck className="w-6 h-6" />} title="意思決定基準" desc="迷った時に立ち返るべき「自分軸」を。" />
          </div>
        </section>

        <div ref={resultRef}>
          {result && (
            <section className="py-20 bg-slate-50 border-t border-slate-200 min-h-screen">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <ResultCard 
                  animalNumber={result.number} 
                  animalName={result.animalName} 
                  groupCode={result.groupCode}
                  content={result.content}
                  gender={result.gender} 
                  onRetry={handleReset}
                />
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
