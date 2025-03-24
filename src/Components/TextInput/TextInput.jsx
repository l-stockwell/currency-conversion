import React from 'react';
import PropTypes from 'prop-types';
import classes from './TextInput.module.css';

const TextInput = ({ label, value, onChange, type = 'text', placeholder, style }) => {
    return (
        <div className={classes.container} style={style}>
            {label && <label className={classes.label}>{label}</label>}
            <input
                className={classes.input}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
};

TextInput.propTypes = {
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    style: PropTypes.object,
};

export default TextInput;
