import Axios from 'axios';
import React, { useEffect, useState, Component } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import axios from '../../node_modules/axios/index';

import Popup from './Popup';

import YtokenLogo from '../Y-TOKEN_logo2.png'
import YtokenBaner from '../Y-TOKEN_baner.png'

class YTokenRegister extends Component{
  constructor(props){
    super(props)
    this.state = {
      acc_name: '',
    }
  }

  changeHandler = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  
  submitHandler = (e) => {
    this.setState({ isLoading: true });
    var status
    const headers = {
      'Content-Type': 'application/json',
    }
    e.preventDefault()
    var url= 'http://192.168.146.130:8080/ytoken/account/register'
    axios.post(url, this.state, {
      headers: headers
    })
    .then((response) => {
      var name = this.state.acc_name
      this.state.acc_name = ''
      status =  response.data.status
      if(status === 'COMPLETED'){
          this.props.setNewAccountInfo(name, response.data.message, response.data.public_key,  response.data.private_key, response.data.hash)
      }
      else{
        this.props.setNewAccountInfo('', response.data.Mensaje, '', '', '')
      }
      this.setState({
        isLoading: false,
        show: false 
    });
    //window.location.reload();
      //payOrder(this.props.o, response.data)
        //return response.json();
    })
    .catch((error) => {
      this.setState({
        isLoading: false,
        show: false
      });
      this.props.setNewAccountInfo('', 'Connection timeout', '', '', '')
    });
  }


  render() {
    const {acc_name} = this.state
    return (
      <div className="ytokenform">
        <img className="ytokenlogo" src={YtokenLogo} alt="Logo" />
        <form className="form" onSubmit={this.submitHandler}>
          <label>
            <div>
              <h1>Y-Token</h1>
              <h2>Create your own Y-Token account</h2>
            </div>
            <div>
              <label for="acc_name" required>New Y-Token Account ID:</label>
              <input id ="acc_name" type="text" name="acc_name" value={acc_name} onChange={this.changeHandler} /> @ytoken
            </div>
          </label>
          <input type="submit" value="Sign Up" disabled={this.state.isLoading} onClick={this.props.togglePopup}></input>
        </form>
      </div>
    )
  }
}

export default function YTokenRegisterScreen(props) {
  const [ytokenNewAccountName, setYtokenNewAccountName] = useState('');
  const [message, setMessage] = useState('');
  const [ytokenNewAccountPublicKey, setYtokenNewAccountPublicKey] = useState('');
  const [ytokenNewAccountPrivateKey, setYtokenNewAccountPrivateKey] = useState('');
  const [ytokenTransactionHash, setYtokenTransactionHash] = useState('');

  const [isLoading, setIsLoading] = useState('');
  const [isOpen, setIsOpen] = useState(false);
 
  const togglePopup = () => {
    setIsOpen(!isOpen);
    setYtokenNewAccountName('');
    setMessage('');
    setYtokenNewAccountPublicKey('');
    setYtokenNewAccountPrivateKey('');
    setYtokenTransactionHash('');
    setIsLoading('Processing...');
  }

  function setNewAccountInfo (name, message, pubkey, privkey, hash){
    setIsLoading('');
    setYtokenNewAccountName(name+'@ytoken');  
    setMessage(message);
    setYtokenNewAccountPublicKey(pubkey);
    setYtokenNewAccountPrivateKey(privkey);
    setYtokenTransactionHash(hash);
  }
 

  return (
    <div>
      <YTokenRegister setNewAccountInfo={setNewAccountInfo} togglePopup={togglePopup} />
      {isOpen && <Popup
        content={<>
          <b>Y-Token</b>
          <p><strong className='processing'>{isLoading}</strong></p>
          <p><strong className='balance'>{message}</strong></p>
          <p>Your account name: <strong>{ytokenNewAccountName}</strong> </p>
          <p>Your Account's public key: <strong>{ytokenNewAccountPublicKey}</strong> </p>
          <p>Your Account's private key: <strong>{ytokenNewAccountPrivateKey}</strong> </p>
          <p>Transaction Hash: <strong>{ytokenTransactionHash}</strong> </p>
        </>}
        handleClose={togglePopup}
      />}
    </div>
  );
}
