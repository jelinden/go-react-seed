var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');
var Login = Login;
var DataWrapper = DataWrapper;

var Members = React.createClass({
    contextTypes: {
        data: React.PropTypes.any
    },

    componentDidMount: function() {
        Layout.closeMenu();
    },

    render() {
        var userList, data;
        if (this.context.data !== undefined) {
            data = this.context.data;
        } else {
            data = this.props.data;
        }
        if (data !== undefined) {
            if (data.Err !== "") {
                userList = <div>{data.Err}</div>;
            } else {
                userList = <UserList data={data}/>;
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
                        <td>{item.EmailVerified}</td>
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

module.exports = {
    Members: Members
};
