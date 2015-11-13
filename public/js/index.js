var React = require('react');
var ReactDOM = require('react-dom');
var Login = Login;

var Index = React.createClass({
    componentDidMount: function() {
        Layout.closeMenu();
    },

    render() {
        return (
            <div>
                <h2>Home page</h2>
                <div>First page</div>
            </div>
        );
    }
});

module.exports = {
    Index: Index
};
