var React = require('react');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var Register = Register;
var Members = Members;
var Login = Login;
var Index = Index;
var Layout = Layout;

var routes = (
    <Route handler={Layout} path="/">
        <DefaultRoute handler={Index}/>
        <Route path="/register" handler={Register}/>
        <Route path="/members" handler={Members}/>
        <Route path="/login" handler={Login}/>
    </Route>
);

module.exports = {
    routes: routes
};
