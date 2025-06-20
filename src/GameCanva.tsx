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
        backgroundColor: '#121212',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <div
        ref={sketchRef}
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -145%)',
          width: '1280px',
          height: '720px',
        }}
      />
    </div>
  );
};

export default GameCanvas;
