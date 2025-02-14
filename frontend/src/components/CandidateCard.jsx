import React from "react";
import { useState, useEffect } from "react";
import voteSessionAtom from "../../atoms/voteSessionAtom.js";
import { useRecoilValue } from "recoil";
import connectedAddressAtom from "../../atoms/connectedAddressAtom.js";
import axios from "axios";

const CandidateCard = ({ hasVoted, votedCandidateId, candidate, totalVotes, setTotalVotes }) => {
    const [percentage, setPercentage] = useState(0);
    const voteSession = useRecoilValue(voteSessionAtom);
    const fromAddress = useRecoilValue(connectedAddressAtom);
    const [voted, setVoted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchVoteCount = () => {
            try {
                if (!candidate || !totalVotes) {
                    return;
                }
                const percentage = (candidate.candidateVoteCount / totalVotes) * 100;
                setPercentage(percentage.toFixed(2));

            } catch (error) {
                console.log(error.message);
            }
        }

        fetchVoteCount();
    }, [candidate]);

    const handleVoteClick = async () => {
        if (!fromAddress || !voteSession || loading || voted || hasVoted) {
            return;
        }

        setLoading(true);
        try {
            const voteContract = voteSession.voteContract;
            const candidateId = candidate.candidateId;
            const response = await axios.post("http://localhost:5000/api/contract/vote", {
                fromAddress: fromAddress,
                candidateId: candidateId,
                voteContract: voteContract
            });

            const { result } = response.data

            if (result?.error) {
                console.log(result?.error);
                return;
            }

            setTotalVotes((prev) => prev + 1);
            setVoted(true);
        } catch (error) {
            console.log(error.message);
            return;
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="candidate-card">
            <p className="candidate-card-name">{candidate.candidateName}</p>
            <p className="candidate-card-percentage">{percentage}%</p>
            <div className="candidate-card-progress-bar">
                <div className="progress-bar-inside" style={{ width: `${percentage}%`, backgroundColor: "#1778F2", height: "100%", borderRadius: "10px" }}></div>
            </div>
            {!(fromAddress === voteSession.organizer) && (
                (hasVoted && votedCandidateId === candidate.candidateId) ? <button className="candidate-card-vote-btn">Voted</button> :
                    <button className="candidate-card-vote-btn" onClick={() => handleVoteClick()}>Vote</button>
            )
            }
        </div>
    )
}

export default CandidateCard