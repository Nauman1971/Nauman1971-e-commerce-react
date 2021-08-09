import React from "react";
import { Drawer } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SET_VISIBLE } from "../../reducers/drawerReducer";
import testImage from "../../images/testimage.jpg";
import { Link } from "react-router-dom";

export const SideDrawer = () => {
    const dispatch = useDispatch();
    const { drawer, cart } = useSelector((state) => ({ ...state }));

    const handleClose = () => {
        dispatch({
            type: SET_VISIBLE,
            payload: false,
        });
    }

    const imageStyle = {
        width: '100%',
        height: 'auto',
        objectFit: 'cover',
    }

    return (
        <Drawer
            closable={false}
            className="text-center"
            title={`Cart / ${cart.length} Product`}
            placement="right"
            onClose={handleClose}
            visible={drawer}
        >
            {cart.map((p) => (
                <div key={p._id} className="row">
                    <div className="col">
                        {p.images[0] ? (
                            <>
                                <img src={p.images[0].url} alt={p.title} style={imageStyle} />
                                <p className="text-center bg-secondary text-light">{p.title} x {p.count}</p>
                            </>
                        ) : (
                            <>
                                <img src={testImage} alt="testimage" style={imageStyle} />
                                <p className="text-center bg-secondary text-light">{p.title} x {p.count}</p>
                            </>
                        )}
                    </div>
                </div>
            ))}
            <Link to="/cart">
                <button className="text-center btn btn-primary btn-raised btn-block"
                    onClick={() =>
                        dispatch({
                            type: SET_VISIBLE,
                            payload: false,
                        })
                    }
                >Go to cart</button>
            </Link>
        </Drawer>
    )
}