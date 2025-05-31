import { create } from "zustand";

export type Group = {
  answerDescription: string;
  words: Array<string>;
};

export type LlmGame = {
  words: Array<string>;
  answers: Array<Group>;
};

export type HistoricGame = LlmGame & {
  contest: string;
  date: string;
  difficulty: number;
};

type Store = {
  game: LlmGame | HistoricGame | undefined;
  setGame: (game: LlmGame | HistoricGame) => void;
  selection: Set<string>;
  add: (clicked: string) => void;
  verify: () => void;
  incorrect: boolean;
  setIncorrect: (val: boolean) => void;
  correctGroups: Group[];
  oneAway: boolean;
  setOneAway: (val: boolean) => void;
};

const useStore = create<Store>((set) => ({
  game: undefined,

  setGame: (game) => {
    const shuffledWords = [...game.words];
    for (let i = shuffledWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledWords[i], shuffledWords[j]] = [
        shuffledWords[j],
        shuffledWords[i],
      ];
    }

    set({ game: { ...game, words: shuffledWords }, correctGroups: [] });
  },

  selection: new Set(),

  add: (clicked) =>
    set((state) => {
      const updated = new Set(state.selection);
      if (updated.has(clicked)) {
        updated.delete(clicked);
      } else {
        if (updated.size >= 4) return { selection: updated };
        updated.add(clicked);
      }
      return { selection: updated };
    }),

  incorrect: false,
  setIncorrect: (val) => set({ incorrect: val }),

  correctGroups: [],

  verify: () =>
    set((state) => {
      if (state.selection.size !== 4 || !state.game) return {};

      const selected = Array.from(state.selection);

      const matchedGroup = state.game.answers.find((answer) => {
        if (answer.words.length !== 4) return false;
        const answerSet = new Set(answer.words);
        return selected.every((word) => answerSet.has(word));
      });

      if (matchedGroup) {
        const updatedWords = state.game.words.filter(
          (word) => !matchedGroup.words.includes(word),
        );

        return {
          incorrect: false,
          oneAway: false,
          selection: new Set(),
          game: {
            ...state.game,
            words: updatedWords,
          },
          correctGroups: [...state.correctGroups, matchedGroup],
        };
      }

      const isOneAway = state.game.answers.some((answer) => {
        const answerSet = new Set(answer.words);
        const matchCount = selected.filter((word) =>
          answerSet.has(word),
        ).length;
        return matchCount === 3;
      });

      if (isOneAway) {
        set({ oneAway: true });
        setTimeout(() => set({ oneAway: false }), 3000);
      }

      setTimeout(() => set({ incorrect: false }), 3000);
      return { incorrect: true };
    }),

  oneAway: false,
  setOneAway: (val) => set({ oneAway: val }),
}));

export default useStore;
