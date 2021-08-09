import React from "react";
export const LocalSearch = ({ keyword, setKeyword }) => {
    // step 3
    const handleSearch = (evt) => {
        evt.preventDefault();
        setKeyword(evt.target.value.toLowerCase());
    }

    return (
        <div className="container pt-4 pb-4">
            {/* step 2 */}
            <input type="search"
                placeholder="Filter"
                value={keyword}
                onChange={handleSearch}
                className="form-control mb-4"
            />
        </div>
    )
}