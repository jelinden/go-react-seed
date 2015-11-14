var React = require('react');
var ReactDOM = require('react-dom');
var ReactDOMServer = require('react-dom/server');
var Router = require('react-router');
var RoutingContext = Router.RoutingContext;
var match = Router.match;
var Html = Html;
var Index = Index;
var routes = routes;
var DataWrapper = DataWrapper;
var createBrowserHistory = require('history/lib/createBrowserHistory');
var createLocation = require('history/lib/createLocation');

if (typeof selfjs !== 'undefined') {
    selfjs.handleRequest = function(req, res, data) {
        match({ routes, location: req.path }, (error, redirectLocation, renderProps) => {
            const routerProps = {
               ...renderProps,
                createElement: (Component, props) => {
                    return React.createElement(Component, {...props, data});
                }
            }

            var reactContainer = ReactDOMServer.renderToString(
                <DataWrapper data={data}>
                    <RoutingContext {...routerProps}/>
                </DataWrapper>);
            res.write(ReactDOMServer.renderToStaticMarkup(
                <Html>
                    <div id='react-container' dangerouslySetInnerHTML={{__html: reactContainer}}>
                    </div>
                </Html>
            ));
        });
    }
}

if (typeof window !== 'undefined') {
    function renderWithData(data) {
        let history = createBrowserHistory();
        ReactDOM.render(
            <DataWrapper data={data}>
                <Router history={history}>{routes}</Router>
            </DataWrapper>, document.getElementById('react-container'));
    }

    function loadServerData(callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "/api/users", true);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && (xmlhttp.status == 200 || xmlhttp.status == 403)) {
                var data = xmlhttp.responseText;
                callback(JSON.parse(data));
            }
        }
        xmlhttp.send();
    }

    window.onload = function() {
        loadServerData(renderWithData);
    }
}
