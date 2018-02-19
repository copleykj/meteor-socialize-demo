import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cloudinary } from 'meteor/socialize:cloudinary';

const fileContainer = {
    alignItems: 'center',
    display: 'inline-flex',
    overflow: 'hidden',
    position: 'relative',
    verticalAlign: 'top',
};

const fileInput = {
    cursor: 'pointer',
    display: 'block',
    filter: 'alpha(opacity=0)',
    fontSize: '999px',
    minHeight: '100%',
    minWidth: '100%',
    opacity: '0',
    position: 'absolute',
    right: '0',
    textAlign: 'right',
    top: '0',
};

export default class Uploader extends Component {
    static propTypes = {
        afterUpload: PropTypes.func.isRequired,
        children: PropTypes.element.isRequired,
        multiple: PropTypes.bool,
        accept: PropTypes.string,
    }
    static defaultProps = {
        accept: 'image/*',
    }
    onChange = (e) => {
        const uploads = Cloudinary.uploadFiles(e.currentTarget.files);
        uploads.forEach(async (response) => {
            const fileData = await response;
            this.props.afterUpload.call(this, fileData);
        });
    }
    render() {
        return (
            <span style={fileContainer}>
                {this.props.children}
                <input style={fileInput} type="file" accept={this.props.accept} multiple={this.props.multiple} onChange={this.onChange} />
            </span>
        );
    }
}
