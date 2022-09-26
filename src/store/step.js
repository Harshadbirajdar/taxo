import create from "zustand";

import { devtools, persist } from "zustand/middleware";

const stepStore = (set) => ({
  current: "Form",

  setStep: (step) => {
    set(() => ({
      current: step,
    }));
  },
});

const usestepStore = create(devtools(stepStore));

export default usestepStore;
