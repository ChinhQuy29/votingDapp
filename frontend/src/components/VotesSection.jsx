import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios';
import VoteCards from "./VoteCards.jsx";
import { FaPlus } from "react-icons/fa";
import VoteFormModal from "./VoteFormModal.jsx";
import { useSetRecoilState } from "recoil";
import voteSessionsAtom from "../../atoms/voteSessionsAtom.js";


const VotesSection = () => {
    const setVoteSessions = useSetRecoilState(voteSessionsAtom);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            try {
                const fetchVoteSessions = async () => {
                    const response = await axios.get("http://localhost:5000/api/contract/getAllVotes");
                    const voteSessions = response.data.votingSessions;
                    setVoteSessions(voteSessions);
                }
                fetchVoteSessions();
            } catch (error) {
                console.log(error.message)
            }
        }

        initialize();
    }, [setVoteSessions]);

    return (
        <section className='ongoing-votes'>
            <div className="votes-introduction">
                <div className="votes-introduction-text">
                    <h1>Ongoing Votes</h1>
                    <p>Explore active polls and make your voice heard! Cast your vote now for your favorites before time runs out.</p>
                </div>
                <button className="create-vote-button" onClick={() => setShowModal(true)}><FaPlus size={10}></FaPlus> Create</button>
                { showModal &&
                    <VoteFormModal></VoteFormModal>
                }
            </div>
            <VoteCards/>
        </section>
    )
}

export default VotesSection