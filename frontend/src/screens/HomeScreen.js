import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { listProducts } from "../actions/productActions";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginator from "../components/Paginator";
import LatestCarousel from "../components/LatestCarousel";
import { useNavigate } from "react-router-dom";

function HomeScreen() {
    const dispatch = useDispatch();
    const productList = useSelector((state) => state.productList);
    const { error, loading, products, page, pages } = productList;
    const navigate = useNavigate();
    const query = window.location.search;
    useEffect(() => {
        dispatch(listProducts(query));
    }, [dispatch, query]);

    return (
        <div>
            {!query && <LatestCarousel />}
            <h1 className="title-h1">Our Products</h1>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <div>
                    <Row>
                        {products.map((product) => (
                            <Col key={product.id} sm={12} md={6} lg={4}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                    <Paginator className='text-center' page={page} pages={pages} query={query} />
                </div>
            )}
        </div>
    );
}

export default HomeScreen;
