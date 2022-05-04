import { Link, useParams, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";


function Heart({ idUsername, liked, setLiked }) {
    const handleLike = () => {
        fetch(`http://localhost:8000/restaurant/${idUsername}/like/`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
            }
        })
            .then((res) => res.json())
            .then((json) => {
                setLiked(json.message);
            }).catch(console.error);
        setLiked((PrevState) => PrevState);
    }

    return (<>
        {liked == "true" ? <i className="fa fa-heart like-button" onClick={handleLike}></i> :
            <i className="fa fa-heart-o like-button" onClick={handleLike}></i>}
    </>);
}


function Person({ idUsername, followed, setFollowed }) {
    const handleFollow = () => {
        fetch(`http://localhost:8000/restaurant/${idUsername}/follow/`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
            }
        })
            .then((res) => res.json())
            .then((json) => {
                setFollowed(json.message);
            }).catch(console.error);
        setFollowed((PrevState) => PrevState);
    }

    return (<>
        {followed == "true" ? <i className="fa fa-user follow-button text-end" onClick={handleFollow}></i> :
            <i className="fa fa-user-o follow-button text-end" onClick={handleFollow}></i>}
    </>);
}


function General() {
    document.title = "Restify | Restaurant";

    const { idUsername } = useParams();
    const currUser = useOutletContext();

    const isOwner = (currUser.username == idUsername);
    const [restaurant, setRestaurant] = useState({});
    const [images, setImages] = useState([]);
    const [liked, setLiked] = useState("false");
    const [followed, setFollowed] = useState("false");

    useEffect(() => {
        //get restaurant images
        fetch(`http://localhost:8000/${idUsername}/restaurant/images/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
            }
        })
            .then((res) => res.json())
            .then((json) => {
                setImages(json);
            }).catch(console.error);
    }, []);

    const getRestaurantInfo = () => {
        //get restaurant info
        fetch(`http://localhost:8000/${idUsername}/restaurant/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
            }
        })
            .then((res) => res.json())
            .then((json) => {
                setRestaurant(json)
            }).catch(console.error);
    }

    useEffect(() => {
        getRestaurantInfo();

        //get whether current user has liked this restaurant
        fetch(`http://localhost:8000/restaurant/${idUsername}/hasliked/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
            }
        })
            .then((res) => res.json())
            .then((json) => {
                setLiked(json.message);
            }).catch(console.error);
    }, [liked])

    useEffect(() => {
        getRestaurantInfo();

        //get whether current user has followed this restaurant
        fetch(`http://localhost:8000/restaurant/${idUsername}/hasfollowed/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
            }
        })
            .then((res) => res.json())
            .then((json) => {
                setFollowed(json.message);
            }).catch(console.error);
    }, [followed])


    return (
        <div className="tab-pane fade show active main-container p-0" id="nav-general" role="tabpanel" aria-labelledby="nav-general-tab">
            <div className="row main-row g-0">
                <div id="myCarousel" className="carousel slide col-7 bg-light" data-bs-ride="carousel">
                    <div className="carousel-inner">

                        {images.map(image => (
                            <div className={images[0] == image ? "carousel-item active" : "carousel-item"} key={image.image} >
                                <div className="image-wrapper m-0 p-0">
                                    <img src={image.image} focusable="false" />
                                </div>
                                <div className="carousel-image text-center w-100">
                                    <img src={image.image} focusable="false" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>

                <div className="col-5 general-info bg-white">
                    {isOwner ?
                        <Link className="page-edit-link edit-link" to={`/${idUsername}/restaurant/general/edit`}>
                            <i className="bi bi-pencil-square"></i> Edit Info
                        </Link> : <></>}
                    {isOwner ?
                        <Link className="page-edit-link-start edit-link" to={`/${idUsername}/restaurant/general/editImages`}>
                            <i className="bi bi-pencil-square"></i> Edit Images
                        </Link> : <></>}

                    <div className="row card-text-box">
                        {(restaurant.name != null && restaurant.name != "") ? <>
                            <hr className="col-12 divider-line my-3 py-0" />
                            <div className="col-12 restaurant-name text-center m-0 p-0 fw-bolder">{restaurant.name}</div>
                            <hr className="col-12 divider-line mt-3 py-0" />
                        </> : <><div className="my-5"></div><hr className="col-12 divider-line mt-3 py-0" /></>}

                        <div className="row mt-2">
                            <div className="col-6 text-center likes"><i className="fa fa-heart"></i> {restaurant.num_likes}</div>
                            <div className="col-6 text-center followers"><i className="fa fa-user"></i> {restaurant.num_followers}</div>
                        </div>

                        <div className="col-12 text-center restaurant-logo">
                            <img src={restaurant.logo} className="rounded-circle" />
                        </div>

                        <div className="row like-follow-buttons g-0 m-0 pt-2 ps-2 pe-0 pb-0 text-center">
                            <div className="col-5 general-like-button-container text-end">
                                <Heart idUsername={idUsername} liked={liked} setLiked={setLiked} /><span className="general-like-text"> Like</span>
                            </div>
                            <div className="col-1"></div>
                            <div className="col-5 follow-button-container text-start">
                                <Person idUsername={idUsername} followed={followed} setFollowed={setFollowed} /><span className="follow-text"> Follow</span>
                            </div>
                        </div>

                        <div className="col-12 text-center pb-2">{restaurant.email}</div>
                        <div className="col-12 text-center pb-2">{restaurant.phone_number}</div>
                        <div className="col-12 text-center pb-2">{restaurant.address}</div>
                        <div className="col-12 text-center ">{restaurant.postal_code}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default General;