import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Image, Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginator from "../components/Paginator";
import {
    listProducts,
    deleteProduct,
    createProduct,
} from "../actions/productActions";
import { CREATE_PRODUCT_RESET } from "../constants/productConstants";

function ProductsScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const productList = useSelector((state) => state.productList);
    const { products, loading, error, page, pages } = productList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const productDelete = useSelector((state) => state.productDelete);
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = productDelete;

    const query = location.search

    const productCreate = useSelector((state) => state.productCreate);
    const {
        loading: loadingCreate,
        error: errorCreate,
        success: successCreate,
        product: createdProduct,
    } = productCreate;

    useEffect(() => {
        dispatch({ type: CREATE_PRODUCT_RESET });
        if (!userInfo.is_staff) {
            navigate("/login");
        }
        if (successCreate) {
            navigate(`/admin/product/${createdProduct.id}/edit`);
        } else {
            dispatch(listProducts(query));
        }
    }, [
        navigate,
        successDelete,
        dispatch,
        successCreate,
        createdProduct,
        userInfo,
        query
    ]);

    const deleteProductHandler = (id) => {
        if (
            window.confirm(
                `Are you sure, that you want to delete product with ${id} ID?`
            )
        )
            dispatch(deleteProduct(id));
    };

    const addProductHandler = () => {
        dispatch(createProduct());
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
            {loadingDelete && <Loader />}
            {errorDelete && <Message variant="danger">{errorDelete}</Message>}
            {loadingCreate && <Loader />}
            {errorCreate && <Message variant="danger">{errorCreate}</Message>}
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <div>
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
                                                className="products-img"
                                                src={product.images[0]}
                                            />
                                        </td>
                                        <td>{product.name}</td>
                                        <td>{product.category}</td>
                                        <td>{product.brand}</td>
                                        <td>${product.price}</td>
                                        <td>
                                            <Link
                                                to={`/admin/product/${product.id}/edit`}
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
                                                    deleteProductHandler(
                                                        product.id
                                                    )
                                                }
                                            >
                                                <i className="fa-regular fa-trash-can" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                    <Paginator page={page} pages={pages} is_staff={true}/>
                </div>
            )}
        </div>
    );
}

export default ProductsScreen;
