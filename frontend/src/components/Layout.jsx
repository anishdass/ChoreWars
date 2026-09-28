import { useState } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  ClipboardList,
  Coins,
  LogOut,
  Settings,
  ShoppingBag,
  Trophy,
  UserRound,
} from "lucide-react";

const navItems = [
  { id: "quests", label: "Quest Board", Icon: ClipboardList },
  { id: "leaderboard", label: "Leaderboard", Icon: Trophy },
  { id: "rewards", label: "Reward Store", Icon: ShoppingBag },
  { id: "activity", label: "Activity", Icon: ChartNoAxesColumnIncreasing },
];

export default function Layout({
  user = {
    name: "Ava",
    level: 8,
    currentXp: 720,
    xpGoal: 1000,
    gold: 245,
  },
  activeView = "quests",
  onViewChange = () => {},
  children,
}) {
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const xpProgress = Math.min((user.currentXp / user.xpGoal) * 100, 100);
  const isProfileMenuOpen = Boolean(profileMenuAnchor);
  const openProfileMenu = (event) => setProfileMenuAnchor(event.currentTarget);
  const closeProfileMenu = () => setProfileMenuAnchor(null);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff", color: "#1f2937" }}>
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, md: 3 },
          pb: 10,
          pt: 2,
        }}>
        <AppBar
          position='static'
          elevation={0}
          sx={{
            border: "1px solid rgba(107,114,128,0.2)",
            borderRadius: 1,
            bgcolor: "#fff",
            color: "#1f2937",
            boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
          }}>
          <Toolbar sx={{ gap: 2, flexWrap: "wrap", py: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mr: "auto",
              }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#615fff",
                  color: "#fff",
                  fontWeight: 900,
                }}>
                C
              </Box>
              <Box>
                <Typography
                  variant='caption'
                  sx={{ letterSpacing: 2, color: "#6b7280" }}>
                  CHOREWARS
                </Typography>
                <Typography
                  variant='h6'
                  sx={{ fontWeight: 700, lineHeight: 1.2, color: "#1f2937" }}>
                  Household Campaign
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                ml: "auto",
              }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 1,
                  border: "1px solid rgba(107,114,128,0.2)",
                  bgcolor: "#fff",
                  px: 1.5,
                  py: 1,
                }}>
                <Typography variant='caption' sx={{ color: "#6b7280" }}>
                  Level
                </Typography>
                <Typography
                  component='span'
                  sx={{ ml: 1, fontWeight: 700, color: "#1f2937" }}>
                  {user.level}
                </Typography>
              </Paper>

              <Box sx={{ minWidth: { xs: 160, md: 220 }, flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.75,
                  }}>
                  <Typography variant='caption' sx={{ color: "#6b7280" }}>
                    XP
                  </Typography>
                  <Typography variant='caption' sx={{ color: "#4b5563" }}>
                    {user.currentXp}/{user.xpGoal}
                  </Typography>
                </Box>
                <LinearProgress
                  variant='determinate'
                  value={xpProgress}
                  sx={{
                    height: 9,
                    borderRadius: 999,
                    bgcolor: "#e5e7eb",
                    ".MuiLinearProgress-bar": {
                      bgcolor: "#615fff",
                    },
                  }}
                />
              </Box>

              <Paper
                elevation={0}
                sx={{
                  borderRadius: 1,
                  border: "1px solid rgba(107,114,128,0.2)",
                  bgcolor: "#fff",
                  px: 1.5,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}>
                <Coins size={17} color='#615fff' aria-hidden='true' />
                <Typography
                  variant='body2'
                  sx={{ fontWeight: 700, color: "#1f2937" }}>
                  {user.gold}
                </Typography>
              </Paper>
              <IconButton
                aria-label='Open profile menu'
                aria-controls={isProfileMenuOpen ? "profile-menu" : undefined}
                aria-haspopup='true'
                aria-expanded={isProfileMenuOpen ? "true" : undefined}
                onClick={openProfileMenu}
                sx={{
                  color: "#4f46e5",
                  border: "1px solid #c7d2fe",
                  bgcolor: "#eef2ff",
                  "&:hover": { bgcolor: "#e0e7ff" },
                }}>
                <UserRound size={19} />
                <ChevronDown size={15} />
              </IconButton>
              <Menu
                id='profile-menu'
                anchorEl={profileMenuAnchor}
                open={isProfileMenuOpen}
                onClose={closeProfileMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      border: "1px solid rgba(107,114,128,0.2)",
                      boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
                    },
                  },
                }}>
                <MenuItem onClick={closeProfileMenu}>
                  <ListItemIcon sx={{ color: "#615fff", minWidth: 34 }}>
                    <UserRound size={17} />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={closeProfileMenu}>
                  <ListItemIcon sx={{ color: "#615fff", minWidth: 34 }}>
                    <Settings size={17} />
                  </ListItemIcon>
                  Account settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={closeProfileMenu}>
                  <ListItemIcon sx={{ color: "#615fff", minWidth: 34 }}>
                    <LogOut size={17} />
                  </ListItemIcon>
                  Sign out
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            display: "grid",
            gap: 3,
            mt: 3,
            gridTemplateColumns: { lg: "220px 1fr" },
          }}>
          <Paper
            elevation={0}
            sx={{
              display: { xs: "none", lg: "block" },
              borderRadius: 1,
              border: "1px solid rgba(107,114,128,0.2)",
              bgcolor: "#fff",
              boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
              p: 1.5,
              height: "fit-content",
            }}>
            <List disablePadding>
              {navItems.map((item) => {
                const isActive = activeView === item.id;

                return (
                  <ListItemButton
                    key={item.id}
                    selected={isActive}
                    onClick={() => onViewChange(item.id)}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      color: isActive ? "#4f46e5" : "#4b5563",
                      bgcolor: isActive ? "#eef2ff" : "transparent",
                      ":hover": { bgcolor: "#f3f4f6" },
                    }}>
                    <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                      <item.Icon size={19} />
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                );
              })}
            </List>
          </Paper>

          <Box sx={{ display: "grid", gap: 3 }}>{children}</Box>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          borderTop: "1px solid rgba(107,114,128,0.2)",
          bgcolor: "rgba(255,255,255,0.98)",
          display: { xs: "block", lg: "none" },
          zIndex: 10,
        }}>
        <BottomNavigation
          value={activeView}
          onChange={(event, newValue) => onViewChange(newValue)}
          showLabels
          sx={{ bgcolor: "transparent" }}>
          {navItems.map((item) => (
            <BottomNavigationAction
              key={item.id}
              label={item.label}
              value={item.id}
              icon={<item.Icon size={19} />}
              sx={{
                color: "#6b7280",
                "&.Mui-selected": { color: "#4f46e5" },
              }}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

Layout.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    level: PropTypes.number,
    currentXp: PropTypes.number,
    xpGoal: PropTypes.number,
    gold: PropTypes.number,
  }),
  activeView: PropTypes.oneOf(["quests", "leaderboard", "rewards", "activity"]),
  onViewChange: PropTypes.func,
  children: PropTypes.node,
};
