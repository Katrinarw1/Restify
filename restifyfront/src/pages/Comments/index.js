import { useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';


function Comments() {
    document.title = "Restify | Comments";

    const { idUsername } = useParams();

    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [commentPost, setCommentPost] = useState("");

    useEffect(() => {
        fetch(`http://localhost:8000/${idUsername}/restaurant/comments/?page=${page}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
            }
        })
            .then((res) => res.json())
            .then((json) => {
                setTotalPages(Math.ceil(json.count / 10));
                setResults(json.results);
            }).catch(console.error);

        document.getElementById("theComment").scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }, [page]);

    const postComment = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('content', commentPost);
        formData.append('owner', idUsername);

        fetch(`http://localhost:8000/${idUsername}/restaurant/comments/`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + `${localStorage.getItem('token')}`
            },
            body: formData,
        })
            .then((result) => {
                setCommentPost("");
                setPage(1);
            }).catch(console.error);
    }

    return (
        <div className="comment-container">
            <div className="row m-0 p-0 g-0">
                <div className="col-6 comment-image" style={{ background: `url(/images/meal.jpg)` }}></div>

                <div id="theComment" className="col-6 comment-card py-4 px-5" style={{ background: `url(/images/grey-background1.jpg)` }}>
                    <div className="col-12 text-center title">COMMENTS</div>

                    <hr className="my-3 col-12 comment-divider" />

                    <form onSubmit={postComment} className="row comment-form">
                        <div className="col-12 justify-content-md-center">
                            <textarea id="post-comment" name="post-comment" className="col-8" rows="2"
                                placeholder="Leave a comment on this restaurant here." value={commentPost}
                                onChange={(e) => setCommentPost(e.target.value)}></textarea>
                        </div>
                        <div className="col-12 justify-content-md-center">
                            <button type="submit" className="btn btn-success submit-button col-8">Post Comment</button>
                        </div>
                    </form>

                    <hr className="my-3 col-12 comment-divider" />

                    {results.map(comment => (<div key={comment.id}>
                        <div className="comment row">
                            <div className="col-12 name">{comment.owner_name}:</div>
                            <div className="col-12 comment-content">{comment.content}</div>
                        </div>

                        <hr className="my-3 col-12 comment-divider" />
                    </div>))}

                    <div className="row my-3 blog-pagination pagination-number">
                        {page > 1 ?
                            <span className="page-btn col text-start" onClick={() => setPage(page - 1)}>Previous</span>
                            : <></>}
                        {page < totalPages ?
                            <span className="page-btn col text-end" onClick={() => setPage(page + 1)}>Next</span>
                            : <></>}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Comments;