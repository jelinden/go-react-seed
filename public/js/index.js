var React = require('react');
var Login = Login;

var Index = React.createClass({
    componentDidMount: function() {
        Layout.closeMenu();
    },

    render() {
        if (typeof window !== 'undefined') {
            console.log("index page render");
        }
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
