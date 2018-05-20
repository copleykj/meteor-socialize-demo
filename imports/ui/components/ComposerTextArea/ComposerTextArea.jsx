import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';


class ComposerTextArea extends Component {
    componentDidMount() {
        Meteor.setTimeout(() => {
            this.textarea.style.overflowY = 'hidden';
            this.textarea.style.height = `${this.textarea.scrollHeight}px`;
        }, 10);
    }
    autoSize = () => {
        this.textarea.style.height = 'auto';
        this.textarea.style.height = `${this.textarea.scrollHeight}px`;
    }
    reset = () => {
        this.textarea.value = '';
        this.autoSize();
    }
    render() {
        const { onFocus, onBlur, onSend, getRef, disabled, className, ...props } = this.props;
        getRef(this);
        return (
            <textarea
                disabled={disabled}
                ref={(ref) => { this.textarea = ref; }}
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
    getReset: PropTypes.func,
    onBlur: PropTypes.func,
    onSend: PropTypes.func,
    getRef: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string,
};

export default ComposerTextArea;
