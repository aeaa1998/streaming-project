import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';

const Login = () => {
    const [username, watchUsername] = useState("");
    const [passowrd, watchPassword] = useState("");

    return (
        <div className="">
            <video autoPlay muted loop className="chill-video"><source src="/videos/chill.mp4" type="video/mp4" /></video>
            <img src />
            <div className="row">
                <div className="offset-4 col-md-4 main-bg-t p-4">
                    <div className="min-vh-30 text-light">
                        <div className="title-3">Iniciar sesión</div>
                        <input className="form-input w-100 mt-2 mb-2 bt-0 bl-0 br-0" type="text" placeholder="Usuario"
                            onChange={(e) => watchUsername(e.target.value)} value={username} />
                        <input className="form-input w-100 mt-2 mb-2 bt-0 bl-0 br-0" type="text" placeholder="Constraseña"
                            onChange={(e) => watchPassword(e.target.value)} value={passowrd} />
                        <div className="row mt-3 mb-3">
                            <div className="offset-2 col-3">
                                <button type="button" className="btn btn-dark w-100">Login</button>
                            </div>
                            <div className="offset-1 col-4">
                                <button type="button" className="btn btn-dark w-100">Crear Cuenta</button>
                            </div>
                        </div>
                        <div className="w-100 text-center pointer inline-block">Recuperar contraseña</div>

                    </div>
                </div>
            </div>
        </div>
    );

}

if (document.getElementById('login')) {

    ReactDOM.render(<Login />, document.getElementById('login'));
}
