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

class YtokenCheckTransactionForm extends Component{
  constructor(props){
    super(props)
    this.state = {
      ytokenTransactionHash: '',
      ytokenTransactionDetail: '',
    }
  }

  changeHandler = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }
  
  submitHandler = (e) => {
    this.setState({ isLoading: true });
    const headers = {
      'Content-Type': 'application/json',
    }
    e.preventDefault()
    var url= 'http://192.168.146.130:8080/ytoken/transaction/' + this.state.ytokenTransactionHash
    axios.get(url, {
      headers: headers
    })
    .then((response) => {
      this.state.ytokenTransactionHash = ''
      if(response.data.transaction.includes('commands')){
        this.state.ytokenTransactionDetail = response.data.transaction
        this.props.setTransactionDetail(this.state.ytokenTransactionDetail, ' ')
      }
      else{
        this.props.setTransactionDetail(' ', 'Seems like you dont hay any Y-Token in your account')
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
      this.props.setTransactionDetail(' ', 'Connection timeout')
    });
  }


  render() {
    const {ytokenTransactionHash} = this.state
    return (
      <div className="ytokenform">
        <img className="ytokenlogo" src={YtokenLogo} alt="Logo" />
        <form className="form" onSubmit={this.submitHandler}>
          <label>
            <div>
              <h1>Y-Token</h1>
              <h2>Check transaction by hash</h2>
            </div>
            <div>
              <label for="ytokenTransactionHash">Y-Token Transaction Hash:</label>
              <input id ="ytokenTransactionHash" type="text" name="ytokenTransactionHash" value={ytokenTransactionHash} required onChange={this.changeHandler} />
            </div>
          </label>
          <input type="submit" value="OK" disabled={this.state.isLoading} onClick={this.props.togglePopup}></input>
          <div>
            <label />
          </div>
        </form>
      </div>
    )
  }
}

export default function YTokenScreen(props) {
  const [ytokenTransactionDetail, setYtokenTransactionDetail] = useState('');
  const [message, setMessage] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState('');
 
  const togglePopup = () => {
    setIsOpen(!isOpen);
    setMessage('');
    setYtokenTransactionDetail('');
    setIsLoading('Processing...');
  }

  function setTransactionDetail (detail, message){
    setIsLoading('');
    setYtokenTransactionDetail(detail)
    setMessage(message);
  }
 

  return (
    <div>
      <YtokenCheckTransactionForm setTransactionDetail={setTransactionDetail} togglePopup={togglePopup} />
      {isOpen && <Popup
        content={<>
          <b>Y-Token</b>
          <p><strong className='processing'>{isLoading}</strong></p>
          <p><strong className='balance'>{message}</strong></p>
          <p>Transaction Detail: <strong className='balance'>{ytokenTransactionDetail}</strong> </p>
        </>}
        handleClose={togglePopup}
      />}
    </div>
  );
}
