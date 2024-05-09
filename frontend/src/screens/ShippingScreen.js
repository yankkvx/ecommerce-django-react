import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { SAVE_SHIPPING_ADDRESS } from "../constants/cartConstants";
import { saveShippingAddress } from "../actions/cartActions";
import Checkout from "../components/Checkout";

function ShippingScreen() {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [country, setCountry] = useState(shippingAddress.country);
    const [city, setCity] = useState(shippingAddress.city);
    const [address, setAddress] = useState(shippingAddress.address);
    const [postal_code, setPostalCode] = useState(shippingAddress.postal_code);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ country, city, address, postal_code }));
        navigate("/payment");
    };

    return (
        <FormContainer >
            <Checkout step1 step2/>
            <h2>Shipping</h2>
            <Form onSubmit={submitHandler}>
                <Form.Group className="py-2" controlId="country">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter country..."
                        value={country ? country : ""}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    ></Form.Control>
                </Form.Group>
                <Form.Group className="py-2" controlId="country">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter city..."
                        value={city ? city : ""}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    ></Form.Control>
                </Form.Group>
                <Form.Group className="py-2" controlId="country">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter address..."
                        value={address ? address : ""}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    ></Form.Control>
                </Form.Group>
                <Form.Group className="py-2" controlId="country">
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter postal code..."
                        value={postal_code ? postal_code : ""}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                    ></Form.Control>
                </Form.Group>

                <Row className="py-2 text-center">
                    <Col>
                        <Button
                            type="submit"
                            variant="primary"
                            className="rounded"
                        >
                            Continue
                        </Button>
                    </Col>
                </Row>
            </Form>
        </FormContainer>
    );
}

export default ShippingScreen;
