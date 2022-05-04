import { Link, Outlet, useOutletContext, useParams } from "react-router-dom";


function Restaurant() {
    const currUser = useOutletContext();
    const { idUsername } = useParams();

    return (<>
    <nav>
        <div className="nav nav-pills nav-fill mx-5" id="nav-tab" role="tablist">
            <Link to={`/${idUsername}/restaurant/general`} className="nav-link start-tab">Information</Link>
            <Link to={`/${idUsername}/restaurant/menu`} className="nav-link">Menu</Link>
            <Link to={`/${idUsername}/restaurant/blog`} className="nav-link">Blog</Link>
            <Link to={`/${idUsername}/restaurant/comments`} className="nav-link end-tab">Comments</Link>
        </div>
    </nav >
    
    <div className="tab-content" id="nav-tabContent">
        <Outlet context={currUser} />
    </div>
    
    </>
    );
}

export default Restaurant;