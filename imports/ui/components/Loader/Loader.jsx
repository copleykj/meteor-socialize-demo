import React from 'react';
import PropTypes from 'prop-types';

const Loader = ({ children, ready, large }) => {
    if (!ready) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className={`la-ball-scale-multiple ${large && 'la-2x'}`}>
                    <div />
                    <div />
                    <div />
                </div>
            </div>
        );
    }
    return React.cloneElement(children);
};

Loader.propTypes = {
    children: PropTypes.node,
    ready: PropTypes.bool,
    large: PropTypes.bool,
};

export default Loader;
