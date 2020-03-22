import React, { Component, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import RolesTable from './RolesTable'

export default class Role extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="row mt-4">
                <div className="col-12">
                    <RolesTable />
                </div>
                <div className="main-bg"></div>
            </div>
        );
    }
}

if (document.getElementById('roles')) {
    ReactDOM.render(<Role />, document.getElementById('roles'));
}

