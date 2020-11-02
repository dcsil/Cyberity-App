import React from 'react';
import { Link } from 'react-router-dom';
import {Button} from '@material-ui/core';

export default function Login() {
    return (
        <div>
            <Button component={Link} to="/app/dashboard">LOGIN TO CYBERITY</Button>
        </div>
    );
}