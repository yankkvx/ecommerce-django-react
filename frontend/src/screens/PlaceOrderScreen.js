import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Checkout from "../components/Checkout";
import Product from "../components/Product";

function PlaceOrderScreen() {
    const cart = useSelector((state) => state.cart);

    cart.items_price = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
    cart.shipping_price = (cart.items_price > 500 ? 0 : cart.items_price * 0.01).toFixed(2);
    cart.total_price = (Number(cart.items_price) + Number(cart.shipping_price)).toFixed(2);

    const placeOrder = () => {
        console.log("Place order");
    };
    return (
        <div>
            <Checkout step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Shipping: </strong>
                                {cart.shippingAddress.address},{" "}
                                {cart.shippingAddress.city},{" "}
                                {cart.shippingAddress.postal_code},{" "}
                                {cart.shippingAddress.country}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {cart.paymentMethod}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cart.cartItems.length === 0 ? (
                                <Message variant="info">Cart is empty</Message>
                            ) : (
                                <ListGroup variant="flush">
                                    {cart.cartItems.map((item, id) => (
                                        <ListGroup.Item key={id}>
                                            <Row>
                                                <Col md={1}>
                                                    <Link
                                                        to={`/products/${item.product}`}
                                                    >
                                                        <Image
                                                            src={item.image}
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
                                    <Col>${cart.items_price}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping: </Col>
                                    <Col>${cart.shipping_price}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${cart.total_price}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button
                                    type="button"
                                    className="w-100"
                                    disabled={cart.cartItems === 0}
                                    onClick={placeOrder}
                                >
                                    Place order
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default PlaceOrderScreen;
