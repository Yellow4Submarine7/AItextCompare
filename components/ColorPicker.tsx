"use client";

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const colors = [
  '#FFFFFF', // 白色
  '#FFD700', // 金色
  '#FF6347', // 番茄红
  '#7FFFD4', // 碧绿色
  '#DDA0DD', // 梅红色
  '#90EE90', // 淡绿色
];

export default function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  return (
    <div className="flex justify-center space-x-2 mb-4">
      {colors.map((color) => (
        <button
          key={color}
          className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
          } ${color === '#FFFFFF' ? 'border border-gray-300' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => onColorChange(color)}
        />
      ))}
    </div>
  );
}
