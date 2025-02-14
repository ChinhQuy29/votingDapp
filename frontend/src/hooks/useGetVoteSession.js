import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRecoilValue } from 'recoil';
import connectedAddressAtom from '../../atoms/connectedAddressAtom.js';
import { voteABI } from '../assets/vote_ABI.js';
import useGetWeb3 from './useGetWeb3.js'

const useGetVoteSession = (voteId) => {
    const fromAddress = useRecoilValue(connectedAddressAtom);
    const [voteSession, setVoteSession] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { web3 } = useGetWeb3();

    useEffect(() => {
        const getVoteSession = async () => {
            try {
                if (!voteId || !fromAddress) {
                    return;
                }
                const response = await axios.get(`http://localhost:5000/api/contract/getVoteSession/${voteId}`, { fromAddress });
                const voteSession = response.data.voteSession;
                setVoteSession(voteSession);
            } catch (error) {
                console.log(error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        getVoteSession();

        if (voteSession.voteContract) {
            const vote = new web3.eth.Contract(voteABI, voteSession.voteContract);
            console.log(vote);
            console.log(vote.events.votingStarted);
            console.log(vote.events.votingEnded);
            vote.events.votingStarted()
                .on("data", (event) => {
                    if (event) {
                        console.log(event)
                        getVoteSession();
                    }
                })
                .on("error", (error) => {
                    console.log(error)
                })

            vote.events.votingEnded()
                .on("data", (event) => {
                    console.log(event);
                    getVoteSession();
                })
                .on("error", (error) => {
                    console.log(error);
                })
        }

        return () => {
            if (voteSession.voteContract) {
                vote.removeAllListeners("votingStarted");
                vote.removeAllListeners("votingEnded");
            }
        }

    }, [voteId, fromAddress]);

    return { voteSession, loading, error };
}

export default useGetVoteSession;