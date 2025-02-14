import React from "react";
import NavigationBar from "../components/NavigationBar.jsx";

const FrontPage = ({ loginWithWallet }) => {

    return (
        <section className="front-page">
            <NavigationBar isMainPage={false}/>
            <section className="front-project-introduction">
                <p className="front-welcome">Welcome to Votely!</p>
                <p className="front-text-1">
                    A decentralized voting platform that ensures privacy and trustworthiness. With advanced cryptography and blockchain technology, we protect voter anonymity while guaranteeing transparent and verifiable results.
                </p>
                <p className="front-text-2">Your vote, your voice—secure, private, and trusted.</p>
                <div className="front-buttons">
                    <button className="front-button explore">Start Exploring</button>
                    <button className="front-button connnect" onClick={loginWithWallet}>Connect Wallet</button>
                </div>
            </section>
        </section>
    )
}

export default FrontPage