import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router";
import { SEARCH_QUERY } from "../../reducers/searchReducer";

export const Search = () => {
    const dispatch = useDispatch();
    const { search } = useSelector((state) => ({ ...state }));
    const { text } = search;
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/shop?${text}`)

    };

    const handleChange = (e) => {
        dispatch({
            type: SEARCH_QUERY,
            payload: { text: e.target.value }
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="form-inline my-2 my-lg-0">
            <input type="search"
                value={text}
                className="form-control mr-sm-2"
                placeholder="Search"
                onChange={handleChange}
            />
            <SearchOutlined
                style={{ cursor: "pointer" }}
                onClick={handleSubmit} />
        </form>
    )
}