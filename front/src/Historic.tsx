import { useEffect, useState } from "react";
import type { HistoricGame } from "./types/Games";

function Historic() {
  const [game, setGame] = useState<HistoricGame>();
  useEffect(() => {
    async function getGame() {
      const res = await fetch("http://localhost:3000/start_historic");
      const game = await res.json();
      setGame(game);
    }
    getGame();
  }, []);
  console.log(game);
  return (
    <>
      <p>historic</p>
    </>
  );
}

export default Historic;
