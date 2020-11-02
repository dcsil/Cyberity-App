import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ErrorIcon from '@material-ui/icons/Error';
import GroupIcon from '@material-ui/icons/Group';
import TimelineIcon from '@material-ui/icons/Timeline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {
    Switch,
    Route,
    Link,
} from "react-router-dom";

import Dashboard from './Dashboard';
import InsiderThreats from './InsiderThreats';
import Users from './Users';
import UserTimeline from './UserTimline';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        alignItems: 'center',
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(7) + 1,
        },
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

export default function Navbar() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
            <div className={classes.root}>
                <CssBaseline />
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                >
                    <div className={classes.toolbar}>
                        <List>
                            <ListItem>
                                {open ?
                                    <IconButton
                                        onClick={handleDrawerClose}
                                        className={clsx(classes.menuButton)}
                                        edge="start"
                                    >
                                        <ChevronLeftIcon />
                                    </IconButton>
                                    :
                                    <IconButton
                                        color="inherit"
                                        aria-label="open drawer"
                                        onClick={handleDrawerOpen}
                                        edge="start"
                                        className={clsx(classes.menuButton, {
                                            [classes.hide]: open,
                                        })}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                }
                            </ListItem>
                        </List>
                    </div>
                    <Divider />
                    <List>
                        <ListItem button component={Link} to="/app/dashboard">
                            <ListItemIcon><DashboardIcon></DashboardIcon></ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                        <ListItem button component={Link} to="/app/insiderthreats">
                            <ListItemIcon><ErrorIcon></ErrorIcon></ListItemIcon>
                            <ListItemText primary="Insider Threats" />
                        </ListItem>
                        <ListItem button component={Link} to="/app/users">
                            <ListItemIcon><GroupIcon></GroupIcon></ListItemIcon>
                            <ListItemText primary="Users" />
                        </ListItem>
                        <ListItem button component={Link} to="/app/usertimeline">
                            <ListItemIcon><TimelineIcon></TimelineIcon></ListItemIcon>
                            <ListItemText primary="User Timeline" />
                        </ListItem>
                        <Divider />
                        <ListItem button component={Link} to="/login">
                            <ListItemIcon><ExitToAppIcon></ExitToAppIcon></ListItemIcon>
                            <ListItemText primary="Sign out" />
                        </ListItem>
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <Switch>
                        <Route exact path="/app/dashboard" children={Dashboard} />
                        <Route exact path="/app/usertimeline" children={UserTimeline} />
                        <Route exact path="/app/users" children={Users} />
                        <Route exact path="/app/insiderthreats" children={InsiderThreats} />
                    </Switch>
                </main>
            </div>
    );
}
