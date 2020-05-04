import React, { Component, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
    CardContent, Table, TableContainer, LinearProgress, TableRow, TableCell,
    TableHead, TextField, Modal, Backdrop, Fade, Select, MenuItem, Collapse
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
import Flag from '@material-ui/icons/Flag';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import { lighten, makeStyles } from '@material-ui/core/styles';
import _ from 'lodash'
function getCookie(name) {
    if (!document.cookie) {
        return null;
    }

    const xsrfCookies = document.cookie.split(';')
        .map(c => c.trim())
        .filter(c => c.startsWith(name + '='));

    if (xsrfCookies.length === 0) {
        return null;
    }
    return decodeURIComponent(xsrfCookies[0].split('=')[1]);
}


let permissions = []
let filterJson = [{}]
let csfrToken = ""
let userId = -1
if (document.getElementById('permissions')) {
    permissions = JSON.parse(document.getElementById('permissions').getAttribute('data'))
}
if (document.getElementById("token_l")) {
    csfrToken = document.getElementById("token_l").value
}
if (document.getElementById("userId")) {
    userId = document.getElementById("userId").value
}
const headers = new Headers({
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': csfrToken,
});
if (document.getElementById('filterJson')) {
    filterJson = JSON.parse(document.getElementById('filterJson').getAttribute('data'))
}



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
let rowsFetched = [{}]
let createForm = [{}]
if (document.getElementById('createForm') && document.getElementById('rows')) {
    createForm = JSON.parse(document.getElementById('createForm').getAttribute('data'))
    rowsFetched = JSON.parse(document.getElementById('rows').getAttribute('data'))
}


// Permision 1 See
// Permision 2 Edit
// Permision 3 Delete
const TableView = (props) => {
    const [selected, setSelected] = useState({})
    const [rows, setRows] = useState(_.sortBy(rowsFetched, ['id']))
    const [isFetching, setIsFetching] = useState(false)
    const [mounted, setMounted] = useState(true)
    const [alert, setAlert] = useState(false)
    const [alertSeverity, setAlertSeverity] = useState("success")
    const [alertMessage, setAlertMessage] = useState("")
    const [itemsPerPage, watchItemsPerPage] = useState(15)
    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState(false)
    const [isValidForm, setIsValidForm] = useState(false)
    const [adding, setAdding] = useState(false)
    const [page, watchPage] = useState(0);
    const classes = useStyles()
    const handleOpen = () => (setOpen(true))
    const handleAdd = () => (setAdding(true))
    const showAlert = (message, severity) => {
        setAlert(true)
        setAlertMessage(message)
        setAlertSeverity(severity)
        setTimeout(() => {
            setAlert(false)
        }, 3000)
    }
    const handleCloseAdd = () => {
        setAdding(false)
        createForm = createForm.map(json => {
            json.value = ""
            return json
        })
        setIsValidForm(false)
    }

    const handleOpenEditing = () => (setEditing(true))
    const fetchById = (id) => (
        fetch(`fetch/${props.byIdQuery}/${props.idColumn}/${id}`)
            .then(result => result.json())
            .then(data => {
                handleOpenEditing(); setSelected({ ...data[0] })
            }).catch(error => (console.log(`fetch/${props.byIdQuery}/${props.idColumn}/${id}`)))
    )
    const deleteById = (id) => (
        fetch('delete/id',
            {
                method: 'PUT', // or 'PUT'
                body: JSON.stringify({ query: props.url, "columnId": props.idColumn, "id": id, "table": props.table, "userId": userId }), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
            })
            .then(result => result.json())
            .then(data => {
                showAlert("Se ha borrado con exito!", "success")
                setRows(_.sortBy(data, ['id']))
            }).catch(error => {
                showAlert(props.errorMessage, "error")
            })
    )
    const updateById = (id, column, value) => {

        fetch("update/by/id", {
            method: 'PUT', // or 'PUT'
            body: JSON.stringify({
                query: props.byIdQuery, columnId: props.idColumn, id: id, column: column, value: value, table: props.table,
                userId: userId
            }),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
        })
            .then(result => result.json())
            .then(data => {
                setIsFetching(true)
                showAlert("Se ha actualizado con exito!", "success")
                fetch(props.url)
                    .then(result => result.json())
                    .then(data => {
                        setMounted(true)
                        setIsFetching(false)
                        setRows(_.sortBy(data, ['id']))
                    }).catch(error => (console.log(error)))
                setSelected({ ...data[0] })
            }).catch(error => {
                showAlert("Ups! ha ocurrido un problema al editar", "error")
            })
    }
    const iconMaker = (permissionId, model) => {
        if (permissionId == 1) return <RemoveRedEye key={permissionId} color="primary" className="ml-2 pointer" onClick={() => { handleOpen(); setSelected({ ...model }) }} />
        else if (permissionId == 2) return <Edit key={permissionId} color="action" className="ml-2 pointer" onClick={() => {
            fetchById(model.id)
        }} />
        else if (permissionId == 3) return <DeleteForeverSharp key={permissionId} color="error" className="ml-2 pointer" onClick={
            () => {
                deleteById(model.id)
            }
        } />
        else return ""

    }
    const handleClose = () => (setOpen(false))
    const handleCloseEditing = () => (setEditing(false))

    return (
        <div className="row">
            {
                (mounted ?
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
                    : "")
            }
            <div className="pl-3 col-2 container pr-1">
                <Card>
                    <CardContent>
                        <div className="row">
                            <div className="col-12 subtitle-2">
                                Filtros de busqueda
                            </div>
                            <div className="col-12 mb-1">
                                <ClearButton url={props.url} fetching={setIsFetching}
                                    callback={(response) => { setIsFetching(false); watchPage(0); setRows(_.sortBy(response, ['id'])) }}
                                />
                            </div>

                            {Object.entries(filterJson).map(([column, json]) =>
                                <div className="pr-1 pl-1 col-6" key={column}>
                                    <TextField id={column} key={column} label={column} type="search" />
                                    <FilterButton mounted={mounted} fetching={setIsFetching} url={props.url} json={json} column={column}
                                        callback={(response) => { setIsFetching(false); watchPage(0); setRows(_.sortBy(response, ['id'])) }} />
                                </div>
                            )}
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-12">
                                <button
                                    className={`${mounted ? 'btn-success' : 'btn-outline-secondary default-pointer'} w-100 mt-4 p-2`}
                                    onClick={
                                        () => {
                                            if (mounted) {
                                                setIsFetching(true)
                                                let requestJson = Object.entries(filterJson)
                                                    .map(([column, json]) => ([json["column"], json["operator"], setValue(column, json)]))
                                                    .filter((json) => json[2] != "")

                                                let url = `filtered/all/${props.url}`
                                                axios.get(url, {
                                                    params: {
                                                        parameters: requestJson
                                                    }
                                                })
                                                    .then(res => res)
                                                    .catch(error => console.error('Error:', error))
                                                    .then(response => { setIsFetching(false); watchPage(0); setRows(_.sortBy(response.data, ['id'])); })
                                            }
                                        }
                                    }
                                >
                                    Buscar todos los parametros
                                </button>
                            </div>
                        </div>
                        {
                            (mounted ? <div className="row mt-1">

                                <div className="col-12">
                                    <button
                                        type="button"
                                        className={`${mounted ? 'btn-success' : 'btn-outline-secondary default-pointer'} w-100 mt-3 mb-2`}
                                        onClick={() => handleAdd()}
                                    >
                                        Agregar nueva fila
                                    </button>
                                </div>
                            </div>
                                : "")
                        }
                    </CardContent>
                </Card>
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
                                    {props.columns.map((value, index) => <TableCell key={index}>{value}</TableCell>)}
                                    <TableCell style={{ minWidth: 205 }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {rows.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((row, index) =>
                                    <TableRow key={index}>
                                        {Object.entries(row).map(([rowKey, value]) => <TableCell key={rowKey}>{value}</TableCell>)}
                                        <TableCell>
                                            {
                                                (permissions.length != 0 ? (
                                                    permissions.map((value, index) => (iconMaker(value, row)))
                                                ) : "Sin acciones")
                                            }
                                        </TableCell>
                                    </TableRow>
                                )}

                            </TableBody>
                        </Table>
                    </TableContainer>
                    {
                        (mounted ?
                            <TablePagination
                                rowsPerPageOptions={[itemsPerPage]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={itemsPerPage}
                                page={page}
                                onChangePage={(e, newPage) => { if (mounted) watchPage(newPage) }}
                            /> : (isFetching ? "Cargando" : "No hubo resultados"))
                    }

                </Paper>
            </div>
            {

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
                                <h2 id="transition-modal-title white mb-3">Detalle</h2>
                                <div className="row">
                                    {Object.entries(selected).map(([rowKey, value]) =>
                                        <div key={rowKey} className="col-6  mb-3 ">
                                            <div className="pl-4 pr-4 card-header subtitle-">
                                                {Object.entries(filterJson).filter(([column, json]) => (json["tableName"] === rowKey))[0][0]}
                                            </div>
                                            <div className="mt-3 text-center subtitle-2">{value}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Fade>
                    </Modal> : ""
                )
            }
            {

                (mounted ?

                    <Modal
                        className={classes.modal}
                        open={editing}
                        onClose={handleCloseEditing}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{ timeout: 500, }}
                    >
                        <Fade in={editing}>
                            <div className={classes.paper}>
                                <h2 id="transition-modal-title white mb-3">Edicion</h2>
                                <div className="row">
                                    {Object.entries(selected).map(([rowKey, value]) => {

                                        if (rowKey != "id") {
                                            return <div key={rowKey} className="col-12  mb-2 ">
                                                <div className="pl-1 pr-1 card-header subtitle-3">
                                                    {Object.entries(filterJson).filter(([column, json]) => (json["tableName"] === rowKey))[0][0]}
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="mt-2 subtitle-3 text-left">Valor Actual</div>
                                                        <TextField variant="filled" fullWidth InputProps={{
                                                            className: classes.input
                                                        }} className="mt-1" fontSize={14} value={value ? value : "No hay valor seteado"} />
                                                    </div>
                                                    <div className="col-1 align-middle "><ArrowForward className="mt-5" fontSize="large" /></div>
                                                    <div className="col">
                                                        <div className="mt-2 subtitle-3 text-left">Valor a cambiar</div>
                                                        {
                                                            (Object.entries(filterJson).filter(([column, json]) => (json["tableName"] === rowKey))[0][1].queryType != undefined) ?
                                                                <Select className="white pt-1 mt-1" fullWidth id={`new-${rowKey}`}>
                                                                    {Object.entries(filterJson).filter(([column, json]) => (json["tableName"] === rowKey))[0][1].values.map(json => <MenuItem key={json.id} value={json.id}>{json.name}</MenuItem>)}
                                                                </Select>
                                                                :
                                                                <TextField id={`new-${rowKey}`} fullWidth variant="filled" InputProps={{
                                                                    className: classes.input
                                                                }} className="mt-1" fontSize={14} />
                                                        }

                                                    </div>
                                                    <div className="col-1 ">

                                                        {<Send className="mt-5 pointer" fontSize="large"
                                                            onClick={() => {
                                                                let filterJsonSelected = Object.entries(filterJson).filter(([column, json]) => (json["tableName"] === rowKey))[0][1]
                                                                let newValue = (filterJsonSelected.queryType != undefined) ? document.getElementById(`new-${rowKey}`).nextSibling.value :
                                                                    setValueStandard(`new-${rowKey}`, filterJsonSelected)

                                                                let columnToSet = (filterJsonSelected.columnEdit != undefined) ? filterJsonSelected.columnEdit : filterJsonSelected.column
                                                                if (newValue) {
                                                                    updateById(selected.id, columnToSet, newValue)
                                                                }

                                                            }
                                                            }
                                                        />}
                                                    </div>
                                                </div>


                                            </div>
                                        }
                                    }
                                    )}
                                </div>
                            </div>
                        </Fade>
                    </Modal> : ""
                )
            }
            {

                (mounted ?

                    <Modal
                        className={classes.modal}
                        open={adding}
                        onClose={handleCloseAdd}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{ timeout: 500, }}
                    >
                        <Fade in={adding}>
                            <div className={classes.paper}>
                                <h2 id="transition-modal-title white mb-3">Agregar nueva fila</h2>
                                <div className="row">
                                    {createForm.map((json, index) =>
                                        <div key={json.name} className="col-6 p-2">
                                            <div className="row">
                                                <div className="pl-1 pr-1 offset-1 card-header subtitle-3 col-10">{json.name}</div>
                                                <div className="offset-1 col-10">
                                                    {
                                                        (json.type == 'select' ?
                                                            <Select fullWidth className="white pt-1 mt-1" id={`new-${json.name}`}
                                                                onChange={
                                                                    (e) => {
                                                                        let clone = [...createForm]
                                                                        clone[index].value = e.target.value
                                                                        createForm = [...clone]
                                                                        if (isValidForm != createForm.every(val => val.value != "")) {
                                                                            setIsValidForm(createForm.every(val => val.value != ""))
                                                                        }
                                                                    }
                                                                }
                                                            >
                                                                {json.values.map(json => <MenuItem key={json.id} value={json.id}>{json.name}</MenuItem>)}
                                                            </Select>
                                                            :
                                                            <TextField variant="filled" fullWidth InputProps={{
                                                                className: classes.input
                                                            }} className="mt-1" fontSize={14} id={`create-form-${json.name}`}
                                                                onChange={
                                                                    (e) => {
                                                                        let clone = [...createForm]
                                                                        clone[index].value = setValueTextField(e.target.value, json)
                                                                        createForm = [...clone]
                                                                        if (isValidForm != createForm.every(val => val.value != "")) {
                                                                            setIsValidForm(createForm.every(val => val.value != ""))
                                                                        }
                                                                    }
                                                                } />)
                                                    }
                                                </div>
                                            </div>
                                        </div>)
                                    }
                                    <div className="offset-3 p-2 col-6">
                                        <button
                                            type="button"
                                            className={`${(isValidForm) ? 'btn-success' : 'btn-outline-secondary default-pointer'} w-100 mt-3 mb-2`}
                                            onClick={() => {
                                                if (isValidForm) {
                                                    let columns = createForm.reduce((acc, json) => acc + json.column + ", ", "")
                                                    let values = createForm.reduce((acc, json) => acc + json.value + ", ", "")
                                                    values = values.substring(0, values.length - 2)
                                                    columns = columns.substring(0, columns.length - 2)
                                                    let data = {
                                                        query: props.url, table: props.table, "values": values, "columns":
                                                            columns, "columnId": props.idColumn, userId: userId
                                                    }
                                                    fetch("create", {
                                                        method: 'POST',
                                                        body: JSON.stringify(data),
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                                        }
                                                    }).then(res => res.json())
                                                        .catch(error => showAlert("Verifica que metas valores validos", "error"))
                                                        .then(response => {
                                                            if (response == undefined) {
                                                                showAlert("Verifica que metas valores validos", "error")
                                                            } else {
                                                                showAlert("Se ha agregado con exito", "success")
                                                                setRows(_.sortBy(response, ['id']))
                                                            }
                                                        })
                                                    handleCloseAdd()
                                                }
                                            }}
                                        >
                                            Agregar
                                    </button>
                                    </div>
                                </div>
                            </div>
                        </Fade>
                    </Modal> : ""
                )
            }
        </div >
    );

}

export default TableView;

