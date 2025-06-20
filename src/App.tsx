import { useState } from 'react';
import GameCanvas from './GameCanva';
import RegisterMenu from './game/components/RegisterMenu';

function App() {
  const [playerName, setPlayerName] = useState<string | null>(null);

  const handleRegister = (name: string) => {
    setPlayerName(name);

  };

  return (
    <div>
      {playerName ? (
        <GameCanvas />
      ) : (
        <RegisterMenu onContinue={handleRegister} />
      )}
    </div>
  );
}

export default App;
