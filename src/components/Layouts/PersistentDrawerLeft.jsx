import * as React from "react";
import {styled} from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import {
    Avatar,
    Box, Button, Card,
    Collapse,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {useCustomThemeContext} from "../../context/GlobalThemeContext/CustomThemeProvider.jsx";
import ModeNightIcon from '@mui/icons-material/ModeNight';
import LightModeIcon from '@mui/icons-material/LightMode';
import {useAuthContext} from "../../context/Auth/AuthContext.jsx";
import {avatarColor} from "../../services/util/Utils.jsx";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {useNavigate} from "react-router-dom";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import WorkspaceListElement from "../Workspace/WorkspaceListElement.jsx";
import {NewWorkspaceBadge} from "../Workspace/NewWorkspaceBadge.jsx";
import {ChatCard} from "../Chat/ChatCard.jsx";


const drawerWidth = 180;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',

});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: '50px'
});

const DrawerHeader = styled("div")(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 0.5),
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer)(({theme, open}) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",

    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));


const AnimatedCard = styled(Card)(({theme, open}) => ({
    backgroundColor: 'white',
    width: open ? '450px' : '0px',
    zIndex: 4000,
    transition: 'width 200ms ease-in-out',
    // transform: open ? 'translateX(0)' : 'translateX(100%)',
    // position: 'fixed',
    right: 0,
    top: 0,
    height: '100vh',
}));

