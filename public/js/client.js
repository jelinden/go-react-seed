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
var createHistory = require('history/lib/createBrowserHistory');
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

            res.write(ReactDOMServer.renderToStaticMarkup(
                <Html>
                    <RoutingContext {...routerProps}/>
                </Html>
            ));
        });
    }
}

if (typeof window !== 'undefined') {
    var xmlhttp = new XMLHttpRequest();
    const history = createHistory();
    
    function render() {
        getData(function(data) {
            match({ routes, location: window.location.pathname }, (error, redirectLocation, renderProps) => {
                const routerProps = {
                   ...renderProps,
                   createElement: (Component, props) => {
                       return React.createElement(Component, {...props, data});
                   }
                }

                ReactDOM.render(
                    <DataWrapper data={data}>
                        <Router {...{history, routerProps}}>
                            {routes}
                        </Router>
                    </DataWrapper>, document.getElementById('react-container'));
            });
        }, "/api/users");
    }

    function renderFactory(data) {
        ReactDOM.render(<Router history={createHistory()} data={data}><DataWrapper data={data}>{routes}</DataWrapper></Router>, document.body);
    }

    function getData(callback, apiEndpoint) {
        xmlhttp.open("GET", apiEndpoint, true);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && (xmlhttp.status == 200 || xmlhttp.status == 403)) {
                var data = xmlhttp.responseText;
                callback(JSON.parse(data));
            }
        }
        xmlhttp.send();
    }

    window.onload = function() {
        render();
    }
}
