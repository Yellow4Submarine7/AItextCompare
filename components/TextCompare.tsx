"use client";

import { useState, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';
import ColorPicker from './ColorPicker';

interface Highlight {
  start: number;
  end: number;
  color: string;
}

interface ConsoleMessage {
  type: 'selected' | 'highlighted';
  side: 'left' | 'right';
  text: string;
  start: number;
  end: number;
}

interface Match {
  similar_text: string;
  start: number;
  end: number;
  explanation: string;
}

export default function TextCompare() {
  const defaultLeftText = `在一个遥远的小村庄里，住着一位老木匠。他的手艺精湛，村里几乎所有的家具都出自他的手。一天天过去，他年纪越来越大，手也不再那么灵活了。有一天，一个年轻人来找他，想跟他学习木匠的技艺。老木匠看了看年轻人，问道："你为什么想学这门手艺？"年轻人回答道："因为我想和您一样，能创造出那么精美的家具。"老木匠笑了笑，说："手艺不仅仅是做东西，更是一种生活的态度。"于是，老木匠决定教他，年轻人从那天起，每天都到老木匠的作坊里学。几年后，年轻人成为了村里最好的木匠，而老木匠则在看到年轻人的成就后，安心地退休了。`;
  const defaultRightText = `在一个宁静偏远的小村庄里，住着一位技艺精湛的老木匠。他拥有无与伦比的技艺，村里几乎所有的家具都出自他的巧手。岁月流逝，他的年纪渐渐增长，曾经灵活的双手如今变得有些笨拙。

一天，一位年轻人前来拜访，恳求能向他学习这门精湛的木匠技艺。老木匠端详着年轻人，平静地问："你为什么想学这门手艺？"

年轻人回答："Because I want to be like you and create such exquisite furniture."

老木匠微笑着说："手艺不仅是制造物件，它更是一种生活态度。"

老木匠决定收下他为徒。从那天起，年轻人每天都准时到作坊勤奋学习。数年后，年轻人成为村中最杰出的木匠，而老木匠在见证他的成就后，心满意足地退休了。`;

  const [leftText, setLeftText] = useState(defaultLeftText);
  const [rightText, setRightText] = useState(defaultRightText);
  const [leftHighlights, setLeftHighlights] = useState<Highlight[]>([]);
  const [rightHighlights, setRightHighlights] = useState<Highlight[]>([]);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [showNotification, setShowNotification] = useState(false);
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const leftTextareaRef = useRef<HTMLTextAreaElement>(null);
  const rightTextareaRef = useRef<HTMLTextAreaElement>(null);
  const leftBackdropRef = useRef<HTMLDivElement>(null);
  const rightBackdropRef = useRef<HTMLDivElement>(null);
  const [isClearMode, setIsClearMode] = useState(false);

  const handleTextChange = (side: 'left' | 'right', value: string) => {
    if (side === 'left') {
      setLeftText(value);
    } else {
      setRightText(value);
    }
  };

  // 保留原有的 API 调用，使用 AI 进行语义匹配
  const findSimilarSentence = async (sourceSide: 'left' | 'right', selectedText: string): Promise<Match | null> => {
    const sourceText = sourceSide === 'left' ? leftText : rightText;
    const targetText = sourceSide === 'left' ? rightText : leftText;

    try {
      const response = await fetch('/api/findSimilarSentence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sourceText, targetText, selectedText }),
      });

      if (!response.ok) {
        throw new Error('API请求失败');
      }

      const result = await response.json();
      return result; // 预期格式为 { similar_text: '...', start: ..., end: ..., explanation: '...' }
    } catch (error) {
      console.error('API调用错误:', error);
      return null;
    }
  };

  // 使用模糊匹配在目标文本中查找相似文本的位置
  const findSimilarTextPosition = (text: string, pattern: string) => {
    // 预处理文本，移除空白字符和标点符号
    const preprocess = (str: string) => str.replace(/[\s\p{P}]/gu, '').toLowerCase();

    const processedText = preprocess(text);
    const processedPattern = preprocess(pattern);

    // 使用 Fuse.js 进行模糊匹配
    const fuse = new Fuse([{ text: processedText }], {
      keys: ['text'],
      includeScore: true,
      threshold: 0.3, // 可根据需要调整阈值
      distance: 1000,
    });

    const results = fuse.search(processedPattern);

    if (results.length > 0) {
      const bestMatch = results[0];
      // 由于我们只传入了整个文本，索引为 0
      // 需要在原始文本中找到匹配的起始位置

      // 使用字符串搜索来找到匹配的位置
      const index = text.indexOf(pattern);

      if (index !== -1) {
        return { start: index, end: index + pattern.length };
      } else {
        // 如果直接找不到，尝试更宽松的匹配
        const index = text.toLowerCase().indexOf(pattern.toLowerCase());
        if (index !== -1) {
          return { start: index, end: index + pattern.length };
        } else {
          console.error('在目标文本中未找相似的文本段');
          return { start: -1, end: -1 };
        }
      }
    } else {
      console.error('未找到相似的文本段');
      return { start: -1, end: -1 };
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setIsClearMode(false);
  };

  const handleClearHighlight = () => {
    setIsClearMode(true);
    setSelectedColor('#FFFFFF');
  };

  const applyHighlight = async (side: 'left' | 'right') => {
    const textareaRef = side === 'left' ? leftTextareaRef : rightTextareaRef;

    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;

      if (start !== end) {
        if (isClearMode) {
          // 清除模式：移除选中区域的高亮
          const setHighlights = side === 'left' ? setLeftHighlights : setRightHighlights;
          setHighlights(prev => prev.filter(h => h.start >= end || h.end <= start));
        } else if (selectedColor !== '#FFFFFF') {
          // 正常高亮模式
          const selectedText = (side === 'left' ? leftText : rightText).substring(start, end);
          const newHighlight = { start, end, color: selectedColor };

          // 更新当前侧的高亮
          const setHighlights = side === 'left' ? setLeftHighlights : setRightHighlights;
          setHighlights(prev => [...prev, newHighlight]);

          // 添加选中的文本到控制台
          setConsoleMessages(prev => [...prev, {
            type: 'selected',
            side,
            text: selectedText,
            start,
            end
          }]);

          // 查找并高亮另一侧的相似文本段
          const similarResult = await findSimilarSentence(side, selectedText);

          // 添加 AI 请求和响应到控制台
          setConsoleMessages(prev => [
            ...prev,
            {
              type: 'selected',
              side: 'AI 请求',
              text: JSON.stringify({ sourceText: side === 'left' ? leftText : rightText, targetText: side === 'left' ? rightText : leftText, selectedText }),
              start: 0,
              end: 0,
            },
            {
              type: 'highlighted',
              side: 'AI 响应',
              text: JSON.stringify(similarResult),
              start: 0,
              end: 0,
            },
          ]);

          if (similarResult && similarResult.similar_text) {
            const otherSide = side === 'left' ? 'right' : 'left';
            const setOtherHighlights = otherSide === 'left' ? setLeftHighlights : setRightHighlights;
            const targetText = otherSide === 'left' ? leftText : rightText;

            // 使用 findSimilarTextPosition 找到相似文本的位置
            const { start: matchStart, end: matchEnd } = findSimilarTextPosition(targetText, similarResult.similar_text);

            if (matchStart !== -1 && matchEnd !== -1) {
              setOtherHighlights(prev => [...prev, {
                start: matchStart,
                end: matchEnd,
                color: selectedColor
              }]);

              // 添加高亮的文本到控制台
              setConsoleMessages(prev => [...prev, {
                type: 'highlighted',
                side: otherSide,
                text: targetText.substring(matchStart, matchEnd),
                start: matchStart,
                end: matchEnd
              }]);

              // 滚动到新高亮的位置
              setTimeout(() => {
                const backdropRef = otherSide === 'left' ? leftBackdropRef.current : rightBackdropRef.current;
                if (backdropRef) {
                  const highlightElements = backdropRef.querySelectorAll('mark');
                  const lastHighlight = highlightElements[highlightElements.length - 1] as HTMLElement;
                  if (lastHighlight) {
                    lastHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }
              }, 0);
            } else {
              console.error('在目标文本中未找到相似的文本段');
              setShowNotification(true);
              setTimeout(() => setShowNotification(false), 3000);
            }
          } else {
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000); // 3秒后隐藏通知
          }
        }
      }
    }
  };

  const clearAllHighlights = () => {
    setLeftHighlights([]);
    setRightHighlights([]);
    setConsoleMessages([]);
  };

  const escapeHtml = (text: string) => {
    return text.replace(/[&<>"']/g, (match) => {
      switch (match) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '"':
          return '&quot;';
        case "'":
          return '&#039;';
        default:
          return match;
      }
    });
  };

  const resetTexts = () => {
    setLeftText(defaultLeftText);
    setRightText(defaultRightText);
    setLeftHighlights([]);
    setRightHighlights([]);
    setConsoleMessages([]);
  };

  useEffect(() => {
    const applyHighlights = (text: string, highlights: Highlight[], backdrop: HTMLDivElement | null) => {
      if (!backdrop) return;

      // 按开始索引排序高亮数组
      const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

      let highlightedText = '';
      let pos = 0;

      sortedHighlights.forEach((highlight, index) => {
        // 添加高亮前的文本
        const beforeHighlight = text.substring(pos, highlight.start);
        highlightedText += escapeHtml(beforeHighlight);

        // 添加高亮的文本，添加唯一的 id
        const highlightedPart = text.substring(highlight.start, highlight.end);
        highlightedText += `<mark id="highlight-${index}" style="background-color: ${highlight.color}; color: inherit;">${escapeHtml(highlightedPart)}</mark>`;

        // 更新当前位置
        pos = highlight.end;
      });

      // 添加最后一个高亮之后的文本
      const afterLastHighlight = text.substring(pos);
      highlightedText += escapeHtml(afterLastHighlight);

      // 处理换行符
      backdrop.innerHTML = highlightedText.replace(/\n/g, '<br/>');
    };

    applyHighlights(leftText, leftHighlights, leftBackdropRef.current);
    applyHighlights(rightText, rightHighlights, rightBackdropRef.current);
  }, [leftText, rightText, leftHighlights, rightHighlights]);

  return (
    <div className="flex flex-col space-y-4 font-sans">
      <div className="flex justify-between items-center">
        <ColorPicker 
          selectedColor={selectedColor} 
          onColorChange={handleColorChange}
          onClearHighlight={handleClearHighlight}
        />
        <div>
          <button 
            onClick={clearAllHighlights}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors mr-2"
          >
            清空所有高亮
          </button>
          <button 
            onClick={resetTexts}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            重置文本
          </button>
        </div>
      </div>
      {showNotification && (
        <div className="fixed top-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md">
          未找到相似的句子
        </div>
      )}
      <div className="flex space-x-4">
        {['left', 'right'].map((side) => (
          <div key={side} className="w-1/2 relative h-96">
            <div 
              ref={side === 'left' ? leftBackdropRef : rightBackdropRef}
              className="absolute inset-0 w-full h-full p-4 border rounded-lg whitespace-pre-wrap font-sans overflow-auto" 
              style={{ 
                backgroundColor: 'white', 
                zIndex: 1, 
                pointerEvents: 'none',
                wordWrap: 'break-word',
              }}
            ></div>
            <textarea
              ref={side === 'left' ? leftTextareaRef : rightTextareaRef}
              className="absolute inset-0 w-full h-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none font-sans"
              style={{ 
                color: 'transparent',
                caretColor: 'black',
                backgroundColor: 'transparent',
                zIndex: 2,
              }}
              value={side === 'left' ? leftText : rightText}
              onChange={(e) => handleTextChange(side as 'left' | 'right', e.target.value)}
              onMouseUp={() => applyHighlight(side as 'left' | 'right')}
            />
          </div>
        ))}
      </div>
      {/* 控制台部分 */}
      <div className="mt-4 p-4 bg-gray-100 rounded-lg max-h-60 overflow-auto">
        <h3 className="font-bold mb-2">控制台</h3>
        {consoleMessages.map((message, index) => (
          <div key={index} className="mb-2">
            <span className="font-semibold">{message.type === 'selected' ? '选中' : message.type === 'highlighted' ? '高亮' : message.side}: </span>
            <span>{message.text}</span>
            {message.start !== 0 && message.end !== 0 && (
              <span className="text-gray-500"> (开始: {message.start}, 结束: {message.end})</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
