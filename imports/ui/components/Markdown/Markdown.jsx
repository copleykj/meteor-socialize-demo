import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

class CodeBlock extends PureComponent {
    static defaultProps = {
        language: '',
    }
    static propTypes = {
        value: PropTypes.string.isRequired,
        language: PropTypes.string,
    }
    constructor(props) {
        super(props);
        this.setRef = this.setRef.bind(this);
    }

    componentDidMount() {
        this.highlightCode();
    }

    componentDidUpdate() {
        this.highlightCode();
    }

    setRef(el) {
        this.codeEl = el;
    }

    highlightCode() {
        window && window.hljs.highlightBlock(this.codeEl);
    }

    render() {
        return (
            <pre>
                <code ref={this.setRef} className={`language-${this.props.language}`}>
                    {this.props.value}
                </code>
            </pre>
        );
    }
}

const Markdown = ({ source }) => (
    <ReactMarkdown
        source={source}
        skipHtml
        renderers={{ code: CodeBlock }}
        unwrapDisallowed
    />
);

Markdown.propTypes = {
    source: PropTypes.string,
};

export default Markdown;
