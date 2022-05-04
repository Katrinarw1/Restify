import { Link } from "react-router-dom";
import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const usernameRegex = /^[a-zA-Z0-9_]+$/;
const passwordRegex = /^(?=.*[0-9]+)(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[!@#$%^&*]+)[a-zA-Z0-9!@#$%^&*]{8,}$/;
const emailRegex = /^([a-zA-Z0-9!#$%&'*+\-\/=?^_`{|}~]+(\.[a-zA-Z0-9!#$%&'*+\-\/=?^_`{|}~]+)*)@([a-zA-Z0-9]+([\-]+[a-zA-Z0-9]+)*)+((\.[a-zA-Z0-9]+([\-]+[a-zA-Z0-9]+)*)*(\.(?=[0-9]*[a-zA-Z\-]+)([a-zA-Z0-9]+([\-]+[a-zA-Z0-9]+)*))+)*$/;
const phoneRegex = /^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/;


function Register() {
    document.title = "Restify | Sign Up";

    const [state, setState] = useState({
        username: "",
        password1: "",
        password2: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: ""
    });
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState("https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png");

    const [errorMessage, setErrorMessage] = useState({
        usernameError: "",
        password1Error: "",
        password2Error: "",
        first_nameError: "",
        last_nameError: "",
        emailError: "",
        phoneError: "",
        avatarError: "",
    });

    const [errorMessageSubmit, setErrorMessageSubmit] = useState("");


    const handle_change = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const handle_image = (event) => {
        //setErrorMessage(prevState => ({ ...prevState, avatarError: validateImage() }))
        setAvatar(event.target.files[0]);
        setPreview(URL.createObjectURL(event.target.files[0]));

    }

    const validateFirst = () => {
        if (state.first_name == "") {
            return "Enter your first name";
        } else {
            return "";
        }
    }
    const validateLast = () => {
        if (state.last_name == "") {
            return "Enter your last name";
        } else {
            return "";
        }
    }
    const validateUsername = () => {
        if (state.username == "") {
            return "Enter a username";
        } else if (usernameRegex.test(state.username) == false) {
            return "Can only contain letters, numbers, and underscores"
        } else {
            return "";
        }
    }
    const validatePhone = () => {
        if (state.phone_number == "") {
            return "Enter a phone number";
        } else if (phoneRegex.test(state.phone_number) == false) {
            return "Must be in format (XXX) XXX-XXXX";
        } else {
            return "";
        }
    }
    const validateEmail = () => {
        if (state.email == "") {
            return "Enter an email";
        } else if (emailRegex.test(state.email) == false) {
            return "Enter a valid email"
        } else {
            return "";
        }
    }
    const validatePassword = () => {
        if (state.password1 == "") {
            return "Enter a password";
        } else if (passwordRegex.test(state.password1) == false) {
            return "Must contain a number, uppercase, lowercase, special character, and be at least 8 characters long"
        } else {
            return "";
        }
    }
    const validatePasswordMatch = () => {
        if (state.password2 != state.password1) {
            return "Passwords much match";
        } else {
            return "";
        }
    }
    const validateImage = () => {
        if (avatar == null) {
            return "Upload an image";
        } else {
            return "";
        }
    }

    let navigate = useNavigate();

    const signupToServer = (e) => {
        e.preventDefault();

        if (validateFirst() == "" && validateLast() == "" && validateUsername() == "" && validateEmail() == "" &&
            validatePhone() == "" && validatePassword() == "" && validatePasswordMatch() == "" && avatar != null) {

            const formData = new FormData();

            formData.append('username', state.username);
            formData.append('password', state.password1);
            formData.append('avatar', avatar);
            formData.append('email', state.email);
            formData.append('phone_number', state.phone_number);
            formData.append('first_name', state.first_name);
            formData.append('last_name', state.last_name);

            fetch('http://localhost:8000/signup/', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(json => {
                    if (json.hasOwnProperty('username') == true) {
                        if (json.username == state.username) {
                            //login successful
                            navigate('/login', { replace: true });
                        } else if (json.username.indexOf("user with this username already exists.") > -1) {
                            setErrorMessageSubmit("A user with this username already exists");
                        }
                    } else if (json.hasOwnProperty('email') == true) {
                        if (json.email.indexOf("Enter a valid email address.") > -1) {
                            setErrorMessageSubmit("Try again");
                            setErrorMessage(prevState => ({ ...prevState, emailError: "Enter an actual email address" }))
                        }
                    } else {
                        setErrorMessageSubmit("An unknown error occurred");
                    }
                }).catch(console.error);
        } else {
            setErrorMessage({
                usernameError: validateUsername(),
                password1Error: validatePassword(),
                password2Error: validatePasswordMatch(),
                first_nameError: validateFirst(),
                last_nameError: validateLast(),
                emailError: validateEmail(),
                phoneError: validatePhone(),
                avatarError: validateImage(),
            });
            setErrorMessageSubmit("Fix errors");
        }
    }

    return (<>
        <div className="login-background-wrapper"><img src="/images/signupbackground.jpg" /></div>

        <div className="signup-form text-center">
            <form onSubmit={e => { signupToServer(e, state); }}>
                <h2>Register</h2>
                <p className="hint-text">Create your account. It's free and only takes a minute.</p>

                <div className="row">
                    <div className="col">
                        <div className="text-center mt-2 mb-4">
                            <label htmlFor="profile-image" className="custom-file-upload">
                                <div className="profile-signup-image-button text-center">
                                    <img src={preview} className="rounded-circle img-fluid w-100 mb-2" />
                                </div>
                                Upload a profile photo
                            </label>
                            <input className="text-center" type="file" name="avatar" id="profile-image"
                                accept=".png, .jpg, .jpeg" onChange={handle_image} />
                        </div>
                        <div className="col-12 error-message text-center">{errorMessage.avatarError}</div>
                    </div>

                    <div className="col">
                        <div className="row">
                            <div className="error-message col-6 text-center">{errorMessage.first_nameError}</div>
                            <div className="error-message col-6 text-center">{errorMessage.last_nameError}</div>
                        </div>

                        <div className="row">
                            <div className="input-group col left-col">
                                <span className="input-group-text"><i className="fa fa-user"></i></span>
                                <input type="text" id="first_name" name="first_name" className="form-control"
                                    placeholder="First name" required value={state.first_name}
                                    onChange={handle_change}
                                    onBlur={() => setErrorMessage(prevState => ({ ...prevState, first_nameError: validateFirst() }))} />
                            </div>

                            <div className="input-group col">
                                <span className="input-group-text"><i className="fa fa-user"></i></span>
                                <input type="text" id="last_name" name="last_name" className="form-control"
                                    placeholder="Last name" required value={state.last_name} onChange={handle_change}
                                    onBlur={() => setErrorMessage(prevState => ({ ...prevState, last_nameError: validateLast() }))} />
                            </div>
                        </div>


                        <div className="col-12 error-message ps-3 text-center">{errorMessage.usernameError}</div>
                        <div className="input-group">
                            <span className="input-group-text"><i className="fa fa-user"></i></span>
                            <input type="text" id="username" name="username" className="form-control" placeholder="Username"
                                value={state.username} onChange={handle_change} required
                                onBlur={() => setErrorMessage(prevState => ({ ...prevState, usernameError: validateUsername() }))} />
                        </div>

                        <div className="col-12 error-message ps-3 text-center">{errorMessage.emailError}</div>
                        <div className="input-group">
                            <span className="input-group-text"><i className="fa fa-paper-plane"></i></span>
                            <input type="email" id="email" name="email" className="form-control" placeholder="Email address"
                                required value={state.email} onChange={handle_change}
                                onBlur={() => setErrorMessage(prevState => ({ ...prevState, emailError: validateEmail() }))} />
                        </div>

                        <div className="col-12 error-message ps-3 text-center">{errorMessage.phoneError}</div>
                        <div className="input-group">
                            <span className="input-group-text"><i className="fa fa-phone"></i></span>
                            <input type="tel" id="phone_number" name="phone_number" className="form-control"
                                placeholder="Phone number" required
                                value={state.phone_number} onChange={handle_change}
                                onBlur={() => setErrorMessage(prevState => ({ ...prevState, phoneError: validatePhone() }))} />
                        </div>

                        <div className="col-12 error-message ps-3 text-center">{errorMessage.password1Error}</div>
                        <div className="input-group">
                            <span className="input-group-text"><i className="fa fa-lock"></i></span>
                            <input type="password" id="password1" name="password1" className="form-control" placeholder="Password"
                                required value={state.password1} onChange={handle_change}
                                onBlur={() => setErrorMessage(prevState => ({ ...prevState, password1Error: validatePassword() }))} />
                        </div>

                        <div className="col-12 error-message ps-3 text-center">{errorMessage.password2Error}</div>
                        <div className="input-group">
                            <span className="input-group-text"><i className="fa fa-lock"></i><i className="fa fa-check"></i></span>
                            <input type="password" id="password2" name="password2" className="form-control" placeholder="Confirm password"
                                required value={state.password2} onChange={handle_change}
                                onBlur={() => setErrorMessage(prevState => ({ ...prevState, password2Error: validatePasswordMatch() }))} />
                        </div>
                    </div>
                </div>

                <div className="d-grid mt-3">
                    <button type="submit" className="btn btn-success btn-lg submit-button">Create account</button>
                    <div className="error-message">{errorMessageSubmit}</div>
                </div>

            </form>

            <div className="redirect-link">Already have an account? <Link to="/login">Sign in</Link></div>
        </div>

    </>);
}


export default Register;