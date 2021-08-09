import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { ProductCard } from "../components/cards/ProductCard";
import {
    getProductsByCount,
    fetchProductByFilter,
} from "../functions/product";
import { getCategories } from "../functions/category";
import { getSubs } from "../functions/sub";
import { Menu, Radio, Slider, Checkbox } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import { DollarOutlined, DownSquareOutlined, StarOutlined } from "@ant-design/icons";
import { SEARCH_QUERY } from "../reducers/searchReducer";
import { Star } from "../components/forms/Star";

export const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState([0, 0]);
    const [ok, setOk] = useState(false);
    const [categories, setCategories] = useState([]);
    const [caetgoryIds, setCategoryIds] = useState([]);
    const [star, setStar] = useState("");
    const [subs, setSubs] = useState([]);
    const [sub, setSub] = useState("");
    const [color, setColor] = useState("");
    const [brand, setBrand] = useState("");
    const [shipping, setShipping] = useState("");
    const colors = ["Black", "Brown", "Silver", "Blue", "White", "Red"];
    const brands = ["Apple", "Samsung", "Microsoft", "Lenovo", "Asus", "Hp"];

    const dispatch = useDispatch();
    const { search } = useSelector(state => ({ ...state }));
    const { text } = search;

    useEffect(() => {
        loadAllProducts();
        // fetch categories
        getCategories().then(res => setCategories(res.data));
        getSubs().then(res => setSubs(res.data))
    }, []);

    const fetchProducts = (arg) => {
        fetchProductByFilter(arg).then((res) => {
            setProducts(res.data)
        })
    }

    // 1. load products by default on page load 
    const loadAllProducts = () => {
        getProductsByCount(12).then((p) => {
            setProducts(p.data);
            setLoading(false);
        })
    }

    // 2. load products on user search input
    useEffect(() => {
        const delayed = setTimeout(() => {
            fetchProducts({ query: text })
            if (!text) {
                loadAllProducts();
            }
        }, 300);
        return () => clearTimeout(delayed)
        // console.log("load products on user search input", text);
    }, [text]);



    // 3. load products based on 
    useEffect(() => {
        console.log('ok to request');
        fetchProducts({ price });
    }, [ok])

    const handleSlider = (value) => {
        dispatch({
            type: SEARCH_QUERY,
            payload: { text: "" },
        });

        // reset.
        setCategoryIds([])
        setPrice(value);
        setStar("");
        setSub("");
        setBrand("");
        setColor("");
        setShipping("");
        setTimeout(() => {
            setOk(!ok)
        }, 300);
    }

    // 4. Load products based on category
    // show categories in a list of checkbox
    const showCategories = () => categories.map((c) =>
        <div key={c._id}>
            <Checkbox
                className="pb-2 pl-4 pr-4"
                checked={caetgoryIds.includes(c._id)}
                value={c._id}
                name="category"
                onChange={handleChange}
            >{c.name}</Checkbox>
        </div>)

    // handle check for categories
    const handleChange = (e) => {
        dispatch({
            type: SEARCH_QUERY,
            payload: { text: "" },
        })
        // reset
        setPrice([0, 0]);
        setStar("");
        setSub("");
        setBrand("");
        setColor("");
        setShipping("");
        // console.log(e.target.value);
        let inTheState = [...caetgoryIds];
        let justChecked = e.target.value;
        let foundInTheState = inTheState.indexOf(justChecked); // index or -1

        // indexOf methi=od ?? if not found returns -1 else return index
        if (foundInTheState === -1) {
            inTheState.push(justChecked);
        }
        else {
            // if found pull out one item from index
            inTheState.splice(foundInTheState, 1);
        }
        setCategoryIds(inTheState);
        // console.log(inTheState);
        fetchProducts({ category: inTheState })
    };

    // 5. show products by star rating
    const handleStarClick = (num) => {
        // console.log(num)
        // reset
        dispatch({
            type: SEARCH_QUERY,
            payload: { text: "" },
        })
        setPrice([0, 0]);
        setCategoryIds([]);
        setSub("");
        setBrand("");
        setColor("");
        setShipping("");
        setStar(num);
        fetchProducts({ stars: star });
    }
    const showStars = () => (
        <div className="pr-4 pl-4 pb-2">
            <Star starClick={handleStarClick} numberOfStars={5} />
            <Star starClick={handleStarClick} numberOfStars={4} />
            <Star starClick={handleStarClick} numberOfStars={3} />
            <Star starClick={handleStarClick} numberOfStars={2} />
            <Star starClick={handleStarClick} numberOfStars={1} />
        </div>
    )

    // 6. show products by sub categories
    const showSubs = () => subs.map((s) =>
        <div key={s._id}
            className="p-1 m-1 badge badge-secondary"
            style={{ cursor: "pointer" }}
            onClick={() => handleSub(s)}>
            {s.name}
        </div>)
    const handleSub = (sub) => {
        // console.log('SUB', sub);
        setSub(sub);
        dispatch({
            type: SEARCH_QUERY,
            payload: { text: "" },
        })
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar("");
        setBrand("");
        setColor("");
        setShipping("");
        fetchProducts({ sub });
    }

    // 7. show products based on brand name
    const showBrands = () => brands.map((b) =>
        <Radio
            className="pb-1 pl-4 pr-4"
            key={b}
            value={b}
            name={b}
            checked={b === brand}
            onChange={handleBrand}
        >{b}</Radio>
    )

    const handleBrand = (e) => {
        setSub("");
        dispatch({
            type: SEARCH_QUERY,
            payload: { text: "" },
        })
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar("");
        setColor("");
        setShipping("");
        setBrand(e.target.value)
        fetchProducts({ brand });
    }

    // 8. show products based on color
    const showColors = () => colors.map((c) =>
        <Radio
            className="pb-1 pl-4 pr-4"
            key={c}
            value={c}
            name={c}
            checked={c === color}
            onChange={handleColor}
        >{c}</Radio>
    )

    const handleColor = (e) => {
        setSub("");
        dispatch({
            type: SEARCH_QUERY,
            payload: { text: "" },
        })
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar("");
        setBrand("");
        setShipping("");
        setColor(e.target.value)
        fetchProducts({ color });
    }

    // 9. show products based on shipping yes/no
    const showShipping = () =>
        <>
            <Checkbox
                className="pb-2 pl-4 pr-4"
                onChange={handleShippingchange}
                value="Yes"
                checked={shipping === "Yes"}
            >Yes</Checkbox>
            <Checkbox
                className="pb-2 pl-4 pr-4"
                onChange={handleShippingchange}
                value="No"
                checked={shipping === "No"}
            >No</Checkbox>
        </>

    const handleShippingchange = (e) => {
        setSub("");
        dispatch({
            type: SEARCH_QUERY,
            payload: { text: "" },
        })
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar("");
        setBrand("");
        setColor("");
        setShipping(e.target.value);
        fetchProducts({ shipping });
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 pt-2">
                    <h4>Search/Filter</h4>
                    <Menu
                        defaultOpenKeys={['1', '2', '3', '4', '5', '6', '7']}
                        mode="inline"
                    >
                        {/* Price */}
                        <SubMenu title={
                            <span className="h6">
                                <DollarOutlined /> Price
                            </span>}
                            key="1">
                            <div><Slider
                                className="ml-4 mr-4"
                                tipFormatter={(v) => `$${v}`}
                                range
                                value={price}
                                max="4999"
                                onChange={handleSlider}
                            /></div>
                        </SubMenu>

                        {/* category */}
                        <SubMenu title={
                            <span className="h6">
                                <DownSquareOutlined /> Categories
                            </span>}
                            key="2">
                            <div style={{ marginTop: "-10px" }}>
                                {showCategories()}
                            </div>
                        </SubMenu>

                        {/* stars */}
                        <SubMenu title={
                            <span className="h6">
                                <StarOutlined />Rating
                            </span>}
                            key="3">
                            <div style={{ marginTop: "-10px" }}>
                                {showStars()}
                            </div>
                        </SubMenu>
                        {/* sub category */}
                        <SubMenu title={
                            <span className="h6">
                                <DownSquareOutlined /> Sub Categories
                            </span>}
                            key="4">
                            <div className="pl-4 pr-4" style={{ marginTop: "-10px" }}>
                                {showSubs()}
                            </div>
                        </SubMenu>
                        {/* brands */}
                        <SubMenu title={
                            <span className="h6">
                                <DownSquareOutlined /> Brands
                            </span>}
                            key="5">
                            <div className="pr-5" style={{ marginTop: "-10px" }}>
                                {showBrands()}
                            </div>
                        </SubMenu>
                        {/* colors */}
                        <SubMenu title={
                            <span className="h6">
                                <DownSquareOutlined /> Colors
                            </span>}
                            key="6">
                            <div className="pr-5" style={{ marginTop: "-10px" }}>
                                {showColors()}
                            </div>
                        </SubMenu>
                        {/* shipping */}
                        <SubMenu title={
                            <span className="h6">
                                <DownSquareOutlined /> Shipping
                            </span>}
                            key="7">
                            <div className="pr-5" style={{ marginTop: "-10px" }}>
                                {showShipping()}
                            </div>
                        </SubMenu>
                    </Menu>
                </div>
                <div className="col-md-9 pt-2">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                        <h4 className="text-danger">Products</h4>
                    )}
                    {products.length < 1 && <p>No products found</p>}
                    <div className="row pb-5">
                        {products.map((p) => <div
                            className="col-md-4 mt-3"
                            key={p._id}>
                            <ProductCard product={p} />
                        </div>)}
                    </div>
                </div>
            </div>
        </div>
    )
}