import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import connectedAddressAtom from "../../atoms/connectedAddressAtom.js";

const useGetCandidates = (voteSession) => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const fromAddress = useRecoilValue(connectedAddressAtom);

    useEffect(() => {
        const fetchCandidates = async () => {
            if (!fromAddress || !voteSession || !voteSession.voteContract) {
                return;
            }

            try {
                const voteContract = voteSession.voteContract;
                const response = await axios.post("http://localhost:5000/api/contract/getCandidates", { fromAddress, voteContract })
                const candidates = response.data.candidates;
                setCandidates(candidates);

            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchCandidates();
    }, [voteSession, fromAddress])

    return { candidates, loading };
}

export default useGetCandidates;