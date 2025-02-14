import React from "react";
import Web3 from 'web3';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { Route, Routes } from 'react-router-dom';
import FrontPage from './pages/FrontPage.jsx';
import MainPage from './pages/MainPage.jsx';
import VotePage from './pages/VotePage.jsx';

const App = () => {
  // const [userAddress, setUserAddress] = useState('')

  const web3 = window.ethereum ? new Web3(window.ethereum) : new Web3("http://127.0.0.1:7545");

  const navigate = useNavigate();

  const requestNonce = async () => {
    try {
      const accounts = await web3.eth.requestAccounts();
      const userAddress = accounts[0];

      const response = await axios.post(`http://localhost:5000/api/user/nonce`, { address: userAddress })
      const nonce = response.data.data;

      return { userAddress, nonce };
    } catch (error) {
      console.log(error.message);
    }
  }

  const signMessage = async (userAddress, nonce) => {
    const message = `Please sign this message to log in. Nonce: ${nonce}`;
    const hexMessage = web3.utils.utf8ToHex(message);
    try {
      const signature = await web3.eth.personal.sign(hexMessage, userAddress, 'abc');
      return signature;
    } catch (error) {
      console.log(error.message);
    }

  }

  const verifySignature = async (userAddress, signature) => {
    try {
      const response = await axios.post('http://localhost:5000/api/user/verify', { address: userAddress, signature: signature });
      const accessToken = response.data.accessToken;
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        navigate('/home');
      } else {
        console.log("Access Token missing");
        navigate('/');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const loginWithWallet = async () => {
    const { userAddress, nonce } = await requestNonce();
    const signature = await signMessage(userAddress, nonce);
    await verifySignature(userAddress, signature);
  }


  return (
    <Routes>
      <Route path='/' element={<FrontPage loginWithWallet={loginWithWallet} />}></Route>
      <Route path='/home' element={
        <ProtectedRoute>
          <MainPage></MainPage>
        </ProtectedRoute>
      }></Route>
      <Route path='/vote/:id' element={
        <ProtectedRoute>
          <VotePage></VotePage>
        </ProtectedRoute>
      }>
      </Route>
    </Routes>
  )
}

export default App;
