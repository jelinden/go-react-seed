var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;

var Register = Register;
var Members = Members;
var Login = Login;
var Index = Index;
var Layout = Layout;

var routes = (
    <Route component={Layout} path="/">
        <IndexRoute component={Index}/>
        <Route path="/register" component={Register}/>
        <Route path="/members" component={Members}/>
        <Route path="/login" component={Login}/>
    </Route>
);

module.exports = {
    routes: routes
};
