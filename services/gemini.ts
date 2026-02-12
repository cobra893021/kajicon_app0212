import { GoogleGenerativeAI } from "@google/generative-ai";
import { DiagnosisContent } from "../types";

export const fetchDiagnosisFromGemini = async (
  animalName: string,
  groupData: any
): Promise<DiagnosisContent> => {
 const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("API Key is missing in environment variables.");
    throw new Error("API_KEY_MISSING");
  }

  // Check Daily Limit via Server API
  try {
    const limitRes = await fetch('/api/check-limit', { method: 'POST' });
    if (!limitRes.ok) {
      if (limitRes.status === 429) {
        throw new Error("DAILY_LIMIT_REACHED");
      }
      // If endpoint doesn't exist (e.g. dev environment without server.js), we might want to proceed or warn.
      // For now, we assume if it fails with other errors, we proceed (or you can choose to block).
      console.warn("Limit check failed, proceeding...", limitRes.statusText);
    }
  } catch (err: any) {
    // If we are strictly enforcing, we should rethrow if it's the specific limit error
    if (err.message === "DAILY_LIMIT_REACHED") {
      throw err;
    }
    console.warn("Could not reach limit endpoint, proceeding with diagnosis.", err);
  }

  const genAI = new GoogleGenerativeAI(apiKey);


  const prompt = `
あなたはベテランの個性心理学診断士（カジコン）です。
以下の「対象キャラクター」と、その深層心理を表す「サイグラムデータ」を組み合わせて、
読み手が「自分のことが完全に理解されている」と感動するような本質診断レポートを作成してください。

【対象キャラクター】
名前: ${animalName}

【サイグラムデータ（重要）】
以下の特徴データを分析の核として使用し、結果に必ず反映させてください。
${JSON.stringify(groupData || {})}

【出力ルール】
1. **文字数**: 主要項目（基本性格・人生の傾向・仕事）は**250〜300文字**程度で、具体例を交えて充実させること。
2. **サイグラムの反映**: 「psychegram」セクションは、一言で終わらせず、提供されたサイグラムデータの内容を含めて**60〜100文字**程度で丁寧に解説すること。
3. **文体**: 専門用語は使わず、親しみやすい「〜です」「〜ます」調で、優しく語りかけるトーン。
4. **文章構成（重要）**: 
   - 「基本性格」では、安易な逆接（「しかし」など）を避け、多面的な性格が矛盾なく共存している様子を「また」「同時に」「その一方で」などを用いて自然に描写してください。文脈が断絶しないように注意してください。
5. **深掘りと差別化（重要）**:
   - 「psychegram」セクション（深層心理・対人対応など）は、「基本性格」と内容が重複しないようにしてください。
   - 表面的な行動だけでなく、その裏にある心理的動機、無意識の判断基準、潜在的なメカニズムまで踏み込んで深掘りしてください。
6. **禁止事項**: 
   - 「基本性格：」「人生の傾向：」などの見出しラベルを本文に含めないでください。
   - 「A6」「F1」などの内部的な分類コードや運命数などのロジックに関する記述は一切しないでください。
   - 「〇〇な動物」といった比喩表現も避けてください。

【JSON出力フォーマット】
必ず以下のJSON構造のみを出力してください。Markdownのコードブロックは不要です。

{
  "title": "キャラクターのキャッチコピー（例：正直なこじか）",
  "basicPersonality": "基本性格：表面的な特徴だけでなく、内面の葛藤や本質的な欲求を含めて詳細に記述してください。文章の繋がりを重視し、矛盾のない自然な構成にしてください。（目標：250〜300文字）",
  "lifeTrend": "人生の傾向：どのような運勢の流れやバイオリズムを持っているか、人生の目的は何かを記述してください。（目標：250〜300文字）",
  "femaleTraits": "女性の場合の特徴：恋愛観や対人距離感を含めて記述。（目標：150〜200文字）",
  "maleTraits": "男性の場合の特徴：仕事観や社会的な振る舞いを含めて記述。（目標：150〜200文字）",
  "work": "仕事の適性と働き方：才能を活かせる環境や役割、成功へのアドバイスを記述してください。（目標：250〜300文字）",
  "psychegram": {
    "features": "深層心理：基本性格とは被らない視点で、サイグラムデータの『features』をベースに、無意識の価値観や判断基準を深掘り解説（60〜100文字）",
    "interpersonal": "対人関係：基本性格とは被らない視点で、サイグラムデータの『interpersonal』をベースに、他人との距離感や接し方のクセを深掘り解説（60〜100文字）",
    "action": "行動特性：基本性格とは被らない視点で、サイグラムデータの『action』をベースに、行動を起こすスイッチやパターンを深掘り解説（60〜100文字）",
    "expression": "会話・表現：基本性格とは被らない視点で、サイグラムデータの『expression』をベースに、言葉選びや伝え方の特徴を深掘り解説（60〜100文字）",
    "talent": "才能：基本性格とは被らない視点で、サイグラムデータの『talent』をベースに、本人も気づいていない潜在能力を深掘り解説（60〜100文字）",
    "male": "男性心理：サイグラムデータの『male』の内容をベースに、男性特有の深層心理を解説（60〜100文字）",
    "female": "女性心理：サイグラムデータの『female』の内容をベースに、女性特有の深層心理を解説（60〜100文字）"
  }
}
`;

  try {
    const response = await ai.models.generateContent(...)
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini");
    }

    // JSON部分の抽出とパース
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
       console.error("Malformed JSON response:", text);
       throw new Error("Response is not valid JSON");
    }

    return JSON.parse(jsonMatch[0]) as DiagnosisContent;

  } catch (e) {
    console.error("Gemini API Error details:", e);
    throw e;
  }
};
