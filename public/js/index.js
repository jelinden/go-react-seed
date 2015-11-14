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
                <div>This is a seed project with universal Reactjs and Go backend.
                Registering and logging in are supported. Email verification is sent, but not enforced yet.</div>
            </div>
        );
    }
});

module.exports = {
    Index: Index
};
