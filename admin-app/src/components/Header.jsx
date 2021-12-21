import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { startLogout } from '../actions/auth';

const Header = () => {

    const dispatch = useDispatch();

    const hanleLogout = () => {
        dispatch( startLogout() )
    }

    return (
        <div className="navbarrjb">
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
                <div className="container-fluid">
                    <Link className="navbar-brand me-5" to="/">RJB App - Admin</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="collapsibleNavbar">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/events">Eventos</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/plants">Plantas y Lugares</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/itineraries">Itinerarios</NavLink>
                            </li>
                        </ul>
                    </div>
                    <button
                        className="btn btn-logout"
                        onClick={hanleLogout}
                    >
                        Logout
                    </button>
                </div>
            </nav>
        </div>
    )
}

export default Header
