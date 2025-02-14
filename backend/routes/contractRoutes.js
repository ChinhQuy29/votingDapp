import express from "express";

import { getCandidates, createVote, addCandidate, registerVoter, getAllVotes, getVoteSession, getTotalVotes, startVoting, endVoting, vote, getVoter } from "../controllers/contractControllers.js";

const router = express.Router();


router.post('/getCandidates', getCandidates)

router.post('/createVote', createVote)

router.post('/addCandidate', addCandidate)

router.post('/registerVoter', registerVoter)

router.get('/getAllVotes', getAllVotes)

router.get('/getVoteSession/:id', getVoteSession)

router.get("/getTotalVotes", getTotalVotes)

router.get("/startVoting", startVoting)

router.get("/endVoting", endVoting)

router.post("/vote", vote)

router.get("/getVoter/:voterAddress", getVoter)

export default router