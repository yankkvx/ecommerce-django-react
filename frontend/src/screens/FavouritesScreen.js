import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { listFavourites } from "../actions/productActions";
import { useNavigate } from "react-router-dom";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";

function FavouritesScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const favouritesList = useSelector((state) => state.favouritesList);
    const { error, loading, products } = favouritesList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (!userInfo || userInfo.length === 0) {
            navigate("/login");
        } else {
            dispatch(listFavourites());
        }
    }, [dispatch]);

    return (
        <div>
            <h1 className="title-h1">Favourite products</h1>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Row>
                    {products &&
                        products.map((favourite) => (
                            <Col
                                key={favourite.product.id}
                                sm={12}
                                md={6}
                                lg={4}
                            >
                                <Product product={favourite.product} />
                            </Col>
                        ))}
                </Row>
            )}
        </div>
    );
}

export default FavouritesScreen;
