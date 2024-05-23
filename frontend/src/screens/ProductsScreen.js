import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Image, Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listProducts } from "../actions/productActions";

function ProductsScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const productList = useSelector((state) => state.productList);
    const { products, loading, error } = productList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (userInfo && userInfo.is_staff) {
            dispatch(listProducts());
        } else {
            navigate("/login");
        }
    }, [navigate, dispatch]);

    const deleteProductHandler = (id) => {
        window.confirm(
            `Are you sure, that you want to delete product with ${id} ID?`
        );
    };

    const addProductHandler = (product) => {
        console.log("add new product");
    };

    return (
        <div>
            <Row className="align-items-center pb-2">
                <Col>
                    <h2>Products</h2>
                </Col>
                <Col className="text-end">
                    <Button className="my-3 btn-sm" onClick={addProductHandler}>
                        <i className="fa-solid fa-plus" /> Add product
                    </Button>
                </Col>
            </Row>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Table striped bordered responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Brand</th>
                            <th>Price</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products &&
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>
                                        <Image
                                            className="img-fluid" 
                                            src={product.images[0]}
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>${product.price}</td>
                                    <td>
                                        <Link
                                            to={`/admin/product/${product.id}`}
                                        >
                                            <Button
                                                variant="info"
                                                className="btn-sm"
                                            >
                                                <i className="fa-regular fa-pen-to-square" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="danger"
                                            className="btn-sm"
                                            onClick={() =>
                                                deleteProductHandler(product.id)
                                            }
                                        >
                                            <i className="fa-regular fa-trash-can" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
}

export default ProductsScreen;
