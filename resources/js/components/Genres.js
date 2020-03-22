import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import TableView from './TableView'

export default class Genres extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="row mt-4">
                <div className="col-12">

                    <TableView
                        url={"fetch/select genreid as id, name from Genre"}
                        columns={["Id", "Nombre del Genero"]}
                        errorMessage="Asegurese de que el artista no tenga una cancion o album"
                        byIdQuery={"select genreid as id, name from Genre"}
                        idColumn={"genreid"}
                        table={"Genre"}
                    />
                </div>

            </div>
        );
    }
}

if (document.getElementById('genres')) {
    ReactDOM.render(<Genres />, document.getElementById('genres'));
}
