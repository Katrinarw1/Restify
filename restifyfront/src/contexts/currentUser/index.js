import { Outlet, useOutletContext, useParams, Navigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';


function CurrentUser() {
    const currUser = useOutletContext();
    const { idUsername } = useParams();
    const [valid, setValid] = useState('ah');

    useEffect(() => {
        //check if idUsername is a valid username
        fetch(`http://localhost:8000/profile/${idUsername}/`, {
            method: 'GET'
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.detail != "Not found.") {
                    setValid(true);
                } else {
                    setValid(false);
                }
            }).catch(console.error);
    }, [valid]);

    return (<>
        {valid != 'ah' ?
            <>{valid == true ? <Outlet context={currUser} /> : <Navigate to='/404' replace />}</>
            : <></>
        }
    </>);
}

export default CurrentUser;