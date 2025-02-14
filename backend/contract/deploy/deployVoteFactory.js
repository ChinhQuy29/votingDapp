import Web3 from "web3";
import fs from 'fs';

const voteFactory_ABI= JSON.parse(fs.readFileSync("../voteFactory_ABI.json", "utf-8"));
const voteFactory_Bytecode= fs.readFileSync("../voteFactory_Bytecode.txt", "utf-8");

const web3= new Web3("http://127.0.0.1:7545");

const deployVoteFactoryContract = async () => {
    const accounts= await web3.eth.getAccounts();
    const admin= accounts[0];

    console.log("Vote Factory deployed from address: ", admin);
    const contract= new web3.eth.Contract(voteFactory_ABI);

    const deployment= await contract
        .deploy({ data: voteFactory_Bytecode })
        .send({ from: admin, gas: 3000000 });
    
    console.log("Vote Factory contract deployed at address: ", deployment.options.address);
}

deployVoteFactoryContract().catch(console.error);