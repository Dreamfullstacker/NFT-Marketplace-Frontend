import React,  { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { registerAction } from '../action/auth.action';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row'

function Register() {
    const [userinfo, setUserInfo] = useState({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    })
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onInput = (key) => (e) => {
        setUserInfo({...userinfo, [key]: e.target.value});
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        dispatch(registerAction(userinfo, navigate));
    }

    return (
        <div class="body-padding">
            <div bg="dark" variant="light">
            <Container>
                <div class="d-flex justify-content-center">
                        <div class="w-50 p-3 border border-1 rounded-3">
                            <Form class="text-white">
                                <Form.Group className="mb-3" controlId="formGroupUsername">
                                    <Form.Label class="text-white py-2">Username</Form.Label>
                                    <Form.Control type="text" placeholder="Username" value={userinfo.username} onChange={onInput("username")}/>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formGroupEmail">
                                    <Form.Label class="text-white py-2">Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" value={userinfo.email} onChange={onInput("email")}/>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formGroupPassword">
                                    <Form.Label class="text-white py-2">Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" value={userinfo.password} onChange={onInput("password")}/>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formGroupPassword2">
                                    <Form.Label class="text-white py-2">Confirm Password</Form.Label>
                                    <Form.Control type="password" placeholder="Confirm Password" value={userinfo.password_confirmation} onChange={onInput("password_confirmation")}/>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3 pt-3">
                                    <Col sm={{ span: 12, offset: 0 }}>
                                        <Button type="submit" onClick={onSubmit}>Register</Button>
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

export default Register;