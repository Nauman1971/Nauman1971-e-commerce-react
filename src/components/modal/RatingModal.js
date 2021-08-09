import React, { useState } from "react";
import { StarOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";

export const RatingModal = ({ children }) => {
    const { user } = useSelector(state => ({ ...state }))
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();
    const { slug } = useParams();

    const handleModal = () => {
        if (user && user.token) {
            setModalVisible(true)
        }
        else {
            navigate({ pathname: '/login' }, { state: { from: `/product/${slug}` } })
        }
    }
    return (
        <>
            <div onClick={handleModal}>
                <StarOutlined className="text-danger" /><br /> {" "}
                {user ? "Leave rating" : "Login to leave rating"}
            </div>
            <Modal
                title="Leave your rating"
                centered
                visible={modalVisible}
                onOk={() => {
                    setModalVisible(false)
                    toast.success('Thanks for your review. It will appear soon.')
                }}
                onCancel={() => setModalVisible(false)}
            >{children}</Modal>
        </>
    )
}