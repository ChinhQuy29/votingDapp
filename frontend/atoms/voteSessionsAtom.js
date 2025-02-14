import { atom } from "recoil";

const voteSessionsAtom = atom({
    key: "voteSessionsAtom",
    default: []
})

export default voteSessionsAtom;