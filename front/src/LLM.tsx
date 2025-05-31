import { useEffect, useState } from "react";
import type { LlmGame } from "./types/Games";

function LLM() {
  const [game, setGame] = useState<LlmGame>();
  useEffect(() => {
    async function getGame() {
      const res = await fetch("http://localhost:3000/start_llm");
      const game = await res.json();
      setGame(game)
    }
    getGame();
  }, []);
  console.log(game);

  return (
    <>
      <p>llm</p>
    </>
  );
}

export default LLM;
