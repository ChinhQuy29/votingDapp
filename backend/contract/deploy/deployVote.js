import Web3 from "web3";
import fs from 'fs';

const vote_ABI = JSON.parse(fs.readFileSync("../vote_ABI.json", "utf-8"));
const vote_Bytecode = fs.readFileSync("../vote_Bytecode.txt", "utf-8");

const web3 = new Web3("http://127.0.0.1:7545");

const deployVoteContract = async () => {
    const accounts = await web3.eth.getAccounts();
    const admin = accounts[0];

    console.log("Vote deployed from address: ", admin);

    const voteContract = new web3.eth.Contract(vote_ABI);
    const deployment = await voteContract
        .deploy({ data: vote_Bytecode, arguments: [] })
        .send({ from: admin, gas: 3000000 });

    console.log("Vote contract deployed at address: ", deployment.options.address);
};

deployVoteContract().catch(console.error);

