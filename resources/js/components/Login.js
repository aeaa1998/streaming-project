import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import { TextField } from '@material-ui/core';

const Login = () => {
    const [username, watchUsername] = useState("");
    const [password, watchPassword] = useState("");
    const [invalidCredentials, setInvalidCredentials] = useState(false);
    const [emptyFields, setEmptyFields] = useState(false);
    const [success, setSuccess] = useState(false);
    const logIn = () => {
        if (username == "" || password == "") {
            setEmptyFields(true)
            setTimeout(() => setEmptyFields(false), 3000)
            return
        }
        let data = { "username": username, "password": password }
        fetch(`/auth/user/${username}/${password}`)
            .then(response => {
                console.log(response)
                if (response.status != 200) {
                    setInvalidCredentials(true)
                    setTimeout(() => setInvalidCredentials(false), 3000)
                } else {
                    if (response.redirected) {
                        window.location.href = response.url
                    }
                    setSuccess(true)
                    setTimeout(() => setSuccess(false), 3000)
                }
            })
            .catch(error => {

            })
    }
    return (
        <div className="">
            <video autoPlay muted loop className="chill-video"><source src="/videos/chill.mp4" type="video/mp4" /></video>
            <div className={`alert alert-success w-50 position-absolute alert-sign ${success ? 'show' : 'hide'}`}>
                Exito!
            </div>
            <div className={`alert alert-danger w-50 position-absolute alert-sign ${emptyFields ? 'show' : 'hide'}`}>
                Asegurese de llenar todos los campos!
            </div>
            <div className={`alert alert-danger w-50 position-absolute alert-sign ${invalidCredentials ? 'show' : 'hide'}`}>
                Credenciales invalidas
            </div>
            <div className="row">
                <div className="offset-4 col-md-4 main-bg-t mt-30 p-4">
                    <div className="min-vh-30 text-light">
                        <div className="title-3">Iniciar sesión</div>
                        <TextField fullWidth required className="mt-2 white" variant="filled" label="Email" value={username} onChange={(e) => watchUsername(e.target.value)} />
                        <TextField fullWidth required className="mt-2 white" variant="filled" type="password" label="Constraseña" value={password} onChange={(e) => watchPassword(e.target.value)} />

                        <div className="row mt-3 mb-3">
                            <div className="offset-2 col-3">
                                <button type="button" className={`btn btn-${(username == "" || password == "") ? 'dark' : 'success'} w-100`} onClick={logIn}>Login</button>
                            </div>
                            <div className="offset-1 col-4">
                                <a type="button" className="btn btn-success w-100" href="/register">Crear Cuenta</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

if (document.getElementById('login')) {

    ReactDOM.render(<Login />, document.getElementById('login'));
}
