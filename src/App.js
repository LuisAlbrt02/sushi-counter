import { useState } from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import './SushiCounter.css';

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

  const CounterCard = ({ title, count, setCount, variant }) => (
    <div className={`card ${variant}`}>
      <button className="btn minus" onClick={() => setCount(Math.max(0, count - 1))}>
        <Minus size={22} />
      </button>

      <h2>{title}</h2>
      <span className="count">{count}</span>

      <button className="btn plus" onClick={() => setCount(count + 1)}>
        <Plus size={22} />
      </button>
    </div>
  );

  return (
    <div className="app">
      <h1>🍣 Contador de Sushi</h1>
      <p className="subtitle">Lleva el control de tus piezas</p>

      <div className="grid">
        <CounterCard title="Rolls" count={rolls} setCount={setRolls} variant="red" />
        <CounterCard title="Sashimis" count={sashimis} setCount={setSashimis} variant="orange" />
        <CounterCard title="Otros" count={otros} setCount={setOtros} variant="pink" />

        <div className="card total">
          <h2>Total</h2>
          <span className="count big">{total}</span>
          <p>piezas</p>
        </div>
      </div>

      <button className="reset" onClick={resetAll}>
        <RotateCcw size={18} />
        Reiniciar todo
      </button>
    </div>
  );
}