export const PersistentDrawerLeft = ({children, open, setOpen}) => {
    const {auth} = useAuthContext();

    const {workspaces, loadAllWorkspaces, chatOpen,closeChat} = useTaskOperations();

    const {isDarkMode, toggleTheme} = useCustomThemeContext();
    const [openSubmenu, setOpenSubmenu] = React.useState(false);
    const [cardOpen, setCardOpen] = React.useState(false); // Состояние для карточки

    const navigate = useNavigate();
    const handleDrawerClick = () => {
        if (open) {
            setOpenSubmenu(false);
        }
        localStorage.setItem("drawerOpen", JSON.stringify(!open));
        setOpen(prev => !prev);

    };

    const handleProjectsOpen = async () => {
        if (open) {
            if (!openSubmenu) {
                await loadAllWorkspaces();
            }
            setOpenSubmenu(prev => !prev);
        } else {
            setOpen(true);
            if (!openSubmenu) {
                await loadAllWorkspaces();
            }
            setOpenSubmenu(true);
        }

    };

    const toggleCard = () => {
        setCardOpen(prev => !prev);
    };

    if (!auth.isAuthenticated) {
        return (
            <>
                {children}
            </>
        );

    }


    return (
        <Box sx={{
            display: "flex",
            width: '100vw',
            minHeight: '100vh',

        }}>
            <Box sx={{
                display: "flex",
                width: '100vw',
                minHeight: '100vh'
            }}>
                {
                    auth.isAuthenticated &&

                    <Drawer variant="permanent" open={open}
                            slotProps={{
                                paper: {
                                    sx: {
                                        backgroundColor: 'drawer',
                                        backdropFilter: 'blur(8px)',
                                        WebkitBackdropFilter: 'blur(8px)',
                                    }
                                }
                            }}
                    >
                        <DrawerHeader>
                            <IconButton onClick={handleDrawerClick}>
                                {!open ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                            </IconButton>
                        </DrawerHeader>
                        <Divider sx={{ml: open ? 1 : 0, mr: open ? 1 : 0}}/>

                        <List>

                            <ListItem disablePadding sx={{display: "block"}}>
                                <ListItemButton
                                    selected={location.pathname === '/profile'}
                                    sx={{
                                        maxHeight: 40,
                                        justifyContent: open ? "initial" : "center",
                                        '&.Mui-selected': {
                                            border: '1px solid',
                                            borderLeft: 'none',
                                            borderRight: 'none'
                                        }
                                    }}
                                    onClick={() => {
                                        closeChat();
                                        navigate('/profile');
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 0,
                                            p: 0,
                                            width: 12,
                                            justifyContent: "center",
                                            mb: '3px'
                                        }}
                                    >
                                        <Avatar sx={{
                                            fontSize: "13px",
                                            color: 'white',
                                            border: '2px solid ',
                                            borderColor: 'action.selected',
                                            backgroundColor: auth.isAuthenticated ? avatarColor(auth.user.email) : 'black',
                                            fontWeight: "500", m: 0
                                        }}
                                                alt={auth.isAuthenticated ? auth.user.email : ''}
                                                style={{width: 34, height: 34}}
                                                src={auth.user.avatarUrl}
                                        >
                                        </Avatar>
                                    </ListItemIcon>
                                    <ListItemText primary="Профиль" sx={{
                                        opacity: open ? 1 : 0,
                                        '& .MuiTypography-root': {
                                            fontSize: '0.9rem',

                                        }
                                    }}/>
                                </ListItemButton>


                            </ListItem>

                            <Divider sx={{ml: open ? 1 : 0, mr: open ? 1 : 0}}/>
                            <ListItem disablePadding sx={{display: "block"}}
                            >
                                <ListItemButton
                                    sx={{
                                        maxHeight: 40,
                                        justifyContent: open ? "initial" : "center",
                                        px: 2.5,
                                        '&.Mui-selected': {
                                            border: '1px solid',
                                            borderLeft: 'none',
                                            borderRight: 'none'
                                        }
                                    }}
                                    selected={location.pathname === '/project'}
                                    onClick={handleProjectsOpen}
                                >

                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : "auto",
                                            width: 10,
                                            justifyContent: "center",
                                        }}
                                    >
                                        <PlaylistAddCheckIcon sx={{fontSize: "24px"}}/>
                                    </ListItemIcon>
                                    <ListItemText primary={"Проекты"} sx={{
                                        opacity: open ? 1 : 0,
                                        '& .MuiTypography-root': {
                                            fontSize: '0.9rem',
                                        }
                                    }}/>
                                    {open && (openSubmenu ? <ExpandLess/> : <ExpandMore/>)}
                                </ListItemButton>
                                <Collapse in={openSubmenu} timeout="auto" unmountOnExit>
                                    <List disablePadding component="div">
                                        <NewWorkspaceBadge/>

                                        {workspaces
                                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                            .map(ws => <WorkspaceListElement workspace={ws}/>)}
                                    </List>
                                </Collapse>
                            </ListItem>
                            <Divider sx={{ml: open ? 1 : 0, mr: open ? 1 : 0}}/>

                            <ListItem disablePadding sx={{display: "block"}}>
                                <ListItemButton
                                    sx={{
                                        maxHeight: 40,
                                        justifyContent: open ? "initial" : "center",
                                        px: 2.5,
                                    }}
                                    onClick={toggleTheme}
                                >

                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : "auto",
                                            width: 10,

                                            justifyContent: "center",
                                        }}
                                    >
                                        {!isDarkMode ? <ModeNightIcon sx={{fontSize: "20px"}}/> :
                                            <LightModeIcon sx={{fontSize: "20px"}}/>}
                                    </ListItemIcon>
                                    <ListItemText primary={"Сменить тему"} sx={{
                                        opacity: open ? 1 : 0,
                                        '& .MuiTypography-root': {
                                            ml: 0,
                                            fontSize: '0.9rem',
                                        }
                                    }}/>
                                </ListItemButton>
                            </ListItem>

                        </List>


                    </Drawer>
                }

                <Box display="flex" width='100%' flexDirection="row">
                    <Box sx={{
                        width: '100%',
                        margin: '0',
                        flex: 1
                    }}>
                        {children}
                    </Box>

                    {auth.isAuthenticated &&
                        <ChatCard open={chatOpen}/>
                    }

                </Box>
            </Box>

        </Box>
    );
};