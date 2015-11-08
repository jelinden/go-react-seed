var React = require('react');
var ReactDOM = require('react-dom');

var DataWrapper = React.createClass({
    propTypes: {
		data: React.PropTypes.any
	},
    childContextTypes: {
         data: React.PropTypes.any
    },

    getChildContext: function() {
        return {
            data: this.props.data
        };
    },

    render: function() {
        return this.props.children;
    }
});

module.exports = {
    DataWrapper: DataWrapper
};
