import React, { Component, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import axios from 'axios'

const TableView = (props) => {
    const [rows, watchRows] = useState([])
    const [isFetching, watchIsFetching] = useState(false)
    useEffect(() => {

        const fetchRows = () =>
            watchIsFetching(true)
        console.log(isFetching)
        fetch('fetch/artists')
            .then(result => result.json())
            .then(data => {
                watchIsFetching(false)
                watchRows(data)
            })
            .catch(error => {
                console.log(error)
            })
        fetchRows()
    }, [rows])

    return (
        <div className="">
            <TableContainer>
                <Table
                    size="medium"
                >
                    <TableHead>
                        <TableRow>
                            {props.columns.map((value, index) => <TableCell key={index}>{value}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) =>
                            <TableRow key={index}>
                                {Object.entries(row).map(([rowKey, value]) => <TableCell key={rowKey}>{value}</TableCell>)}
                            </TableRow>
                        )}

                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    );

}

export default TableView;

