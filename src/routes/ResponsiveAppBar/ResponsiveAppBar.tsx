import * as React from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

import MenuIcon from "@mui/icons-material/Menu";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import "./_app-bar.scss";

import VoiceSelection from "../../VoiceComponents/VoiceSelection";

import { defaultProducts } from "../defaultProducts";
import { IGroup, set } from "../universal";
import { defaultRecipes } from "../defaultRecipes";

const pages = [
  // ["react-guide", "React Guide"],
  // ["food-supply", "Food Supply"],
  ["food-supply", "Available products"],
  ["recipes", "My recipes"],
  ["recomendations", "Recomendations"],
  // ["err", "ERR"],
];
const settings = [
  "Голос приложения",

  "Установить базу продуктов по умолчанию",
  "Установить базу рецептов по умолчанию",

  "Clear Product database",
  "Clear Recipe database",
];

function ResponsiveAppBar() {
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [open, setOpen] = React.useState(false);

  const setProductDefaultDatabase = () => {
    if (confirm("Please confirm you want to set Product Default Database.")) {
      const groups = defaultProducts;
      set<IGroup>("products", groups);

      navigate("/");
    }
  };

  const setRecipeDefaultDatabase = () => {
    if (confirm("Please confirm you want to set Recipe Default Database.")) {
      const groups = defaultRecipes;
      set<IGroup>("all-recipes", groups);

      navigate("/");
    }
  };

  const clearProductDatabase = () => {
    if (confirm("Please confirm you want to clear Product Database.")) {
      set<IGroup>("all-recipes", []);
      navigate("/");
    }
  };

  const clearRecipeDatabase = () => {
    if (confirm("Please confirm you want to clear Recipe Database.")) {
      set<IGroup>("all-recipes", []);
      navigate("/");
    }
  };

  const location = useLocation();

  // Get all buttons with class="btn" inside the container
  const btns = document.getElementsByClassName("buttons");

  React.useEffect(() => {
    for (let i = 0; i < btns.length; i++) {
      if (location.pathname.indexOf(pages[i][0]) !== -1) {
        btns[i].classList.add("button-active");
      } else {
        btns[i].classList.remove("button-active");
      }
    }
  }, [location.pathname, btns]);

  return (
    <>
      <AppBar id="app-bar" position="static">
        <Container maxWidth="lg">
          <Toolbar>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                mr: 1,
              }}
            >
              <img
                src={import.meta.env.BASE_URL + "/logo_meal_6.png"}
                alt="icon F.M.G"
                height={35}
              />
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".0rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              F.M.G
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate("/" + page[0]);
                    }}
                  >
                    <Typography textAlign="center">{page[1]}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                mr: 1,
              }}
            >
              <img
                src={import.meta.env.BASE_URL + "/logo_meal_6.png"}
                alt="icon F.M.G"
                height={35}
              />
            </Box>
            <Typography
              variant="h5"
              noWrap
              component="a"
              // href="#app-bar-with-responsive-menu"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".0rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              F.M.G
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                gap: 0.5,
              }}
            >
              {pages.map((page, index) => (
                <Button
                  className="buttons"
                  value={page[0]}
                  key={index}
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate("/" + page[0]);
                  }}
                  sx={{ my: 1, color: "white", display: "block" }}
                >
                  {page[1]}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <SettingsOutlinedIcon fontSize="large" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      handleCloseUserMenu();
                      if (setting === settings[0]) {
                        setOpen(true);
                      }

                      if (setting === settings[1]) {
                        setProductDefaultDatabase();
                      }

                      if (setting === settings[2]) {
                        setRecipeDefaultDatabase();
                      }
                      if (setting === settings[3]) {
                        clearProductDatabase();
                      }
                      if (setting === settings[4]) {
                        clearRecipeDatabase();
                      }
                    }}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <VoiceSelection open={open} onClose={() => setOpen(false)} />
          </Toolbar>
        </Container>
      </AppBar>
      <div id="detail-app-bar">
        <Outlet />
      </div>
    </>
  );
}
export default ResponsiveAppBar;
