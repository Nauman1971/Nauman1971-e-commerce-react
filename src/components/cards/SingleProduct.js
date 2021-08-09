import React from "react";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Card, Tabs, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import testImage from "../../images/testimage.jpg";
import { ProductListItem } from "./ProductListItem";
import StarRating from "react-star-ratings";
import { RatingModal } from "../modal/RatingModal";
import { showAverage } from "../../functions/rating";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ADDTO_CART } from "../../reducers/cartReducer";
import _ from "lodash";
import { SET_VISIBLE } from "../../reducers/drawerReducer";
import { toast } from "react-toastify";
import { addToWishlist } from "../../functions/user";

const { TabPane } = Tabs;

// this is children component of Product page
export const SingleProduct = ({ product, onStarClick, star }) => {
    const { title, description, images, _id } = product;
    const [toolTip, setToolTip] = useState("Click to add");
    const dispatch = useDispatch()
    const { user } = useSelector((state) => ({ ...state }));
    const navigate = useNavigate();

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
            // console.log("unique", unique);
            localStorage.setItem('cart', JSON.stringify(unique));

            // show tooltip
            setToolTip("Added");
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

    const handleAddToWishlist = (e) => {
        e.preventDefault();
        addToWishlist(product._id, user.token).then(res => {
            console.log("added to wishlist", res.data);
            toast.success('Added to wishlist');
            navigate("/user/wishlist");
        })
    }

    return (
        <>
            <div className="col-md-7">
                {images && images.length ? (
                    <Carousel
                        infiniteLoop
                        autoPlay
                        showArrows={true}
                    >
                        {images && images.map((image) => (
                            <img src={image.url} key={image.public_id} alt={image.title} />
                            // <p className="legend">Legend 1</p> 
                        ))}
                    </Carousel>
                ) : (<Card cover={<img src={testImage} alt="carousel" className="mb-3 card-image" />}></Card>)}
                <Tabs type="card">
                    <TabPane tab="Description" key="1">
                        {description && description}
                    </TabPane>
                    <TabPane tab="More" key="2">
                        Call use on xxx xxx xxx to learn more about this product.
                    </TabPane>
                </Tabs>
            </div>
            <div className="col-md-5">
                <h1 className="bg-info p-3">{title}</h1>
                {product && product.ratings && product.ratings.length > 0 ? showAverage(product) : <div className="text-center pt-1 pb-3">No ratings yet</div>}
                <Card
                    actions={[
                        <>
                            <Tooltip title={toolTip}>
                                <button
                                    style=
                                    {{ background: 'none', border: '0px', cursor: 'pointer' }}
                                    onClick={handleAddToCart}
                                    disabled={product.quantity < 1}
                                >

                                    <ShoppingCartOutlined
                                        className="text-danger"
                                    // onClick={() => handleRemove(slug)}
                                    />
                                    <br />
                                    {product.quantity < 1 ? 'Out of stock' : 'Add to cart'}
                                </button>
                            </Tooltip>
                        </>,
                        <button
                            style=
                            {{ background: 'none', border: '0px', cursor: 'pointer' }}
                            onClick={handleAddToWishlist}>
                            <HeartOutlined className="text-info" />
                            <br />
                            Add to wishlist
                        </button>,
                        <RatingModal>
                            <StarRating
                                name={_id}
                                numberOfStars={5}
                                rating={star}
                                isSelectable={true}
                                starRatedColor="red"
                                changeRating={onStarClick}
                            />
                        </RatingModal>,
                    ]}
                >
                    {/* <Meta
                        title={title}
                        description={description}
                    /> */}
                    <ProductListItem product={product} />
                </Card>
            </div>
        </>
    )
}