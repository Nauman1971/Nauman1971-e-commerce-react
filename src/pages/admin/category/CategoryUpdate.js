import { AdminNav } from "../../../components/nav/AdminNav"
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import { CategoryForm } from "../../../components/forms/CategoryForm";
import { getSub, updateSub } from "../../../functions/sub";

export const CategoryUpdate = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadCategory();
    }, []);

    const loadCategory = () =>
        getSub(slug).then(c => setName(c.data.name));

    const handleSubmit = (evt) => {
        evt.preventDefault();
        setLoading(true);
        updateSub(slug, { name }, user.token)
            .then(res => {
                setLoading(false);
                setName("");
                toast.success(`"${res.data.name}" is updated`);
                navigate("/admin/category")
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
                    ) : (<h4>Update Category</h4>)}
                    <CategoryForm
                        handleSubmit={handleSubmit}
                        name={name}
                        setName={setName}
                    />

                </div>
            </div>
        </div>
    )
}