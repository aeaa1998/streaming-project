import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import TableView from './TableView'
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';


import CircularProgress from '@material-ui/core/CircularProgress';
import Switch from '@material-ui/core/Switch';

import FilterListIcon from '@material-ui/icons/FilterList';

export default class Artists extends Component {
    render() {
        return (
            <div className="row mt-4">
                <div className="offset-2 col-8">

                    <TableView columns={["Id", "Nombre del Artista"]} />
                </div>
                <div className="main-bg"></div>
            </div>
        );
    }
}

if (document.getElementById('artists')) {

    ReactDOM.render(<Artists />, document.getElementById('artists'));
}
