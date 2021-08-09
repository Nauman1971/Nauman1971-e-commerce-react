import { AdminNav } from "../../../components/nav/AdminNav"
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createSub, getSubs, removeSub } from "../../../functions/sub";
import { toast } from "react-toastify";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { CategoryForm } from "../../../components/forms/CategoryForm";
import { LocalSearch } from "../../../components/forms/LoacalSearch";
import { getCategories } from "../../../functions/category";

export const SubCreate = () => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => ({ ...state }));
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");
    const [subs, setSubs] = useState([]);

    // step 1
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        loadCategories();
        loadSubs();
    }, []);

    const loadCategories = () =>
        getCategories().then(c => setCategories(c.data));

    const loadSubs = () =>
        getSubs().then(c => setSubs(c.data));

    const handleSubmit = (evt) => {
        evt.preventDefault();
        setLoading(true);
        createSub({ name, parent: category }, user.token)
            .then(res => {
                setLoading(false);
                setName("");
                toast.success(`"${res.data.name}" is created`);
                loadSubs();
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
                if (err.response.status === 400) toast.error(err.response.data);
            });
    };

    const handleRemove = async (slug) => {
        // let answer = window.confirm("Delete?");
        // console.log(answer, slug)
        if (window.confirm("Delete?")) {
            setLoading(true);
            removeSub(slug, user.token)
                .then(res => {
                    setLoading(false);
                    toast.error(`${res.data.name} deleted`);
                    loadSubs();
                })
                .catch(err => {
                    if (err.response.status === 400) {
                        setLoading(false);
                        toast.error(err.response.data);
                    }
                })
        }
    }


    // step 4
    const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword)

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (<h4>Create Sub</h4>)}
                    <div className="form-group">
                        <label htmlFor="category">Prent Category</label>
                        <select
                            className="form-control"
                            name="category"
                            onChange={e => setCategory(e.target.value)}
                        >
                            <option>Please select a parent</option>
                            {categories.length > 0 && categories.map((c) => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <CategoryForm
                        handleSubmit={handleSubmit}
                        name={name}
                        setName={setName}
                    />

                    <LocalSearch
                        keyword={keyword}
                        setKeyword={setKeyword}
                    />

                    <hr />
                    {/* step 5 */}
                    {subs.filter(searched(keyword)).map((s) => (
                        <div className="alert alert-secondary" key={s._id}>
                            {s.name}
                            <span onClick={() => handleRemove(s.slug)} className="btn btn-sm float-right">
                                <DeleteOutlined className="text-danger" />
                            </span>
                            <Link to={`/admin/sub/${s.slug}`}>
                                <span className="btn btn-sm float-right">
                                    <EditOutlined className="text-warning" />
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}