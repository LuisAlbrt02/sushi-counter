import { useState } from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';

export default function SushiCounter() {
  const [rolls, setRolls] = useState(0);
  const [sashimis, setSashimis] = useState(0);
  const [otros, setOtros] = useState(0);

  const total = rolls + sashimis + otros;

  const resetAll = () => {
    setRolls(0);
    setSashimis(0);
    setOtros(0);
  };

  const CounterCard = ({ title, count, setCount, color }) => (
    <div className={`${color} rounded-2xl p-6 shadow-lg relative h-48 flex flex-col items-center justify-center`}>
      <button
        onClick={() => setCount(Math.max(0, count - 1))}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-40 text-white rounded-full p-3 transition-all"
      >
        <Minus size={24} />
      </button>
      <button
        onClick={() => setCount(count + 1)}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-40 text-white rounded-full p-3 transition-all"
      >
        <Plus size={24} />
      </button>
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      <div className="text-6xl font-bold text-white">{count}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">🍣 Contador de Sushi</h1>
          <p className="text-slate-300 text-lg">Lleva el control de tus piezas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <CounterCard
            title="Rolls"
            count={rolls}
            setCount={setRolls}
            color="bg-gradient-to-br from-red-500 to-red-600"
          />
          <CounterCard
            title="Sashimis"
            count={sashimis}
            setCount={setSashimis}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
          />
          <CounterCard
            title="Otros"
            count={otros}
            setCount={setOtros}
            color="bg-gradient-to-br from-pink-500 to-pink-600"
          />
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center h-48">
            <h2 className="text-2xl font-bold text-white mb-2">Total</h2>
            <div className="text-7xl font-bold text-white">{total}</div>
            <p className="text-white text-opacity-90 mt-2">piezas</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={resetAll}
            className="bg-white hover:bg-slate-100 text-slate-800 font-semibold px-6 py-3 rounded-full shadow-lg transition-all inline-flex items-center gap-2"
          >
            <RotateCcw size={20} />
            Reiniciar Todo
          </button>
        </div>
      </div>
    </div>
  );
}