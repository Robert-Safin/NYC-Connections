import type { FC } from "react";
import Card from "./Card";

type Props = {
  words: Array<string>;
};

const Board: FC<Props> = ({ words }) => {
  return (
    <div
      className={`grid grid-cols-4 gap-x-8 gap-y-8 transition-colors duration-1000

    `}
    >
      {words.map((word) => (
        <Card key={word} text={word} />
      ))}
    </div>
  );
};

export default Board;
