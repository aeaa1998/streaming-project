import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import TableView from './TableView'
const query = "fetch/select Album.albumid as id, Album.title, Artist.name as artista  from Album inner join Artist on Album.artistid = Artist.artistid"
const byId = "select Album.albumid as id, Album.title, Artist.name as artista  from Album inner join Artist on Album.artistid = Artist.artistid"
export default class Albums extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="row mt-4">
                <div className="col-12">

                    <TableView
                        url={query}
                        columns={["Id", "Nombre Album", "Nombre del Artista"]}
                        errorMessage="Asegurese de que el album no dependa de una cancion"
                        byIdQuery={byId}
                        idColumn={"albumid"}
                        table={"album"}
                    />
                </div>

            </div>
        );
    }
}

if (document.getElementById('albums')) {
    ReactDOM.render(<Albums />, document.getElementById('albums'));
}
