import React from "react";
import PropTypes from "prop-types";

const SearchStatus = ({ onChange, value }) => {
    return (
        <form action="">
            <div>
                <input
                    type="text"
                    value={value}
                    name="filter"
                    onChange={onChange}
                    placeholder="Search..."
                />
            </div>
        </form>
    );
};
SearchStatus.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string
};

export default SearchStatus;
