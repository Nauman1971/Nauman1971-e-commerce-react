import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { AdminNav } from "../../components/nav/AdminNav"
import { updateProduct } from "../../functions/product"
import { toast } from "react-toastify";
import { getProduct } from "../../functions/product";
import { FileUpload } from "../../components/forms/FileUpload";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { ProductUpdateForm } from "../../components/forms/ProductUpdateForm";
import { getCategories, getCategorySubs } from "../../functions/category";

const initialState = {
    title: "",
    description: "",
    price: "",
    category: "",
    subs: [],
    shipping: "",
    quantity: "",
    images: [],
    colors: ["Black", "Brown", "Silver", "White", "Blue"],
    brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
    color: "",
    brand: "",
};

export const ProductUpdate = () => {
    const { user } = useSelector((state) => ({ ...state }));
    const { slug } = useParams();
    const [values, setValues] = useState(initialState);
    const [subOptions, setSubsOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [arrayOfSubs, setArrayOfSubs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        loadProduct()
        loadCategories();
    }, [])

    const loadProduct = () => {
        getProduct(slug)
            .then(p => {
                // console.log('single product', p)
                // 1: load single product
                setValues({ ...values, ...p.data })
                // 2: load single product category subs
                getCategorySubs(p.data.category._id)
                    .then(res => {
                        setSubsOptions(res.data) // on first load default subs
                    })
                // 3 prepare array of sub ids to show as default sub values in antd Select
                let arr = [];
                p.data.subs.map((s) => {
                    arr.push(s._id);
                })
                setArrayOfSubs((prev) => arr) // required for antd select
            })
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        setLoading(true);

        values.subs = arrayOfSubs
        values.category = selectedCategory ? selectedCategory : values.category;

        updateProduct(slug, values, user.token)
            .then(res => {
                setLoading(false)
                toast.success(`"${res.data.title}" is updated`);
                navigate("/admin/products");
            })
            .catch(err => {
                console.log(err);
                toast.error(err.response.data.err);
            })
    }

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    const loadCategories = () => {
        getCategories().then(c => setCategories(c.data))
    }

    const handleCategoryChange = (e) => {
        e.preventDefault();
        console.log('Clicked category', e.target.value);
        setValues({ ...values, subs: [] });
        setSelectedCategory(e.target.value)
        getCategorySubs(e.target.value)
            .then((res) => {
                console.log('sub options on category click', res);
                setSubsOptions(res.data);
            });

        // if user clicks back to the original category
        // show its sub category default
        if (values.category._id === e.target.value) {
            loadProduct()
        }
        setArrayOfSubs([]);
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>

                <div className="col-md-10">
                    {loading ? (
                        <LoadingOutlined className="text-danger h1" />
                    ) : (
                        <h4>Product Update</h4>
                    )}
                    <FileUpload
                        values={values}
                        setValues={setValues}
                        setLoading={setLoading}
                    />
                    <ProductUpdateForm
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        values={values}
                        setValue={setValues}
                        categories={categories}
                        handleCategoryChange={handleCategoryChange}
                        subOptions={subOptions}
                        arrayOfSubs={arrayOfSubs}
                        setArrayOfSubs={setArrayOfSubs}
                        selectedCategory={selectedCategory}
                    />
                    <hr />
                </div>
            </div>
        </div>
    )
}