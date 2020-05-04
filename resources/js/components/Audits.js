import React, { Component, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
    CardContent, Table, TableContainer, LinearProgress, TableRow, TableCell,
    TableHead, TextField, Modal, Backdrop, Fade, Select, MenuItem, Collapse, Chip, FormControl, Input, InputLabel
} from '@material-ui/core';
import _Alert from '@material-ui/lab/Alert';
import TableBody from '@material-ui/core/TableBody';
import ClearButton from './ClearButton'
import FilterButton from './FilterButton'
import Card from '@material-ui/core/Card';
import Edit from '@material-ui/icons/Edit';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import ArrowForward from '@material-ui/icons/ArrowForward';
import AddIcon from '@material-ui/icons/Add';
import Send from '@material-ui/icons/Send';
import DeleteForeverSharp from '@material-ui/icons/DeleteForeverSharp';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import { lighten, makeStyles } from '@material-ui/core/styles';
import _ from 'lodash'
import moment from 'moment'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8


const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const createStyles = makeStyles(theme => ({
    table: {
        minWidth: 650,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: "90%",
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
}))

const setValue = (id, json) => {
    let input = document.getElementById(id).value
    input = input.replace("/", "-----")
    if (input != "") {
        input = json["operator"] == "LIKE" ? `${input}+=+` : input
        input = json["type"] == "text" ? `'${input}'` : input
    }
    return input
}
const setValueTextField = (input, json) => {
    input = input.replace("/", "-----")
    if (input != "") {
        input = json["type"] == "text" ? `'${input}'` : input
    }
    return input
}

const setValueStandard = (id, json) => {
    let input = document.getElementById(id).value
    input = input.replace("/", "-----")
    if (input != "") {
        input = json["type"] == "text" ? `'${input}'` : input
    }
    return input
}
let permissions = []
let rowsFetched = [{}]
let tableSelect = [{}]
let typeSelect = [{}]
if (document.getElementById('rows')) {
    rowsFetched = JSON.parse(document.getElementById('rows').getAttribute('data'))
}

if (document.getElementById('tableSelect')) {
    tableSelect = JSON.parse(document.getElementById('tableSelect').getAttribute('data'))
}

if (document.getElementById('typeSelect')) {
    typeSelect = JSON.parse(document.getElementById('typeSelect').getAttribute('data'))
}

if (document.getElementById('permissions')) {
    permissions = JSON.parse(document.getElementById('permissions').getAttribute('data'))
}


const Audits = (props) => {
    const classes = createStyles()
    const [fetching, setIsFetching] = useState(false)
    const [alert, setAlert] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [alertSeverity, setAlertSeverity] = useState("error")
    const [alertMessage, setAlertMessage] = useState("")
    const [open, setOpen] = useState(false)
    const [edit, setEdit] = useState(false)
    const [create, setCreate] = useState(false)
    const [rows, setRows] = useState(rowsFetched)
    const [selectedAudit, setSelectedAudit] = useState({})
    const [nameEdit, setNameEdit] = useState("")
    const [nameCreate, setNameCreate] = useState("")
    const [tablesFilter, setTablesFilter] = useState([])
    const [typesFilter, setTypesFilter] = useState([])
    const [itemsPerPage, watchItemsPerPage] = useState(10)
    const handleClose = () => (setOpen(false))


    const showAlert = (message, severity) => {
        setAlert(true)
        setAlertMessage(message)
        setAlertSeverity(severity)
        setTimeout(() => {
            setAlert(false)
        }, 3000)
    }
    const iconMaker = (permissionId, model) => {
        if (permissionId == 1) return <RemoveRedEye key={permissionId} color="primary" className="ml-2 pointer" onClick={() => {
            setSelectedAudit(model)
            setOpen(true)
        }
        }
        />
        else return ""

    }
    const filterFetch = (url, json) => {
        setIsFetching(true)
        axios.get(url, {
            params: {
                parameters: json
            }
        })
            .catch(error => console.error('Error:', error))
            .then(response => {
                console.log(response)
                setIsFetching(false);
                watchPage(0); setRows(response.data);
            })
    }
    const [page, watchPage] = useState(0);
    useEffect(() => {
        setTimeout(() => { setMounted(true) }, 50)
    }, []);
    return (
        <div className="row mt-4">
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
                    {/* Filters */}
                    <div className="pl-3 col-2 container pr-1">
                        <Card>
                            <CardContent>
                                <div className="row">
                                    <div className="col-12 subtitle-2">
                                        Filtros de busqueda
                                    </div>
                                    <div className="col-12 mb-1">
                                        <ClearButton url={"fetch/audits"} fetching={setIsFetching}
                                            callback={(response) => { setIsFetching(false); watchPage(0); setRows(_.sortBy(response, ['id'])) }}
                                        />
                                    </div>
                                    <div className="pr-1 pl-1 col-12">
                                        {(mounted ?
                                            <FormControl className={classes.formControl}>
                                                <InputLabel id="demo-mutiple-chip-label">Tabla</InputLabel>
                                                <Select
                                                    className="w-100"
                                                    labelId="demo-mutiple-chip-label"
                                                    id="demo-mutiple-chip"
                                                    value={tablesFilter}
                                                    multiple
                                                    input={<Input id="select-multiple-chip" />}
                                                    onChange={(e) => setTablesFilter(e.target.value)}
                                                    renderValue={selected => (
                                                        < div className={classes.chips}>
                                                            {selected.map(value => (
                                                                <Chip key={value} label={tableSelect.filter(permission => permission["id"] == value)[0]["name"]} className={classes.chip} />
                                                            ))}
                                                        </div>
                                                    )}
                                                    MenuProps={MenuProps}
                                                >
                                                    {tableSelect.map(permission => (
                                                        <MenuItem key={permission["id"]} value={permission["id"]} >
                                                            {permission["name"]}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            : "")
                                        }
                                        <button
                                            type="button"
                                            className="btn-success w-100 mt-3 mb-2"
                                            onClick={() => filterFetch("/fetch/audits/by/table", { ids: tablesFilter })}>
                                            Buscar
                                            </button>
                                        {(mounted ?
                                            <FormControl className={classes.formControl}>
                                                <InputLabel id="demo-mutiple-chip-label">Tipo de evento</InputLabel>
                                                <Select
                                                    className="w-100"
                                                    labelId="demo-mutiple-chip-label"
                                                    id="demo-mutiple-chip"
                                                    value={typesFilter}
                                                    multiple
                                                    input={<Input id="select-multiple-chip" />}
                                                    onChange={(e) => setTypesFilter(e.target.value)}
                                                    renderValue={selected => (
                                                        < div className={classes.chips}>
                                                            {selected.map(value => (
                                                                <Chip key={value} label={typeSelect.filter(permission => permission["id"] == value)[0]["name"]} className={classes.chip} />
                                                            ))}
                                                        </div>
                                                    )}
                                                    MenuProps={MenuProps}
                                                >
                                                    {typeSelect.map(permission => (
                                                        <MenuItem key={permission["id"]} value={permission["id"]} >
                                                            {permission["name"]}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            : "")
                                        }
                                        <button
                                            type="button"
                                            className="btn-success w-100 mt-3 mb-2"
                                            onClick={() => filterFetch("/fetch/audits/by/type", { ids: typesFilter })}>
                                            Buscar
                                        </button>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-12">
                                        <button
                                            className=""
                                            className='btn-success w-100 mt-4 p-2'
                                            onClick={() => filterFetch("/fetch/audits/by/both", { tablesIds: tablesFilter, typesIds: typesFilter })}>
                                            Buscar todos los parametros
                                        </button>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                    {/* TABLA */}
                    <div className="col-10">
                        <LinearProgress className={(fetching) ? "" : "d-none"} />
                        <Paper elevation={3}>
                            <TableContainer className={classes.container}>
                                <Table
                                    stickyHeader
                                    className={classes.table}
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell > Nombre de la tabla</TableCell>
                                            <TableCell > Id de la tabla</TableCell>
                                            <TableCell >Evento</TableCell>
                                            <TableCell >Fecha</TableCell>
                                            <TableCell >Usuario que efectuo el cambio</TableCell>
                                            <TableCell style={{ minWidth: 155 }}>Acciones</TableCell>
                                        </TableRow>

                                    </TableHead>

                                    <TableBody>
                                        {rows.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((row, index) =>
                                            <TableRow key={index}>
                                                <TableCell>{tableSelect.filter(s => s["id"].toLowerCase() == row["table"].toLowerCase())[0]["name"]}</TableCell>
                                                <TableCell>{row["idtable"]}</TableCell>
                                                <TableCell>{typeSelect.filter(s => s["id"].toLowerCase() == row["event"].toLowerCase())[0]["name"]}</TableCell>
                                                <TableCell>{moment(row["date"]).locale('es').format('ll')}</TableCell>
                                                <TableCell>{row["user"]}</TableCell>
                                                <TableCell>
                                                    {
                                                        (permissions.length != 0 && row["event"].toLowerCase() == "update" ? (
                                                            permissions.map((value, index) => (iconMaker(value, row)))
                                                        ) : "Sin acciones")
                                                    }
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
                    { /*Detalle*/
                        (mounted ?

                            <Modal
                                className={classes.modal}
                                open={open}
                                onClose={handleClose}
                                closeAfterTransition
                                BackdropComponent={Backdrop}
                                BackdropProps={{ timeout: 500, }}
                            >
                                <Fade in={open}>
                                    <div className={classes.paper}>
                                        <h2 id="transition-modal-title white mb-3">Detalle de la actualización</h2>
                                        <div className="row">
                                            <div className="col-12  mb-3 ">
                                                <div className="pl-4 pr-4 card-header subtitle-2">
                                                    Nombre de la columna que se cambio
                                            </div>
                                                <div className="mt-3 text-center subtitle-2">{selectedAudit["column"]}</div>

                                            </div>
                                            <div className="col-6">
                                                <div className="pl-4 pr-4 card-header subtitle-2">
                                                    Valor antiguo
                                                </div>
                                                <div className="mt-3 text-center subtitle-2">{selectedAudit["oldvalue"] ?? "No hubo cambio de valor"}</div>
                                            </div>


                                            <div className="col-6">
                                                <div className="pl-4 pr-4 card-header subtitle-2">
                                                    Valor nuevo

                                                    <div className="mt-3 text-center subtitle-2">{selectedAudit["newvalue"] ?? "No hubo cambio de valor"}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Fade>
                            </Modal> : ""
                        )
                    }

                </div >
            </div>
            <div className="main-bg"></div>
        </div>
    );

}

if (document.getElementById('audits')) {

    ReactDOM.render(<Audits />, document.getElementById('audits'));
}
