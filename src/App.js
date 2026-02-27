import { useState, useEffect } from 'react';
import { Plus, Minus, RotateCcw, Copy, Check } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, update, remove } from 'firebase/database';
import './App.css';
import sushiImg from './images/maki.png';
import makiImg from './images/sushi.png';
import sashimiImg from './images/sashimi.png';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDj_abc123xyz456...",
  authDomain: "sushi-counter-b37d5.firebaseapp.com",
  databaseURL: "https://sushi-counter-b37d5-default-rtdb.europe-west1.firebaseatabase.app",
  projectId: "sushi-counter-b37d5",
  storageBucket: "sushi-counter-b37d5.appspot.com",
  messagingSenderId: "123456789012345",
  appId: "1:123456789012:web:abcdef1234567890"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function SushiCounter() {
  //const sushiImg = '/sushi.png';
  //const makiImg = '/maki.png';
  //const sashimiImg = '/sashimi.png';
  const [playerName, setPlayerName] = useState('');
  const [lobbyCode, setLobbyCode] = useState('');
  const [currentLobby, setCurrentLobby] = useState(null);
  const [players, setPlayers] = useState({});
  const [copied, setCopied] = useState(false);

  const [rolls, setRolls] = useState(0);
  const [sashimis, setSashimis] = useState(0);
  const [nigiris, setNigiris] = useState(0);

  const total = rolls + sashimis + nigiris;

  // Generar código de lobby aleatorio
  const generateLobbyCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Crear nuevo lobby
  const createLobby = () => {
    if (!playerName.trim()) {
      alert('Ingresa tu nombre primero');
      return;
    }
    const code = generateLobbyCode();
    const lobbyRef = ref(database, `lobbies/${code}`);
    set(lobbyRef, {
      createdAt: Date.now(),
      players: {
        [playerName]: { rolls: 0, sashimis: 0, nigiris: 0 }
      }
    });
    setCurrentLobby(code);
    setLobbyCode(code);
  };

  // Unirse a un lobby existente
  const joinLobby = () => {
    if (!playerName.trim()) {
      alert('Ingresa tu nombre primero');
      return;
    }
    if (!lobbyCode.trim()) {
      alert('Ingresa el código del lobby');
      return;
    }
    const code = lobbyCode.toUpperCase();
    const playerRef = ref(database, `lobbies/${code}/players/${playerName}`);
    set(playerRef, { rolls: 0, sashimis: 0, nigiris: 0 });
    setCurrentLobby(code);
  };

  // Escuchar cambios en tiempo real
  useEffect(() => {
    if (!currentLobby) return;

    const playersRef = ref(database, `lobbies/${currentLobby}/players`);
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPlayers(data);
        // Actualizar los valores locales del jugador actual
        if (data[playerName]) {
          setRolls(data[playerName].rolls || 0);
          setSashimis(data[playerName].sashimis || 0);
          setNigiris(data[playerName].nigiris || 0);
        }
      }
    });

    return () => unsubscribe();
  }, [currentLobby, playerName]);

  // Actualizar valores en Firebase
  const updatePlayer = (field, value) => {
    if (!currentLobby) return;
    const playerRef = ref(database, `lobbies/${currentLobby}/players/${playerName}/${field}`);
    set(playerRef, Math.max(0, value));
  };

  const increment = (field, currentValue) => {
    const newValue = currentValue + 1;
    if (field === 'rolls') setRolls(newValue);
    else if (field === 'sashimis') setSashimis(newValue);
    else if (field === 'nigiris') setNigiris(newValue);
    updatePlayer(field, newValue);
  };

  const decrement = (field, currentValue) => {
    const newValue = Math.max(0, currentValue - 1);
    if (field === 'rolls') setRolls(newValue);
    else if (field === 'sashimis') setSashimis(newValue);
    else if (field === 'nigiris') setNigiris(newValue);
    updatePlayer(field, newValue);
  };

  const resetAll = () => {
    setRolls(0);
    setSashimis(0);
    setNigiris(0);
    if (currentLobby) {
      const playerRef = ref(database, `lobbies/${currentLobby}/players/${playerName}`);
      set(playerRef, { rolls: 0, sashimis: 0, nigiris: 0 });
    }
  };

  const leaveLobby = () => {
    if (currentLobby) {
      const playerRef = ref(database, `lobbies/${currentLobby}/players/${playerName}`);
      remove(playerRef);
    }
    setCurrentLobby(null);
    setLobbyCode('');
    setRolls(0);
    setSashimis(0);
    setNigiris(0);
    setPlayers({});
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentLobby);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const CounterCard = ({ title, count, field, image }) => (
    <div className="card red">
      <div className="card-image">
        <img src={image} alt={title} />
      </div>
      <h2>{title}</h2>
      <div className="card-content">
        <span className="count">{count}</span>
      </div>
      <div className="card-buttons">
        <button 
          className="btn minus" 
          onClick={() => decrement(field, count)}
          title="Restar"
        >
          <Minus size={20} />
        </button>
        <button 
          className="btn plus" 
          onClick={() => increment(field, count)}
          title="Sumar"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );

  // Pantalla inicial - Crear o unirse
  if (!currentLobby) {
    return (
      <div className="app">
        <h1>🍣 Contador de Sushi</h1>
        <p className="subtitle">Juega con tus amigos en tiempo real</p>

        <div className="login-container">
          <div className="login-card">
            <label>Tu nombre:</label>
            <input
              type="text"
              placeholder="Ej: Juan"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="input"
            />

            <button className="btn-primary" onClick={createLobby}>
              + Crear nuevo lobby
            </button>

            <div className="divider">O</div>

            <label>Código del lobby:</label>
            <input
              type="text"
              placeholder="XXXXXX"
              value={lobbyCode}
              onChange={(e) => setLobbyCode(e.target.value.toUpperCase())}
              className="input"
            />
            <button className="btn-primary secondary" onClick={joinLobby}>
              Unirse a un lobby
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla del juego
  return (
    <div className="app">
      <div className="header">
        <div>
          <h1>🍣 Contador de Sushi</h1>
          <p className="subtitle">Lobby: <strong>{currentLobby}</strong></p>
        </div>
        <button 
          className="copy-btn"
          onClick={copyToClipboard}
          title="Copiar código"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>

      <div className="grid">
        <CounterCard 
          title="Rolls" 
          count={rolls} 
          field="rolls"
          image={makiImg}
        />
        <CounterCard 
          title="Sashimis" 
          count={sashimis} 
          field="sashimis"
          image={sashimiImg}
        />
        <CounterCard 
          title="Nigiris" 
          count={nigiris} 
          field="nigiris"
          image={sushiImg}
        />

        <div className="card total">
          <div className="card-content">
            <h2>Total</h2>
            <span className="count big">{total}</span>
            <p>piezas</p>
          </div>
        </div>
      </div>

      <button className="reset" onClick={resetAll}>
        <RotateCcw size={18} />
        Reiniciar mis contadores
      </button>

      {/* Tabla de otros jugadores con ranking */}
      <div className="players-section">
        <h3>🏆 Ranking en vivo</h3>
        <div className="leaderboard">
          {Object.entries(players)
            .map(([name, stats]) => ({
              name,
              stats,
              total: (stats.rolls || 0) + (stats.sashimis || 0) + (stats.otros || 0)
            }))
            .sort((a, b) => b.total - a.total)
            .map(({ name, stats, total }, index) => {
              
              return (
                <div key={name} className={`player-row ${name === playerName ? 'current' : ''}`}>
                  <div className="rank-info">
                    <span className="position">#{index + 1}</span>
                    <span className="name">{name} {name === playerName && '(tú)'}</span>
                  </div>
                  <div className="stats">
                    <span className="stat">Rolls: {stats.rolls || 0}</span>
                    <span className="stat">Sashimis: {stats.sashimis || 0}</span>
                    <span className="stat">Otros: {stats.otros || 0}</span>
                    <span className="stat total-stat">
                      Total: <strong>{total}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <button className="leave-btn" onClick={leaveLobby}>
        Salir del lobby
      </button>
    </div>
  );
}