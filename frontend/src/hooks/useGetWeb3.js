import Web3 from "web3";

const useGetWeb3 = () => {
    const web3 = window.ethereum ? new Web3(window.ethereum) : new Web3("http://127.0.0.1:7545");

    return { web3 }
}

export default useGetWeb3;