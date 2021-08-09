import React, { useState } from "react";
import { Menu, Badge } from "antd";
import { AppstoreOutlined, LogoutOutlined, SettingOutlined, ShoppingCartOutlined, ShoppingOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../../reducers/userReducer";
import { Link } from "react-router-dom";
import { Search } from "../forms/Search";

const { SubMenu, Item } = Menu;

export const Header = () => {
    const [current, setCurrent] = useState("home");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, cart } = useSelector((state) => ({ ...state }));

    const handleClick = (e) => {
        // console.log(e.key);
        setCurrent(e.key);
    };

    const logout = () => {
        firebase.auth().signOut();
        dispatch({
            type: LOGOUT,
            payload: null,
        });
        navigate("login");
    }
    return (
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
            <Item key="home" icon={<AppstoreOutlined />}>
                <Link to="/">Home</Link>
            </Item>
            <Item key="shop" icon={<ShoppingOutlined />}>
                <Link to="/shop">Shop</Link>
            </Item>
            <Item key="cart" icon={<ShoppingCartOutlined />}>
                <Link to="/cart">
                    <Badge offset={[9, 0]} count={cart.length}>
                        Cart
                    </Badge>
                </Link>
            </Item>
            {!user && (
                <Item key="register" icon={<UserAddOutlined />} className="float-right">
                    <Link to="register">Register</Link>
                </Item>
            )}
            {!user && (
                <Item key="login" icon={<UserOutlined />} className="float-right">
                    <Link to="login">Login</Link>
                </Item>
            )}

            {user && (
                <SubMenu
                    key="submenu"
                    icon={<SettingOutlined />}
                    title={user.email && user.email.split('@')[0]}
                    className="float-right">
                    {user && user.role === 'admin' && (
                        <Item> <Link to="/admin/dashboard">Dashboard</Link></Item>
                    )}

                    {user && user.role === 'subscriber' && (
                        <Item> <Link to="/user/history">Dashboard</Link></Item>
                    )}

                    <Item icon={<LogoutOutlined />} onClick={logout}>Logout</Item>
                </SubMenu>
            )}
            <span className="float-right p-1">
                <Search />
            </span>
        </Menu>
    )

}