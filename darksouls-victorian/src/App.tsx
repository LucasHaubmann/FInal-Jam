import GameEngine from "./game/core/GameEngine";
import sketch from "./game/core/sketch";

function App() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ color: "#fff", fontFamily: "serif" }}>Dark Souls: Victorian</h1>
      <GameEngine sketch={sketch} />
    </div>
  );
}

export default App;
