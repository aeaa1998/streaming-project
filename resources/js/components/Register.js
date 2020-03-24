import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import { TextField, InputLabel } from '@material-ui/core';
let types = [{}]
if (document.getElementById("types-register")) {

    types = JSON.parse(
        document.getElementById("types-register").getAttribute("data")
    )
}
function isValidEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return true
    }
    return false
}
const Register = () => {
    const [name, setName] = useState("");
    const [username, watchUsername] = useState("");
    const [password, watchPassword] = useState("");
    const [passwordConfirm, watchPasswordConfirm] = useState("");
    const [subscription, setSubscription] = useState(2);
    const [invalidCredentials, setInvalidCredentials] = useState("");
    const [passwordMissmatch, setPasswordMissmatch] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [emptyFields, setEmptyFields] = useState("");
    const [success, setSuccess] = useState("");
    const registerUser = () => {
        if (![name, username, password, passwordConfirm, subscription].every(val => val != "")) {
            setEmptyFields(true)
            setTimeout(() => setEmptyFields(false), 3000)
            return
        } else if (password != passwordConfirm) {
            setPasswordMissmatch(true)
            setTimeout(() => setPasswordMissmatch(false), 3000)
            return
        } else if (!isValidEmail(username)) {
            setInvalidEmail(true)
            setTimeout(() => setInvalidEmail(false), 3000)
            return
        }

        let data = { "email": username, "password": password, "subscription": subscription, "name": name }
        fetch("/register/user", {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        })
            .catch(error => console.error('Error:', error))
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url
                } else {
                    console.log(response.json())
                    setInvalidCredentials(true)
                    setTimeout(() => setInvalidCredentials(false), 3000)
                }
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

            <div className={`alert alert-danger w-50 position-absolute alert-sign ${passwordMissmatch ? 'show' : 'hide'}`}>
                Las constraseñas no coinciden
            </div>
            <div className={`alert alert-danger w-50 position-absolute alert-sign ${invalidCredentials ? 'show' : 'hide'}`}>
                No se pudo crear el usuario asegurese de meter valores validos
            </div>
            <div className={`alert alert-danger w-50 position-absolute alert-sign ${invalidEmail ? 'show' : 'hide'}`}>
                Meta un correo válido
            </div>
            <div className="row">
                <div className="offset-4 col-md-4 main-bg-t mt-30 p-4">
                    <div className="min-vh-30 text-light">
                        <div className="title-3">Crear usuario</div>
                        <TextField fullWidth required className="mt-2 white" variant="filled" label="Nombre usuario" value={name} onChange={(e) => setName(e.target.value)} />
                        <TextField fullWidth required className="mt-2 white" variant="filled" label="Email" value={username} onChange={(e) => watchUsername(e.target.value)} />
                        <TextField fullWidth required className="mt-2 white" variant="filled" type="password" label="Constraseña" value={password} onChange={(e) => watchPassword(e.target.value)} />
                        <TextField fullWidth required className="mt-2 white" variant="filled" type="password" label="Confirmar Constraseña" value={passwordConfirm} onChange={(e) => watchPasswordConfirm(e.target.value)} />
                        <div className="input-bg p-2 mt-2">
                            <InputLabel className="mt-2">Tipo de suscripción</InputLabel>
                            <select className="custom-select transparent-bg input-color no-border" id="inputGroupSelect01" onChange={(e) => {
                                setSubscription(e.target.value)
                            }}>
                                {types.map(type => <option className="input-color" key={type["id"]} value={type["id"]}>{type["name"]}</option>)}

                            </select>

                        </div>



                        <div className="row mt-3 mb-3">
                            <div className="offset-3 col-6">
                                <button type="button"
                                    className={`btn btn-${(![name, username, password, passwordConfirm, subscription].every(val => val != "")) ? 'dark' : 'success'} w-100`}
                                    onClick={registerUser}>Regustrarse</button>
                            </div>
                        </div>
                        {/* <div className="w-100 text-center pointer inline-block">Recuperar contraseña</div> */}

                    </div>
                </div>
            </div>
        </div>
    );

}

if (document.getElementById('register')) {
    ReactDOM.render(<Register />, document.getElementById('register'));
}
