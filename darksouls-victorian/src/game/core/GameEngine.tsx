import { useEffect, useRef } from "react";
import p5 from "p5";

interface GameEngineProps {
  sketch: (p: p5) => void;
}

export default function GameEngine({ sketch }: GameEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const instance = new p5(sketch, containerRef.current!);
    return () => instance.remove();
  }, [sketch]);

  return <div ref={containerRef} />;
}
