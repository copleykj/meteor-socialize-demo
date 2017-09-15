import PropTypes from 'prop-types';
import React from 'react';

const ComposerTextArea = ({ onFocus, onBlur, onSend, getRef, disabled }) => (
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
        className="form-control"
    />
);

ComposerTextArea.propTypes = {
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onSend: PropTypes.func,
    getRef: PropTypes.func,
    disabled: PropTypes.bool,
};

export default ComposerTextArea;
