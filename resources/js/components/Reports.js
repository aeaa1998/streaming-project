import React, { Component, useState } from 'react';
import $ from 'jquery';
import Popper from 'popper.js';
import ReactDOM from 'react-dom';
import { Bar } from 'react-chartjs-2';


const Reports = ({ songsByArtist, songsByGenre, avgDurationByGenre, albumsByArtist }) => {

    const [report, setReport] = useState('songsByArtist')

    let reportLabels;
    let reportData;

    if (report === 'songsByArtist') {
        reportLabels = JSON.parse(songsByArtist).map(artist => artist.description)
        reportData = JSON.parse(songsByArtist).map(artist => artist.quantity)
    }
    if (report === 'songsByGenre') {
        reportLabels = JSON.parse(songsByGenre).map(genre => genre.description)
        reportData = JSON.parse(songsByGenre).map(genre => genre.quantity)
    }

    if (report === 'avgDurationByGenre') {
        reportLabels = JSON.parse(avgDurationByGenre).map(genre => genre.description)
        reportData = JSON.parse(avgDurationByGenre).map(avgDuration => avgDuration.quantity)
    }
    if (report === 'albumsByArtist') {
        reportLabels = JSON.parse(albumsByArtist).map(artist => artist.description)
        reportData = JSON.parse(albumsByArtist).map(artist => artist.quantity)

    }

    const state = {
        labels: reportLabels,
        datasets: [
            {
                label: 'Cantidad',
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: reportData
            }
        ]
    }


    return (
        <div className="row mt-4">
            <div className="col align-self-center">

                <div class="card">
                    <div class="card-header">
                        Reportes
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item" onClick={() => setReport("songsByGenre")}>Géneros con más canciones</li>
                        <li class="list-group-item" onClick={() => setReport("albumsByArtist")} >Artistas con más albumes</li>
                        <li class="list-group-item" onClick={() => setReport("avgDurationByGenre")}>Promedio de duración por género</li>
                        <li class="list-group-item" onClick={() => setReport("songsByArtist")}>Canciones por artista</li>
                    </ul>

                </div>
            </div>

            <div className="col-10 align-self-center">
                <Bar
                    data={state}
                    options={{
                        title: {
                            display: true,
                            text: 'Reporte',
                            fontSize: 20
                        },
                        legend: {
                            display: true,
                            position: 'right'
                        }
                    }}
                />
            </div>
        </div>
    )
}

if (document.getElementById('reports')) {
    let permissions = document.getElementById('permissions').getAttribute('data')
    let songsByGenre = document.getElementById('songsByGenre').getAttribute('data')
    let albumsByArtist = document.getElementById('albumsByArtist').getAttribute('data')
    let avgDurationByGenre = document.getElementById('avgDurationByGenre').getAttribute('data')
    let songsByArtist = document.getElementById('songsByArtist').getAttribute('data')

    ReactDOM.render(<Reports
        permissions={permissions}
        songsByGenre={songsByGenre}
        albumsByArtist={albumsByArtist}
        avgDurationByGenre={avgDurationByGenre}
        songsByArtist={songsByArtist}
    />, document.getElementById('reports'));
}

if (document.getElementById('artists')) {

    ReactDOM.render(<Artists permissions={permissions} filterJson={filterJson} />, document.getElementById('artists'));
}
