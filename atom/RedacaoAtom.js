import { atom } from 'recoil'

export const postIdState = atom({
    key: "postIdState", // unique ID (with respect to other atoms/selectors)
    default: "id", // default value (aka initial value)
  });