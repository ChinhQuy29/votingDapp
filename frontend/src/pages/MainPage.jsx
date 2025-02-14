import React, { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar.jsx";
import VotesSection from "../components/VotesSection.jsx";
import Web3 from "web3";
import { useSetRecoilState } from "recoil";
import connectedAddressAtom from "../../atoms/connectedAddressAtom.js";

const MainPage = () => {
    const setConnectedAddress= useSetRecoilState(connectedAddressAtom);

    useEffect(() => {
        const getConnectedAddress = async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);

                window.ethereum.on("accountsChanged", (accounts) => {
                    if (accounts.length > 0) {
                        localStorage.setItem("connectedAddress", accounts[0])
                        setConnectedAddress(accounts[0]);
                    } else {
                        setConnectedAddress(null);
                    }
                });

                window.ethereum.on("chainChanged", () => {
                    window.location.reload();
                });

                const accounts = await web3.eth.getAccounts();
                if (accounts.length > 0) {
                    localStorage.setItem("connectedAddress", accounts[0]);
                    setConnectedAddress(accounts[0]);
                } else {
                    setConnectedAddress(null);
                }
            }
        }
        getConnectedAddress();

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener("accountsChanged", getConnectedAddress);
            }
        }
    }, [setConnectedAddress])   

    return (
        <section className="main-page">
            <NavigationBar isMainPage={true}/>
            <section className="main-introduction">
                <h1 className="main-explore-votes">Explore Votes</h1>
                <p className="main-explore-text">Discover ongoing votes and have your say! Browse active polls, register quickly, and cast your vote for your favorites. Your voice matters—make it count today!</p>
            </section>
            <VotesSection/>
        </section>
    )
}

export default MainPage