import React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FieldArray from "./fieldArray";
import { useParams, useNavigate, useLocation, Navigate } from "react-router-dom";

/* Nested Form from https://codesandbox.io/embed/react-hook-form-usefieldarray-nested-arrays-x7btr with modifications */


export default function EditMenu(props) {
    document.title = "Restify | Edit Menu";

    const { idUsername, idMenu } = useParams();
    const [menus, setMenus] = useState([]);
    const [defaultValues, setDefaultValues] = useState({});

    const location = useLocation();
    const [isEdit] = useState(location.pathname.includes('/edit'));

    const [valid, setValid] = useState('ah');

    useEffect(() => {
        //check if idMenu is a menu that exists
        fetch(`http://localhost:8000/restaurant/menu/${idMenu}/`, {
            method: 'GET'
        })
            .then((res) => {
                if (res.status == 404) {
                    setValid(false);
                } else {
                    setValid(true);
                }
            }).catch(console.error);
    }, [valid]);

    useEffect(() => {
        if (isEdit) {
            fetch(`http://localhost:8000/restaurant/menu/${idMenu}/`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
                }
            })
                .then((res) => res.json())
                .then((json) => {
                    setMenus(json);
                    setDefaultValues(json);
                }).catch(console.error);
        } else {
            setMenus({ name: "", menu_item: [] });
            setDefaultValues({ name: "", menu_item: [] });
        }
    }, []);

    useEffect(() => {
        reset(defaultValues);
    }, [menus]);

    const {
        control,
        register,
        handleSubmit,
        getValues,
        errors,
        reset,
        setValue
    } = useForm({
        defaultValues: defaultValues
    });

    const [errorMessage, setErrorMessage] = useState({
        name1Error: "",
    });

    const [errorMessageSubmit, setErrorMessageSubmit] = useState("");

    const validateName = () => {
        if (defaultValues.name == "") {
            return "Enter a name for the menu";
        } else {
            return "";
        }
    }

    let navigate = useNavigate();

    const handleDelete = (e) => {
        fetch(`http://localhost:8000/restaurant/menu/${idMenu}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
            }
        }).then((res) => {
            navigate(`/${idUsername}/restaurant/menu`, { replace: true });
        })
            .catch(console.error);
    }

    const onSubmit = (data) => {
        console.log(data)
        if (defaultValues.name != "" || data.name != "") {
            if (isEdit) {
                fetch(`http://localhost:8000/restaurant/menu/${idMenu}/`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`,
                        'Content-Type': "application/json",
                    },
                    body: JSON.stringify(data)
                })
                    .then((res) => res.json())
                    .then((json) => {
                        if (json.hasOwnProperty('name')) {
                            navigate(`/${idUsername}/restaurant/menu`, { replace: true });
                        } else {
                            setErrorMessageSubmit("All items must have a name, and all prices must be numbers")
                        }
                    }).catch(console.error);
            }
            else {
                fetch(`http://localhost:8000/${idUsername}/restaurant/menu/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`,
                        'Content-Type': "application/json",
                    },
                    body: JSON.stringify(data)
                })
                    .then((res) => res.json())
                    .then((json) => {
                        console.log(json);
                        if (json.hasOwnProperty('name')) {
                            navigate(`/${idUsername}/restaurant/menu`, { replace: true });
                        } else {
                            setErrorMessageSubmit("All items must have a name, and all prices must be numbers")
                        }
                    }).catch(console.error);
            }
        }
    };

    return (
    // don't want to load the page if this isn't a valid menu
        <>{valid != 'ah' ?
            <>{valid == true ?
                <main className="edit-container p-3">
                    <form onSubmit={handleSubmit(onSubmit)} className="edit-form row m-4 py-4 px-3" >
                        <div className="row mb-2">
                            <div className="col">
                                <h2>MENU INFO</h2>
                            </div>
                        </div>

                        <div className="row mb-5">
                            <label htmlFor="inputMenuName" className="col-2 input-label col-form-label">Menu name:</label>
                            <div className="col-6">
                                <input {...register(`name`, { required: true })} defaultValue={defaultValues.name}
                                    className="form-control" />
                            </div>
                        </div>
                        <FieldArray {...{ control, register, defaultValues, getValues, setValue, errors }} />

                        <div className="row justify-content-md-center">
                            <div className="col-5 my-3">
                                <button type="submit" className="btn btn-success submit-button w-100">Save changes</button>
                                <div className="error-message text-center">{errorMessageSubmit}</div>
                            </div>
                        </div>
                    </form>

                    {isEdit ?
                        <div className="row justify-content-md-center">
                            <div className="col-3 my-3">
                                <button type="submit" className="btn btn-danger submit-button w-100"
                                    onClick={handleDelete}>Delete menu</button>
                            </div>
                        </div> : <></>}
                </main>
                : <Navigate to='/404' replace />}</>
            : <></>}</>);
}

