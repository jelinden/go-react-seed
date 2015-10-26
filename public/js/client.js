var React = require('react');
var Html = Html;

if (typeof selfjs !== 'undefined') {
    selfjs.handleRequest = function(req, res, data) {
        Router.run(routes, req.path, function(Root, state) {
            var html = React.createFactory(Html)({
                markup: <Root params={state.params} data={data}/>
            });

            res.write(React.renderToStaticMarkup(html));
        });
    }
}

if (typeof window !== 'undefined') {
    var xmlhttp = new XMLHttpRequest();

    function render() {
        Router.run(routes, Router.HistoryLocation, function(Root, state) {
            if (state.path === "/") {
                renderFactoryPlain(Root, state);
            }
            if (state.path === "/register") {
                renderFactoryPlain(Root, state);
            }
            if (state.path === "/login") {
                renderFactoryPlain(Root, state);
            }
            if (state.path === "/members") {
                getData(function(data) {
                    renderFactory(Root, state, data);
                }, "/api/users");
            }

        });
    }

    function renderFactory(Root, state, data) {
        React.render(<Root params={state.params} data={data}/>, document.body);
    }

    function renderFactoryPlain(Root, state) {
        React.render(<Root params={state.params}/>, document.body);
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
