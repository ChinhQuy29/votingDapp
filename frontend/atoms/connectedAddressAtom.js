import { atom } from 'recoil'

const connectedAddressAtom = atom({
    key: "connectedAddressAtom",
    default: localStorage.getItem("connectedAddress")
});

export default connectedAddressAtom;