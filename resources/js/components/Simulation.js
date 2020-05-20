import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import _Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import moment from 'moment'
import {
    Collapse, Button, LinearProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import _ from 'lodash'


const createStyles = makeStyles(theme => ({

    alert: {
        width: '100%',
        marginBottom: theme.spacing(2),
        '& > * + *': {
            marginTop: theme.spacing(2),
        }
    },
    paper: {
        type: "dark",
        backgroundColor: '#303030',
        boxShadow: theme.shadows[5],
        minWidth: '80%',
        maxWidth: '90%',
        color: 'white',
        padding: theme.spacing(4, 4, 4),
    },
}))


// Permision 1 See
// Permision 2 Edit
// Permision 3 Delete
const Simulation = (props) => {
    const classes = createStyles()
    const [fetching, setIsFetching] = useState(false)
    const [alert, setAlert] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [alertSeverity, setAlertSeverity] = useState("error")
    const [selectedDate, setSelectedDate] = useState('')
    const [numberOfTracks, setNumberOfTracks] = useState(0)
    const [alertMessage, setAlertMessage] = useState("")

    const showAlert = (message, severity) => {
        setAlert(true)
        setAlertMessage(message)
        setAlertSeverity(severity)
        setTimeout(() => {
            setAlert(false)
        }, 3000)
    }

    const clearForm = () => {
        setSelectedDate('')
        setNumberOfTracks(0)
    }
    useEffect(() => {
        setTimeout(() => { setMounted(true) }, 50)
    }, []);
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className={classes.alert}>
                    <div className="col-8">
                        <Collapse in={alert}>
                            <_Alert severity={alertSeverity} >
                                {alertMessage}
                            </_Alert>
                        </Collapse>
                    </div>
                </div>
            </div >
            <div className="row justify-content-center">
                <LinearProgress className={(fetching) ? "" : "d-none"} />
                <div className="col-12">

                    <div className="card text-white bg-light mb-3">
                        <h1 className="card-header py-3 px-3 text-center text-dark">Simulacion de ventas</h1>
                        <div className="card-body py-5 px-4">
                            <div className="w-50 d-inline-block px-4">
                                <TextField
                                    label="Fecha en que se desea simular las ventas"
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => {
                                        console.log(e.target.value)
                                        setSelectedDate(e.target.value)
                                    }}
                                    className="w-100"
                                    variant="filled"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </div>
                            <div className="w-50 d-inline-block px-4">
                                <TextField
                                    label="Number"
                                    type="number"
                                    className="w-100"
                                    value={numberOfTracks}
                                    onChange={(e) => setNumberOfTracks(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="filled"
                                />
                            </div>
                            <div className="mt-5 row justify-content-end">
                                {mounted && <Button color="primary" className="mx-2" variant="outlined"
                                    onClick={() => {
                                        setIsFetching(true)
                                        axios.post('simulate/sales', {
                                            date: selectedDate, numberOfTracks: numberOfTracks
                                        })
                                            .catch(error => console.error('Error:', error))
                                            .then(response => {
                                                console.log(response)
                                                setIsFetching(false);
                                                // clearForm()
                                                showAlert(`Se realizo la simulacion de ${numberOfTracks} canciones exitosamente`, "success")
                                                // watchPage(0); setRows(response.data);
                                            })
                                    }}
                                    disabled={selectedDate == "" || numberOfTracks <= 0}
                                >Simular ventas</Button>}
                                {mounted && <Button color="secondary" className="mx-2" variant="outlined"
                                    onClick={clearForm}
                                >Resetear formulario</Button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


}

if (document.getElementById('simulations')) {
    ReactDOM.render(<Simulation />, document.getElementById('simulations'));
}