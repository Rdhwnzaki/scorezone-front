import React from 'react';

import { Link } from 'react-router-dom';
import { RiShieldStarFill } from "react-icons/ri";
import { MdScoreboard } from "react-icons/md";
import { FaTable } from "react-icons/fa6";

const Sidebar = () => {
    return (
        <div id="layoutSidenav_nav">
            <nav className="sb-sidenav sb-sidenav-dark" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <div className="nav">
                        <div className="sb-sidenav-menu-heading fs-3 text-center">Scorezone</div>
                        <Link className="nav-link collapsed" data-bs-toggle="collapse" data-bs-target="#collapseLayouts" aria-expanded="false" aria-controls="collapseLayouts" to='/club'>
                            <div className="sb-nav-link-icon">
                                <RiShieldStarFill className='fs-4 text-white' />
                            </div>
                            Club
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </Link>
                        <Link className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapsePages" aria-expanded="false" aria-controls="collapsePages" to='/score'>
                            <div className="sb-nav-link-icon">
                                <MdScoreboard className='fs-4 text-white' />
                            </div>
                            Score
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </Link>
                        <Link className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapsePages" aria-expanded="false" aria-controls="collapsePages" to='/standings'>
                            <div className="sb-nav-link-icon">
                                <FaTable className='fs-5 text-white' />
                            </div>
                            Standing
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Sidebar;
