import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AdminProductCard } from "../../components/cards/AdminProductCard";
import { AdminNav } from "../../components/nav/AdminNav"
import { getProductsByCount, removeProduct } from "../../functions/product"

export const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadAllProducts()
    }, [])

    const loadAllProducts = () => {
        setLoading(true)
        getProductsByCount(100)
            .then((res) => {
                setProducts(res.data)
                setLoading(false);
            })
            .catch((err) => {
                console.log(err)
                setLoading(false);
            });
    }
    const handleRemove = (slug) => {
        let answer = window.confirm("Delete?");

        if (answer) {
            removeProduct(slug, user.token)
                .then(res => {
                    loadAllProducts()
                    toast.error(`${res.data.title} is deleted`);
                })
                .catch(err => {
                    if (err.response.status === 400) toast.error(err.response.data);
                    console.log(err)
                })
            // console.log("Send delete request", slug);
        }
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>

                <div className="col">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                        <h4>All Products</h4>
                    )}
                    <div className="row">
                        {products.map((product) => (
                            <div className="col-md-4 pb-3" key={product._id}>
                                <AdminProductCard
                                    handleRemove={handleRemove}
                                    product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}