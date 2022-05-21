import { Link, useParams, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";


function Blog() {
    document.title = "Restify | Blog";

    const { idUsername } = useParams();
    const currUser = useOutletContext();

    const isOwner = (currUser.username == idUsername);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [results, setResults] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8000/${idUsername}/restaurant/blog/?page=${page}`, {
            method: 'GET'
        })
            .then((res) => res.json())
            .then((json) => {
                setTotalPages(Math.ceil(json.count / 10));
                setResults(json.results);
            }).catch(console.error);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [page]);

    return (
        <main className="blog-section spad mt-4">
            <div className="blog-items container-fluid">
                <div className="row">

                    {results.map(result => (
                        <div className="col-xxl-4 col-xl-6 col-6" key={result.id}>
                            <div className="single-blog">
                                <div className="blog-img-container">
                                    <img src={result.header_image != null ? result.header_image : "/images/breakfastbagel.jpg"}
                                        className="img-fluid" />
                                </div>
                                <div className="blog-post px-3 pb-3">
                                    <div className="d-flex blog-details justify-content-center">
                                        <div className="flex-fill text-center px-0 mx-0">
                                            <Link to={`/${result.restaurant_owner}/restaurant`} className="restaurant-link">
                                                <i className="fa fa-user"></i> By {result.restaurant_owner}
                                            </Link>
                                        </div>
                                        <div className="flex-fill sep text-center px-0 mx-0"> / </div>
                                        <div className="flex-fill text-center px-0 mx-0">
                                            <i className="fa fa-calendar"></i> {result.date}
                                        </div>
                                        <div className="flex-fill sep text-center px-0 mx-0"> / </div>
                                        <div className="flex-fill num-likes text-center px-0 mx-0">
                                            <i className="fa fa-heart"></i> {result.num_likes}
                                        </div>
                                    </div>
                                    <div className="blog-content">
                                        <h4>{result.title}</h4>
                                        <p>{result.summary}</p>
                                    </div>
                                    <Link to={`/${result.restaurant_owner}/blogPost/${result.id}`} className="read-btn">Read More</Link>
                                </div>
                            </div>
                        </div>)
                    )}

                    {isOwner ?
                        <div className="col-xxl-4 col-xl-6 col-6">
                            <Link to={`/${currUser.username}/blogpost/add`} className="card-link">
                                <div className="create-blog single-blog text-center">
                                    <div className="create-blog-text p-5">+ Create new blog post</div>
                                </div>
                            </Link>
                        </div>
                        : <></>}

                </div>
            </div>

            <div className="row my-3 blog-pagination pagination-number">
                {page > 1 ?
                    <span className="page-btn col text-start" onClick={() => setPage(page - 1)}>Previous</span>
                    : <></>}
                {page < totalPages ?
                    <span className="page-btn col text-end" onClick={() => setPage(page + 1)}>Next</span>
                    : <></>}
            </div>
        </main >
    )
}

export default Blog;