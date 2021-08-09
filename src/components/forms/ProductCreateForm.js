import React from "react";
import { Select } from "antd";
const { Option } = Select;

export const ProductCreateForm = ({
    handleChange,
    handleSubmit,
    values,
    handleCategoryChange,
    subOptions,
    showSub,
    setValues,
}) => {
    const {
        title,
        description,
        price,
        categories,
        subs,
        quantity,
        colors,
        brands,
    } = values;

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="Title">Title</label>
                <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleChange}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label htmlFor="Description">Description</label>
                <input
                    type="text"
                    name="description"
                    value={description}
                    onChange={handleChange}
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label htmlFor="Price">Price</label>
                <input
                    type="number"
                    name="price"
                    value={price}
                    className="form-control"
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="Shipping">Shipping</label>
                <select
                    name="shipping"
                    className="form-control"
                    onChange={handleChange}
                >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="Quantity">Quantity</label>
                <input
                    type="number"
                    name="quantity"
                    className="form-control"
                    value={quantity}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="Colors">Color</label>
                <select
                    name="color"
                    className="form-control"
                    onChange={handleChange}
                >
                    <option>Please select</option>
                    {colors.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="Brands">Brand</label>
                <select
                    name="brand"
                    className="form-control"
                    onChange={handleChange}
                >
                    <option>Please select</option>
                    {brands.map((b, i) => (
                        <option key={i} value={b}>{b}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                    className="form-control"
                    name="category"
                    onChange={handleCategoryChange}
                >
                    <option>Please select a parent</option>
                    {categories !== undefined && categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                </select>
            </div>
            {showSub && (
                <div>
                    <label htmlFor="sub categories">Sub categories</label>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        value={subs}
                        onChange={value => setValues({ ...values, subs: value })}
                    >
                        {subOptions.length && subOptions.map((s) => (
                            <Option key={s._id} value={s._id}>{s.name}</Option>
                        ))}
                    </Select>
                </div>
            )}
            <button type="submit" className="btn btn-primary">Create</button>
        </form>
    )
}