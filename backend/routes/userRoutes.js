import express from "express";

import { createNewNonce, verifyConnect, getNonces, deleteNonces } from "../controllers/userControllers.js";

const router = express.Router();

router.post('/nonce', createNewNonce)

router.post('/verify', verifyConnect)

router.get('/getNonces', getNonces)

router.delete('/deleteNonces', deleteNonces)

export default router