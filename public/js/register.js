var React = require('react');
var ReactDOM = require('react-dom');
var Login = Login;

var Register = React.createClass({
    componentDidMount: function() {
        Layout.closeMenu();
    },

    render: function() {
        return (
            <div>
                <form action="/register" method="POST" className="pure-form pure-form-stacked">
                    <fieldset>
                        <legend>Register</legend>

                        <label htmlFor="Id">Email</label>
                        <input id="Id" name="Id" type="email" placeholder="Email"/>

                        <label htmlFor="Username">Username</label>
                        <input id="Username" name="Username" type="text" placeholder="username"/>

                        <label htmlFor="Password">Password</label>
                        <input id="Password" name="Password" type="password" placeholder="Password"/>

                        <button type="submit" className="pure-button pure-button-primary">Register</button>
                    </fieldset>
                </form>
            </div>
        );
    }
});

module.exports = {
    Register: Register
};
