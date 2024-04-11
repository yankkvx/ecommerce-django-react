import React from "react";
import { Row, Col } from "react-bootstrap";
import products from "../products";
import Product from "../components/Product";

function HomeScreen() {
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
