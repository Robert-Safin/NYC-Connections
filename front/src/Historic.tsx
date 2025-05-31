import { useEffect } from "react";
import useStore from "./store";
import Board from "./components/Board";
import Groups from "./components/Groups";
import Buttons from "./components/Buttons";

function Historic() {
  const { game, setGame, incorrect, oneAway } = useStore();

  useEffect(() => {
    async function getGame() {
      const res = await fetch("http://localhost:3000/start_historic");
      const game = await res.json();
      setGame(game);
    }
    getGame();
  }, [setGame]);
  console.log(game);

  return (
    <div
      className={`relative w-full h-screen px-[24px] py-[24px] transition-colors duration-700
        ${incorrect ? "bg-red-300" : "bg-slate-50 "}
    `}
    >
      <div className="absolute bottom-8 right-8 rounded-md border-[1px] bg-slate-300">
        {oneAway && <p className="text-[18px] px-3 py-6">One away!</p>}
      </div>
      <Groups />
      {game && <Board words={game.words} />}
      <Buttons />
    </div>
  );
}

export default Historic;
