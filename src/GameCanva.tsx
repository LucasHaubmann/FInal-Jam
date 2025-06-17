import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import { sketch } from './game/core/sketch';

const GameCanvas: React.FC = () => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p5Instance = new p5(sketch, sketchRef.current!);
    return () => p5Instance.remove(); // limpa o canvas ao desmontar
  }, []);

  return <div ref={sketchRef} />;
};

export default GameCanvas;
