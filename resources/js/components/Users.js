import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import UserTableView from './UserTableView'
const query = "fetch/select userid as id, users.name as name, users.email as email, role.name as rol, SubsriptionType.name as subs from users inner join Role on role.roleid = users.roleid inner join SubsriptionType on SubsriptionType.subscriptionTypeId = users.subscriptionTypeId where users.userid != 1"
const specialUrl = "fetch/select userid as id, users.name as name, users.email as email, role.name as rol, SubsriptionType.name as subs from users inner join Role on role.roleid = users.roleid inner join SubsriptionType on SubsriptionType.subscriptionTypeId = users.subscriptionTypeId"
const byId = "select userid as id, users.name as name, users.email as email, role.name as rol, SubsriptionType.name as subs from users inner join Role on role.roleid = users.roleid inner join SubsriptionType on SubsriptionType.subscriptionTypeId = users.subscriptionTypeId"
export default class Users extends Component {

    render() {
        return (
            <div className="row mt-4">
                <div className="col-12">
                    <UserTableView
                        permissions={JSON.parse(this.props.permissions)}
                        url={query}
                        specialUrl={specialUrl}
                        columns={["Id", "Nombre", "Email", "Rol", "Subscripcion"]}
                        errorMessage="Asegurate que el usuario no tenga vinculada ni una suscripción"
                        byIdQuery={byId}
                        idColumn={"userid"}
                        table={"users"}
                        filters={JSON.parse(this.props.filterJson)} />
                </div>

            </div>
        );
    }
}

if (document.getElementById('users')) {

    let permissions = document.getElementById('permissions').getAttribute('data')
    let filterJson = document.getElementById('filterJson').getAttribute('data')

    ReactDOM.render(<Users permissions={permissions} filterJson={filterJson} />, document.getElementById('users'));
}
