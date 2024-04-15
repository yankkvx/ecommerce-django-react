import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import axios from "axios";

function HomeScreen() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchProducts() {
            const { data } = await axios.get("/api/products/");
            setProducts(data);
        }

        fetchProducts()
    }, []);

    return (
        <div>
            <Row>
                <h1>Latest Products</h1>
                {products.map((product) => (
                    <Col key={product.id} sm={12} md={6} lg={4}>
                        <Product product={product} />
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default HomeScreen;
