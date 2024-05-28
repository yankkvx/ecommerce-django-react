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
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
    getOrderDetails,
    payOrder,
    deliverOrder,
} from "../actions/orderActions";
import {
    ORDER_PAY_RESET,
    ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

function OrderScreen() {
    const params = useParams();
    const orderId = params.id;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [sdkReady, setSdkReady] = useState();

    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, error, loading } = orderDetails;

    const orderPay = useSelector((state) => state.orderPay);
    const { loading: loadingPay, success: successPay } = orderPay;

    const orderDeliver = useSelector((state) => state.orderDeliver);
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    if (!loading && !error) {
        order.items_price = order.orders
            .reduce((acc, item) => acc + item.price * item.quantity, 0)
            .toFixed(2);
    }

    const addPaypalScript = () => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}&currency=USD`;
        script.async = true;
        script.onload = () => {
            setSdkReady(true);
        };
        document.body.appendChild(script);
    };

    useEffect(() => {

        if(!userInfo) {
            navigate('/login')
        }

        if (
            !order ||
            successPay ||
            order.id !== Number(orderId) ||
            successDeliver
        ) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch({ type: ORDER_DELIVER_RESET });
            dispatch(getOrderDetails(orderId));
        } else if (!order.is_paid) {
            if (!window.paypal) {
                addPaypalScript();
            } else {
                setSdkReady(true);
            }
        }
    }, [dispatch, order, orderId, successPay, successDeliver]);

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult));
    };

    const deliverHandler = () => {
        dispatch(deliverOrder(order));
    };

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
                                    <Message variant="success">
                                        Delivered at{" "}
                                        {new Date(
                                            order.delivered_at
                                        ).toLocaleString()}
                                    </Message>
                                ) : (
                                    <Message variant="info">
                                        Not delivered
                                    </Message>
                                )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h2>Payment Method</h2>
                                <p>
                                    <strong>Method: </strong>
                                    {order.payment_method}
                                </p>
                                {order.is_paid ? (
                                    <Message variant="success">
                                        Paid at{" "}
                                        {new Date(
                                            order.paid_at
                                        ).toLocaleString()}
                                    </Message>
                                ) : (
                                    <Message variant="info">Not paid</Message>
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
                                {!order.is_paid && (
                                    <ListGroup.Item>
                                        {loadingPay && <Loader />}
                                        {!sdkReady ? (
                                            <Loader />
                                        ) : (
                                            <PayPalScriptProvider
                                                options={{
                                                    "client-id":
                                                        process.env
                                                            .REACT_APP_PAYPAL_CLIENT_ID,
                                                    currency: "USD",
                                                }}
                                            >
                                                <PayPalButtons
                                                    createOrder={(
                                                        data,
                                                        actions
                                                    ) => {
                                                        return actions.order.create(
                                                            {
                                                                purchase_units:
                                                                    [
                                                                        {
                                                                            amount: {
                                                                                value: order.total_price,
                                                                            },
                                                                        },
                                                                    ],
                                                            }
                                                        );
                                                    }}
                                                    onApprove={(
                                                        data,
                                                        actions
                                                    ) => {
                                                        return actions.order
                                                            .capture()
                                                            .then((details) => {
                                                                successPaymentHandler(
                                                                    details
                                                                );
                                                            });
                                                    }}
                                                />
                                            </PayPalScriptProvider>
                                        )}
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                            {loadingDeliver && <Loader />}
                            {userInfo &&
                                userInfo.is_staff &&
                                order.is_paid &&
                                !order.is_delivered && (
                                    <ListGroup.Item>
                                        <Button
                                            type="button"
                                            className="w-100"
                                            onClick={deliverHandler}
                                        >
                                            Mark as delivered
                                        </Button>
                                    </ListGroup.Item>
                                )}
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default OrderScreen;
