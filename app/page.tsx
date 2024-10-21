import TextCompare from '../components/TextCompare';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">文本对比工具</h1>
      <TextCompare />
    </div>
  );
}