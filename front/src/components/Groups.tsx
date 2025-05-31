import useStore from "../store";

const Groups = () => {
  const { correctGroups } = useStore();

  const bgColors = [
    "bg-red-100",
    "bg-yellow-200",
    "bg-blue-300",
    "bg-purple-400",
  ];

  return (
    <div className="flex flex-col w-full items-center text-[24px] space-y-8 mb-8">
      {correctGroups.map((group, i) => (
        <div
          className={`flex flex-col items-center justify-center rounded-md border-[1px] h-[132px] w-full ${bgColors[i]}`}
          key={i}
        >
          <h1 className="font-bold text-center">{group.answerDescription}</h1>
          <div className="flex space-x-2 w-full items-center justify-center">
            {group.words.map((word, i) => (
              <p key={i}>{word}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Groups;
