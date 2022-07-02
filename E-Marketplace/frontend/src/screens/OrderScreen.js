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

import YtokenLogo from '../Y-TOKEN_logo2.png'
import YtokenBaner from '../Y-TOKEN_baner.png'

class YtokenPaymentForm extends Component{
  constructor(props){
    super(props)
    this.state = {
      src_acc_name: '',
      dest_acc_name: this.getSellersYtokenAccountName(props.s.toString()),
      amount: props.a,
      src_priv_key: '',
      domain_name: 'emarket',
      isLoading: false,
      show: false,
    }
  }


  getSellersYtokenAccountName(id) {
    Axios.get(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${this.props.ui.token}` },
    })
    .then(res => {
        this.setState({ dest_acc_name: res.data.seller.ytokenAccountName });
    })
    .catch(error => {
        console.log(error)
    });
 }

  changeHandler = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  
  submitHandler = (e) => {
    this.setState({ isLoading: true });
    var status
    const headers = {
      'Content-Type': 'application/json',
      'ACCOUNT-PRIVATE-KEY': this.state.src_priv_key,
    }
    const transferResult = {
      'id': '',
      'status': '',
    }
    e.preventDefault()
    console.log(this.state)
    axios.post('http://192.168.146.130:8080/ytoken/transfer/domain/' + this.state.domain_name, this.state, {
      headers: headers
    })
    .then((response) => {
      console.log(response)
      status =  response.data.status
      if(status === 'COMPLETED'){
        transferResult.id = response.data.hash
        transferResult.status = response.data.status
        console.log(status)
        axios.put(`/api/orders/${this.props.o._id}/pay`, transferResult, {
          headers: { Authorization: `Bearer ${this.props.ui.token}` },
        });
      }
      else{
        console.log(status)
      }
      this.setState({
        isLoading: false,
        show: false 
    });
    window.location.reload();
      //payOrder(this.props.o, response.data)
        //return response.json();
    })
    .catch((error) => {
      this.setState({
        isLoading: false,
        show: false
      });
      console.log('error: ' + error);
      this.setState({ requestFailed: true });
    });
  }


  render() {
    const {src_acc_name, dest_acc_name, amount, src_priv_key} = this.state
    return (
      <div className="ytokenpaymentform">
        <img className="ytokenbaner" src={YtokenBaner} alt="Logo" />
        <form onSubmit={this.submitHandler}>
          <label>
            <div>
              <label for="src">Source Account ID: </label>
              <input id ="src" type="text" name="src_acc_name" value={src_acc_name} onChange={this.changeHandler} /> @ytoken
            </div>
            <div>
              <label for="dest">Destination Account ID: </label>
              <input id ="dest" type="text" name="dest_acc_name" value={dest_acc_name} readonly /> @ytoken
            </div>
            <div>
              <label for="amt">Amount: </label>
              <input id ="amt" type="text" name="amount" value={amount} readonly/>
            </div>
            <div>
              <label for="asst">Source Account Private Key: </label>
              <input id ="asst" type="text" name="src_priv_key" value={src_priv_key} onChange={this.changeHandler} />
            </div>
          </label>
          <input type="submit" value="Submit" disabled={this.state.isLoading}></input>
        </form>
      </div>
    )
  }
}

export default function OrderScreen(props) {
  const orderId = props.match.params.id;
  const [sdkReady, setSdkReady] = useState(false);
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  
  const orderPay = useSelector((state) => state.orderPay);
  const {
    loading: loadingPay,
    error: errorPay,
    success: successPay,
  } = orderPay;
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    error: errorDeliver,
    success: successDeliver,
  } = orderDeliver;
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
      if (
        !order ||
        successPay ||
        successDeliver ||
        (order && order._id !== orderId)
      ) {
        dispatch({ type: ORDER_PAY_RESET });
        dispatch({ type: ORDER_DELIVER_RESET });
        dispatch(detailsOrder(orderId));
      } else {
        if (!order.isPaid) {
          if (!window.paypal) {
            addPayPalScript();
          } else {
            setSdkReady(true);
          }
        }
      }
    }, [dispatch, orderId, sdkReady, successPay, successDeliver, order]);

  
    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(order, paymentResult));
    };


    const deliverHandler = () => {
      dispatch(deliverOrder(order._id));
    };
  
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <h1>Order {order._id}</h1>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2>Payment</h2>
                <p>
                  <strong>Method:</strong> {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <MessageBox variant="success">
                    <p>Paid at {order.paidAt}{"\n"}</p>
                    <p>Transaction Hash: {order.paymentResult.id}</p>
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Paid</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Order Items</h2>
                <ul>
                  {order.orderItems.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="small"
                          ></img>
                        </div>
                        <div className="min-30">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>

                        <div>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </div>

                        {(() => {
                            if (order.isPaid) {
                              return (
                                <div>
                                  <Link to={item.content} target="_blank" download>Download</Link>
                                </div>
                              )
                            } 
                        })()}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1">
          <div className="card card-body">
            <ul>
              <li>
                <h2>Order Summary</h2>
              </li>
              <li>
                <div className="row">
                  <div>Items</div>
                  <div>${order.itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Tax</div>
                  <div>${order.taxPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong> Order Total</strong>
                  </div>
                  <div>
                    <strong>${order.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
              {!order.isPaid && (
                <li>
                  {!sdkReady ? (
                    <LoadingBox></LoadingBox>
                  ) : (
                    <>
                      {errorPay && (
                        <MessageBox variant="danger">{errorPay}</MessageBox>
                      )}
                      {loadingPay && <LoadingBox></LoadingBox>}
                    </>
                  )}
                      <YtokenPaymentForm
                      a={order.totalPrice.toFixed(2)}
                      o={order}
                      ui={userInfo}
                      s={order.seller}
                      //onSuccess={refreshPageAfterPay}
                      ></YtokenPaymentForm>
                </li>
                
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}