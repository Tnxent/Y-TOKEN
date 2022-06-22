import Axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import React, { useEffect, useState, Component } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deliverOrder, detailsOrder, payOrder } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from '../constants/orderConstants';
import axios from '../../node_modules/axios/index';
import data from '../data';

import Popup from './Popup';

import YtokenLogo from '../Y-TOKEN_logo2.png'
import YtokenBaner from '../Y-TOKEN_baner.png'

export default function YTokenAddFundsScreen(props) {
  const [ytokenAccountName, setYtokenAccountName] = useState('');
  const [amount, setAmount] = useState('10');
  const [domain_name, setDomain_name] = useState('emarket');
  const [domain_admin_acc_name, setDomain_admin_acc_name] = useState('admin_emarket');
  const [domain_admin_priv_key, setDomain_admin_priv_key] = useState('ac004f98f01fefca7cd92b7c45ec4cf0e1167df53a6f72189302cd1632f494fe');

  const [sdkReady, setSdkReady] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState('');

  const [message, setMessage] = useState('');
  const [ytokenTransactionHash, setYtokenTransactionHash] = useState('');
  
  const dispatch = useDispatch();
  useEffect(() => {
    const addPayPalScript = async () => {
        const { data } = await Axios.get('/api/config/paypal');
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
        script.async = true;
        script.onload = () => {
          setSdkReady(true);
        };
        document.body.appendChild(script);
      };
    }, [dispatch, sdkReady]);
    
    const successPaymentHandler = (paymentResult) => {
      if(paymentResult.status==='COMPLETED'){
        const headers = {
          'Content-Type': 'application/json',
          'DOMAIN-ADMIN-PRIVATE-KEY': domain_admin_priv_key,
        }
        var url= 'http://192.168.146.130:8080/ytoken/' + ytokenAccountName + '/domain/' + domain_name
        axios.post(url, {
          domain_admin_acc_name: domain_admin_acc_name,
          amount: amount,
        }, {
          headers: headers
        })
        .then((response) => {
          if(response.data.status === 'COMPLETED'){
            setIsLoading('')
            setYtokenTransactionHash(response.data.hash)
            setMessage('The payment has been completed and the funds have been added successfully to your account balance.')
          }
          else{
            setMessage('The payment has been completed but seems like the user does not exist, please contact with the administrator.')
          }
        })
        .catch((error) => {
          setMessage('The payment has been completed but some problems ocurred, please contact with the administrator.')
        });
    }
    else{
      setMessage('Payment failed');
    }
  }
    const togglePopup = () => {
      setIsOpen(!isOpen);
      setMessage('');
      setYtokenTransactionHash('');
      setIsLoading('Processing...');
    }
  
  return (
  <div className="ytokenform">
    <img className="ytokenlogo" src={YtokenLogo} alt="Logo" />
    <form className="form">
      <label>
        <div>
          <h1>Y-Token#emarket</h1>
          <h2>Add more E-Marketplace domain founds to your Y-Token account</h2>
        </div>
        <div>
          <label for="name" required>Y-Token Account ID:</label>
          <input id ="name" type="text" name="ytokenAccountName" required value={ytokenAccountName} onChange={(e) => setYtokenAccountName(e.target.value)} /> @ytoken
        </div>
        <div>
          <label for="amount" required>Amount:</label>
          <input id ="amount" type="number" step="0.01" min="10" max="1000" required name="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
      </label>
      <div>
            <label />
            <div>
              Don't have an Y-Token account?{' '}
              <Link to={`/ytokenregister`}>Sign-Up</Link>
            </div>
      </div>
      <br /><br /><br />
      <PayPalButton
        amount={amount/10}
        onSuccess={successPaymentHandler}
        onClick={togglePopup}
      ></PayPalButton>
    </form>
    {isOpen && <Popup 
        content={<>
          <b>Y-Token#emarket</b>
          <p><strong className='processing'>{isLoading}</strong></p>
          <p><strong className='balance'>{message}</strong></p>
          <p>Your Account: <strong className='balance'>{ytokenAccountName}@ytoken</strong> </p>
          <p>Transaction Hash: <strong>{ytokenTransactionHash}</strong> </p>
        </>}
        handleClose={togglePopup}
      />}
  </div>
  );
}
