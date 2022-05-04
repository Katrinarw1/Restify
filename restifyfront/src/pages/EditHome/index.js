import { useParams, useLocation } from "react-router-dom";
import React, { useEffect } from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";



function EditHome() {
    document.title = "Restify | Edit Restaurant";

    const { idUsername } = useParams();
    const location = useLocation();
    const [currUsr, setCurrUser] = useState({});

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [postalCode, setPostalCode] = useState("");

    const [existingLogo, setExistingLogo] = useState("");
    const [logo, setLogo] = useState("");
    const [preview, setPreview] = useState(null);


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
                }).catch(console.error);

            fetch(`http://localhost:8000/${idUsername}/restaurant/`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
                }
            })
                .then((res) => res.json())
                .then((json) => {
                    if (json.detail == undefined) {  //if restaurant doesn't exist
                        if (json.name != null) {
                            setName(json.name);
                        }
                        if (json.email != null) {
                            setEmail(json.email);
                        }
                        if (json.phone_number != null) {
                            setPhoneNumber(json.phone_number);
                        }
                        if (json.address != null) {
                            setAddress(json.address);
                        }
                        if (json.postal_code != null) {
                            setPostalCode(json.postal_code);
                        }
                        if (json.logo != null) {
                            setLogo(json.logo);
                            setExistingLogo(json.logo);
                            setPreview(json.logo);
                        }
                    }
                }).catch(console.error);
        }
    }, []);

    const handleImage = (e) => {
        setLogo(e.target.files[0]);
        setPreview(URL.createObjectURL(e.target.files[0]));
    }

    const handleDelete = () => {
        fetch(`http://localhost:8000/${idUsername}/restaurant/`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
            }
        }).catch(console.error);
        navigate(`/${idUsername}/restaurant/general`, { replace: true });
    }

    let navigate = useNavigate();

    const handleEdit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone_number', phoneNumber);
        formData.append('address', address);
        formData.append('postal_code', postalCode);

        if (logo != null && logo != "" && logo != existingLogo) {
            formData.append('logo', logo);
        }

        fetch(`http://localhost:8000/${idUsername}/restaurant/`, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
            },
            body: formData,
        })
            .then((result) => {
                navigate(`/${idUsername}/restaurant/general`, { replace: true });
            }).catch(console.error);
    }


    return (
        <main className="edit-container p-3">
            <form onSubmit={handleEdit}>
                <div className="edit-form row m-4 py-4 px-3">
                    <div className="col-8 m-0 pe-5">
                        <div className="row mb-2">
                            <div className="col pb-2">
                                <h2>RESTAURANT INFO</h2>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="inputResName" className="col-4 ms-3 col-form-label">Restaurant name:</label>
                            <div className="col">
                                <input type="text" id="inputResName" name="inputResName" className="form-control"
                                    placeholder="Restaurant name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="inputemail" className="col-4 ms-3 col-form-label">Email:</label>
                            <div className="col">
                                <input type="text" id="inputemail" name="inputemail" className="form-control"
                                    placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="inputPhoneNumber" className="col-4 ms-3 col-form-label">Phone number:</label>
                            <div className="col">
                                <input type="tel" id="inputPhoneNumber" name="inputPhoneNumber" className="form-control"
                                    placeholder="Phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="inputaddress" className="col-4 ms-3 col-form-label">Address:</label>
                            <div className="col">
                                <input type="tel" id="inputaddress" name="inputaddress" className="form-control"
                                    placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="inputPostalCode" className="col-4 ms-3 col-form-label">Postal code:</label>
                            <div className="col">
                                <input type="tel" id="inputPostalCode" name="inputPostalCode" className="form-control"
                                    placeholder="Postal code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                            </div>
                        </div>
                    </div>


                    <div className="col-4 m-0 p-0">
                        <div className="row profile-button justify-content-md-center mt-3 mb-3 text-center">
                            <div className="col">
                                <label htmlFor="avatar" className="custom-file-upload">
                                    <img src={preview} className="rounded-circle img-fluid mb-2 col-12" />
                                    Upload new logo
                                </label>
                                <input className="text-center" type="file" name="avatar" id="avatar"
                                    accept=".png, .jpg, .jpeg" onChange={handleImage} />
                            </div>
                        </div>

                        <div className="row justify-content-md-center">
                            <div className="col-8 mt-3 pt-3 pb-4">
                                <button type="submit" className="btn btn-success submit-button w-100">Save changes</button>
                            </div>
                        </div>
                    </div>

                </div>


            </form>

        </main>

    );
}


export default EditHome;