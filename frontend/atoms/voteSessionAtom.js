import { atom } from "recoil";

const voteSessionAtom = atom({
    key: "voteSessionAtom",
    default: {
        "voteId": null,
        "voteContract": "",
        "organizer": "",
        "purpose": "",
        "category": "",
        "isPublic": null,
        "isOpen": null
    },
})

export default voteSessionAtom