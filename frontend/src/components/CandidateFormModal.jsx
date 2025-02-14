import React from "react";
import { useState } from "react";
import axios from "axios";
import { AiOutlineDelete } from "react-icons/ai";
import { useRecoilValue } from "recoil";
import connectedAddressAtom from "../../atoms/connectedAddressAtom.js";


const CandidateFormModal = ({ showModal, setShowModal, voteContract }) => {
    const [candidateName, setCandidateName] = useState("");
    const fromAddress = useRecoilValue(connectedAddressAtom);

    const handleInputSubmit = async () => {
        try {
            if (!candidateName) {
                return;
            }

            const response = await axios.post("http://localhost:5000/api/contract/addCandidate", {
                voteAddress: voteContract,
                fromAddress: fromAddress,
                candidateName: candidateName
            })
        } catch (error) {
            console.log(error.message)
        } finally {
            setShowModal(!showModal)
        }
    }
    return (
        <div className="candidate-form-modal">
            <AiOutlineDelete size={20} onClick={() => setShowModal(!showModal)}></AiOutlineDelete>
            <label>Candidate's name: </label>
            <input type="text" onChange={(e) => setCandidateName(e.target.value)} value={candidateName} placeholder="Eren Yeager" />
            <button onClick={handleInputSubmit}>Add</button>
        </div>
    )
}

export default CandidateFormModal