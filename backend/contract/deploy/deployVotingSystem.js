import Web3 from 'web3'
import fs from 'fs'

const web3= new Web3("http://127.0.0.1:7545");

const votingSystemABI= JSON.parse(fs.readFileSync("../votingSystem_ABI.json", "utf-8"));
const votingSystemBytecode= fs.readFileSync("../votingSystem_Bytecode.txt", "utf-8");

const deployVotingSystemContract = async () => {
    const accounts= await web3.eth.getAccounts();
    const admin= accounts[0];

    console.log("Voting System deployed from address: ", admin);

    const contract= new web3.eth.Contract(votingSystemABI);

    const deployment= await contract
        .deploy({ data: votingSystemBytecode, arguments: ["0xafBd249604D3ccbD0bE81512F7E72f77e7F08E4e"]})
        .send({ from: admin, gas: 3000000 });
    
    console.log("Voting System contract deployed at address: ", deployment.options.address);
};

deployVotingSystemContract().catch(console.error);

