// api/chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // セキュリティ対策：POSTメソッド以外は受け付けない
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Vercelの管理画面で設定する環境変数からAPIキーを読み込む（ブラウザからは見えません）
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // 最新の gemini-2.0-flash を使用
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    const { prompt } = req.body; // フロントエンドから送られてきたテキスト
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 結果をフロントエンドに返す
    res.status(200).json({ text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AIの呼び出しに失敗しました' });
  }
}
