import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { getUserProfile, updateUserProfile } from "../actions/userActions";

function UserEditScreen() {
    const params = useParams();
    const dispatch = useDispatch();
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [is_staff, setIsStaff] = useState(false);

    const userId = params.id;

    const userProfile = useSelector((state) => state.userProfile);
    const { error, loading, user } = userProfile;

    useEffect(() => {
        if (!user || user.id !== Number(userId)) {
            dispatch(getUserProfile(userId));
        } else {
            setFirstName(user.first_name);
            setLastName(user.last_name);
            setEmail(user.email);
            setPassword(user.password);
            setIsStaff(user.is_staff);
        }
    }, [dispatch, user, userId]);

    const submitHandler = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            <Link to="/admin/users/">Go back</Link>
            <FormContainer>
                <h2>Edit User</h2>
                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">{error}</Message>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group className="py-2" controlId="first_name">
                            <Form.Label>First name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter user's first name"
                                value={first_name}
                                onChange={(e) => setFirstName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="py-2" controlId="last_name">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter user's last name"
                                value={last_name}
                                onChange={(e) => setLastName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="py-2" controlId="email">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter user's email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="py-2" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter user's password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="py-2" controlId="isstaff">
                            <Form.Check
                                type="checkbox"
                                label="Is Staff"
                                checked={is_staff}
                                onChange={(e) => setIsStaff(e.target.checked)}
                            ></Form.Check>
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

export default UserEditScreen;
