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


if (document.getElementById('permissions')) {
    permissions = JSON.parse(document.getElementById('permissions').getAttribute('data'))
}

let graphs = [
    { "value": 'firstGraph', "name": 'Primera grafica ventas usuarios por año y canciones' },
    { "value": 'locations', "name": 'Total de ventas por País' }
]
const Tableu = (props) => {
    const classes = createStyles()
    const [fetching, setIsFetching] = useState(false)
    const [alert, setAlert] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [graph, setGraph] = useState('locations');
    const [page, watchPage] = useState(0);
    // const [graphs, s] => useState(graphss);
    useEffect(() => {
        setTimeout(() => { setMounted(true) }, 50)
    }, []);
    return (
        <div className="row mt-4 container-fluid">
            <div className="col-10">
                {mounted && <Select className="white pt-1 mt-1"
                    value={graph}
                    onChange={(e) => setGraph(e.target.value)}
                >
                    {graphs.map(json => <MenuItem key={json["value"]} value={json["value"]}>{json["name"]}</MenuItem>)})}
                </Select>
                }


            </div>
            <div className="col-12">
                <div className={`tableauPlaceholder ${graph == "firstGraph" ? "" : "d-none"}`} style={{ width: '1680px', height: '760px' }}><object className='tableauViz' width='1680' height='760' style={{ display: "none" }}><param name='host_url' value='https%3A%2F%2Fprod-useast-a.online.tableau.com%2F' /><param name='embed_code_version' value='3' /><param name='site_root' value='&#47;t&#47;streaming' /><param name='name' value='Primeragrafica&#47;Sheet1' /><param name='tabs' value='no' /><param name='toolbar' value='yes' /><param name='showAppBanner' value='false' /></object></div>
                <div className={`tableauPlaceholder ${graph == "locations" ? "" : "d-none"}`} style={{ width: '1680px', height: '760px' }}><object className='tableauViz' width='1680' height='760' style={{ display: "none" }}><param name='host_url' value='https%3A%2F%2Fprod-useast-a.online.tableau.com%2F' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='&#47;t&#47;streaming' /><param name='name' value='TotalGrossingsByCountry&#47;Sheet2' /><param name='tabs' value='no' /><param name='toolbar' value='yes' /><param name='showAppBanner' value='false' /></object></div>
            </div>
            <div className="col-12">

            </div>
            <div className="main-bg"></div>
        </div>
    );

}

if (document.getElementById('tableu')) {

    ReactDOM.render(<Tableu />, document.getElementById('tableu'));
}
