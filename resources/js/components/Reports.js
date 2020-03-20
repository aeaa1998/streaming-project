import React, { Component, useState } from 'react';
import $ from 'jquery';
import Popper from 'popper.js';
import ReactDOM from 'react-dom';

let permissions = document.getElementById('permissions').getAttribute('data')
const Reports = () => {
    const [showing, setShow] = useState(false)
    return (
        <div className="row mt-4">
            <div className="col-12">
            </div>
        </div>
    )
}

if (document.getElementById('reports')) {
    ReactDOM.render(<Reports />, document.getElementById('reports'));
}
