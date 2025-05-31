export type LlmGame = {
  words: Array<string>;
  answers: Array<{ answerDescription: string; words: Array<string> }>;
};

export type HistoricGame = LlmGame & {
  contest: string;
  date: string;
  difficulty: number;
};
