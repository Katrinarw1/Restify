import { Link, useParams, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";


function Menu() {
    document.title = "Restify | Menu";

    const { idUsername } = useParams();
    const currUser = useOutletContext();

    const isOwner = (currUser.username == idUsername);
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetch(`http://localhost:8000/${idUsername}/restaurant/menu/?page=${page}`, {
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
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [page]);

    return (
        <div className="menu-cards-container px-0">

            {results.map(menu => (<div key={menu.id}>
                <div className="row featurette" style={{ background: `url(/images/grey-background1.jpg)` }}>
                    {isOwner ?
                        <Link className="page-edit-link edit-link" to={`./${menu.id}/edit/`}>
                            <i className="bi bi-pencil-square"></i> Edit
                        </Link> : <></>}
                    <div className="card-text-box p-3 g-0">

                        <div className="col-12 card-title mb-3">
                            <h2 className="featurette-heading">{menu.name}</h2>
                        </div>

                        {menu.menu_item.map(single_menu_item => (
                            <div className="menu-item" key={single_menu_item.id}>
                                <div className="row my-2">
                                    <div className="col-10 food-name">{single_menu_item.name}</div>
                                    {single_menu_item.price != null ?
                                        <div className="col-2 text-end">{single_menu_item.price}</div>
                                        : <></>}
                                </div>

                                {single_menu_item.menu_subitem.map(single_menu_subitem => (
                                    <div className="row my-1 ps-4" key={single_menu_subitem.id}>
                                        <div className="col-10 sub-item">{single_menu_subitem.name}</div>

                                        {single_menu_subitem.price != null ?
                                            <div className="col-2 text-end">{single_menu_subitem.price}</div>
                                            : <></>}

                                        {single_menu_subitem.description != null ?
                                            <div className="row my-2 g-0 sub-item-description">
                                                <div className="col-12">{single_menu_subitem.description}</div>
                                            </div>
                                            : <></>}
                                    </div>
                                ))}

                                {single_menu_item.description != null ? <div className="row my-2 food-description">
                                    <div className="col-12">{single_menu_item.description}</div>
                                </div> : <></>}
                                <hr className="menu-divider col-12" />
                            </div>
                        ))}

                    </div>
                </div>

                <hr className="featurette-divider" />
            </div>))}

            <div className="row my-3 blog-pagination pagination-number">
                {page > 1 ?
                    <span className="page-btn col text-start" onClick={() => setPage(page - 1)}>Previous</span>
                    : <></>}
                {page < totalPages ?
                    <span className="page-btn col text-end" onClick={() => setPage(page + 1)}>Next</span>
                    : <></>}
            </div>

            {isOwner ? <div className="col mb-5 featurette">
                <Link to="./add" className="card-link">
                    <div className="create-blog single-blog text-center">
                        <div className="create-blog-text p-5">+ Add new menu</div>
                    </div>
                </Link>
            </div> : <></>}
        </div>
    );
}

export default Menu;