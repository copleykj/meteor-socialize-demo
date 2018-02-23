import PropTypes from 'prop-types';
import React from 'react';

const ComposerTextArea = ({ onFocus, onBlur, onSend, getRef, disabled, className, ...props }) => (
    <textarea
        disabled={disabled}
        ref={getRef}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyPress={(event) => {
            if (event.shiftKey && event.which === 13) {
                event.preventDefault();
                onSend(event.target.value);
            }
        }}
        className={`form-control ${className}`}
        {...props}
    />
);

ComposerTextArea.propTypes = {
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onSend: PropTypes.func,
    getRef: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string,
};

export default ComposerTextArea;
