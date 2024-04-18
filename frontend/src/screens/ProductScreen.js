import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
    Row,
    Col,
    Carousel,
    Image,
    ListGroup,
    Button,
    Card,
} from "react-bootstrap";
import axios from "axios";

function ProductScreen() {
    const { id } = useParams();
    
    const [product, setProduct] = useState([]);

    useEffect(() => {
        async function fetchProduct() {
            const { data } = await axios.get(`/api/products/${id}`);
            setProduct(data);
        }

        fetchProduct()
    }, []);

    return (
        <Row className="py-3">
            <Col md={5}>
                <Carousel>
                    {product.images && product.images.map((image, index) => (
                        <Carousel.Item key={index}>
                            <Image src={image} alt={product.name} fluid />
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
                    <ListGroup.Item>
                        <Button className="col-12" type="button" disabled={product.count_in_stock === 0}>
                            Add to Cart
                        </Button>
                    </ListGroup.Item>
                </ListGroup>
            </Col>
        </Row>
    );
}

export default ProductScreen;