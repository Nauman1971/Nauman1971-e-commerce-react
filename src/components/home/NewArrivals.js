import { Pagination } from 'antd';
import React, { useEffect, useState } from 'react'
import { getProducts, getProductsCount } from '../../functions/product';
import { LoadingCard } from '../cards/LoadingCard';
import { ProductCard } from '../cards/ProductCard';

export const NewArrivals = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productsCount, setProductsCount] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadAllProducts()
    }, [page]);


    useEffect(() => {
        getProductsCount()
            .then((res) => {
                setProductsCount(res.data)
            }).catch(err => {

            })
    }, [])

    const loadAllProducts = () => {
        getProducts('createdAt', 'desc', page)
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
    }

    return (
        <>
            <div className="container">
                {loading ? <LoadingCard count={3} /> : (
                    <div className="row">
                        {products.map((product) => (
                            <div key={product._id} className="col-md-4">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="row">
                <nav className="col-md-4 offset-md-4 pt-5 p-3">
                    <Pagination
                        current={page}
                        total={(productsCount / page) * 10}
                        onChange={value => setPage(value)} />
                </nav>
            </div>
        </>
    )
}

