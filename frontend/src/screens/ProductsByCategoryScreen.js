import React, { useDebugValue, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { listProductsByCategory } from "../actions/productActions";
import Product from "../components/Product";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";

function ProductsByCategoryScreen() {
    const dispatch = useDispatch();
    const { category } = useParams();
    const productListByCategory = useSelector(
        (state) => state.productListByCategory
    );
    const { error, loading, products } = productListByCategory;

    useEffect(() => {
        dispatch(listProductsByCategory(category));
    }, [dispatch, category]);

    return (
        <div>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Row>
                    <h2 className="title-h2">Category: {category}</h2>
                    {products.map((product) => (
                        <Col key={product.id} sm={12} md={6} lg={4}>
                            <Product product={product} />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}

export default ProductsByCategoryScreen;
