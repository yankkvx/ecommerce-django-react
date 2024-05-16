import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    Row,
    Col,
    Button,
    ListGroup,
    Image,
    Card,
    ListGroupItem,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getOrderDetails } from "../actions/orderActions";

function OrderScreen() {
    const params = useParams();
    const orderId = params.id;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, error, loading } = orderDetails;

    if (!loading && !error) {
        order.items_price = order.orders
            .reduce((acc, item) => acc + item.price * item.quantity, 0)
            .toFixed(2);
    }

    useEffect(() => {
        if (!order || order.id !== Number(orderId)) {
            dispatch(getOrderDetails(orderId));
        }
    }, [order, orderId]);

    return (
        <div>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Row>
                    <Col md={8}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Order: {orderId}</h2>
                                <p>
                                    <strong>Name: </strong>{" "}
                                    {order.user.full_name}
                                </p>
                                <p>
                                    <strong>Email: </strong>{" "}
                                    <a href={`mailto:${order.user.email}`}>
                                        {order.user.email}
                                    </a>
                                </p>
                                <p>
                                    <strong>Shipping: </strong>
                                    {order.shipping_address.address},{" "}
                                    {order.shipping_address.city},{" "}
                                    {order.shipping_address.postal_code},{" "}
                                    {order.shipping_address.country}
                                </p>
                                {order.is_delivered ? (
                                    <Message variant='success'>Delivered at {new Date(order.delivered_at).toLocaleString()}</Message>
                                ) : (
                                    <Message variant='info'>Not delivered</Message>
                                )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h2>Payment Method</h2>
                                <p>
                                    <strong>Method: </strong>
                                    {order.payment_method}
                                </p>
                                {order.is_paid ? (
                                    <Message variant='success'>Paid at {new Date(order.paid_at).toLocaleString()}</Message>
                                ) : (
                                    <Message variant='info'>Not paid</Message>
                                )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h2>Order Items</h2>
                                {order.orders.length === 0 ? (
                                    <Message variant="info">
                                        Order is empty
                                    </Message>
                                ) : (
                                    <ListGroup variant="flush">
                                        {order.orders.map((item, id) => (
                                            <ListGroup.Item key={id}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Link
                                                            to={`/products/${item.product}`}
                                                        >
                                                            <Image
                                                                src={
                                                                    item.image
                                                                        .image
                                                                }
                                                                alt={item.name}
                                                                fluid
                                                                rounded
                                                            />
                                                        </Link>
                                                    </Col>
                                                    <Col>
                                                        <Link
                                                            to={`/products/${item.product}`}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    </Col>
                                                    <Col>
                                                        {item.quantity} x $
                                                        {item.price} = $
                                                        {(
                                                            item.quantity *
                                                            item.price
                                                        ).toFixed(2)}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h2>Order Summary</h2>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items: </Col>
                                        <Col>${order.items_price}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping: </Col>
                                        <Col>${order.shipping_price}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Total</Col>
                                        <Col>${order.total_price}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    {error && (
                                        <Message variant="danger">
                                            {error}
                                        </Message>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default OrderScreen;
