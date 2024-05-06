import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { login } from "../actions/userActions";

function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const redirect = new URLSearchParams(window.location.search).get("redirect");
    const userLogin = useSelector((state) => state.userLogin);
    const { error, loading, userInfo } = userLogin;

    useEffect(() => {
        // Check if userInfo is defined and not null or undefined.
        if (userInfo && Object.keys(userInfo).length !== 0) {
            // If we have userInfo and it's not empty proceed.
            // If the "redirect" parameter is not specified, I'll be redirected to the home page ("/").
            navigate(redirect || "/");
        }
    }, [userInfo, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    return (
        <FormContainer>
            <h1>Sign In</h1>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Form onSubmit={submitHandler}>
                    <Form.Group className="py-2" controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group className="py-2" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <div className="py-2 text-center">
                        <Button
                            className="rounded"
                            type="submit"
                            variant="primary"
                        >
                            Sign In
                        </Button>
                    </div>
                </Form>
            )}

            <Row>
                <Col className="text-center">
                    New to Frame?{" "}
                    <Link
                        to={
                            redirect
                                ? `/sign-up?redirect=${redirect}`
                                : "/sign-up"
                        }
                        className="text-link"
                    >
                        Sign Up
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    );
}

export default LoginScreen;
