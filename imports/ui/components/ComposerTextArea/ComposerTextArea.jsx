import PropTypes from 'prop-types';
import React, { Component } from 'react';


class ComposerTextArea extends Component {
    componentDidMount() {
        this.ref.style.overflowY = 'hidden';
        this.ref.style.height = `${this.ref.scrollHeight}px`;
    }
    autoSize = () => {
        this.ref.style.height = 'auto';
        this.ref.style.height = `${this.ref.scrollHeight}px`;
    }
    render() {
        const { onFocus, onBlur, onSend, getRef, disabled, className, ...props } = this.props;
        return (
            <textarea
                disabled={disabled}
                ref={(ref) => { this.ref = ref; getRef(ref); }}
                onFocus={onFocus}
                onBlur={onBlur}
                onInput={this.autoSize}
                onKeyPress={(event) => {
                    if (event.shiftKey && event.which === 13) {
                        event.preventDefault();
                        onSend(event.target.value);
                    }
                }}
                className={`${className}`}
                {...props}
            />
        );
    }
}

ComposerTextArea.propTypes = {
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onSend: PropTypes.func,
    getRef: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string,
};

export default ComposerTextArea;
