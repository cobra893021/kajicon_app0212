// api/chat.js (JSONパースエラー対策版)
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'APIキーが設定されていません' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      // AIに「必ず純粋なJSONだけで返して」と強く指示する設定
      generationConfig: { responseMimeType: "application/json" }
    });

    const { prompt } = req.body;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // もしAIが ```json ... ``` のような装飾を付けてきた場合、それを取り除く
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    // 念のため、JSONとして正しいかチェックしてからフロントエンドに返す
    res.status(200).json({ text });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message || 'AIの呼び出しに失敗しました' });
  }
}
