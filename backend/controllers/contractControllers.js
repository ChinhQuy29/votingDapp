import Web3 from 'web3'
import fs from 'fs'
import 'dotenv';

const web3 = new Web3("http://127.0.0.1:7545");
const votingSystemABI = JSON.parse(fs.readFileSync("D:/VotingDApp/backend/contract/votingSystem_ABI.json", "utf-8"));
const voteFactoryABI = JSON.parse(fs.readFileSync("D:/VotingDApp/backend/contract/voteFactory_ABI.json", "utf-8"));
const voteABI = JSON.parse(fs.readFileSync("D:/VotingDApp/backend/contract/vote_ABI.json", "utf-8"));

const votingSystem_CA = "0x48dd82365389b34F659798fA62AD8E06308cF7EF";
const votingSystemContract = new web3.eth.Contract(votingSystemABI, votingSystem_CA);

const getCandidates = async (req, res) => {
    const { fromAddress, voteContract } = req.body;
    try {

        if (!voteContract) {
            console.log("voteContract missing")
            return res.status(404).send({
                message: "voteContract missing"
            })
        }

        const vote = new web3.eth.Contract(voteABI, voteContract);
        const candidates = await vote.methods.getCandidates().call({ from: fromAddress, gas: 3000000 });
        if (!candidates) {
            return res.status(404).send({
                message: "Candidates not found"
            })
        }

        const candidatesArray = [];
        for (let i = 0; i < candidates.length; i++) {
            const candidate = candidates[i];
            const transformedCandidate = {
                candidateId: Number(candidate.id),
                candidateName: candidate.name.toString(),
                candidateVoteCount: Number(candidate.voteCount),
            }
            candidatesArray.push(transformedCandidate);
        }

        return res.status(200).send({
            candidates: candidatesArray
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            message: error.message,
        })
    }
}

const createVote = async (req, res) => {
    const { organizer, purpose, category, isPublic } = req.body;

    try {
        if (!purpose || !category) {
            return res.status(404).send({
                message: "Missing Information"
            })
        }

        const receipt = await votingSystemContract.methods
            .createVote(purpose, category, isPublic)
            .send({ from: organizer, gas: 3000000 });

        const event = receipt.events.votingSessionCreated;
        if (event) {
            const { voteId,
                voteContract,
                organizer,
                purpose,
                category,
                isPublic,
            } = event.returnValues;

            console.log("Vote contract: ", voteContract.toString());
            return res.status(200).send({
                message: "Voting session created successfully",
                voteContract: voteContract,
            })
        } else {
            console.log("No events emitted");
            return res.status(500).send({
                message: "Voting session created but no events emitted"
            })
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            message: error.message,
        })
    }
}

const addCandidate = async (req, res) => {
    const { voteAddress, fromAddress, candidateName } = req.body;

    try {
        if (!voteAddress || !fromAddress || !candidateName) {
            return res.status(404).send({
                message: "Missing Information"
            })
        }

        const voteContract = new web3.eth.Contract(voteABI, voteAddress);
        const receipt = await voteContract.methods
            .addCandidate(candidateName)
            .send({ from: fromAddress, gas: 3000000 });

        const event = receipt.events.candidateAdded;

        if (event) {
            const { name, candidateId } = event.returnValues;
            return res.status(200).send({
                success: "Candidate added successfully",
                candidateName: name.toString(),
                candidateId: candidateId.toString(),
            })
        } else {
            return res.status(500).send({
                success: "Candidate added but no events emitted"
            })
        }
    } catch (error) {
        console.log(error.mesasge);
        return res.status(500).send({
            error: error.message
        })
    }
}

const registerVoter = async (req, res) => {
    const { fromAddress, voteAddress, voterAddress } = req.body;

    try {
        if (!voterAddress || !fromAddress || !voterAddress) {
            return res.status(404).send({
                message: "Missing Information",
            })
        }

        const voteContract = new web3.eth.Contract(voteABI, voteAddress);
        const receipt = await voteContract.methods
            .registerVoter(voterAddress)
            .send({ from: fromAddress, gas: 3000000 });

        const event = receipt.events.voterRegistered;
        if (event) {
            const { voter } = event.returnValues;
            console.log(voter);
            return res.status(200).send({
                message: "Voter registered succesfully",
                voterAddress: voter,
            })
        } else {
            return res.status(500).send({
                message: "Voter registered but no events emitted",
            })
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            message: error.message,
        })
    }
}

const getAllVotes = async (req, res) => {
    const { fromAddress } = req.body;

    try {
        let totalVoteSessions = await votingSystemContract.methods.totalVoteSessions().call({ from: fromAddress, gas: 3000000 });
        totalVoteSessions = Number(totalVoteSessions);

        if (totalVoteSessions === 0) {
            console.log("No voting sessions created yet");
            return res.status(404).send({
                message: "No vote sessions created yet",
            })
        }

        const votingSessions = [];
        for (let i = 1; i <= totalVoteSessions; i++) {
            const voteSession = await votingSystemContract.methods.votingSessions(i).call({ from: fromAddress, gas: 3000000 });
            const voteContract = voteSession.voteContract.toString();
            const vote = new web3.eth.Contract(voteABI, voteContract);
            const gasEstimate = await vote.methods.isOpen().estimateGas({ from: fromAddress });
            const isOpen = await vote.methods.isOpen().call({ from: fromAddress, gas: gasEstimate });

            const transformedVoteSession = {
                voteId: Number(voteSession.voteId),
                voteContract: voteSession.voteContract.toString(),
                organizer: voteSession.organizer.toString(),
                purpose: voteSession.purpose.toString(),
                category: voteSession.category.toString(),
                isPublic: voteSession.isPublic,
                isOpen: isOpen,
            }

            votingSessions.push(transformedVoteSession);
        }

        return res.status(200).send({
            votingSessions: votingSessions,
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            message: error.message,
        })
    }
}

