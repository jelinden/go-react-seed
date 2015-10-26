var React = require('react');

var Html = React.createClass({
    render: function() {
        return (
            <html>
                <head>
                    <meta charSet="utf-8" />
                    <meta httpEquiv="x-ua-compatible" content="ie=edge" />
                    <title>Go - React - Template</title>
                    <link rel="shortcut icon" href="favicon.ico" />
                    <meta name="description" content="" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="stylesheet" href="/public/css/pure-min.css" />
                    <link rel="stylesheet" href="/public/css/index.css" />
                </head>
                <body>
                    {this.props.markup}
                    <script src="/universal.js" async></script>
                </body>
             </html>
        );
    }
});

module.exports = {
    Html: Html
};
