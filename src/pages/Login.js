import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row'
import { loginAction } from '../action/auth.action';

function Login() {
    const [userinfo, setUserInfo] = useState({
        email: '',
        password: '',
    })
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onInput = (key) => (e) => {
        setUserInfo({...userinfo, [key]: e.target.value});
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginAction(userinfo, navigate));
    }

    return (
        <div class="body-padding">
            <div bg="dark" variant="light">
            <Container>
                <div class="d-flex justify-content-center">
                    <div class="w-50 p-3 border border-1 rounded-3">
                        <Form className="text-white">
                            <Form.Group className="mb-3" controlId="formGroupEmail">
                                <Form.Label class="text-white py-2">Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" value={userinfo.email} onChange={onInput('email')}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formGroupPassword">
                                <Form.Label class="text-white py-2">Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={userinfo.password} onChange={onInput('password')}/>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalCheck">
                                <Col sm={{ span: 10, offset: 0 }}>
                                <Form.Check label="Remember me" />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3 pt-2">
                                <Col sm={{ span: 12, offset: 0 }}>
                                    <Button type="submit" onClick={onSubmit}>Login</Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            </Container>
            </div>
        </div>
    );
}

export default Login;