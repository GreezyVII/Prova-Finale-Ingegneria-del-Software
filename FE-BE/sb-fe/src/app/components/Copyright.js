/* 
    Component che mi permetterà di mostrare a video l'intestazione sul copyright.
*/
// --------------------------------------------------------
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import React from "react";
// --------------------------------------------------------

const Copyright = () => {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
                SmartBooking
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default Copyright;
