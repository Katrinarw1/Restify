import { Outlet, useOutletContext, useParams } from "react-router-dom";


function CurrentUser() {
    const currUser = useOutletContext();

    return (
        <Outlet context={currUser} />
    );
}

export default CurrentUser;