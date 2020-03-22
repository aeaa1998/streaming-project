import React, { Component, useState } from 'react';
import $ from 'jquery';
import Popper from 'popper.js';
import ReactDOM from 'react-dom';
let permissions = []
if (document.getElementById('permissions')) {
    permissions = document.getElementById('permissions').getAttribute('data')
}
const logout = () => {
    fetch("/logout", {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url
            }
        })
}
const Navbar = () => {
    const [showing, setShow] = useState(false)
    return (
        <nav className="navbar navbar-expand-lg navbar-light main-dark-bg p-3 ">
            <a className="navbar-brand title-3 white" href="#">Streaming</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    {/* <li className="nav-item active">
                        <a className="nav-link subtitle-2 white" href="/">Home</a>
                    </li> */}
                    <li className="nav-item">
                        <a className="nav-link subtitle-2 white" href="/artists">Artistas</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link subtitle-2 white" href="/albums">Albums</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link subtitle-2 white" href="/songs">Canciones</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link subtitle-2 white" href="/genres">Generos</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link subtitle-2 white" href="/reports">Reportería</a>
                    </li>
                    {
                        permissions.includes(4) ? <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle white subtitle-2" href="#" id="navbarDropdown" role="button" onClick={() => { console.log('here'); setShow(!showing) }}>
                                Administracion
                            </a>
                            <div className={`dropdown-menu ${showing ? 'show' : ''}`} aria-labelledby="navbarDropdown">
                                <a className={`dropdown-item subtitle-3 `} href="/admin/users">Usuarios</a>
                                <a className={`dropdown-item subtitle-3 `} href="/admin/roles">Roles</a>
                            </div>
                        </li> : ""
                    }
                </ul>
                <div>

                </div>

                <button className="btn btn-info my-2 my-sm-0 white" type="submit" onClick={logout}>Salir</button>

            </div>
        </nav >
    )
}

if (document.getElementById('navbar')) {
    ReactDOM.render(<Navbar />, document.getElementById('navbar'));
}
