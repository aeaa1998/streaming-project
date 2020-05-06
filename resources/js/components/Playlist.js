import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import PlaylistTable from './PlaylistTable';

export default class Playlist extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="row mt-4">
                <div className="col-12">

                    <PlaylistTable />
                </div>

            </div>
        );
    }
}

if (document.getElementById('playlist')) {
    ReactDOM.render(<Playlist />, document.getElementById('playlist'));
}
