import { useEffect, useState } from "react";
import useStore from "./store";
import Board from "./components/Board";
import Groups from "./components/Groups";
import Buttons from "./components/Buttons";

function Historic() {
  const { game, setGame, incorrect, oneAway } = useStore();
  const [deadBackend, setDeadBackend] = useState<boolean>(false);

  useEffect(() => {
    async function getGame() {
      try {
        const res = await fetch("http://localhost:3000/start_historic");
        const game = await res.json();
        setGame(game);
      } catch (error) {
        console.log(error);
        setDeadBackend(true);
      }
    }
    getGame();
  }, [setGame]);

  return (
    <>
      {!deadBackend ? (
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
      ) : (
        <h4 className="text-[28px] mt-[20px] font-bold text-center">Ensure backend is running</h4>
      )}
    </>
  );
}

export default Historic;
