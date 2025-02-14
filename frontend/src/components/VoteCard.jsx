import React from "react";
import { FiCopy } from "react-icons/fi";
import { useState, useEffect } from "react";
import axios from "axios";
import connectedAddressAtom from "../../atoms/connectedAddressAtom.js";
import { useRecoilValue } from "recoil";

const VoteCard = ({ voteSession }) => {
    const connectedAddress = useRecoilValue(connectedAddressAtom);
    const [isOrganizer, setIsOrganizer]= useState(false);

    useEffect(() => {
        if (connectedAddress.toLowerCase() === voteSession.organizer.toLowerCase()) {
            setIsOrganizer(true);
        } 
    }, [])

    // const handleRegister = async () => {
    //     try {
    //         if (!voteSession || !connectedAddress) {
    //             return;
    //         } 

    //         const response = await axios.post("http://localhost:5000/api/contract/register", { voterAddress : connectedAddress });
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // }

    return (
        <div className="vote-card" key={voteSession.voteId}>
            <div className="vote-card-information">
                <h3 className="vote-card-purpose">{voteSession.purpose} #{voteSession.voteId}</h3>
                <p className="vote-card-category">{voteSession.category}</p>
                <p className="vote-card-organizer">Organizer: {voteSession.organizer}  <FiCopy size={12}></FiCopy></p>
            </div>
            <div>   
                <p>{ voteSession.isPublic ? "Public" : "Private"}</p>
                <p>{ voteSession.isOpen ? "Open" : "Closed"}</p>
            </div>
            <div className="vote-card-buttons">
                { isOrganizer && ( 
                        <div className="vote-card-organizer-buttons">
                            <button className="vote-card-organizer-button add-candidate">Add Candidate</button>
                            <button className="vote-card-organizer-button register-user">Register User</button>
                        </div> 
                    )
                }
                <button className="vote-card-button explore">Explore</button>
                { !isOrganizer &&
                    <button className="vote-card-button register">Register</button>
                }
            </div>
        </div>
    )
}

export default VoteCard