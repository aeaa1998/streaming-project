import React, { Component, useState } from 'react';
import $ from 'jquery';
import Popper from 'popper.js';
import ReactDOM from 'react-dom';
import { Bar } from 'react-chartjs-2';


const Reports = ({ songsByArtist, songsByGenre, avgDurationByGenre, albumsByArtist }) => {

    const [report, setReport] = useState('songsByArtist')

    // console.log("songsByArtist", JSON.parse(songsByArtist))
    // console.log("songsByGenre", JSON.parse(songsByGenre))
    // console.log("avgDurationByGenre", JSON.parse(avgDurationByGenre))
    // console.log("albumsByArtist", JSON.parse(albumsByArtist))

    let reportLabels;
    let reportData;

    if (report === 'songsByArtist') {
        reportLabels = JSON.parse(songsByArtist).map(artist => artist.description)
        reportData = JSON.parse(songsByArtist).map(artist => artist.quantity)
    }
    if (report === 'songsByGenre') {
        reportLabels = JSON.parse(songsByGenre).map(genre => genre.description)
        reportData = JSON.parse(songsByGenre)
    }
    if (report === 'avgDurationByGenre') {
        reportLabels = JSON.parse(avgDurationByGenre)
        reportData = JSON.parse(avgDurationByGenre)
    }
    if (report === 'albumsByArtist') {
        reportLabels = JSON.parse(albumsByArtist)
        reportData = JSON.parse(albumsByArtist)
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
                <div>hola <br />
                    acá <br />
                    iria <br />
                    el <br />
                    menu <br />
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
