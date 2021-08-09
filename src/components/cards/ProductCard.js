import React, { useState } from "react";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons"
import { Card, Tooltip } from "antd"
import { Link } from "react-router-dom"
import { showAverage } from "../../functions/rating";
import testImage from "../../images/testimage.jpg";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux"
import { ADDTO_CART } from "../../reducers/cartReducer";
import { SET_VISIBLE } from "../../reducers/drawerReducer";
const { Meta } = Card;

export const ProductCard = ({ product }) => {
    const { title, images, description, slug, price } = product;
    const [toolTip, setToolTip] = useState('Click to add');
    const dispatch = useDispatch();

    const handleAddToCart = () => {

        // create cart array
        let cart = [];
        if (typeof window !== "undefined") {
            // if cart is in localstorage get it
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem("cart"));
            }
            // push new products to cart
            cart.push({
                ...product,
                count: 1,
            });
            // remove duplicates
            let unique = _.uniqWith(cart, _.isEqual)
            // save to local storage 
            console.log("unique", unique);
            localStorage.setItem('cart', JSON.stringify(unique));
            // show tooltip
            setToolTip("Added");

            // add to redux state
            dispatch({
                type: ADDTO_CART,
                payload: unique,
            });
            // show cart items in side drawer
            dispatch({
                type: SET_VISIBLE,
                payload: true,
            });
        }
    }

    return (
        <>
            {product && product.ratings && product.ratings.length > 0 ? (
                showAverage(product)) : (
                <div className="text-center pt-1 pb-3">No ratings yet</div>
            )
            }
            <Card
                cover={
                    <img alt={title} src={images && images.length ? images[2].url : testImage}
                        style={{ height: '150px', objectFit: "cover" }}
                        className="p-1"
                    />}
                actions={[
                    <Link to={`/product/${slug}`}>
                        <EyeOutlined className="text-warning" />
                        <br />
                    View Product
                </Link>,
                    <Tooltip title={toolTip}>
                        <button
                            style={{ background: 'none', border: "0px", cursor: "pointer" }}
                            onClick={handleAddToCart}
                            disabled={product.quantity < 1}>
                            <ShoppingCartOutlined
                                className="text-danger"
                            // onClick={() => handleRemove(slug)}
                            />
                            <br />
                            {product.quantity < 1 ? 'Out of stock' : 'Add to cart'}
                        </button>
                    </Tooltip>
                ]}
            >
                <Meta title={`${title} - $${price}`} description={`${description && description.substring(0, 40)}...`} />
            </Card>
        </>
    )
}