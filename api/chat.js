// api/chat.js (ES module形式に完全修正)
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // POSTメソッド以外はエラーを返す
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // APIキーがない場合のエラーハンドリング
    if (!apiKey) {
      console.error("Environment Variable GEMINI_API_KEY is missing");
      return res.status(500).json({ error: 'APIキーが設定されていません' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // 最新の gemini-2.0-flash を使用
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const { prompt } = req.body;
    
    // AIにリクエストを送信
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 成功したら結果を返す
    res.status(200).json({ text });
  } catch (error) {
    console.error("Server Error details:", error);
    res.status(500).json({ error: error.message || 'AIの呼び出しに失敗しました' });
  }
}
