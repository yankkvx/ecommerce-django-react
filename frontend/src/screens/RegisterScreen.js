import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { register } from "../actions/userActions";

function RegisterScreen() {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const redirect = new URLSearchParams(window.location.search).get(
        "redirect"
    );

    const userRegister = useSelector((state) => state.userRegister);
    const { error, loading, userInfo } = userRegister;

    useEffect(() => {
        if (userInfo && Object.keys(userInfo).length !== 0) {
            navigate(redirect || "/");
        }
    }, [userInfo, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();

        if (password != confirmPassword) {
            setMessage("Passwords don't match");
        } else {
            dispatch(register(first_name, last_name, email, password));
        }
    };

    return (
        <FormContainer>
            <h1>Sign Up</h1>
            {message && <Message variant="danger">{message}</Message>}
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Form onSubmit={submitHandler}>
                    <Form.Group className="py-2" controlId="first_name">
                        <Form.Label>First name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your first name"
                            value={first_name}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className="py-2" controlId="last_name">
                        <Form.Label>Last name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your last name"
                            value={last_name}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className="py-2" controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className="py-2" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className="py-2" controlId="passwordConfirm">
                        <Form.Label>Confirm password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        ></Form.Control>
                    </Form.Group>
                    <div className="py-2 text-center">
                        <Button
                            className="rounded"
                            type="submit"
                            variant="primary"
                        >
                            Sign Up
                        </Button>
                    </div>
                </Form>
            )}
            <Row>
                <Col className="text-center">
                    Already have an account?{" "}
                    <Link
                        to={redirect ? `/login?redirect=${redirect}` : "/login"}
                        className="text-link"
                    >
                        Sing In
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    );
}

export default RegisterScreen;
