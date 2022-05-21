import './App.css';
import { BrowserRouter, Route, Routes, useNavigate, Navigate, useHistory } from "react-router-dom";

import CurrentUser from './contexts/currentUser';

import PageNotFound from './pages/PageNotFound';

import Navbar from './components/navbar';

import LoginPage from './pages/Login';
import Register from './pages/Register';

import Home from './pages/Home';
import Feed from './pages/Feed';
import Restaurant from './pages/Restaurant';
import General from './pages/General';
import Blog from "./pages/Blog";
import Menu from "./pages/Menu";
import Comments from "./pages/Comments";
import SingleBlogPost from './pages/SingleBlogPost';

import EditProfile from './pages/EditProfile';
import EditBlogPost from './pages/EditBlogPost';
import EditHome from './pages/EditHome';
import EditImages from './pages/EditImages/EditImages';
import EditMenu from './pages/EditMenu';


function Auth({ children }) {
    return localStorage.getItem('token') ? children : <Navigate to='/login' replace />;
}

function LoggedIn({ children }) {
    return localStorage.getItem('token') ? <Navigate to='/home' replace /> : children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/404' element={<PageNotFound />} />
                <Route path='*' element={<Navigate to='/404' />} />

                <Route path="/login" element={<LoggedIn><LoginPage /></LoggedIn>} />
                <Route path="/register" element={<LoggedIn><Register /></LoggedIn>} />

                /* otherwise blank / brings up just the navbar */
                <Route path='/' element={<Navigate to='/home' replace />} />

                <Route path="/" element={<Navbar />}>
                    <Route path="home" element={<Home />} />
                    <Route path="feed" element={<Auth><Feed /></Auth>} />

                    <Route path="editProfile" element={<Auth><EditProfile /></Auth>} />

                    <Route path=':idUsername/' element={<Navigate to='./restaurant/general' replace />} />

                    <Route path=':idUsername/' element={<CurrentUser />} >
                        <Route path='blogPost/'>
                            <Route path='' element={<Navigate to='../../restaurant/blog' replace />} />
                            <Route path=":idSlug" element={<SingleBlogPost />} />
                            <Route path=":idSlug/edit" element={<Auth><EditBlogPost /></Auth>} />
                            <Route path="add" element={<Auth><EditBlogPost /></Auth>} />
                        </Route>
                        
                        <Route path='restaurant/' element={<Restaurant />} >
                            <Route path='general' element={<General />} />
                            
                            /* otherwise blank / brings up just the tabs */
                            <Route path='' element={<Navigate to='./general' replace />} />
                            
                            <Route path='menu' element={<Menu />} />
                            <Route path='blog' element={<Blog />} />
                            <Route path='comments' element={<Comments />} />

                            <Route path='general/edit' element={<Auth><EditHome /></Auth>} />
                            <Route path='general/editImages' element={<Auth><EditImages /></Auth>} />

                            <Route path='menu/:idMenu/edit' element={<Auth><EditMenu /></Auth>} />
                            <Route path='menu/add' element={<Auth><EditMenu /></Auth>} />                            
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>

    );
}

export default App;
