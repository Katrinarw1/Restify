import { Link, useParams, useOutletContext } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";


function Heart({ idSlug, liked, setLiked }) {
    const handleLike = () => {
        fetch(`http://localhost:8000/restaurant/blogpost/${idSlug}/like/`, {
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


function SingleBlogPost() {
    document.title = "Restify | Blog Post";

    const { idUsername } = useParams();
    const currUser = useOutletContext();
    
    const isOwner = (currUser.username == idUsername);
    const { idSlug } = useParams();
    const [blogPost, setBlogPost] = useState({});
    const [liked, setLiked] = useState("false");


    const getBlogPostInfo = () => {
        fetch(`http://localhost:8000/restaurant/blogpost/${idSlug}/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
            }
        })
            .then((res) => res.json())
            .then((json) => {
                setBlogPost(json)
            }).catch(console.error);
    }

    useEffect(() => {
        getBlogPostInfo();

        fetch(`http://localhost:8000/restaurant/blogpost/${idSlug}/hasliked/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
            }
        })
            .then((res) => res.json())
            .then((json) => {
                setLiked(json.message);
            }).catch(console.error);
    }, [liked]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <main className="single-blog-post-container bg-white">
            <div className="header-image p-0 m-0">
                <img src={blogPost.header_image != null ? blogPost.header_image : "/images/default1.jpg"}
                    className="img-fluid w-100 p-0 m-0" />

                <div className="header-text justify-content-center">
                    <div className="title text-start m-0 p-0">{blogPost.title}</div>
                    <div className="sub-title text-start m-0 p-0">{blogPost.small_title}</div>
                    <div className="info text-start my-4">
                        Posted by {blogPost.restaurant_owner} on {blogPost.date}
                    </div>
                </div>
            </div>

            <article className="single-blog-post py-3">
                {isOwner ?
                    <Link className="page-edit-link edit-link" to={`./edit`}>
                        <i className="bi bi-pencil-square"></i> Edit
                    </Link>
                    : <></>
                }
                <div className="mb-4">
                    <Heart idSlug={idSlug} liked={liked} setLiked={setLiked} />{blogPost.num_likes}
                </div>
                <div dangerouslySetInnerHTML={{ __html: blogPost.content }} className="single-blog-post-content" />
            </article>

            <div className="row my-3 blog-pagination pagination-number">
                <div className="col-12 text-center justify-content-center py-3">
                    <span className="single-page-btn" onClick={scrollToTop}>Top of page</span>
                </div>
            </div>
        </main >
    )
}

export default SingleBlogPost;