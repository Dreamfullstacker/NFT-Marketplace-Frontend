import Container from 'react-bootstrap/Container';
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from 'react'
import { logoutAction } from '../action/auth.action';
import { useDispatch, useSelector } from 'react-redux';
import { SET_CURRENT_USER, ACCOUNT_LIST_SUCCESS } from "../constants/actionTypes";
import SimpleToast from './Toast';

function Header(props) {
  const snackbar = useSelector(state => state.snackbar)
  const [alertShow, setAlertShow] = useState(false);
  const [user, SetUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    let token = localStorage.getItem('authToken');
    if(token) {
        let user = jwt_decode(token);
        SetUser(user);
        dispatch({type: SET_CURRENT_USER, data: user});
        dispatch({type: ACCOUNT_LIST_SUCCESS, data: user.accounts});
    }
    if(snackbar.type) {
      setAlertShow(true);
    }
  }, [dispatch, snackbar])
  
  const onLogout = () => {
    dispatch(logoutAction());
    SetUser(null);
  }

  return (
    <>
      <div class="alert-style"><SimpleToast alertShow={alertShow} setAlertShow={setAlertShow} alertTitle={snackbar.type} alertContent={snackbar.message}/></div>
      <div class="header-padding">
          <div bg="dark" variant="light">
            <Container>
              <div class="d-flex justify-content-left">
                <Link to="/">
                  <img
                    alt=""
                    src="/download.jpg"
                    width="100"
                    height="100"
                    className="d-inline-block align-top"
                  />
                </Link>
                {' '}
                <div class="text-white logo-assist-padding h2 flex-grow-1 "><strong>NFT TRADING SITE</strong></div>
                {
                  user ?
                  <div class='text-white h6 text-end logo-assist-padding align-middle'>
                    <Link to="/" class="text-decoration-none text-primary px-3">{user.username}</Link>
                    <Link to="/" class="text-white text-decoration-none" onClick={onLogout}>Logout</Link>
                  </div>
                  :
                  <div class='text-white h6 text-end logo-assist-padding align-middle'>
                    <Link to="/register" class="text-white text-decoration-none px-3 ">Register</Link>
                    <Link to="/login" class="text-white text-decoration-none">Login</Link>
                  </div> 
                }
              </div>
            </Container>
          </div>
        </div>
        <div>{props.children}</div>
      </>
  );
}

export default Header;