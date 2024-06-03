import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { latestProducts } from "../actions/productActions";
import Loader from "./Loader";
import Message from "./Message";

function LatestCarousel() {
    const dispatch = useDispatch();
    const productLatest = useSelector((state) => state.productLatest);
    const { loading, error, products } = productLatest;

    useEffect(() => {
        dispatch(latestProducts());
    }, [dispatch]);

    return loading ? (
        <Loader />
    ) : error ? (
        <Message variant="danger">{error}</Message>
    ) : (
        <Carousel pause="hover" data-bs-theme="dark">
            {products.map((product) => (
                <Carousel.Item key={product.id} interval={2000}>
                    <Link to={`products/${product.id}`}>
                        <Image className="carousel-img" src={product.images[0]} alt={product.name} />
                        <Carousel.Caption className="carousel-caption">
                            <h5>{product.name}</h5>
                            <h6>New product</h6>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default LatestCarousel;
