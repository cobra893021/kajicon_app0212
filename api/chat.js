// api/chat.js (CommonJS形式に修正)
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // POSTメソッド以外はエラーを返す
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // APIキーがない場合のエラーハンドリング
    if (!apiKey) {
      return res.status(500).json({ error: 'APIキーが設定されていません' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const { prompt } = req.body;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message || 'AIの呼び出しに失敗しました' });
  }
};
