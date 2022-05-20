import { useState } from "react";
import { Link } from "react-router-dom";


function PageNotFound() {
    const [fired, setFired] = useState(false);

    return (<>
        {fired ?
            <main className="text-center mt-4">
                <h1 className="m-4">Kat is fired!</h1>
                <img src='/images/sad-cat-slow.gif'/>
                <h4 className="m-4">Poor Kat :(</h4>
                <h6 className="m-4 text-secondary">Now Kat isn't a typically a vindictive person ... but for your sake, we hope you were using a VPN when you clicked that button.</h6>
                <h5 className="mt-5">Return to the <Link to='/home'>homepage</Link>.</h5>
            </main>
            :
            <main className="text-center mt-3">
                <h1 className="m-4">Whoops!</h1>
                <h4 className="mb-5" title="We're sorry it's come to this">404 - Page not found</h4>
                <img className="col-3" src='/images/fast-food.webp' title="Looks good doesn't it? You can have some if you go to the homepage"/>
                <img className="col-3 mx-2" src='/images/cake.jpg' title="Aren't you hungry? We can hook you up if you go to the homepage, we promise"/>
                <img className="col-3" src='/images/chinese-takeout.webp' title="Yes, the developer is trying to distract you with food. Please don't click the button"/>

                <br/>
                <button type="button" title="Nooooooooooooo!!! :(" className="btn btn-danger mx-auto m-3 mt-5" onClick={() => setFired(true)}>
                    Fire the developer!
                </button>

                <h5 className="mt-2">Or return to the <Link to='/home' title='Yes!!! Click this one!<333'>homepage</Link>.</h5>

            </main>}
    </>);
}

export default PageNotFound;