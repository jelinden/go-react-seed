var React = require('react');
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

                        <label for="Id">Email</label>
                        <input id="Id" name="Id" type="email" placeholder="Email"/>

                        <label for="Username">Username</label>
                        <input id="Username" name="Username" type="text" placeholder="username"/>

                        <label for="Password">Password</label>
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
