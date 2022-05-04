import { useParams, useLocation } from "react-router-dom";
import React, { useEffect } from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function EditBlogPost(props) {
    document.title = "Restify | Blog Post Editor";

    const [errorMessage, setErrorMessage] = useState({
        titleError: "",
        contentError: "",
        imageError: "",
    });

    const [errorMessageSubmit, setErrorMessageSubmit] = useState("");

    const { idSlug } = useParams();
    const location = useLocation();
    const [currUsr, setCurrUser] = useState({});

    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");

    const [existingHeaderImage, setExistingHeaderImage] = useState("");
    const [header_image, setHeader_image] = useState("");
    const [preview, setPreview] = useState(null);

    const [blogContent, setBlogContent] = useState("");

    const [isEdit] = useState(location.pathname.includes('/edit'))

    const validateTitle = () => {
        if (title == "") {
            return "Enter a title";
        } else {
            return "";
        }
    }
    const validateContent = () => {
        if (blogContent == "") {
            return "Enter a blog post";
        } else {
            return "";
        }
    }
    const validateImage = () => {
        /*if (header_image == "") {
            return "Upload an image";
        } else {
            return "";
        }*/
        return "";
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
                }).catch(console.error);

            if (isEdit) {
                fetch(`http://localhost:8000/restaurant/blogpost/${idSlug}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
                    }
                })
                    .then((res) => res.json())
                    .then((json) => {
                        if (json.detail == undefined) {  //if blog doesn't exist
                            setTitle(json.title);
                            if (json.small_title != null) {  //if there's a small title
                                setSubTitle(json.small_title);
                            }
                            setHeader_image(json.header_image);
                            setExistingHeaderImage(json.header_image);
                            setPreview(json.header_image);
                            setBlogContent(json.content);
                        }
                    }).catch(console.error);
            }
        }
    }, []);

    const handleImage = (e) => {
        setHeader_image(e.target.files[0]);
        setPreview(URL.createObjectURL(e.target.files[0]));
    }

    const handleDelete = () => {
        fetch(`http://localhost:8000/restaurant/blogpost/${idSlug}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
            }
        }).catch(console.error);
        navigate(`/${currUsr.username}/restaurant/blog`, { replace: true });
    }

    let navigate = useNavigate();

    const handleEdit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('restaurant_owner', currUsr.username);
        if (subTitle != "") {
            formData.append('small_title', subTitle);
        }
        if (title != "" && blogContent != "") {
            formData.append('title', title);
            if (header_image != "" && header_image != null && header_image != existingHeaderImage) {
                formData.append('header_image', header_image);
            }
            formData.append('content', blogContent);

            if (isEdit) {
                fetch(`http://localhost:8000/restaurant/blogpost/${idSlug}/`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
                    },
                    body: formData,
                })
                    .then((result) => {
                        navigate(`/${currUsr.username}/blogpost/${idSlug}`, { replace: true });
                    }).catch(console.error);

            } else {
                fetch(`http://localhost:8000/restaurant/blogpost/add/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
                    },
                    body: formData,
                })
                    .then((response) => response.json())
                    .then((json) => {
                        navigate(`/${currUsr.username}/blogpost/${json.id}`, { replace: true });
                    }).catch(console.error);
            }
        } else {
            setErrorMessage({
                titleError: validateTitle(),
                contentError: validateContent(),
                imageError: "",
            });
            setErrorMessageSubmit("Fix errors");
        }
    }


    return (
        <main className="edit-container p-3">
            <form onSubmit={handleEdit}>
                <div className="edit-form row m-4 py-4 px-3">
                    <div className="row mb-2">
                        <div className="col">
                            <h2>BLOG POST EDITOR</h2>
                        </div>
                    </div>


                    <div className="edit-item-box p-3">
                        <div className="col-12 error-message ps-3 text-center">{errorMessage.titleError}</div>
                        <div className="row mb-2">
                            <label htmlFor="inputName" className="col-2 input-label col-form-label">
                                Blog post name:
                            </label>
                            <div className="col">
                                <input type="text" id="inputName" name="inputName" className="form-control"
                                    value={title} onChange={(e) => setTitle(e.target.value)} required
                                    onBlur={() => setErrorMessage(prevState => ({ ...prevState, titleError: validateTitle() }))} />
                            </div>
                        </div>

                        <div className="row mb-2">
                            <label htmlFor="inputSubTitle" className="col-2 input-label col-form-label">
                                Blog post sub-title:
                            </label>
                            <div className="col">
                                <input type="text" id="inputSubTitle" name="inputSubTitle" className="form-control"
                                    value={subTitle} onChange={(e) => setSubTitle(e.target.value)} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 error-message pe-5 me-5 text-center">{errorMessage.imageError}</div>
                            <div className="col-2 input-label">Blog header image:</div>
                            <div className="col image-square">
                                <label htmlFor="headerImage" className="custom-file-upload">
                                    <div className="col image-header-wrapper"><img src={preview} /></div>
                                </label>
                                <input className="text-center" type="file" name="headerImage" id="headerImage"
                                    accept=".png, .jpg, .jpeg" onChange={handleImage} />
                            </div>
                        </div>
                    </div>


                    <div className="edit-item-box p-3 row mb-2">
                        <div className="col-12 error-message ps-3 text-center">{errorMessage.contentError}</div>
                        <span className="col-2 descrip-label col-form-label">Content:</span>
                        <div className="col ">
                            <textarea className="form-control stop-setting-height-for-others" rows="10" value={blogContent}
                                onChange={(e) => setBlogContent(e.target.value)}
                                onBlur={() => setErrorMessage(prevState => ({ ...prevState, contentError: validateContent() }))} >
                            </textarea>
                        </div>
                    </div>



                    <div className="row justify-content-md-center">
                        <div className="col-5 my-3">
                            <button type="submit" className="btn btn-success submit-button w-100">Post blog</button>
                            <div className="error-message text-center">{errorMessageSubmit}</div>
                        </div>
                    </div>


                    <div className="row justify-content-md-center">
                        <div className="col-3 mt-5 mb-3">
                            <button type="button" className="btn btn-danger w-100" onClick={handleDelete}>
                                Delete blog post
                            </button>
                        </div>
                    </div>

                </div>
            </form>

        </main>

    );
}


export default EditBlogPost;