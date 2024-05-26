import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { listSingleProduct, editProduct } from "../actions/productActions";
import { EDIT_PRODUCT_RESET } from "../constants/productConstants";

function ProductEditScreen() {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [brand, setBrand] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [count_in_stock, setCountInStock] = useState("");
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState([]);
    const productId = params.id;

    const singleProduct = useSelector((state) => state.singleProduct);
    const { error, loading, product } = singleProduct;

    const productEdit = useSelector((state) => state.productEdit);
    const {
        error: errorEdit,
        loading: loadingEdit,
        success: successEdit,
    } = productEdit;

    useEffect(() => {
        if (successEdit) {
            dispatch({ type: EDIT_PRODUCT_RESET });
            navigate("/admin/products/");
        } else {
            if (!product || product.id !== Number(productId)) {
                dispatch(listSingleProduct(productId));
            } else {
                setName(product.name);
                setCategory(product.category);
                setBrand(product.brand);
                setDescription(product.description);
                setPrice(product.price);
                setCountInStock(product.count_in_stock);
            }
        }
    }, [dispatch, product, productId, successEdit]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(
            editProduct({
                id: product.id,
                name,
                category,
                brand,
                description,
                price,
                count_in_stock,
            })
        );
    };

    const uploadFileHandler = async (e) => {
        const files = e.target.files;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("images", files[i]);
        }
        formData.append("product_id", productId);

        setUploading(true);
        try {
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            const { data } = await axios.post(
                "/api/products/upload/",
                formData,
                config
            );
            setUploading(false);
        } catch (error) {
            setUploading(false);
        }
    };

    return (
        <div>
            <Link to="/admin/products/">Go back</Link>
            <FormContainer>
                <h2>Edit Product</h2>

                {loadingEdit && <Loader />}
                {errorEdit && <Message variant="danger">{errorEdit}</Message>}

                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">{error}</Message>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group className="py-2" controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="py-2" controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter user's last name"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="py-2" controlId="brand">
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter brand"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="py-2" controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="py-2" controlId="price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="py-2" controlId="count_in_stock">
                            <Form.Label>Count in stock</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter quantity"
                                value={count_in_stock}
                                onChange={(e) =>
                                    setCountInStock(e.target.value)
                                }
                            ></Form.Control>
                        </Form.Group>
                        {uploading && <Loader />}

                        <Form.Group className="py-2" controlId="images">
                            <Form.Label>Images</Form.Label>
                            <Form.Control
                                type="file"
                                value={images}
                                onChange={uploadFileHandler}
                                multiple
                            />
                            <Form.Text className="text-muted">
                                Please upload only JPEG or PNG images.
                            </Form.Text>
                        </Form.Group>

                        <div className="py-2 text-center">
                            <Button
                                className="rounded"
                                type="submit"
                                variant="primary"
                            >
                                Update
                            </Button>
                        </div>
                    </Form>
                )}
            </FormContainer>
        </div>
    );
}

export default ProductEditScreen;
