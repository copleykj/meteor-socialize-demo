import React from 'react';
import PropTypes from 'prop-types';

const google = [
    [226, 95, 81], // A
    [242, 96, 145], // B
    [187, 101, 202], // C
    [149, 114, 207], // D
    [120, 132, 205], // E
    [91, 149, 249], // F
    [72, 194, 249], // G
    [69, 208, 226], // H
    [72, 182, 172], // I
    [82, 188, 137], // J
    [155, 206, 95], // K
    [212, 227, 74], // L
    [254, 218, 16], // M
    [247, 192, 0], // N
    [255, 168, 0], // O
    [255, 138, 96], // P
    [194, 194, 194], // Q
    [143, 164, 175], // R
    [162, 136, 126], // S
    [163, 163, 163], // T
    [175, 181, 226], // U
    [179, 155, 221], // V
    [194, 194, 194], // W
    [124, 222, 235], // X
    [188, 170, 164], // Y
    [173, 214, 125], // Z
];

const propTypes = {
    name: PropTypes.string,
    size: PropTypes.number,
    fontFamily: PropTypes.string,
};

const defaultProps = {
    name: '?',
    size: 50,
};

const ReactLetterAvatar = ({ name, size, fontFamily, ...props }) => {
    const char = name.trim()[0].toUpperCase();
    const textSize = Math.ceil(size / 1.5);

    let bgColor;
    if (/[A-Z]/.test(char)) {
        const index = char.charCodeAt() - 65;
        bgColor = google[index];
    } else if (/[\d]/.test(char)) {
        bgColor = google[parseInt(char, 10)];
    } else {
        bgColor = [0, 0, 0];
    }

    const backgroundColor = `rgb(${bgColor})`;
    const fontString = fontFamily || 'Lato, Arial, Helvetica Neue, Helvetica, sans-serif';

    const svgImage = `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" style="background-color:${backgroundColor};" width="${size}" height="${size}">
  <text text-anchor="middle" font-family="${fontString}" x="50%" y="50%" dy="0.35em" fill="white" font-size="${textSize}">${char}</text>
</svg>`;

    return (
        <img src={svgImage} alt="" {...props} />
    );
};

ReactLetterAvatar.propTypes = propTypes;
ReactLetterAvatar.defaultProps = defaultProps;

export default ReactLetterAvatar;
