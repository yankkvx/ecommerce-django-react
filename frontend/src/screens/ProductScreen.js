import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Row,
    Col,
    Carousel,
    Image,
    ListGroup,
    Button,
    Form,
    ListGroupItem,
} from "react-bootstrap";
import { listSingleProduct } from "../actions/productActions";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";

function ProductScreen({ history }) {
    const { id } = useParams();
    const dispatch = useDispatch();
    // Selecting the singleProduct slice of state from Redux store.
    const singleProduct = useSelector((state) => state.singleProduct);
    // Destructuring singleProduct state into error, loading, and product.
    const { error, loading, product } = singleProduct;

    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(listSingleProduct(id));
    }, [dispatch]);

    const addToCartHadler = () => {
        navigate(`/cart/${id}?quantity=${quantity}`);
    };

    return (
        <div>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Row className="py-3">
                    <Col md={5}>
                        <Carousel>
                            {product.images &&
                                product.images.map((image, index) => (
                                    <Carousel.Item key={index}>
                                        <Image
                                            src={image}
                                            alt={product.name}
                                            fluid
                                        />
                                    </Carousel.Item>
                                ))}
                        </Carousel>
                    </Col>
                    <Col md={4}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2 className="product-name">{product.name}</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <p className="product-description">
                                    Brand: {product.brand}
                                </p>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <p className="product-description">
                                    Price: <strong>${product.price}</strong>
                                </p>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Rating
                                    value={product.rating}
                                    text={`${product.num_reviews} reviews`}
                                />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <p className="product-description">
                                    {product.description}
                                </p>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={3}>
                        <ListGroup variant="flush">
                            <ListGroup.Item as="h2">
                                <Row className="justify-content-center">
                                    <Col>Price:</Col>
                                    <Col>${product.price}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Status:</Col>
                                    <Col>
                                        {product.count_in_stock > 0
                                            ? "In Stock"
                                            : "Out of Stock"}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            {product.count_in_stock > 0 && (
                                <ListGroupItem>
                                    <Row>
                                        <Col>Quantity:</Col>
                                        <Col xs="auto" className="my-1">
                                            <Form.Control
                                                as="select"
                                                value={quantity}
                                                onChange={(e) =>
                                                    setQuantity(e.target.value)
                                                }
                                            >
                                                {[
                                                    ...Array(
                                                        product.count_in_stock
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
                                    </Row>
                                </ListGroupItem>
                            )}
                            <ListGroup.Item>
                                <Button
                                    onClick={addToCartHadler}
                                    className="col-12"
                                    type="button"
                                    disabled={product.count_in_stock === 0}
                                >
                                    Add to Cart
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default ProductScreen;
