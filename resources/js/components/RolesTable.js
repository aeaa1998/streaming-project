import React, { useState, useEffect } from 'react';
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

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
let permissions = []
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
if (document.getElementById('permissions')) {
    permissions = JSON.parse(document.getElementById('permissions').getAttribute('data'))
}



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

let rowsFetched = [{}]
let permissionsSelect = [{}]
if (document.getElementById('rows')) {
    rowsFetched = JSON.parse(document.getElementById('rows').getAttribute('data'))
}

if (document.getElementById('permissionsSelect')) {
    permissionsSelect = JSON.parse(document.getElementById('permissionsSelect').getAttribute('data'))
}

// Permision 1 See
// Permision 2 Edit
// Permision 3 Delete
const RolesTable = (props) => {
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
    const [selectedRole, setSelectedRole] = useState({})
    const [nameFilter, setNameFilter] = useState("")
    const [nameEdit, setNameEdit] = useState("")
    const [nameCreate, setNameCreate] = useState("")
    const [permissionsFilter, setPermissionsFilter] = useState([])
    const [permissionsEdit, setPermissionsEdit] = useState([])
    const [permissionsCreate, setPermissionsCreate] = useState([])
    const [itemsPerPage, watchItemsPerPage] = useState(10)
    const handleClose = () => (setOpen(false))
    const handleCloseEdit = () => {
        setEdit(false)
        setPermissionsEdit([])
        setNameEdit("")
    }
    const handleCloseCreate = () => {
        setCreate(false)
        setPermissionsCreate([])
        setNameCreate("")
    }
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
            setSelectedRole(model)
            setOpen(true)
        }
        }
        />
        else if (permissionId == 2) return <Edit key={permissionId} color="action" className="ml-2 pointer" onClick={() => {
            setSelectedRole(model)
            setEdit(true)
        }} />
        else if (permissionId == 3) return <DeleteForeverSharp key={permissionId} color="error" className="ml-2 pointer" onClick={
            () => {
                setIsFetching(true)
                fetch(`/delete/role/${model.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                })
                    .then(result => result.json())
                    .then(data => {
                        watchPage(0);
                        setRows(data)
                        setIsFetching(false)
                        showAlert("Se ha borrado el rol con exito", "success")
                    }).catch(error => {
                        setIsFetching(false)
                        showAlert("Asegurese que el rol no tenga usuarios vinculados", "error")
                    })
            }
        } />
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
                setIsFetching(false); watchPage(0); setRows(response.data);
            })
    }
    const editRole = (value, name) => {
        let body = {};
        if (name == "name") body = { id: selectedRole.id, name: value }
        else body = { id: selectedRole.id, permissionIds: value }
        console.log(body)
        setIsFetching(true)
        fetch("/edit/role", {
            method: 'PUT', // or 'PUT'
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
        })
            .then(result => result.json())
            .then(data => {
                watchPage(0);
                setRows(data.rows)
                setSelectedRole(data.selected)
                setIsFetching(false)
            }).catch(error => {
                showAlert("Ups! ha ocurrido un problema al editar", "error")
            })
    }
    const [page, watchPage] = useState(0);
    useEffect(() => {
        setTimeout(() => { setMounted(true) }, 50)
    }, []);
    return (
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
                                <ClearButton url={"fetch/roles"} fetching={setIsFetching}
                                    callback={(response) => { setIsFetching(false); watchPage(0); setRows(_.sortBy(response, ['id'])) }}
                                />
                            </div>
                            <div className="pr-1 pl-1 col-12">
                                <TextField fullWidth label="Nombre del Rol" type="search" value={nameFilter} onChange={(e) => (setNameFilter(e.target.value))} />
                                <button
                                    type="button"
                                    className="btn-success w-100 mt-3 mb-2"
                                    onClick={() => filterFetch("/fetch/roles/by/name", { name: nameFilter })}>
                                    Buscar
                                        </button>


                                {(mounted ?
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="demo-mutiple-chip-label">Permisos</InputLabel>
                                        <Select
                                            className="w-100"
                                            labelId="demo-mutiple-chip-label"
                                            id="demo-mutiple-chip"
                                            value={permissionsFilter}
                                            multiple
                                            input={<Input id="select-multiple-chip" />}
                                            onChange={(e) => setPermissionsFilter(e.target.value)}
                                            renderValue={selected => (
                                                < div className={classes.chips}>
                                                    {selected.map(value => (
                                                        <Chip key={value} label={permissionsSelect.filter(permission => permission["id"] == value)[0]["name"]} className={classes.chip} />
                                                    ))}
                                                </div>
                                            )}
                                            MenuProps={MenuProps}
                                        >
                                            {permissionsSelect.map(permission => (
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
                                    onClick={() => filterFetch("/fetch/roles/by/permission", { ids: permissionsFilter })}>
                                    Buscar
                                        </button>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-12">
                                <button
                                    className=""
                                    className='btn-success w-100 mt-4 p-2'
                                    onClick={() => filterFetch("/fetch/roles/by/both", { ids: permissionsFilter, name: nameFilter })}>
                                    Buscar todos los parametros
                                    </button>
                            </div>
                        </div>
                        <div className="row mt-1">

                            <div className="col-12">
                                <button
                                    type="button"
                                    className='btn-success w-100 mt-3 mb-2'
                                    onClick={() => { setCreate(true) }}
                                >
                                    Agregar nueva fila
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
                                    <TableCell > Nombre del Rol</TableCell>
                                    <TableCell >Permisos</TableCell>
                                    <TableCell style={{ minWidth: 155 }}>Acciones</TableCell>
                                </TableRow>

                            </TableHead>

                            <TableBody>
                                {rows.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((row, index) =>
                                    <TableRow key={index}>
                                        <TableCell>{row["name"]}</TableCell>
                                        <TableCell>{row["permissions"]}</TableCell>
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
                                <h2 id="transition-modal-title white mb-3">Detalle del rol</h2>
                                <div className="row">
                                    <div className="col-6  mb-3 ">
                                        <div className="pl-4 pr-4 card-header subtitle-">
                                            Nombre del rol
                                        </div>
                                        <div className="mt-3 text-center subtitle-2">{selectedRole["name"]}</div>

                                    </div>
                                    <div className="col-6  mb-3 ">
                                        <div className="pl-4 pr-4 card-header subtitle-">
                                            Permisos del rol
                                        </div>
                                        <div className="mt-3 text-center subtitle-2">{selectedRole["permissions"] != "" ? selectedRole["permissions"] : "No tiene"}</div>
                                    </div>
                                </div>
                            </div>
                        </Fade>
                    </Modal> : ""
                )
            }

            { /*Editar*/
                (mounted ?

                    <Modal
                        className={classes.modal}
                        open={edit}
                        onClose={handleCloseEdit}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{ timeout: 500, }}
                    >
                        <Fade in={edit}>
                            <div className={classes.paper}>
                                <h2 id="transition-modal-title white mb-3">Editar el rol</h2>
                                <div className="row">
                                    <div className="col-5  mb-3 ">
                                        <div className="pl-4 pr-4 card-header subtitle-">
                                            Nombre del rol valor actual
                                        </div>
                                        <div className="mt-3 text-center subtitle-2">{selectedRole["name"]}</div>

                                    </div>
                                    <div className="col-5  mb-3 ">
                                        <div className="pl-4 pr-4 card-header subtitle-">
                                            Nombre del rol valor a cambiar
                                        </div>
                                        <TextField fullWidth label="Nombre del Rol" InputProps={{ className: classes.input }} value={nameEdit} onChange={(e) => (setNameEdit(e.target.value))} />
                                    </div>
                                    <div className="col-1 ">
                                        <Send className="mt-5 pointer" fontSize="large"
                                            onClick={() => editRole(nameEdit, "name")}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-5 mb-3 ">
                                        <div className="pl-4 pr-4 card-header subtitle-">
                                            Permisos del rol valor actual
                                        </div>
                                        <div className="mt-3 text-center subtitle-2">{selectedRole["permissions"]}</div>

                                    </div>
                                    <div className="col-5  mb-3 ">
                                        <div className="pl-4 pr-4 card-header subtitle-">
                                            Permisos del rol valor a cambiar
                                        </div>
                                        <Select
                                            className="w-100 white"
                                            labelId="demo-mutiple-chip-label"
                                            id="demo-mutiple-chip"
                                            value={permissionsEdit}
                                            multiple
                                            input={<Input id="select-multiple-chip" />}
                                            onChange={(e) => setPermissionsEdit(e.target.value)}
                                            renderValue={selected => (
                                                < div className={classes.chips}>
                                                    {selected.map(value => (
                                                        <Chip key={value} label={permissionsSelect.filter(permission => permission["id"] == value)[0]["name"]} className={classes.chip} />
                                                    ))}
                                                </div>
                                            )}
                                            MenuProps={MenuProps}
                                        >
                                            {permissionsSelect.map(permission => (
                                                <MenuItem key={permission["id"]} value={permission["id"]} >
                                                    {permission["name"]}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="col-1 ">
                                        <Send className="mt-5 pointer" fontSize="large"
                                            onClick={() => editRole(permissionsEdit, "permissions")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Fade>
                    </Modal> : ""
                )
            }
            { /*Crear*/
                (mounted ?

                    <Modal
                        className={classes.modal}
                        open={create}
                        onClose={handleCloseCreate}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{ timeout: 500, }}
                    >
                        <Fade in={create}>
                            <div className={classes.paper}>
                                <h2 id="transition-modal-title white mb-3">Editar el rol</h2>
                                <div className="row">
                                    <div className="col-6  mb-3 ">
                                        <div className="pl-4 pr-4 card-header subtitle-">
                                            Nombre del rol valor a crear
                                        </div>
                                        <TextField fullWidth label="Nombre del Rol" InputProps={{ className: classes.input }} value={nameCreate} onChange={(e) => (setNameCreate(e.target.value))} />
                                    </div>

                                    <div className="col-6  mb-3 ">
                                        <div className="pl-4 pr-4 card-header subtitle-">
                                            Permisos del rol valor a cambiar
                                        </div>
                                        <Select
                                            className="w-100 white"
                                            labelId="demo-mutiple-chip-label"
                                            id="demo-mutiple-chip"
                                            value={permissionsCreate}
                                            multiple
                                            input={<Input id="select-multiple-chip" />}
                                            onChange={(e) => setPermissionsCreate(e.target.value)}
                                            renderValue={selected => (
                                                < div className={classes.chips}>
                                                    {selected.map(value => (
                                                        <Chip key={value} label={permissionsSelect.filter(permission => permission["id"] == value)[0]["name"]} className={classes.chip} />
                                                    ))}
                                                </div>
                                            )}
                                            MenuProps={MenuProps}
                                        >
                                            {permissionsSelect.map(permission => (
                                                <MenuItem key={permission["id"]} value={permission["id"]} >
                                                    {permission["name"]}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="offset-3 p-2 col-6">
                                        <button
                                            type="button"
                                            className={`${(nameCreate != "") ? 'btn-success' : 'btn-outline-secondary default-pointer'} w-100 mt-3 mb-2`}
                                            onClick={() => {
                                                if (nameCreate != "") {
                                                    fetch("/create/role", {
                                                        method: 'POST',
                                                        body: JSON.stringify({ name: nameCreate, "permissionIds": permissionsCreate }),
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
                                                                setRows(response)
                                                            }
                                                        })
                                                    handleCloseCreate()
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


export default RolesTable
