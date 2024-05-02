import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Row,
    Col,
    Image,
    ListGroup,
    Form,
    Button,
    Card,
} from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { addToCart, removeFromCart } from "../actions/cartActions";

function CartScreen() {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const productId = params.id;
    const quantity = location.search
        ? Number(location.search.split("=")[1])
        : 1;

    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, quantity));
        }
    }, [dispatch, productId, quantity]);

    const removeFromCarthandler = (id) => {
        dispatch(removeFromCart(id))
    };

    const checkoutHandler = () => {
        navigate("/login?redirect=shipping");
    };

    return (
        <Row>
            <Col md={8}>
                <h1 className="title-h1">Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <Message variant="warning">
                        Your cart is empty.<Link to="/">Go Back</Link>
                    </Message>
                ) : (
                    <ListGroup variant="flush">
                        {cartItems.map((item) => (
                            <ListGroup.Item key={item.product}>
                                <Row>
                                    <Col md={2}>
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fluid
                                            rounded
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/products/${item.product}`}>
                                            {" "}
                                            {item.name}
                                        </Link>
                                    </Col>
                                    <Col>Price: ${item.price}</Col>
                                    <Col md={3}>
                                        <Form.Control
                                            as="select"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                dispatch(
                                                    addToCart(
                                                        item.product,
                                                        Number(e.target.value)
                                                    )
                                                )
                                            }
                                        >
                                            {[
                                                ...Array(
                                                    item.count_in_stock
                                                ).keys(),
                                            ].map((x) => (
                                                <option
                                                    key={x + 1}
                                                    value={x + 1}
                                                >
                                                    {/* Array starts with 0, so we need to increment that each time */}
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>

                                    <Col md={1}>
                                        <Button
                                            type="button"
                                            variant="light"
                                            onClick={() =>
                                                removeFromCarthandler(
                                                    item.product
                                                )
                                            }
                                        >
                                            <i className="fa-solid fa-trash" />
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2 className="title-h2">
                                Subtotal (
                                {cartItems.reduce(
                                    (acc, item) => acc + item.quantity,
                                    0
                                )}
                                ) items
                            </h2>
                            $
                            {cartItems
                                .reduce(
                                    (acc, item) =>
                                        acc + item.quantity * item.price,
                                    0
                                )
                                .toFixed(2)}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button
                                type="button"
                                className="w-100"
                                disabled={cartItems.length === 0}
                                onClick={checkoutHandler}
                            >
                                Proceed to Chekcout
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    );
}

export default CartScreen;
