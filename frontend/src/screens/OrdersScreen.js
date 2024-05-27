import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getOrders } from "../actions/orderActions";

function OrdersScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const orderList = useSelector((state) => state.orderList);
    const { orders, loading, error } = orderList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (userInfo && userInfo.is_staff) {
            dispatch(getOrders());
        } else {
            navigate("/login");
        }
    }, [dispatch, navigate, userInfo]);

    return (
        <div>
            <h2>Orders</h2>
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
                            <th>Name</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th>Paid</th>
                            <th>Delivered</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders &&
                            orders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.user && order.user.email}</td>
                                    <td>
                                        {order.user && order.user.full_name}
                                    </td>
                                    <td>{order.created_at.substring(0, 10)}</td>
                                    <td>${order.total_price}</td>
                                    <td>
                                        {order.is_paid ? (
                                            order.paid_at.substring(0, 10)
                                        ) : (
                                            <i className="fa-solid fa-xmark" aria-label="Not Paid"></i>
                                        )}
                                    </td>
                                    <td>
                                        {order.is_delivered ? (
                                            order.delivered_at.substring(0, 10)
                                        ) : (
                                            <i className="fa-solid fa-xmark" aria-label="Not Delivered"></i>
                                        )}
                                    </td>
                                    <td>
                                        <Link to={`/orders/${order.id}`}>
                                            <Button
                                                className="btn-sm"
                                            >
                                                Details
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
}

export default OrdersScreen;
