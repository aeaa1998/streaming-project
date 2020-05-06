import React, { Component, useState } from 'react';
import $ from 'jquery';
import Popper from 'popper.js';
import ReactDOM from 'react-dom';
import { Bar } from 'react-chartjs-2';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const Reports = ({ 
    albumsByArtist,
    songsByGenre,
    durationByPlaylist,
    durationBySong,
    songsByArtist,
    durationByGenre,
    artistByPlaylist,
    genresByArtist,
 }) => {

    const [report, setReport] = useState('songsByArtist');
    const [isAdvanced, setIsAdvanced] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const BAR_COLORS = ['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 0.5)', 'rgba(0, 255, 255, 0.5)']
    const labels = [ 'albumsByArtist', 'songsByGenre', 'durationByPlaylist', 'durationBySong', 'songsByArtist', 'durationByGenre', 'artistByPlaylist', 'genresByArtist']

    let label;
    let reportLabels;
    let reportData;
    let reportDataColors;

    switch(report) {
        case "albumsByArtist": {
            label = labels[0]
            reportLabels = JSON.parse(albumsByArtist).map(i => i.description);
            reportData = JSON.parse(albumsByArtist).map(i => i.quantity);
            reportDataColors = JSON.parse(albumsByArtist).map((_, index) => BAR_COLORS[index % 4]);
            break;
        }
        case "songsByGenre": {
            label = labels[1]
            reportLabels = JSON.parse(songsByGenre).map(i => i.description);
            reportData = JSON.parse(songsByGenre).map(i => i.quantity);
            reportDataColors = JSON.parse(songsByGenre).map((_, index) => BAR_COLORS[index % 4]);
            break;
        }
        case "durationByPlaylist": {
            label = labels[2]
            reportLabels = JSON.parse(durationByPlaylist).map(i => i.description);
            reportData = JSON.parse(durationByPlaylist).map(i => i.quantity);
            reportDataColors = JSON.parse(durationByPlaylist).map((_, index) => BAR_COLORS[index % 4]);
            break;
        }
        case "durationBySong": {
            label = labels[3]
            reportLabels = JSON.parse(durationBySong).map(i => i.description);
            reportData = JSON.parse(durationBySong).map(i => i.quantity);
            reportDataColors = JSON.parse(durationBySong).map((_, index) => BAR_COLORS[index % 4]);
            break;
        }
        case "songsByArtist": {
            label = labels[4]
            reportLabels = JSON.parse(songsByArtist).map(i => i.description);
            reportData = JSON.parse(songsByArtist).map(i => i.quantity);
            reportDataColors = JSON.parse(songsByArtist).map((_, index) => BAR_COLORS[index % 4]);
            break;
        }
        case "durationByGenre": {
            label = labels[5]
            reportLabels = JSON.parse(durationByGenre).map(i => i.description);
            reportData = JSON.parse(durationByGenre).map(i => i.quantity);
            reportDataColors = JSON.parse(durationByGenre).map((_, index) => BAR_COLORS[index % 4]);
            break;
        }
        case "artistByPlaylist": {
            label = labels[6]
            reportLabels = JSON.parse(artistByPlaylist).map(i => i.description);
            reportData = JSON.parse(artistByPlaylist).map(i => i.quantity);
            reportDataColors = JSON.parse(artistByPlaylist).map((_, index) => BAR_COLORS[index % 4]);
            break;
        }
        case "genresByArtist": {
            label = labels[7]
            reportLabels = JSON.parse(genresByArtist).map(i => i.description);
            reportData = JSON.parse(genresByArtist).map(i => i.quantity);
            reportDataColors = JSON.parse(genresByArtist).map((_, index) => BAR_COLORS[index % 4]);
            break;
        }
        default: {
            label = labels[0]
            reportLabels = JSON.parse(albumsByArtist).map(i => i.description);
            reportData = JSON.parse(albumsByArtist).map(i => i.quantity);
            reportDataColors = JSON.parse(albumsByArtist).map((_, index) => BAR_COLORS[index % 4]);
            break;
        }
    }

    const state = {
        labels: reportLabels,
        datasets: [
            {
                label: label,
                backgroundColor: reportDataColors,
                borderColor: 'rgba(0,0,0,0.5)',
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
                        <li class="list-group-item pointer" onClick={() => setReport("albumsByArtist")}> albumsByArtist </li>
                        <li class="list-group-item pointer" onClick={() => setReport("songsByGenre")}> songsByGenre </li>
                        <li class="list-group-item pointer" onClick={() => setReport("durationByPlaylist")}> durationByPlaylist </li>
                        <li class="list-group-item pointer" onClick={() => setReport("durationBySong")}> durationBySong </li>
                        <li class="list-group-item pointer" onClick={() => setReport("songsByArtist")}> songsByArtist </li>
                        <li class="list-group-item pointer" onClick={() => setReport("durationByGenre")}> durationByGenre </li>
                        <li class="list-group-item pointer" onClick={() => setReport("artistByPlaylist")}> artistByPlaylist </li>
                        <li class="list-group-item pointer" onClick={() => setReport("genresByArtist")}> genresByArtist </li>
                        <li class="list-group-item pointer" onClick={() => {setReport("weekSalesInDates"); setIsAdvanced(true);}}> weekSalesInDates </li>
                        <li class="list-group-item pointer" onClick={() => {setReport("artistBySalesInDates"); setIsAdvanced(true);}}> artistBySalesInDates </li>
                        <li class="list-group-item pointer" onClick={() => {setReport("genreSalesInDates"); setIsAdvanced(true);}}> genreSalesInDates </li>
                        <li class="list-group-item pointer" onClick={() => {setReport("artistSongsByPlays"); setIsAdvanced(true);}}> artistSongsByPlays </li>
                    </ul>
                </div>
            </div>

            <div className="col-10 align-self-center">
                {
                    isAdvanced ? (
                        <div>
                            <h1>
                                This is the advanced report BITCH!
                            </h1>
                            <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                            <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
                        </div>
                    ) : (
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
                    )
                }
            </div>
        </div>
    )
}

if (document.getElementById('reports')) {

    let albumsByArtist = document.getElementById('albumsByArtist').getAttribute('data');
    let songsByGenre = document.getElementById('songsByGenre').getAttribute('data');
    let durationByPlaylist = document.getElementById('durationByPlaylist').getAttribute('data');
    let durationBySong = document.getElementById('durationBySong').getAttribute('data');
    let songsByArtist = document.getElementById('songsByArtist').getAttribute('data');
    let durationByGenre = document.getElementById('durationByGenre').getAttribute('data');
    let artistByPlaylist = document.getElementById('artistByPlaylist').getAttribute('data');
    let genresByArtist = document.getElementById('genresByArtist').getAttribute('data');

    ReactDOM.render(<Reports
        permissions={permissions}
        
        albumsByArtist={albumsByArtist}
        songsByGenre={songsByGenre}
        durationByPlaylist={durationByPlaylist}
        durationBySong={durationBySong}
        songsByArtist={songsByArtist}
        durationByGenre={durationByGenre}
        artistByPlaylist={artistByPlaylist}
        genresByArtist={genresByArtist}

    />, document.getElementById('reports'));
}

