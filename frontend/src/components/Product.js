import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import FavouriteButton from "./FavouriteButton";

function Product({ product }) {
    return (
        <div className="product-card-container">
            <Card className="border-0 p-2">
                <Link to={`/products/${product.id}`} className="product-card">
                    <div className="zooming-container">
                        <Card.Img className="zoomimg" src={product.images[0]} />
                    </div>

                    <Card.Text as="div">
                        <strong>{product.name}</strong>
                    </Card.Text>
                    <Card.Text as="div">{product.brand}</Card.Text>
                    <Card.Text as="div">
                        <div>
                            <Rating
                                value={product.rating}
                                text={`${product.num_reviews} reviews`}
                                color={"#000000"}
                            />
                        </div>
                    </Card.Text>
                </Link>

                <div className="d-flex justify-content-between align-items-center">
                    <Card.Text as="h4">${product.price}</Card.Text>
                    <FavouriteButton productId={product.id} />
                </div>
            </Card>
        </div>
    );
}

export default Product;
