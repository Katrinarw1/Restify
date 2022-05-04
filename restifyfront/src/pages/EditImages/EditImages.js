import { useParams, useLocation } from "react-router-dom";
import React, { useEffect } from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function EditImages() {
    document.title = "Restify | Edit Images";

    const { idUsername } = useParams();
    const location = useLocation();
    const [currUsr, setCurrUser] = useState({});

    const [imageList, setImageList] = useState([]);
    const [uploadImage, setUploadImage] = useState("");
    const [preview, setPreview] = useState("");

    const [change, setChange] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('token') != null) {
            fetch(`http://localhost:8000/${idUsername}/restaurant/images/`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
                }
            })
                .then((res) => res.json())
                .then((json) => {
                    if (json.detail == undefined) {  //if restaurant doesn't exist
                        if (json != null) {
                            setImageList(json);
                        }
                    }
                }).catch(console.error);
        }
    }, [change]);

    const handleDelete = (e) => {
        fetch(`http://localhost:8000/images/${e.target.getAttribute("name")}/delete/`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
            }
        }).then((res) => {
            setChange(!change);
        })
            .catch(console.error);
    }

    let navigate = useNavigate();

    const handleUpload = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', e.target.files[0]);

        if (setUploadImage != "") {
            fetch(`http://localhost:8000/${idUsername}/restaurant/images/`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
                },
                body: formData,
            })
                .then((response) => response.json())
                .then((json) => {
                    setChange(!change);
                    setUploadImage("");
                    setPreview("");
                }).catch(console.error);
        }
    }

    const handleDone = () => {
        navigate(`/${idUsername}/restaurant/general`, { replace: true });
    }


    return (
        <main className="edit-container p-3">
            <div className="edit-form row m-4 py-4 px-3">
                <div className="col-12 m-0">
                    <div className="row mb-2">
                        <div className="col pb-2">
                            <h2>RESTAURANT IMAGES</h2>
                        </div>
                    </div>

                    <div className="images-container container-fluid p-3">
                        <div className="row text-center">
                            <div className="col image-square">
                                <label htmlFor="image5" className="custom-file-upload blank-file">
                                    <div className="image-wrapper"><img src="/images/blank.png" /></div>
                                    <div className="upload-message">+upload image</div>
                                </label>
                                <input type="file" name="image5" id="image5" accept=".png, .jpg, .jpeg"
                                    onChange={handleUpload} />
                            </div>

                            {imageList.map(image => (
                                <div className="col image-square" key={image.id} onClick={handleDelete}>
                                    <label className="custom-file-upload delete-file" name={image.id}>
                                        <div className="image-wrapper"><img src={image.image} name={image.id} /></div>
                                        <div className="delete-message" name={image.id}>x delete image</div>
                                    </label>
                                </div>
                            ))}

                        </div>
                    </div>

                </div>

                <div className="row justify-content-md-center">
                    <div className="col-4 py-2 mt-4">
                        <button type="button" className="btn btn-success w-100" onClick={handleDone}>Finished</button>
                    </div>
                </div>

            </div>
        </main>

    );
}


export default EditImages;