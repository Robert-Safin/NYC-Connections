import type { FC } from "react";
import useStore from "../store";
type Props = {
  text: string;
};

const Card: FC<Props> = ({ text }) => {
  const { selection, add } = useStore();
  return (
    <div
      key={text}
      className={`cursor-pointer rounded-md border-[1px] transition-colors duration-700

        ${selection.has(text) ? "bg-slate-400" : "bg-slate-200"}
      `}
      onClick={() => add(text)}
    >
      <p className="font-sans text-[24px] text-center py-12">{text}</p>
    </div>
  );
};

export default Card;
