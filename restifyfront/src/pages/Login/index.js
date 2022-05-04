import { Link } from "react-router-dom";
import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    document.title = "Restify | Login";

    const [errorMessageSubmit, setErrorMessageSubmit] = useState("");

    const [state, setState] = useState({
        username: "",
        password: ""
    })

    const [errorMessage, setErrorMessage] = useState({
        usernameError: "",
        passwordError: "",
    });

    const validateUsername = () => {
        if (state.username == "") {
            return "Enter your username";
        } else {
            return "";
        }
    }
    const validatePassword = () => {
        if (state.password == "") {
            return "Enter your password";
        } else {
            return "";
        }
    }

    const handle_change = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    let navigate = useNavigate();

    const loginToServer = (e) => {
        e.preventDefault();

        if (validateUsername() == "" && validatePassword() == "") {
            fetch('http://localhost:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: state.username,
                    password: state.password
                })
            })
                .then(response => response.json())
                .then(json => {
                    if (json.detail == null) {
                        //login successful
                        localStorage.setItem('token', json.access);
                        navigate('/home', { replace: true });
                    } else {
                        //handle bad creds
                        setErrorMessageSubmit("Invalid username and password combination");
                    }
                });
        } else {
            setErrorMessage({
                usernameError: validateUsername(),
                passwordError: validatePassword(),
            });
            setErrorMessageSubmit("Invalid username and password combination");
        }
    }

    return (<>
        <div className="login-background-wrapper"><img src="/images/loginbackground.jpg" /></div>

        <div className="login-form text-center">
            <form onSubmit={e => { loginToServer(e, state); }}>
                <h2>Sign in</h2>
                <p className="hint-text">Welcome back to your Restify account.</p>

                <div className="input-group">
                    <div className="col-12 error-message ps-3 text-center">{errorMessage.usernameError}</div>
                    <span className="input-group-text"><i className="fa fa-user"></i></span>
                    <input type="text" id="username" name="username" className="form-control" placeholder="Username"
                        value={state.username} onChange={handle_change} required autoFocus
                        onBlur={() => setErrorMessage(prevState => ({ ...prevState, usernameError: validateUsername() }))} />
                </div>

                <div className="d-grid row">
                    <div className="col-12 error-message ps-3 text-center">{errorMessage.passwordError}</div>
                    <div className="col input-group mb-4">
                        <span className="input-group-text"><i className="fa fa-lock"></i></span>
                        <input type="password" id="password" name="password" className="form-control" placeholder="Password"
                            value={state.password} onChange={handle_change} required
                            onBlur={() => setErrorMessage(prevState => ({ ...prevState, passwordError: validatePassword() }))} />
                    </div>
                </div>

                <div className="d-grid">
                    <button type="submit" className="btn btn-success btn-lg mb-0">Login</button>
                    <div className="error-message">{errorMessageSubmit}</div>
                </div>
            </form>

            <div className="redirect-link text-center">Don't have an account? <Link to="/register">Register now</Link></div>
        </div>
    </>);
}


export default LoginPage;