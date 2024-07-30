import React from "react";
import { Navigate } from "react-router-dom";

import Club from "../pages/Club";
import Score from "../pages/Score";
import Standing from "../pages/Standing";


const publicRoutes = [
    { path: "/club", component: <Club /> },
    { path: "/score", component: <Score /> },
    { path: "/standings", component: <Standing /> },


    {
        path: "/",
        exact: true,
        component: <Navigate to='/club' />,
    },
    { path: "*", component: <Navigate to='/club' /> },
];

export { publicRoutes };

