import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

function Product({ product }) {
    return (
        <Link to={`/products/${product.id}`} className="product-card">
            <Card className="border-0 p-2">
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
                            text={`${product.numReviews} reviews`}
                            color={"#000000"}
                        />
                    </div>
                </Card.Text>

                <Card.Text className="py-2" as="h4">
                    ${product.price}
                </Card.Text>
            </Card>
        </Link>
    );
}

export default Product;
