import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Form, Button, Table, Tab } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getUserProfile, updateUserProfile } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constants/userConstants";
import { getUserOrders } from "../actions/orderActions";

function ProfileScreen() {
    const [first_name, setFirstName] = useState();
    const [last_name, setLastName] = useState();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userProfile = useSelector((state) => state.userProfile);
    const { error, loading, user } = userProfile;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userUpdate = useSelector((state) => state.userUpdate);
    const { success } = userUpdate;

    const userOrders = useSelector((state) => state.userOrders);
    const { loading: loadingOrders, error: errorOrders, orders } = userOrders;

    useEffect(() => {
        if (!userInfo || userInfo.length === 0) {
            navigate("/login");
        } else {
            if (!user || !user.email || success || userInfo.id !== user.id) {
                dispatch({ type: USER_UPDATE_RESET });
                dispatch(getUserProfile("profile"));
                dispatch(getUserOrders());
            } else {
                setFirstName(user.first_name);
                setLastName(user.last_name);
                setEmail(user.email);
            }
        }
    }, [dispatch, userInfo, user, navigate, success]);

    const submitHandler = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords don't match");
        } else {
            dispatch(
                updateUserProfile({
                    id: user.id,
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: password,
                })
            );
        }
    };

    return (
        <Row>
            <Col md={4}>
                <h3>User Profile</h3>
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
                        <Form.Group
                            className="py-2"
                            controlId="passwordConfirm"
                        >
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                            ></Form.Control>
                        </Form.Group>
                        <div className="py-2 text-center">
                            <Button
                                className="rounded"
                                type="submit"
                                variant="primary"
                            >
                                Update
                            </Button>
                        </div>
                    </Form>
                )}
            </Col>
            <Col md={8}>
                <h3>My Orders</h3>
                {loadingOrders ? (
                    <Loader />
                ) : errorOrders ? (
                    <Message variant="danger">{errorOrders}</Message>
                ) : (
                    <Table striped responsive className="table-sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Price</th>
                                <th>Paid</th>
                                <th>Delivered</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr>
                                    <td>{order.id}</td>
                                    <td>{order.created_at.substring(0, 10)}</td>
                                    <td>${order.total_price}</td>
                                    {order.is_paid ? (
                                        <td>
                                            <i
                                                className="fa-solid fa-check"
                                                style={{ color: "green" }}
                                            />
                                        </td>
                                    ) : (
                                        <td>
                                            <i
                                                className="fa-solid fa-xmark "
                                                style={{ color: "red" }}
                                            />
                                        </td>
                                    )}
                                    <td>
                                        <LinkContainer
                                            to={`/orders/${order.id}`}
                                        >
                                            <Button className="btn-sm">Details</Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    );
}

export default ProfileScreen;
