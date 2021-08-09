import { AdminNav } from "../../../components/nav/AdminNav"
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSub, updateSub } from "../../../functions/sub";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { CategoryForm } from "../../../components/forms/CategoryForm";
import { getCategories } from "../../../functions/category";

export const SubUpdate = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => ({ ...state }));
    const [categories, setCategories] = useState([]);
    const [parent, setParent] = useState("");

    useEffect(() => {
        loadCategories();
        loadSub();
    }, []);

    const loadCategories = () =>
        getCategories().then(c => setCategories(c.data));

    const loadSub = () =>
        getSub(slug).then(s => {
            setName(s.data.name);
            setParent(s.data.parent)
        });

    const handleSubmit = (evt) => {
        evt.preventDefault();
        setLoading(true);
        updateSub(slug, { name, parent }, user.token)
            .then(res => {
                setLoading(false);
                setName("");
                toast.success(`"${res.data.name}" is Updated`);
                navigate("/admin/sub");

            })
            .catch(err => {
                console.log(err);
                setLoading(false);
                if (err.response.status === 400) toast.error(err.response.data);
            });
    };


    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (<h4>Update Sub</h4>)}
                    <div className="form-group">
                        <label htmlFor="category">Prent Category</label>
                        <select
                            className="form-control"
                            name="category"
                            onChange={e => setParent(e.target.value)}
                        >
                            <option>Please select a parent</option>
                            {categories.length > 0 && categories.map((c) => (
                                <option
                                    selected={c._id === parent}
                                    key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <CategoryForm
                        handleSubmit={handleSubmit}
                        name={name}
                        setName={setName}
                    />

                    <hr />

                </div>
            </div>
        </div>
    )
}