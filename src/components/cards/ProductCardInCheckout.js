import React from "react";
import { CheckCircleOutlined, CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";
import ModalImage from "react-modal-image";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import testImage from "../../images/testimage.jpg";
import { ADDTO_CART } from "../../reducers/cartReducer";

export const ProductCardInCheckout = ({ p }) => {
    const colors = ["Black", "Brown", "Silver", "Blue", "White", "Red"];
    const dispatch = useDispatch();

    const handleColor = (e) => {
        let cart = [];
        if (typeof window !== "undefined") {
            if (localStorage.getItem("cart")) {
                cart = JSON.parse(localStorage.getItem("cart"));
            }

            cart.map((product, i) => {
                if (product._id === p._id) {
                    cart[i].color = e.target.value;
                }
            });

            // console.log('cart update color', cart)
            localStorage.setItem("cart", JSON.stringify(cart));
            dispatch({
                type: ADDTO_CART,
                payload: cart,
            })
        }
    }

    const handleQtyChange = (e) => {
        let count = e.target.value < 1 ? 1 : e.target.value;
        // console.log(count)
        console.log(p.quantity)
        let cart = [];
        if (count > p.quantity) {
            toast.error(`Max available quantity: ${p.quantity}`)
            return;
        }
        if (typeof window !== "undefined") {
            if (localStorage.getItem("cart")) {
                cart = JSON.parse(localStorage.getItem("cart"));
            }
            cart.map((product, i) => {
                if (product._id === p._id) {
                    cart[i].count = count;
                }
            });
            localStorage.setItem('cart', JSON.stringify(cart))
            dispatch({
                type: ADDTO_CART,
                payload: cart,
            })
        }
    }

    const handleRemove = (id) => {
        let cart = [];

        if (typeof window !== "undefined") {
            if (localStorage.getItem("cart")) {
                cart = JSON.parse(localStorage.getItem("cart"));
            }
            cart.map((product, i) => {
                if (product._id === p._id) {
                    cart.splice(i, 1)
                }
            });
            localStorage.setItem('cart', JSON.stringify(cart))
            dispatch({
                type: ADDTO_CART,
                payload: cart,
            })
        }
    }
    return (
        <tbody>
            <tr>
                <td><div style={{ width: '100px', height: 'auto' }}>
                    {p.images.length ? (
                        <ModalImage
                            small={p.images[0].url}
                            large={p.images[0].url}
                        />
                    ) : (
                        <ModalImage
                            small={testImage}
                            large={testImage}
                        />
                    )}
                </div></td>
                <td>{p.title}</td>
                <td>{p.price}</td>
                <td>{p.brand}</td>
                <td>
                    <select className="form-control" onChange={handleColor} name="color">
                        {p.color ? <option value={p.color}>{p.color}</option> : <option value="Select">Select</option>}
                        {colors
                            .filter((c) => c !== p.color)
                            .map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </td>
                <td>
                    <input
                        type="number"
                        value={p.count}
                        onChange={handleQtyChange}
                        className="form-control" />
                </td>
                <td>
                    {p.shipping === "Yes" ? (
                        <CheckCircleOutlined className="text-success" />
                    ) : (
                        <CloseCircleOutlined className="text-danger" />
                    )}
                </td>
                <td>
                    <CloseOutlined className="text-danger" onClick={handleRemove} />
                </td>
            </tr>
        </tbody>
    )
}