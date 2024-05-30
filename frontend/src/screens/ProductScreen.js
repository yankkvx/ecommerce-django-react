import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
import { listSingleProduct, createReview } from "../actions/productActions";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import RatingReview from "../components/RatingReview";
import { CREATE_REVIEW_RESET } from "../constants/productConstants";

function ProductScreen() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const navigate = useNavigate();
    // Selecting the singleProduct slice of state from Redux store.
    const singleProduct = useSelector((state) => state.singleProduct);
    // Destructuring singleProduct state into error, loading, and product.
    const { error, loading, product } = singleProduct;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const reviewCreate = useSelector((state) => state.reviewCreate);
    const {
        error: errorReview,
        loading: loadingReview,
        success: successReview,
    } = reviewCreate;

    useEffect(() => {
        if (successReview) {
            setRating(0);
            setComment("");
            dispatch({ type: CREATE_REVIEW_RESET });
        }
        dispatch(listSingleProduct(id));
    }, [dispatch, successReview]);

    const addToCartHandler = () => {
        navigate(`/cart/${id}?quantity=${quantity}`); // Use 'id' from useParams
    };

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(
            createReview(id, {
                rating,
                comment,
            })
        );
    };

    return (
        <div>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <div>
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
                                    <h2 className="product-name">
                                        {product.name}
                                    </h2>
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
                                        color={"#000000"}
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
                                                        setQuantity(
                                                            e.target.value
                                                        )
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
                                        onClick={addToCartHandler}
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
                    <Row className="py-3">
                        <Col md={5}>
                            <h4>Reviews</h4>
                            {(!product.reviews ||
                                product.reviews.length === 0) && (
                                <Message variant="info">No Reviews</Message>
                            )}
                            <ListGroup variant="flush">
                                {product.reviews.map((review) => (
                                    <ListGroup.Item key={review.id}>
                                        {review.name}  
                                        <Rating
                                            value={review.rating}
                                            color={"#000000"}
                                        />
                                        <p>
                                            {review.created_at.substring(0, 10)}
                                        </p>
                                        <p className="review-comment">{review.comment}</p>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item>
                                    <h5>Write a review</h5>
                                    {loadingReview && <Loader />}
                                    {successReview && (
                                        <Message variant="success">
                                            Review posted successfully! Thanks
                                            for sharing your thoughts.
                                        </Message>
                                    )}
                                    {errorReview && (
                                        <Message variant="danger">
                                            {errorReview}
                                        </Message>
                                    )}
                                    {userInfo ? (
                                        <Form onSubmit={submitHandler}>
                                            <Form.Group controlId="rating">
                                                <Form.Label>Rating</Form.Label>
                                                <RatingReview
                                                    value={rating}
                                                    color={"#000000"}
                                                    onClick={(value) =>
                                                        setRating(value)
                                                    }
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="comment">
                                                <Form.Label>Comment</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    row="5"
                                                    variant={comment}
                                                    placeholder="Write a comment"
                                                    onChange={(e) =>
                                                        setComment(
                                                            e.target.value
                                                        )
                                                    }
                                                ></Form.Control>
                                            </Form.Group>
                                            <div className="py-2 text-end">
                                                <Button
                                                    className="rounded"
                                                    disabled={loadingReview}
                                                    type="submit"
                                                >
                                                    Submit
                                                </Button>
                                            </div>
                                        </Form>
                                    ) : (
                                        <Message variant="info">
                                            <Link to="/login"> Log in</Link> to
                                            post a review
                                        </Message>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    );
}

export default ProductScreen;
