import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import { sketch } from './game/core/sketch';

const GameCanvas: React.FC = () => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p5Instance = new p5(sketch, sketchRef.current!);
    return () => p5Instance.remove();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',      // altura total da tela
        backgroundColor: '#121212', // cor de fundo mais elegante
      }}
    >
      <div ref={sketchRef} />
    </div>
  );
};

export default GameCanvas;
