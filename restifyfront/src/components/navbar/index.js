import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";


function Navbar() {
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    //TODO implement how many notifications are unread
    const [currUser, setCurrUser] = useState({});
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getProfile();
    }, []);

    useEffect(() => {
        getNotifications();
    }, [page]);

    const getProfile = () => {
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
        }
    }

    const getNotifications = () => {
        if (localStorage.getItem('token') != null) {
            fetch(`http://127.0.0.1:8000/notifications/?page=${page}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
                }
            })
                .then((res) => res.json())
                .then((json) => {
                    setNotifications(json.results);
                    setNotificationCount(json.count);
                    setTotalPages(Math.ceil(json.count / 10));
                }).catch(console.error);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
    }

    return (<>
        <div className="background-wrapper"><img src="/images/woodbackground.jpg" /></div>

        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark container-fluid" id="top-bar">
            <Link to="/home" className="navbar-brand ms-5" >
                <img src="/images/logo.png" className="me-2 site-logo" />Restify
            </Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
                aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <ul className="navbar-nav mb-2 mb-md-0 collapse navbar-collapse justify-content-end" id="navbarCollapse">
                <li className="nav-item px-2"><Link to="/home" className="nav-link">Home</Link></li>

                {currUser.username == undefined ?
                    <>
                        <li className="nav-item px-2"><Link to="/login" className="nav-link" onClick={handleLogout}>Login</Link></li>
                        <li className="nav-item px-2 me-5"><Link to="/register" className="nav-link" onClick={handleLogout}>Sign up</Link></li>
                    </> :
                    <>
                        <li className="nav-item px-2"><Link to="/feed" className="nav-link">Feed</Link></li>


                        <li className="nav-item px-2 dropdown">
                            <Link to="#" className="nav-link dropdown-toggle" id="navbarDropdownNotifications" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false" onClick={getNotifications}>Notifications
                            </Link>

                            <div className="notifications dropdown-menu mb-0 pb-0" id="box">
                                <div>
                                    <div className="ps-3 my-1 title">Notifications - <span>{notificationCount}</span></div>
                                    <hr className="col-12" />

                                    {notifications.map(notif => (
                                        <div key={notif.id} className="row justify-content-center g-0">
                                            <Link to={`/${notif.sender}/restaurant/general`} className="">
                                                <div className="notifications-item row g-0 my-1">
                                                    <div className="notification-image-wrapper col-3 my-1">
                                                        <img src={`http://localhost:8000${notif.sender_image}`}
                                                            className="rounded-circle" alt="avatar or logo" />
                                                    </div>
                                                    <div className="text col-9">
                                                        <div className="row">
                                                            <span className="user col">{notif.sender_name} </span>
                                                            <span className="date text-end col-4 me-2">{notif.date}</span>
                                                        </div>
                                                        <div className="message col-12">{notif.get_message_display}</div>
                                                    </div>
                                                </div>
                                            </Link>
                                            <hr className="col-11" />
                                        </div>
                                    ))}
                                </div>

                                <div className="col-12 m-0 p-0">
                                    {page > 1 ?
                                        <button className="btn btn-primary nav-btn py-0 col-6 float-start" onClick={() => setPage(page - 1)}>
                                            prev
                                        </button> : <div className="col-6"></div>}
                                    {page < totalPages ?
                                        <button className="btn btn-primary py-0 nav-btn col-6 float-end" onClick={() => setPage(page + 1)}>
                                            next
                                        </button> : <div className="col-6"></div>}
                                </div>
                            </div>
                        </li>



                        <li className="nav-item px-2 dropdown">
                            <Link to="#" className="nav-link dropdown-toggle" id="navbarDropdownMyRestaurant" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">My Restaurant
                            </Link>
                            <div className="dropdown-menu" onClick={getProfile} aria-labelledby="navbarDropdownMyRestaurant">

                                <div className="row g-0 justify-content-center text-center">
                                    <Link to={`/${currUser.username}/restaurant/general`} className="dropdown-item">General</Link>
                                    <hr className="col-11" />
                                    <Link to={`/${currUser.username}/restaurant/menu`} className="dropdown-item">Menu</Link>
                                    <hr className="col-11" />
                                    <Link to={`/${currUser.username}/restaurant/blog`} className="dropdown-item">Blogposts</Link>
                                    <hr className="col-11" />
                                    <Link to={`/${currUser.username}/restaurant/comments`} className="dropdown-item">Comments</Link>
                                </div>
                            </div>
                        </li>


                        <li className="nav-item px-2 me-5 dropdown">
                            <Link to="#" className="nav-link dropdown-toggle" id="navbarDropdownAccount" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false" onClick={getProfile}> Account
                            </Link>
                            <div className="dropdown-menu dropdown-menu-end profile-menu text-center" aria-labelledby="navbarDropdownAccount">
                                <div className="row g-0 justify-content-center">
                                    <img src={`${currUser.avatar}`} className="col-12 avatar rounded-circle img-fluid py-3" alt="avatar" />
                                    <div className="col-12 mb-2 fw-bold">{currUser.first_name} {currUser.last_name}</div>
                                    <div className="col-12 mb-1">{currUser.email}</div>
                                    <div className="col-12 mb-2">{currUser.phone_number}</div>

                                    <hr className="col-11" />
                                    <Link to="/editProfile" className="col-12 dropdown-item edit-link">
                                        <i className="bi bi-pencil-square"></i>Edit Profile
                                    </Link>
                                    <hr className="col-11" />
                                    <Link to="/login" className="col-12 dropdown-item" onClick={handleLogout}>Logout</Link>
                                </div>
                            </div>
                        </li>
                    </>
                }
            </ul>
        </nav>

        <div className="content-after-navbar">
            <Outlet context={currUser} />
        </div>
    </>);
}

export default Navbar;
