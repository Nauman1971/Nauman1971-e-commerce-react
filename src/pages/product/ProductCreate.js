import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { AdminNav } from "../../components/nav/AdminNav"
import { createProduct } from "../../functions/product"
import { toast } from "react-toastify";
import { ProductCreateForm } from "../../components/forms/ProductCreateForm";
import { getCategories, getCategorySubs } from "../../functions/category";
import { FileUpload } from "../../components/forms/FileUpload";
import { LoadingOutlined } from "@ant-design/icons";

const initialState = {
    title: "",
    description: "",
    price: "",
    category: "",
    subs: [],
    shipping: "",
    quantity: "",
    images: [],
    colors: ["Black", "Brown", "Silver", "Blue", "White", "Red"],
    brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "Asus", "Hp"],
    color: "",
    brand: "",
}
export const ProductCreate = () => {
    const { user } = useSelector((state) => ({ ...state }));
    const [values, setValues] = useState(initialState);
    const [subOptions, setSubsOptions] = useState([]);
    const [showSub, setShowSub] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => {
        getCategories().then(c => setValues({ ...values, categories: c.data }))
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        createProduct(values, user.token)
            .then(res => {
                console.log(res.data)
                window.alert(`"${res.data.title}" is created`)
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
                // if (err.response.status === 400) toast.error(err.resonse.data);
                toast.error(err.response.data.err)
            })
    };
    const handleChange = (evt) => {
        setValues({ ...values, [evt.target.name]: evt.target.value });
    };

    const handleCategoryChange = (e) => {
        e.preventDefault();
        console.log('Clicked category', e.target.value);
        setValues({ ...values, subs: [], category: e.target.value });
        getCategorySubs(e.target.value)
            .then((res) => {
                console.log('sub options on category click', res);
                setSubsOptions(res.data);
            });
        setShowSub(true);
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>

                <div className="col-md-10">
                    {loading ? <LoadingOutlined
                        className="text-danger h1"
                    /> : (
                        <h4>Product create</h4>
                    )}
                    <hr />
                    {JSON.stringify(values.images)}
                    <div className="p-3">
                        <FileUpload
                            values={values}
                            setValues={setValues}
                            setLoading={setLoading}
                        />
                    </div>
                    <ProductCreateForm
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        setValues={setValues}
                        values={values}
                        handleCategoryChange={handleCategoryChange}
                        subOptions={subOptions}
                        showSub={showSub}
                    />
                </div>
            </div>
        </div>
    )
}