const getVoteSession = async (req, res) => {
    const { id } = req.params;
    const { fromAddress } = req.body;

    try {
        const voteSession = await votingSystemContract.methods.votingSessions(id).call({ from: fromAddress, gas: 3000000 });

        if (!voteSession) {
            return res.status(404).send({
                message: "Vote session not found"
            })
        }

        const voteContract = voteSession.voteContract.toString();
        const vote = new web3.eth.Contract(voteABI, voteContract);
        const isOpen = await vote.methods.isOpen().call({ from: fromAddress, gas: 3000000 });

        const transformedVoteSession = {
            voteId: Number(voteSession.voteId),
            voteContract: voteSession.voteContract.toString(),
            organizer: voteSession.organizer.toString(),
            purpose: voteSession.purpose.toString(),
            category: voteSession.category.toString(),
            isPublic: voteSession.isPublic,
            isOpen: isOpen,
        }

        return res.status(200).send({
            voteSession: transformedVoteSession
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            message: error.message
        })
    }
}

const getTotalVotes = async (req, res) => {
    try {
        const { fromAddress, voteContract } = req.query;
        if (!fromAddress || !voteContract) {
            return res.status(404).send({
                message: "Information missing"
            })
        }

        const vote = new web3.eth.Contract(voteABI, voteContract);
        const totalVotes = await vote.methods.totalVotes().call({ from: fromAddress, gas: 3000000 });

        return res.status(200).send({
            totalVotes: Number(totalVotes)
        })

    } catch (error) {
        console.log(error.mesasge);
        return res.status(500).send({
            message: error.message
        })
    }
}

const startVoting = async (req, res) => {
    const { fromAddress, voteContract } = req.query;

    if (!fromAddress || !voteContract) {
        return res.status(404).send({
            error: "Information missing"
        })
    }
    try {
        const vote = new web3.eth.Contract(voteABI, voteContract);

        const gasEstimate = await vote.methods.startVoting().estimateGas({ from: fromAddress });
        const receipt = await vote.methods.startVoting().send({ from: fromAddress, gas: gasEstimate });

        const event = receipt.events.votingStarted;
        if (event) {
            let { voteId } = event.returnValues;
            voteId = Number(voteId);
            return res.status(200).json({
                success: "Voting started",
                voteId: voteId
            })
        } else {
            return res.status(500).send({
                message: "Voting started but no events emitted"
            })
        }
    } catch (error) {
        console.log(error.mesasge);
        return res.status(500).send({
            error: error.message
        })
    }
}

const endVoting = async (req, res) => {
    const { fromAddress, voteContract } = req.query;
    if (!fromAddress || !voteContract) {
        return res.status(404).send({
            error: "Information missing"
        })
    }

    try {
        const vote = new web3.eth.Contract(voteABI, voteContract);
        const gasEstimate = await vote.methods.endVoting().estimateGas({ from: fromAddress })
        const receipt = await vote.methods.endVoting().send({ from: fromAddress, gas: gasEstimate });
        const event = receipt.events.votingEnded;

        if (event) {
            let { voteId } = event.returnValues;
            voteId = Number(voteId);
            return res.status(200).send({
                success: "End voting successfully",
                voteId: voteId
            })
        } else {
            return res.status(500).send({
                message: "Voting ended but no events emitted"
            })
        }

    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            error: error.message
        })
    }
}

const vote = async (req, res) => {
    const { fromAddress, candidateId, voteContract } = req.body;

    try {
        if (!fromAddress || (candidateId === null)|| !voteContract) {
            return res.status(404).send({
                error: "Information missing"
            })
        }

        const vote = new web3.eth.Contract(voteABI, voteContract);
        const gasEstimate = await vote.methods.vote(candidateId).estimateGas({ from: fromAddress });
        const receipt = await vote.methods.vote(candidateId).send({ from: fromAddress, gas: gasEstimate });
        const event = receipt.events.voteCasted;
        if (event) {
            let { voter, candidateId } = event.returnValues;
            const voterAddress = voter.toString();
            candidateId = Number(candidateId);
            return res.status(200).send({ 
                message: `${voterAddress} has voted for candidate #${candidateId}`
            })
        } else {
            return res.status(200).send({
                message: "vote casted but no events emitted"
            })
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            error: error.message
        })
    }
}

const getVoter = async (req, res) => {
    const { voterAddress } = req.params;
    const { fromAddress, voteContract } = req.query;

    try {
        const vote = new web3.eth.Contract(voteABI, voteContract);
        const gasEstimate = await vote.methods.voters(voterAddress).estimateGas({ from: fromAddress });
        const voter = await vote.methods.voters(voterAddress).call({ from: fromAddress, gas: gasEstimate });
        if (!voter) {
            return res.status(404).send({
                error: "voter not found"
            })
        }
        const transformedVoter = {
            isRegistered: voter.isRegistered,
            hasVoted: voter.hasVoted,
            votedCandidateId: Number(voter.votedCandidateId)
        }
        return res.status(200).send({
            voter: transformedVoter
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            error: error.message
        })
    }
}


export { voteABI, getCandidates, createVote, addCandidate, registerVoter, getAllVotes, getVoteSession, getTotalVotes, startVoting, endVoting, vote, getVoter }