import React from "react";
export const CategoryForm = ({ handleSubmit, name, setName }) => (
    <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
                type="text"
                className="form-control"
                value={name}
                autoFocus
                onChange={e => setName(e.target.value)}
                required
            />
            <br />
            <button className="btn btn-outline-primary">Save</button>
        </div>
    </form>
)