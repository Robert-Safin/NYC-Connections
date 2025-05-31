import { useState } from "react";
import useStore from "../store";

const Buttons = () => {
  const { game, verify } = useStore();
  const [hover, setHover] = useState(false);
  return (
    <div className="flex w-full justify-between items-center mt-[48px] ">
      <button
        className="text-[24px] mx-auto rounded-full border-[1px] px-12 py-4 cursor-pointer"
        onClick={() => {
          verify();
        }}
      >
        ENTER
      </button>
      <div className="relative">
        {hover && (
          <div className="absolute bg-slate-200 w-48 h-fit bottom-0 -left-48 border-[1px] rounded-md p-4 flex flex-col space-y-6">
            {game?.answers.map((ans, i) => (
              <p key={i}>{ans.answerDescription}</p>
            ))}
          </div>
        )}
        <button
          className="cursor-pointer border-[1px] rounded-full px-[20px]"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <p className="text-[40px] ">?</p>
        </button>
      </div>
    </div>
  );
};

export default Buttons;
