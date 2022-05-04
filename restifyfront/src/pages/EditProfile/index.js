import React, { useEffect } from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const passwordRegex = /^(?=.*[0-9]+)(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[!@#$%^&*]+)[a-zA-Z0-9!@#$%^&*]{8,}$/;
const emailRegex = /^([a-zA-Z0-9!#$%&'*+\-\/=?^_`{|}~]+(\.[a-zA-Z0-9!#$%&'*+\-\/=?^_`{|}~]+)*)@([a-zA-Z0-9]+([\-]+[a-zA-Z0-9]+)*)+((\.[a-zA-Z0-9]+([\-]+[a-zA-Z0-9]+)*)*(\.(?=[0-9]*[a-zA-Z\-]+)([a-zA-Z0-9]+([\-]+[a-zA-Z0-9]+)*))+)*$/;
const phoneRegex = /^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/;


function EditProfile() {
    document.title = "Restify | Edit Profile";

    const [currUsr, setCurrUser] = useState({});

    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [phone_number, setPhone_number] = useState("");
    const [email, setEmail] = useState("");

    const [avatar, setAvatar] = useState("");
    const [preview, setPreview] = useState(null);
    const [existingAvatar, setExistingAvatar] = useState("");

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


    const validateFirst = () => {
        if (first_name == "") {
            return "Enter your first name";
        } else {
            return "";
        }
    }
    const validateLast = () => {
        if (last_name == "") {
            return "Enter your last name";
        } else {
            return "";
        }
    }
    const validatePhone = () => {
        if (phone_number == "") {
            return "Enter a phone number";
        } else if (phoneRegex.test(phone_number) == false) {
            return "Must be in format (XXX) XXX-XXXX";
        } else {
            return "";
        }
    }
    const validateEmail = () => {
        if (email == "") {
            return "Enter an email";
        } else if (emailRegex.test(email) == false) {
            return "Enter a valid email"
        } else {
            return "";
        }
    }
    const validatePassword = () => {
        if (password1 != "") {
            if (passwordRegex.test(password1) == false) {
                return "Must contain a number, uppercase, lowercase, special character, and be at least 8 characters long"
            } else {
                return "";
            }
        } else {
            return "";
        }
    }
    const validatePasswordMatch = () => {
        if (password2 != password1) {
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


    useEffect(() => {
        if (localStorage.getItem('token') != null) {
            fetch('http://localhost:8000/currentuser/', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
                }
            })
                .then((res) => res.json())
                .then((json) => {
                    setCurrUser(json);
                    setPreview(json.avatar)
                    setFirst_name(json.first_name);
                    setLast_name(json.last_name);
                    setEmail(json.email);
                    setPhone_number(json.phone_number);
                    setExistingAvatar(json.avatar);
                }).catch(console.error);
        }
    }, []);

    const handleImage = (e) => {
        setAvatar(e.target.files[0]);
        setPreview(URL.createObjectURL(e.target.files[0]));
    }

    let navigate = useNavigate();

    const handleEdit = (e) => {
        e.preventDefault();

        if (validateFirst() == "" && validateLast() == "" && validateEmail() == "" &&
            validatePhone() == "" && validatePassword() == "" && validatePasswordMatch() == "") {

            const formData = new FormData();

            if (password1 != "") {
                formData.append('password', password1);
            }
            if (avatar != "" && avatar != "" && avatar != existingAvatar) {
                formData.append('avatar', avatar);
            }
            formData.append('email', email);
            formData.append('phone_number', phone_number);
            formData.append('first_name', first_name);
            formData.append('last_name', last_name);

            fetch(`http://localhost:8000/profile/${currUsr.username}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
                },
                body: formData,
            })
                .then(response => response.json())
                .then(json => {
                    if (json.hasOwnProperty('email') == true) {
                        if (json.username == currUsr.username) {
                            navigate('/home', { replace: true });
                        }
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
                password1Error: validatePassword(),
                password2Error: validatePasswordMatch(),
                first_nameError: validateFirst(),
                last_nameError: validateLast(),
                emailError: validateEmail(),
                phoneError: validatePhone(),
                avatarError: "",
            });
            setErrorMessageSubmit("Fix errors");
        }
    }

    return (
        <main className="edit-container p-3">
            <form onSubmit={handleEdit} className="edit-form row m-4 py-4 px-3">
                <div className="col-8 m-0 pe-5">
                    <h2 className="mb-3">EDIT PROFILE</h2>

                    <div className="col-12 error-message ps-3 text-center">{errorMessage.first_nameError}</div>
                    <div className="row mb-3">
                        <label htmlFor="first_name" className="col-4 ms-3 col-form-label">First name:</label>
                        <input type="text" id="first_name" name="first_name" className="form-control col"
                            placeholder="First name" value={first_name}
                            onChange={(e) => setFirst_name(e.target.value)} required
                            onBlur={() => setErrorMessage(prevState => ({ ...prevState, first_nameError: validateFirst() }))} />
                    </div>

                    <div className="col-12 error-message ps-3 text-center">{errorMessage.last_nameError}</div>
                    <div className="row mb-3">
                        <label htmlFor="last_name" className="col-4 ms-3 col-form-label">Last name:</label>
                        <input type="text" id="last_name" name="last_name" className="form-control col"
                            placeholder="Last name" value={last_name}
                            onChange={(e) => setLast_name(e.target.value)} required
                            onBlur={() => setErrorMessage(prevState => ({ ...prevState, last_nameError: validateLast() }))} />
                    </div>

                    <div className="col-12 error-message ps-3 text-center">{errorMessage.phoneError}</div>
                    <div className="row mb-3">
                        <label htmlFor="phone_number" className="col-4 ms-3 col-form-label">Phone number:</label>
                        <input type="tel" id="phone_number" name="phone_number" className="form-control col"
                            placeholder="Phone number" value={phone_number}
                            onChange={(e) => setPhone_number(e.target.value)} required
                            onBlur={() => setErrorMessage(prevState => ({ ...prevState, phoneError: validatePhone() }))} />
                    </div>

                    <div className="col-12 error-message ps-3 text-center">{errorMessage.emailError}</div>
                    <div className="row mb-3">
                        <label htmlFor="email" className="col-4 ms-3 col-form-label">Email:</label>
                        <input type="tel" id="email" name="email" className="form-control col"
                            placeholder="Email" value={email}
                            onChange={(e) => setEmail(e.target.value)} required
                            onBlur={() => setErrorMessage(prevState => ({ ...prevState, emailError: validateEmail() }))} />
                    </div>


                    <div className="change-password">
                        <h5 className="mb-3 mt-4 pt-1">CHANGE PASSWORD:</h5>

                        <div className="col-12 error-message ps-3 text-center">{errorMessage.password1Error}</div>
                        <div className="row mb-3">
                            <label htmlFor="inputPassword" className="col-4 ms-3 col-form-label">New password:</label>
                            <input type="password" id="inputPassword" name="inputPassword" className="form-control col"
                                placeholder="New password" value={password1} onChange={(e) => setPassword1(e.target.value)}
                                onBlur={() => setErrorMessage(prevState => ({ ...prevState, password1Error: validatePassword() }))} />
                        </div>

                        <div className="col-12 error-message ps-3 text-center">{errorMessage.password2Error}</div>
                        <div className="row mb-3">
                            <label htmlFor="confirmPassword" className="col-4 ms-3 col-form-label">Confirm new password:</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" className="form-control col"
                                placeholder="Confirm password" value={password2} onChange={(e) => setPassword2(e.target.value)}
                                onBlur={() => setErrorMessage(prevState => ({ ...prevState, password2Error: validatePasswordMatch() }))} />
                        </div>
                    </div>
                </div>


                <div className="col-4 m-0 p-0">
                    <div className="row profile-button justify-content-md-center mt-3 mb-3 text-center">
                        <div className="col">
                            <label htmlFor="avatar" className="custom-file-upload">
                                <img src={preview} className="rounded-circle img-fluid mb-2 col-12" />
                                Upload new avatar
                            </label>
                            <input className="text-center" type="file" name="avatar" id="avatar"
                                accept=".png, .jpg, .jpeg" onChange={handleImage} />
                        </div>
                        <div className="col-12 error-message text-center">{errorMessage.avatarError}</div>
                    </div>

                    <div className="row justify-content-md-center">
                        <div className="col-8 mt-5 pt-3">
                            <button type="submit" className="btn btn-success submit-button w-100">Save changes</button>
                            <div className="error-message">{errorMessageSubmit}</div>
                        </div>
                    </div>

                </div>
            </form>
        </main>
    );
}


export default EditProfile;