import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { IconMenu } from "./basic/IconMenu";
import { useAppContext } from "../providers/AppContextProvider";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

const drawerWidth = 240;

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
  // padding: theme.spacing(1),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export function AppStructure({ auth, children }) {
  function performAction(item) {
    if (!item) {
      return;
    }

    if (item.path) {
      return navigate(item.path);
    } else if (item.callback) {
      item.callback(navigate);
    }
  }
  const navigate = useNavigate();
  const navActions = [{ name: "Moje dotazníky", path: "/questionnaires" }];
  const settings = auth.isAuthenticated
    ? [
        {
          name: "Odhlásit",
          callback: (navigate) => {
            auth.annulAuthentication();
            navigate("/login");
          },
        },
      ]
    : [
        {
          name: "Přihlášení",
          path: "/login",
        },
        {
          name: "Registrace",
          path: "/register",
        },
      ];
  const { pageActions, drawerDisabled } = useAppContext();

  const theme = useTheme();
  const isMdOrLarger = useMediaQuery(theme.breakpoints.up("md")); //useMediaQuery((theme) => theme.breakpoints.up("md"));
  const [open, setOpen] = React.useState(isMdOrLarger);

  React.useEffect(() => {
    setOpen(isMdOrLarger);
  }, [isMdOrLarger]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open && !drawerDisabled}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...((open || drawerDisabled) && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
            mr={1}
          >
            APP
          </Typography>
          {navActions.map((action) => (
            <Button
              color="inherit"
              key={action.name}
              onClick={() => performAction(action)}
            >
              {action.name}
            </Button>
          ))}
          <IconMenu
            title="Můj účet"
            items={settings}
            iconElement={<AccountCircleIcon fontSize="large" />}
          />
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open && !drawerDisabled}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {pageActions.map((action) => (
            <ListItem button key={action.name} onClick={action.callback}>
              <ListItemIcon>{action.icon}</ListItemIcon>
              <ListItemText primary={action.name} />
            </ListItem>
          ))}
        </List>
        {/* <Divider />
        <List>
          {["All mail", "Trash", "Spam"].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List> */}
      </Drawer>
      )
      <Main open={open && !drawerDisabled}>
        <DrawerHeader />
        <Box mt={2}>{children}</Box>
      </Main>
    </Box>
  );
}
