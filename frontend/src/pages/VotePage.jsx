import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import CandidateCard from "../components/CandidateCard.jsx";
import useGetCandidates from "../hooks/useGetCandidates.js";
import { useRecoilState, useRecoilValue } from "recoil";
import connectedAddressAtom from "../../atoms/connectedAddressAtom.js";
import voteSessionAtom from "../../atoms/voteSessionAtom.js";
import { useParams } from "react-router-dom";
import CandidateFormModal from "../components/CandidateFormModal.jsx";

const VotePage = () => {
    const { id } = useParams();
    const [voteSession, setVoteSession] = useRecoilState(voteSessionAtom);
    const [totalVotes, setTotalVotes] = useState(0);
    const fromAddress = useRecoilValue(connectedAddressAtom);
    const { candidates } = useGetCandidates(voteSession);
    const [loading, setLoading] = useState(false);
    const [fetchSession, setFetchSession] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [voter, setVoter] = useState({
        isRegistered: false,
        hasVoted: false,
        votedCandidateId: null
    })

    useEffect(() => {
        const fetchVoteSession = async () => {
            if (loading || !fetchSession || !id) {
                return;
            }

            setLoading(true);

            try {
                const response = await axios.get(`http://localhost:5000/api/contract/getVoteSession/${id}`,
                    {
                        fromAddress: fromAddress
                    }
                );
                const voteSession = response.data.voteSession;
                const voteCountResponse = await axios.get("http://localhost:5000/api/contract/getTotalVotes",
                    {
                        params: {
                            fromAddress: fromAddress,
                            voteContract: voteSession.voteContract
                        }
                    }
                )
                const voteCount = voteCountResponse.data.totalVotes;
                const voterResponse = await axios.get(`http://localhost:5000/api/contract/getVoter/${fromAddress}`, {
                    params: {
                        fromAddress: voteSession.organizer,
                        voteContract: voteSession.voteContract
                    }
                })
                const voter = voterResponse.data.voter;
                setVoter(voter);
                setTotalVotes(Number(voteCount));
                setVoteSession(voteSession);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
                setFetchSession(false);
            }
        }
        fetchVoteSession();
    }, [id, fromAddress, setVoteSession, fetchSession, loading])

    // useEffect(() => {
    //     const fetchTotalVotes = async () => {
    //         if (loading || !voteSession.voteContract) {
    //             return;
    //         }
    //         setLoading(true);

    //         try {
    //             const response = await axios.get("http://localhost:5000/api/contract/getTotalVotes",
    //                 {
    //                     fromAddress: fromAddress,
    //                     voteContract: voteSession.voteContract
    //                 }
    //             );

    //             const totalVotes = response.data.totalVotes;
    //             setTotalVotes(totalVotes);
    //         } catch (error) {
    //             console.log(error.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    //     fetchTotalVotes();
    // }, []);

    const handleEndClick = async () => {
        if (loading) {
            return;
        }

        setLoading(true);

        try {
            if (!fromAddress || !voteSession.voteContract) {
                return;
            }
            if (voteSession.isOpen) {
                const response = await axios.get("http://localhost:5000/api/contract/endVoting",
                    {
                        params: {
                            fromAddress: fromAddress,
                            voteContract: voteSession.voteContract
                        }
                    });
                const { result } = response.data;
                if (result?.success || result?.message) {
                    setVoteSession({ ...voteSession, isOpen: false });
                    console.log("Vote ended successfully");
                }

                if (result?.error) {
                    console.log("Failed ending vote")
                }
            } else {
                return;
            }
        } catch (error) {
            console.log(error.message)
        } finally {
            setLoading(false);
            setFetchSession(true);
        }
    }

    const handleStartClick = async () => {
        if (loading) {
            return;
        }

        setLoading(true);

        try {
            if (!fromAddress || !voteSession.voteContract) {
                return;
            }

            if (!voteSession.isOpen) {
                const response = await axios.get("http://localhost:5000/api/contract/startVoting",
                    {
                        params: {
                            fromAddress: fromAddress,
                            voteContract: voteSession.voteContract
                        }
                    });
                const { result } = response.data;
                if (result?.success || result?.message) {
                    setVoteSession({ ...voteSession, isOpen: true });
                    console.log("Vote started successfully");
                }

                if (result?.error) {
                    console.log("Failed starting vote")
                }
            } else {
                return;
            }
        } catch (error) {
            console.log(error.message)
        } finally {
            setLoading(false);
            setFetchSession(true);
        }
    }

    const handleRegisterVoter = () => {

    }

    return (
        <>
            {
                (voter.isRegistered || fromAddress === voteSession.organizer)? (
                    <>
                        {
                            !loading ?
                                <div className="vote-page">
                                    <section className="vote-page-vote">
                                        <div className="vote-section-introduction">
                                            <h2>{voteSession.purpose} #{voteSession.voteId}</h2>
                                            <div className="introduction-tags">
                                                <div className="introduction-tag">{voteSession.category}</div>
                                                <div className="introduction-tag">{voteSession.isOpen ? "Open" : "Closed"}</div>
                                            </div>
                                        </div>
                                        <div>{voteSession.organizer}</div>
                                        <div>Candidates: </div>
                                        <div className="vote-section-candidates">
                                            {candidates.map((candidate) => (
                                                <CandidateCard hasVoted={voter.hasVoted} votedCandidateId={voter.votedCandidateId} candidate={candidate} totalVotes={totalVotes} setTotalVotes={setTotalVotes} key={candidate.candidateId}></CandidateCard>
                                            ))}
                                        </div>
                                        {fromAddress === voteSession.organizer &&
                                            <>
                                                <button className="add-candidates btn" onClick={() => setShowModal(true)}>Add Candidate</button>
                                                <button className="register-voter btn" onClick={handleRegisterVoter}>Register Voter</button>
                                                <button className="start btn" onClick={handleStartClick}>Start</button>
                                                <button className="end btn" onClick={handleEndClick}>End</button>
                                            </>
                                        }
                                    </section>
                                    <section className="vote-page-comment"></section>
                                    <section className="vote-page-others"></section>
                                </div> :
                                <div>Loading...</div>
                        }
                        {showModal && <CandidateFormModal showModal={showModal} setShowModal={setShowModal} voteContract={voteSession.voteContract} />}
                    </>
                ) : (
                    <div>Must be registered to access to this vote</div>
                )
            }
        </>
    )
}

export default VotePage