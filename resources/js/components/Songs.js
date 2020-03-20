import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import TableView from './TableView'

const query = "select Track.TrackId as id, Track.name as name, Track.Composer as composer, Track.milliseconds as miliseconds, Artist.name as Name_Artist, Album.title as album, Genre.name as genero from Track inner join Genre on Genre.GenreId = Track.GenreId inner join Album on Album.AlbumId = Track.AlbumId inner join Artist on Artist.artistid = Album.artistid"
const queryById = "select Track.TrackId as id, Track.name as name, Track.Composer as composer, Track.milliseconds as miliseconds, Album.title as album, Genre.name as genero from Track inner join Genre on Genre.GenreId = Track.GenreId inner join Album on Album.AlbumId = Track.AlbumId "
export default class Songs extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="row mt-4">
                <div className="col-12">

                    <TableView permissions={JSON.parse(this.props.permissions)}
                        byIdQuery={queryById}
                        idColumn={"trackid"}
                        errorMessage="Asegurese de que la cancion no dependa de alguien mas"
                        table={"Track"}
                        url={`fetch/${query}`} columns={["Id", "Nombre", "Compositor", "Milisegundos", "Artista", "Album", "Genero"]}
                        filters={JSON.parse(this.props.filterJson)} />
                </div>
                <div className="main-bg"></div>
            </div>
        );
    }
}

if (document.getElementById('songs')) {
    let permissions = document.getElementById('permissions').getAttribute('data')
    let filterJson = document.getElementById('filterJson').getAttribute('data')

    ReactDOM.render(<Songs permissions={permissions} filterJson={filterJson} />, document.getElementById('songs'));
}
