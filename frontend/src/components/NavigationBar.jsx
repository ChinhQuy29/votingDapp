import React from "react";
import { FaDiscord, FaTwitter, FaExternalLinkAlt } from 'react-icons/fa'
import { useRecoilValue } from "recoil";
import connectedAddressAtom from "../../atoms/connectedAddressAtom.js";

const NavigationBar = ({ isMainPage }) => {
    const connectedAddress = useRecoilValue(connectedAddressAtom);
    
    const shortenAddress= (address) => {
        if (!address) {
            return "";
        }
        const shortenedAddress= `${address.slice(0,6)}...${address.slice(-4)}`;
        return shortenedAddress;
    }

    return (
        <nav className="front-nav-bar">
            <ul className="front-nav-container">
                <div className="front-nav-left">
                    <li className="front-project-logo">
                    </li>
                    <li className="front-project-name">
                        <p className="vote">VOTE</p>
                        <p className="ly">ly</p>
                    </li>
                </div>
                <div className="front-nav-right">
                    <div className="front-nav-items"> 
                        <li className="front-nav-item">Vision</li>
                        <li className="front-nav-item">About</li>
                        <li className="front-nav-item">Build <FaExternalLinkAlt size={12} /></li>
                    </div>
                    <div className="front-nav-icons">
                        <li className="front-nav-icon discord"><FaDiscord size={25} /></li>
                        <li className="front-nav-icon twitter"><FaTwitter size={25} /></li>
                    </div>
                    { isMainPage &&
                        <div className="main-nav-profile">{ shortenAddress(connectedAddress).toLowerCase() }</div>
                    }
                </div>
            </ul>
        </nav>
    )
}

export default NavigationBar
