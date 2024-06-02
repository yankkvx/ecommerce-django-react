import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SearchBar() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        if (query) {
            navigate(`/?query=${query}&page=1`);
        } else {
            navigate(window.location.pathname);
        }
    };
    return (
        <Form onSubmit={submitHandler} className="d-flex">
            <Form.Control
                type="text"
                name="q"
                onChange={(e) => setQuery(e.target.value)}
                className="mr-sm-2 p-1"
            ></Form.Control>
            <Button type="submit" variant="outline-primary" className="p-1">
                <i className="fa-solid fa-magnifying-glass" />
            </Button>
        </Form>
    );
}

export default SearchBar;
