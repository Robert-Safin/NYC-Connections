import { useEffect, useState } from "react";
import useStore from "./store";
import Groups from "./components/Groups";
import Board from "./components/Board";
import Buttons from "./components/Buttons";

function LLM() {
  const { game, setGame, oneAway, incorrect } = useStore();
  const [retries, setRetries] = useState<number>(-1);
  const [modelNameError, setModelNameError] = useState<boolean>(false);
  const [deadBackend, setDeadBackend] = useState<boolean>(false);

  useEffect(() => {
    async function getGame() {
      try {
        setRetries((prev) => prev + 1);
        const res = await fetch("http://localhost:3000/start_llm");
        if (res.status === 400) {
          setModelNameError(true);
          return;
        }
        if (res.status === 500) {
          await getGame();
          return;
        }
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
          {game ? (
            <Board words={game.words} />
          ) : (
            <div className="flex flex-col text-[20px] font-bold">
              {!modelNameError ? (
                <>
                  <h4>
                    Generating game. May take multiple attempts due to
                    hallucinations.
                  </h4>
                  <p>Attempt: {retries}</p>
                </>
              ) : (
                <>
                  <p>
                    User error: could not connect to ollama (missing/invalid
                    model name)
                  </p>
                </>
              )}
            </div>
          )}
          <Buttons />
        </div>
      ) : (
        <h4 className="text-[28px] mt-[20px] font-bold text-center">Ensure backend is running</h4>
      )}
    </>
  );
}

export default LLM;
