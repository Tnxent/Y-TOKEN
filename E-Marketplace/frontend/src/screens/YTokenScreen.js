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

class YtokenCheckMyBalanceForm extends Component{
  constructor(props){
    super(props)
    this.state = {
      ytokenAccountName: '',
      ytokenPrivateKey: '',
      ytokenBalance: 0,
    }
  }


  getSellersYtokenAccountName(id) {
    Axios.get(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${this.props.ui.token}` },
    })
    .then(res => {
        this.setState({ ytokenAccountName: res.data.seller.ytokenAccountName});
    })
    .catch(error => {
        this.setState({ ytokenAccountName: ''});
    });
 }

  changeHandler = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  
  submitHandler = (e) => {
    this.setState({ isLoading: true });
    const headers = {
      'Content-Type': 'application/json',
      'ACCOUNT-PRIVATE-KEY': this.state.ytokenPrivateKey,
    }
    e.preventDefault()
    var url= 'http://192.168.146.130:8080/ytoken/' + this.state.ytokenAccountName + '/domain/emarket'
    axios.get(url, {
      headers: headers
    })
    .then((response) => {
      this.state.ytokenAccountName = ''
      this.state.ytokenPrivateKey = ''
      if(response.data.asset_id === 'ytoken#emarket'){
        this.state.ytokenBalance = response.data.balance
        this.props.setBalance(this.state.ytokenBalance, ' ')
      }
      else{
        this.props.setBalance(' ', 'Seems like you dont hay any Y-Token of this domain in your account.')
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
      this.props.setBalance(' ', 'Connection timeout')
    });
  }


  render() {
    const {ytokenAccountName, ytokenPrivateKey} = this.state
    return (
      <div className="ytokenform">
        <img className="ytokenlogo" src={YtokenLogo} alt="Logo" />
        <form className="form" onSubmit={this.submitHandler}>
          <label>
            <div>
              <h1>Y-Token#emarket</h1>
              <h2>Check your Y-Token#emarket balance</h2>
            </div>
            <div>
              <label for="name">Y-Token Account ID:</label>
              <input id ="name" type="text" name="ytokenAccountName" value={ytokenAccountName} required onChange={this.changeHandler} /> @ytoken
            </div>
            <div>
              <label for="pk">Y-Token Account Private Key:</label>
              <input id ="pk" type="text" name="ytokenPrivateKey" value={ytokenPrivateKey} required onChange={this.changeHandler} />
            </div>
          </label>
          <input type="submit" value="OK" disabled={this.state.isLoading} onClick={this.props.togglePopup}></input>
          <div>
            <label />
            <div>
              Don't have an Y-Token account?{' '}
              <Link to={`/ytokenregister`}>Sign-Up</Link>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default function YTokenScreen(props) {
  const [ytokenBalance, setYtokenBalance] = useState('');
  const [message, setMessage] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState('');
 
  const togglePopup = () => {
    setIsOpen(!isOpen);
    setMessage('');
    setYtokenBalance('');
    setIsLoading('Processing...');
  }

  function setBalance (balance, message){
    setIsLoading('');
    setYtokenBalance(balance)
    setMessage(message);
  }
 

  return (
    <div>
      <YtokenCheckMyBalanceForm setBalance={setBalance} togglePopup={togglePopup} />
      {isOpen && <Popup
        content={<>
          <b>Y-Token#emarket</b>
          <p><strong className='processing'>{isLoading}</strong></p>
          <p><strong className='balance'>{message}</strong></p>
          <p>Your balance: <strong className='balance'>{ytokenBalance}</strong> </p>
          <Link to={`/ytokenaddfounds`}>
            <button>Add funds</button>
          </Link>
        </>}
        handleClose={togglePopup}
      />}
    </div>
  );
}
