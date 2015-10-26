var React = require('react');
var moment = require('moment');
var Login = Login;

var Members = React.createClass({
    componentDidMount: function() {
        Layout.closeMenu();
    },

    render() {
        if (typeof window !== 'undefined') {
            console.log("Members page render");
        }
        var userList;
        if (this.props.data.Err !== "") {
            userList = <div>{this.props.data.Err}</div>;
        } else {
            userList = <table className="pure-table"><UserList data={this.props.data}/></table>;
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
            <div>
                {
                    this.props.data.Users.map(function (item, i) { 
                        return ( 
                            <tr>
                                <td>{item.Id}</td>
                                <td>{item.Username}</td>
                                <td>{item.Role.Name}</td>
                                <td><DateFormat data={item.CreateDate}/></td>
                            </tr>
                        ); 
                    })
                }
            </div>
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
