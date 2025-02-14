import React from "react";
import { FaTimes } from "react-icons/fa";

const VoteFormModal = () => {

    return (
        <div className="form-modal">
            <form className="vote-form">
                <FaTimes size={20}></FaTimes>
                <div className="form-purpose">
                    <label htmlFor="purpose">Purpose: </label>
                    <textarea name="purpose" id="purpose"></textarea>
                </div>
                <div className="form-category">
                    <label htmlFor="category">Category: </label>
                    <select name="category" id="category">
                        <option value="political">Political</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="education">Education</option>
                        <option value="community">Community Development</option>
                        <option value="charity">Charity</option>
                    </select>
                </div>
                <div className="form-is-public">
                    <label>Accessity: </label>
                    <label>
                        <input type="radio" name="accessity" value="public" />
                        Public
                    </label>
                    <label>
                        <input type="radio" name="accessity" value="private" />
                        Private
                    </label>
                </div>
                <button className="submit-form-btn">Submit</button>
            </form>
        </div>
    )
}

export default VoteFormModal