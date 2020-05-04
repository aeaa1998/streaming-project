import React, { Component, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import TablePagination from '@material-ui/core/TablePagination';
import TableBody from '@material-ui/core/TableBody';
import { lighten, makeStyles } from '@material-ui/core/styles';
import _Alert from '@material-ui/lab/Alert';
import DeleteForeverSharp from '@material-ui/icons/DeleteForeverSharp';
import {
    Table, TableContainer, LinearProgress, TableRow, TableCell,
    TableHead, Paper, Backdrop, Fade, Select, MenuItem, Collapse
} from '@material-ui/core';
import AddCircleOutLine from '@material-ui/icons/AddCircleOutLine';
import AddIcon from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import Axios from 'axios';
const useStyles = makeStyles(theme => ({
    table: {
        minWidth: 650,
    },
    container: {
        maxHeight: "70vh",
        minHeight: "70vh",
    },
    alert: {
        width: '100%',
        marginBottom: theme.spacing(2),
        '& > * + *': {
            marginTop: theme.spacing(2),
        }
    },
    input: {
        color: "white",
        "&.focused": {
            color: "white"
        },
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
    paperDelete: {
        type: "dark",
        backgroundColor: '#303030',
        boxShadow: theme.shadows[5],
        minWidth: '40%',
        maxWidth: '90%',
        color: 'white',
        padding: theme.spacing(4, 4, 4),
    },
}))
let userId = -1
let permissions = []
if (document.getElementById('permissions')) {
    permissions = JSON.parse(document.getElementById('permissions').getAttribute('data'))
}
if (document.getElementById("userId")) {
    userId = document.getElementById("userId").value
}

let rowsFetched = [{}]
if (document.getElementById('rows')) {
    rowsFetched = JSON.parse(document.getElementById('rows').getAttribute('data'))
}

const Cart = (props) => {
    const [isFetching, setIsFetching] = useState(false)
    const [rows, setRows] = useState(_.sortBy(rowsFetched, ['id']))
    const [alert, setAlert] = useState(false)
    const [alertSeverity, setAlertSeverity] = useState("success")
    const classes = useStyles()
    const [alertMessage, setAlertMessage] = useState("")
    const [itemsPerPage, watchItemsPerPage] = useState(15)
    const [page, watchPage] = useState(0);
    const fetchAll = () => {
        setIsFetching(true)
        axios.get("cart/tracks", {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        })
            .catch(error => console.error('Error:', error))
            .then(response => {
                setIsFetching(false); watchPage(0); setRows(_.sortBy(response.data, ['id']));
            })
    }
    const payCart = () => {
        setIsFetching(true)
        axios.post("cart/pay", {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        })
            .catch(error => console.error('Error:', error))
            .then(response => {
                showAlert("Carrito Pagado exitosamente", "success");
                setIsFetching(false); watchPage(0); setRows(_.sortBy(response.data, ['id']));
            })
    }

    const cleanCart = () => {
        setIsFetching(true)
        axios.post("cart/clean", {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        })
            .catch(error => console.error('Error:', error))
            .then(response => {
                showAlert("Carrito Vaciado exitosamente", "success");
                setIsFetching(false); watchPage(0); setRows(_.sortBy(response.data, ['id']));
            })
    }

    const editTrackQuanity = (sign, model) => {
        setIsFetching(true)
        axios.post(`cart/tracks`, {
            id: model.id,
            quantity: sign == "+" ? model.quantity + 1 : model.quantity - 1,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        })
            .catch(error => console.error('Error:', error))
            .then(response => {
                setIsFetching(false); watchPage(0); setRows(_.sortBy(response.data, ['id']));
            })
    }

    const deleteTrack = (model) => {
        setIsFetching(true)
        axios.post(`cart/tracks/${model.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        })
            .catch(error => console.error('Error:', error))
            .then(response => {
                showAlert("Cancion borrada exitosamente", "success");
                setIsFetching(false); watchPage(0); setRows(_.sortBy(response.data, ['id']));
            })
    }



    const showAlert = (message, severity) => {
        setAlert(true)
        setAlertMessage(message)
        setAlertSeverity(severity)
        setTimeout(() => {
            setAlert(false)
        }, 3000)
    }

    return (
        <div className="row mt-4 ml-2">
            <div className="col-12">
                <div className="row">
                    <div className={classes.alert}>
                        <div className="col-12">
                            <div className="row">
                                <div className="offset-2 col-8">
                                    <Collapse in={alert}>
                                        <_Alert severity={alertSeverity} >
                                            {alertMessage}
                                        </_Alert>
                                    </Collapse>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* TABLA */}
                    <div className="col-10">
                        <LinearProgress className={(isFetching) ? "" : "d-none"} />
                        <Paper elevation={3}>
                            <TableContainer className={classes.container}>
                                <Table
                                    stickyHeader
                                    className={classes.table}
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell > Nombre de la cancion</TableCell>
                                            <TableCell > Cantidad</TableCell>
                                            <TableCell >Subtotal</TableCell>
                                            <TableCell style={{ minWidth: 155 }}>Acciones</TableCell>
                                        </TableRow>

                                    </TableHead>

                                    <TableBody>
                                        {rows.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((row, index) =>
                                            <TableRow key={index}>
                                                <TableCell>{row["name"]}</TableCell>
                                                <TableCell>{row["quantity"]}</TableCell>
                                                <TableCell>{row["quantity"] * row["unitprice"]}</TableCell>
                                                <TableCell>
                                                    <AddIcon onClick={() => { editTrackQuanity("+", row) }} />
                                                    <Remove onClick={
                                                        () => {
                                                            if (row["quantity"] > 1) { editTrackQuanity("-", row) }
                                                            else {
                                                                showAlert("No se puede disminuir mas la cantidad", "error")
                                                            }
                                                        }} />
                                                    <DeleteForeverSharp color="error" onClick={
                                                        () => { deleteTrack(row) }} />
                                                </TableCell>
                                            </TableRow>
                                        )}

                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination
                                rowsPerPageOptions={[itemsPerPage]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={itemsPerPage}
                                page={page}
                                onChangePage={(e, newPage) => { if (mounted) watchPage(newPage) }}
                            />


                        </Paper>
                    </div>
                    <div>
                        <button type="button" className="btn btn-dark w-100 mt-4"
                            onClick={() => {
                                payCart()
                            }
                            }
                        >
                            Comprar canciones
                        </button>
                        <button type="button" className="btn btn-dark w-100 mt-4"
                            onClick={() => {
                                cleanCart()
                            }
                            }
                        >
                            Borrar carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}

if (document.getElementById('cart')) {
    ReactDOM.render(<Cart />, document.getElementById('cart'));
}

