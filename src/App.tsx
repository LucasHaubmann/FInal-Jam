import { useState } from 'react';
import GameCanvas from './GameCanva';

function App() {
  const [started, setStarted] = useState(true); // true por enquanto, até termos menu

  return (
    <div>
      {started ? (
        <GameCanvas />
      ) : (
        <div style={{ textAlign: 'center', paddingTop: '100px' }}>
          <h1>Geometry Dash Clone</h1>
          <button onClick={() => setStarted(true)}>Iniciar</button>
        </div>
      )}
    </div>
  );
}

export default App;
