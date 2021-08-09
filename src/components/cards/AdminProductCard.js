import React from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Card } from "antd"
import { Link } from "react-router-dom";
import testImage from "../../images/testimage.jpg";


const { Meta } = Card;

export const AdminProductCard = ({ product, handleRemove }) => {
    const { title, description, images, slug } = product;

    return (
        <Card
            cover={
                <img alt={title} src={images && images.length ? images[2].url : testImage}
                    style={{ height: '150px', objectFit: "cover" }}
                    className="p-1"
                />}
            actions={[
                <Link to={`/admin/product/${slug}`}>
                    <EditOutlined className="text-warning" />
                </Link>,
                <DeleteOutlined
                    className="text-danger"
                    onClick={() => handleRemove(slug)}
                />
            ]}
        >
            <Meta title={title} description={`${description && description.substring(0, 40)}...`} />
        </Card>
    )
}