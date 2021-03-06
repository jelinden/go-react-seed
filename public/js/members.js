var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');
var Login = Login;
var DataWrapper = DataWrapper;

var Members = React.createClass({

    contextTypes: {
        data: React.PropTypes.any
    },

    getInitialState: function() {
        if (this.props.data !== 'undefined' && this.props.data !== null) {
            return { data: this.props.data };
        }
    },

    onChange: function(state) {
        this.setState(state);
    },

    componentDidMount: function() {
        Layout.closeMenu();
    },

    render: function() {
        var userList;
        if (this.state.data !== undefined && this.state.data !== null) {
            if (this.state.data.Err !== "") {
                userList = <div>{this.state.data.Err}</div>;
            } else {
                userList = <UserList data={this.state.data}/>;
            }
        }

        return (
            <div>
                <h2>Members</h2>
                {userList}
            </div>
        );
    }
});

var UserList = React.createClass({
    render: function () {
        return (
            <table className="pure-table"><tbody>
            { this.props.data.Users.map(function (item, i) { 
                return ( 
                    <tr key={i}>
                        <td>{item.Id}</td>
                        <td>{item.Username}</td>
                        <td>{item.Email}</td>
                        <td>{item.Role.Name}</td>
                        <td>{item.EmailVerified?'true':'false'}</td>
                        <td><DateFormat data={item.CreateDate}/></td>
                    </tr>
                ); 
            })}
            </tbody></table>
        );
    }
});

var DateFormat = React.createClass({
    render: function () {
        var formattedFate = moment(this.props.data).format('DD.MM.YYYY hh:mm:ss');
        return (
            <span>{formattedFate}</span>
        );
    }
});

export default Members;
