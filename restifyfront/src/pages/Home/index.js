import { Link } from "react-router-dom";
import { useEffect, useState } from "react";


const Home = () => {
    document.title = "Restify | Home";
    
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [click, setClick] = useState(false);
    const [radio, setRadio] = useState("name");
    const [totalPages, setTotalPages] = useState(0);
    const [results, setResults] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8000/home/?page=${page}&search=${search}&search_fields=${radio}`, {
            method: 'GET',
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
        
        setClick(false);
    }, [page, click]);

    return (
        <div className="search-page-container">
            <div className="search-form">
                <div className="row justify-content-center">
                    <input className="col-4 me-2" type="search" placeholder="Search" aria-label="Search" value={search}
                        onChange={(e) => {setSearch(e.target.value);}} />
                    <button className="btn btn-success btn-large col-1" type="submit" onClick={() => {setPage(1); setClick(true);}}>Search</button>
                </div>
                <div className="search-by-container row justify-content-center">
                    <div className="col-4 me-2 text-center">
                        Search by:
                        <input className="ms-2" type="radio" name="search-by" id="name" value="name"
                            checked={radio === "name"} onChange={() => setRadio("name")} />
                        <label className="me-2" htmlFor="name">Name</label>
                        <input className="ms-2" type="radio" name="search-by" id="menu" value="menu"
                            checked={radio === "menu"} onChange={() => setRadio("menu")} />
                        <label className="me-2" htmlFor="menu">Menu</label>
                        <input className="ms-2" type="radio" name="search-by" id="address" value="address"
                            checked={radio === "address"} onChange={() => setRadio("address")} />
                        <label className="me-2" htmlFor="address">Address</label>
                    </div>
                    <div className="col-1"></div>
                </div>
            </div>

            <main className="home-container mt-5">
                <div className="container-fluid search-card-container mt-3 p-0">
                    <div className="row justify-content-center p-0">
                        {results.map(result => (
                            <div className="search-card p-0" key={result.owner}>
                                <div className="row g-0">
                                    <div className="logo col-4 m-0 p-0">
                                        <Link to={`/${result.owner}/restaurant/general`}>
                                            <img src={result.logo} className="img-fluid w-100 h-100 m-0 p-0" alt="..." />
                                        </Link>
                                    </div>
                                    <div className="col-8 m-0">
                                        <div className="search-card-body ms-3 w-100 h-100">
                                            <div className="search-card-body-text mb-1 px-2 h-100 container">
                                                <div className="col-12 search-card-title fw-bolder">{result.name}</div>
                                                <hr className="search-card-divider mb-2 mt-2" />
                                                <div className="row likes-followers-comments ms-1 mb-2 g-0 w-100">
                                                    <div className="col likes">
                                                        <i className="fa fa-heart"></i> {result.num_likes} likes
                                                    </div>
                                                    <div className="col followers">
                                                        <i className="fa fa-user"></i> {result.num_followers} following
                                                    </div>
                                                    <div className="col comments">
                                                        <i className="fa fa-comment"></i> {result.num_comments} comments
                                                    </div>
                                                </div>
                                                <div className="col-12 mt-3 mb-1 fs-6">
                                                    {result.address},  {result.postal_code}
                                                </div>
                                                <div className="col-12 mb-1">
                                                    {result.email}
                                                </div>
                                                <div className="col-12 mb-4">
                                                    {result.phone_number}
                                                </div>
                                                <Link to={`/${result.owner}/restaurant/general`} className="read-btn-home p-2">
                                                    Visit page
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
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

        </div >)
}

export default Home;