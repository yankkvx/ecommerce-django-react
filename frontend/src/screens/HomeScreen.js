import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { listProducts, listFavourites } from "../actions/productActions";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginator from "../components/Paginator";
import LatestCarousel from "../components/LatestCarousel";
import { useNavigate } from "react-router-dom";

function HomeScreen() {
    const dispatch = useDispatch();
    const productList = useSelector((state) => state.productList);
    const {
        error: productError,
        loading: productLoading,
        products,
        page,
        pages,
    } = productList;

    const favouritesList = useSelector((state) => state.favouritesList);
    const { error: favouritesError, loading: favouritesLoading } =
        favouritesList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const navigate = useNavigate();
    const query = window.location.search;

    useEffect(() => {
        dispatch(listProducts(query));
        if (userInfo && userInfo.token) {
            dispatch(listFavourites());
        }
    }, [dispatch, query, userInfo]);

    return (
        <div>
            {!query && <LatestCarousel />}
            <h1 className="title-h1">Our Products</h1>
            {productLoading || favouritesLoading ? (
                <Loader />
            ) : productError || favouritesError ? (
                <Message variant="danger">
                    {productError || favouritesError}
                </Message>
            ) : (
                <div>
                    <Row>
                        {products.map((product) => (
                            <Col key={product.id} sm={12} md={6} lg={4}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                    <Paginator
                        className="text-center"
                        page={page}
                        pages={pages}
                        query={query}
                    />
                </div>
            )}
        </div>
    );
}

export default HomeScreen;
