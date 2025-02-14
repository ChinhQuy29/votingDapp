import { Nonces } from "../models/nonceModel.js";
import jwt from 'jsonwebtoken'
import Web3 from 'web3'
import dotenv from 'dotenv';

dotenv.config()

const web3 = new Web3("http://127.0.0.1:7545");

const createNewNonce = async (req, res) => {
    const address = req.body.address;
    try {
        const nonce = Math.floor(Math.random() * 1000000).toString();
        const newNonce = { address: address, nonce: nonce };
        await Nonces.create(newNonce);
        return res.status(200).send({ data: nonce });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            error: error.message,
        })
    }
}

const verifyConnect = async (req, res) => {
    const { address, signature } = req.body;
    
    try {
        if (!address || !signature) {
            return res.status(404).send({
                error: "Information missing",
            })
        }

        const Nonce = await Nonces.findOne({ address: address });

        if (!Nonce) {
            return res.status(404).send({
                error: "Nonce not found",
            })
        }

        const message = `Please sign this message to log in. Nonce: ${Nonce.nonce}`
        const signer = web3.eth.accounts.recover(message, signature);

        if (address.toLowerCase() === signer.toLowerCase()) {
            const accessToken = jwt.sign({ address }, process.env.SECRET_KEY, { expiresIn: "1d" });
            await Nonces.deleteOne({ address: address });
            return res.status(200).send({
                success: "Connect successfully",
                accessToken: accessToken,
            })
        } else {
            console.log("Invalid credentials");
            return res.status(400).send({ error: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ error: error.message });
    }
}

const getNonces = async (req, res) => {
    try {
        const nonces = await Nonces.find({});
        return res.status(200).send({
            length: nonces.length,
            data: nonces
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            error: error.message,
        })
    }
}

const deleteNonces = async (req, res) => {
    try {
        await Nonces.deleteMany({});
        return res.status(200).send({
            success: "Nonces deleted successfully"
        })
    } catch (error) {
        console.log(error.mesasge);
        return res.status(500).send({
            error: "Error deleting nonces"
        })
    }
}

export { createNewNonce, verifyConnect, getNonces, deleteNonces }