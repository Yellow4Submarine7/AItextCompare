import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

export async function POST(request: Request) {
  const { sourceText, targetText, selectedText } = await request.json();

  const prompt = `源文本: "${sourceText}"
目标文本: "${targetText}"
在源文本中选中的句子或段落: "${selectedText}"

任务：
1. 分析源文本中选中的句子或段落，理解其核心含义。
2. 在目标文本中寻找与选中内容**高度相似且连续**的文本段，避免包含不相关的额外内容。
3. 返回的相似文本段应尽可能与选中内容在长度和内容上匹配。
4. 返回找到的相似文本段，以及它在目标文本中的**准确起始和结束字符索引（基于字符）**。

请以 JSON 格式返回结果，格式如下：
{
  "similar_text": "找到的相似文本段",
  "start": 起始位置,
  "end": 结束位置,
  "explanation": "简要解释为什么这个文本段被认为是最相似的"
}

只返回 JSON 对象，不要有其他文本或格式。`;

  try {
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0].message.content;
    if (content) {
      // 尝试清理内容并解析 JSON
      const cleanedContent = content.replace(/```json\s*|\s*```/g, '').trim();
      const result = JSON.parse(cleanedContent);
      return NextResponse.json(result);
    }
  } catch (error: any) {
    console.error('API调用错误:', error);
    return NextResponse.json({ error: 'API调用失败', details: error.message }, { status: 500 });
  }
}
