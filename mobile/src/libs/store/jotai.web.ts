import { atom } from "jotai";

export const atomWithSecureStore = <T>(_key: string, initialValue: T) => {
  const baseAtom = atom(initialValue);
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (_get, set, update) => {
      set(baseAtom, update as T);
    },
  );
  return derivedAtom;
};
