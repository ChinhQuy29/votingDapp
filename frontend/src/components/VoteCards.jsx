import React from "react";
import VoteCard from "./VoteCard.jsx";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import voteSessionsAtom from "../../atoms/voteSessionsAtom.js";

const VoteCards = () => {
    const voteSessions = useRecoilValue(voteSessionsAtom);

    return (
        <div className="vote-card-container">
            {voteSessions.map((voteSession) => (
                    <Link to={`/vote/${voteSession.voteId}`} style={{ textDecoration: "none" }} key={voteSession.voteId}>
                        <VoteCard voteSession={voteSession} ></VoteCard>
                    </Link>
            ))}
        </div>
    )
}

export default VoteCards