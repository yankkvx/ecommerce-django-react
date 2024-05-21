import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getUserList, deleteUser } from "../actions/userActions";

function UsersScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userList = useSelector((state) => state.userList);
    const { users, loading, error } = userList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userDelete = useSelector((state) => state.userDelete);
    const { success: successDelete } = userDelete;

    useEffect(() => {
        if (userInfo && userInfo.is_staff) {
            dispatch(getUserList());
        } else {
            navigate("/login");
        }
    }, [navigate, successDelete, dispatch]);

    const deleteUserHandler = (id) => {
        if(window.confirm(`Are you sure, that you want to delete user with ${id} ID?`))
        dispatch(deleteUser(id));
    };

    return (
        <div>
            <h2>Users</h2>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Table striped bordered responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Full Name</th>
                            <th>Admin</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users &&
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.email}</td>
                                    <td>{user.full_name}</td>
                                    <td>
                                        {user.is_staff ? (
                                            <i className="fa-solid fa-check" />
                                        ) : (
                                            <i className="fa-solid fa-xmark " />
                                        )}
                                    </td>
                                    <td>
                                        <Link to={`/admin/user/${user.id}`}>
                                            <Button
                                                variant="info"
                                                className="btn-sm"
                                            >
                                                <i className="fa-solid fa-user-pen" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="danger"
                                            className="btn-sm"
                                            onClick={() =>
                                                deleteUserHandler(user.id)
                                            }
                                        >
                                            <i className="fa-solid fa-user-slash" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
}

export default UsersScreen;
