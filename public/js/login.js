var React = require('react');
var Login = Login;

var Login = React.createClass({
    componentDidMount: function() {
        Layout.closeMenu();
    },

    render: function() {
        return (
            <div>
                <form action="/login" method="POST" className="pure-form pure-form-stacked">
                    <fieldset>
                        <legend>Login</legend>

                        <label for="Id">Email</label>
                        <input id="Id" name="Id" type="email" placeholder="Email"/>

                        <label for="Password">Password</label>
                        <input id="Password" name="Password" type="password" placeholder="Password"/>

                        <button type="submit" className="pure-button pure-button-primary">Login</button>
                    </fieldset>
                </form>
            </div>
        );
    }
});

module.exports = {
    Login: Login
};
