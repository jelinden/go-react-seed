var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Link = ReactRouter.Link;

var Layout = React.createClass({
    contextTypes: {
        data: React.PropTypes.any
    },

    statics: {
        toggleHorizontal: function() {
            [].forEach.call(
                document.getElementById('menu').querySelectorAll('.custom-can-transform'),
                function(el) {
                    el.classList.toggle('pure-menu-horizontal');
                }
            );
        },

        toggleMenu: function() {
            // set timeout so that the panel has a chance to roll up
            // before the menu switches states
            if (document.getElementById('menu').classList.contains('open')) {
                setTimeout(Layout.toggleHorizontal, 500);
            }
            else {
                Layout.toggleHorizontal();
            }
            document.getElementById('menu').classList.toggle('open');
            document.getElementById('toggle').classList.toggle('x');
        },

        closeMenu: function() {
            if (document.getElementById('menu').classList.contains('open')) {
                Layout.toggleMenu();
            }
        }
    },

    componentDidMount: function() {
        Layout.closeMenu();
        document.getElementById('toggle').addEventListener('click', function (e) {
            Layout.toggleMenu();
        });
        window.addEventListener(('onorientationchange' in window) ? 'orientationchange':'resize', Layout.closeMenu);
    },

    componentWillUnmount: function() {
        document.getElementById('toggle').removeEventListener('click', function (e) {
            Layout.toggleMenu();
        });
        window.removeEventListener(('onorientationchange' in window) ? 'orientationchange':'resize', Layout.closeMenu);
    },

    render () {
        var menuLoggedIn;
        if (this.context.data !== undefined && this.context.data.User !== undefined) {
            menuLoggedIn = <ul className="pure-menu-list">
                    <li className="pure-menu-item"><div className="pure-menu-link">{this.context.data.User.Username}</div></li>
                    <li className="pure-menu-item"><a href="/logout" className="pure-menu-link">Logout</a></li>
                </ul>;
        } else {
            menuLoggedIn = <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link to="/register" className="pure-menu-link">Register</Link></li>
                    <li className="pure-menu-item"><Link to="/login" className="pure-menu-link">Login</Link></li>
                </ul>;
        }
        return (
            <div>
                <div className="custom-wrapper pure-g" id="menu">
                    <div className="pure-u-1 pure-u-md-1-3">
                        <div className="pure-menu">
                            <Link to="/" className="pure-menu-heading pure-menu-link">Home</Link>
                            <a href="#" className="custom-toggle" id="toggle"><s className="bar"></s><s className="bar"></s><s className="bar"></s></a>
                        </div>
                    </div>
                    <div className="pure-u-1 pure-u-md-1-3">
                        <div className="pure-menu pure-menu-horizontal custom-can-transform">
                            <ul className="pure-menu-list">
                                <li className="pure-menu-item"><Link to="/members" className="pure-menu-link">Members</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pure-u-1 pure-u-md-1-3">
                        <div className="pure-menu pure-menu-horizontal custom-menu-3 custom-can-transform">
                            {menuLoggedIn}
                        </div>
                    </div>
                </div>

                <div className="main">
                    <h1>go react template project</h1>
                    {React.cloneElement(this.props.children, {
                        data: this.context.data
                    })}
                </div>
            </div>
        );
    }
});

module.exports = {
    Layout: Layout
};
