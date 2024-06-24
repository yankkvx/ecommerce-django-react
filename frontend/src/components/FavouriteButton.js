import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
    addToFavourites,
    removeFavouriteProduct,
} from "../actions/productActions";

const FavouriteButton = ({ productId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const favouritesList = useSelector((state) => state.favouritesList);
    const { products: favouriteProducts } = favouritesList;
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const isFavourite = favouriteProducts.some(
        (favourite) => favourite.product.id === productId
    );

    const handleToggleFavourite = () => {
        // Check if user is logged in.
        if (!userInfo || userInfo.length === 0) {
            navigate("/login");
        } else {
            if (isFavourite) {
                dispatch(removeFavouriteProduct(productId));
            } else {
                dispatch(addToFavourites(productId));
            }
        }
    };

    return (
        <Button
            variant="link"
            onClick={handleToggleFavourite}
            className="fav-button"
        >
            {isFavourite ? (
                <i className="fa-solid fa-heart text-danger" />
            ) : (
                <i className="fa-regular fa-heart" />
            )}
        </Button>
    );
};

export default FavouriteButton;
