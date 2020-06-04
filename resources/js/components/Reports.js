import React, { Component, useState } from 'react';
import $ from 'jquery';
import Popper from 'popper.js';
import ReactDOM from 'react-dom';
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { Bar } from 'react-chartjs-2';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


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

    const [isAdvanced, setIsAdvanced] = useState(false);
    const [startDate, setStartDate] = useState(new Date('2009-01-01'));
    const [endDate, setEndDate] = useState(new Date('2009-04-30'));
    const [quantity, setQuantity] = useState(3);
    const [input, setInput] = useState('');

    const [report, setReport] = useState('songsByArtist');
    const [data, setData] = useState(JSON.parse(songsByArtist));

    const BAR_COLORS = ['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 0.5)', 'rgba(0, 255, 255, 0.5)']

    let endpoint;
    let reqBody;
    let usesDates = false;
    let usesQuantity = false;
    let usesInput = false;


    if (report === 'weekSalesInDates') {
        usesDates = true;
        usesQuantity = false;
        usesInput = false;
        endpoint = '/fetch/sales/by/weeks';
        reqBody = { startDate, endDate };
    }
    else if (report === 'artistBySalesInDates') {
        usesDates = true;
        usesQuantity = true;
        usesInput = false;
        endpoint = '/fetch/artists/by/dates';
        reqBody = { startDate, endDate, quantity };
    }
    else if (report === 'genreSalesInDates') {
        usesDates = true;
        usesQuantity = false;
        usesInput = false;
        endpoint = '/fetch/genres/by/dates';
        reqBody = { startDate, endDate };
    }
    else if (report === 'artistSongsByPlays') {
        usesDates = false;
        usesQuantity = false;
        usesInput = true;
        endpoint = '/fetch/artist/by/plays';
        reqBody = { input };
    } else {
        usesDates = false;
        usesQuantity = false;
        usesInput = false;
    }

    let reportLabels = data.map(i => i.description);
    let reportData = data.map(i => i.quantity);
    let reportDataColors = data.map((_, index) => BAR_COLORS[index % 4]);

    const state = {
        labels: reportLabels,
        datasets: [
            {
                label: report,
                backgroundColor: reportDataColors,
                borderColor: 'rgba(0,0,0,0.5)',
                borderWidth: 2,
                data: reportData
            }
        ]
    }

    const filterFetch = (endpoint, json) => {
        axios.get(endpoint, {
            params: {
                parameters: json
            }
        })
            .catch(error => console.error('ERRORAZO:', error))
            .then(response => {
                console.log("RESPONSE:", response);
                setData(response.data);
            })
    }

    const generate_csv = data => {
        console.log(data);
        const ws = XLSX.utils.json_to_sheet(data);
        const csv = XLSX.utils.sheet_to_csv(ws);

        const blob = new Blob([csv], { type: 'text/plain;charset=UTF-8' });
        saveAs(blob, `${report}.csv`);
    }


    return (
        <div className="row mt-4">
            <div className="col align-self-center">

                <div className="card">
                    {/* <div className="card-header"> Reportes </div> */}

                    <ul className="list-group list-group-flush">
                        <li className="list-group-item pointer"
                            onClick={() => { setReport("albumsByArtist"); setData(JSON.parse(albumsByArtist)); setIsAdvanced(false); }}>
                            albumsByArtist
                        </li>
                        <li className="list-group-item pointer"
                            onClick={() => { setReport("songsByGenre"); setData(JSON.parse(songsByGenre)); setIsAdvanced(false); }}>
                            songsByGenre
                        </li>
                        <li className="list-group-item pointer"
                            onClick={() => { setReport("durationByPlaylist"); setData(JSON.parse(durationByPlaylist)); setIsAdvanced(false); }}>
                            durationByPlaylist
                        </li>
                        <li className="list-group-item pointer"
                            onClick={() => { setReport("durationBySong"); setData(JSON.parse(durationBySong)); setIsAdvanced(false); }}>
                            durationBySong
                        </li>
                        <li className="list-group-item pointer"
                            onClick={() => { setReport("songsByArtist"); setData(JSON.parse(songsByArtist)); setIsAdvanced(false); }}>
                            songsByArtist
                        </li>
                        <li className="list-group-item pointer"
                            onClick={() => { setReport("durationByGenre"); setData(JSON.parse(durationByGenre)); setIsAdvanced(false); }}>
                            durationByGenre
                        </li>
                        <li className="list-group-item pointer"
                            onClick={() => { setReport("artistByPlaylist"); setData(JSON.parse(artistByPlaylist)); setIsAdvanced(false); }}>
                            artistByPlaylist
                        </li>
                        <li className="list-group-item pointer"
                            onClick={() => { setReport("genresByArtist"); setData(JSON.parse(genresByArtist)); setIsAdvanced(false); }}>
                            genresByArtist
                        </li>
                        <li className="list-group-item pointer"
                            onClick={() => { setReport("weekSalesInDates"); setIsAdvanced(true); filterFetch('/fetch/sales/by/weeks', { startDate, endDate }); }}>
                            weekSalesInDates
                        </li>
                        <li className="list-group-item pointer"
                            onClick={() => { setReport("artistBySalesInDates"); setIsAdvanced(true); filterFetch('/fetch/artists/by/dates', { startDate, endDate, quantity }); }}>
                            artistBySalesInDates
                        </li>
                        <li className="list-group-item pointer"
                            onClick={() => { setReport("genreSalesInDates"); setIsAdvanced(true); filterFetch('/fetch/genres/by/dates', { startDate, endDate, quantity }); }}>
                            genreSalesInDates
                        </li>
                        <li className="list-group-item pointer"
                            onClick={() => { setReport("artistSongsByPlays"); setIsAdvanced(true); filterFetch('/fetch/artist/by/plays', { input }); }}>
                            artistSongsByPlays
                        </li>
                    </ul>
                </div>
            </div>

            <div className="col-10 align-self-center row justify-content-center" >
                <h1>{report}</h1>
                <Bar
                    data={state}
                    style={{ height: '70%' }}
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
                {
                    isAdvanced ? (
                        <div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                                {usesDates ?
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid container justify="space-around">
                                            <KeyboardDatePicker
                                                margin="normal"
                                                id="start-date-picker-dialog"
                                                label="Fecha de inicio"
                                                format="MM/dd/yyyy"
                                                value={startDate}
                                                onChange={setStartDate}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />

                                            <KeyboardDatePicker
                                                margin="normal"
                                                id="end-date-picker-dialog"
                                                label="Fecha límite"
                                                format="MM/dd/yyyy"
                                                value={endDate}
                                                onChange={setEndDate}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                    : <div></div>
                                }

                                {usesQuantity ?
                                    <TextField id="filled-basic" label="Cantidad" variant="filled" type="number" value={quantity} onChange={(e) => { setQuantity(e.target.value); }} style={{ margin: '20px' }} />
                                    : <div></div>
                                }

                                {usesInput ?
                                    <TextField id="filled-basic" label="Nombre artista" variant="filled" type="text" value={input} onChange={(e) => { setInput(e.target.value); }} style={{ margin: '20px' }} />
                                    : <div></div>
                                }

                                <Button variant="outlined" style={{ margin: '10px' }} onClick={() => { filterFetch(endpoint, reqBody) }}>
                                    Generar reporte
                                    </Button>
                            </div>
                        </div>
                    ) : (
                            <div></div>
                        )
                }

                <Button variant="outlined" style={{ margin: '10px' }} onClick={() => { generate_csv(data) }}>
                    Exportar a CSV
                </Button>

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

