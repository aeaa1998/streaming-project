import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import TableView from './TableView'

export default class Artists extends Component {
    constructor(props) {
        super(props);
        // console.log('data from component', JSON.parse(this.props.permissions));
    }
    render() {
        return (
            <div className="row mt-4">
                <div className="col-12">

                    <TableView
                        permissions={JSON.parse(this.props.permissions)}
                        url={"fetch/select artistid as id, name from Artist"}
                        columns={["Id", "Nombre del Artista"]}
                        errorMessage="Asegurese de que el artista no tenga una cancion o album"
                        byIdQuery={"select artistid as id, name from Artist"}
                        idColumn={"artistid"}
                        table={"Artist"}
                        filters={JSON.parse(this.props.filterJson)} />
                </div>

            </div>
        );
    }
}

if (document.getElementById('artists')) {
    let permissions = document.getElementById('permissions').getAttribute('data')
    let filterJson = document.getElementById('filterJson').getAttribute('data')
    ReactDOM.render(<Artists permissions={permissions} filterJson={filterJson} />, document.getElementById('artists'));
}
