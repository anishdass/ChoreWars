import { useState } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Avatar,
  Box,
  Badge as MUIBadge,
  BottomNavigation,
  BottomNavigationAction,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Bell,
  ChartNoAxesColumnIncreasing,
  ClipboardList,
  Coins,
  LogOut,
  Settings,
  ShoppingBag,
  UserRound,
  UserPlus,
} from "lucide-react";
import { toast } from "react-toastify";

const navItems = [
  { id: "quests", label: "Tasks", Icon: ClipboardList },
  { id: "rewards", label: "Reward Store", Icon: ShoppingBag },
  { id: "activity", label: "Activity", Icon: ChartNoAxesColumnIncreasing },
];

export default function Layout({
  user = {
    name: "Maya Sarabhai",
    role: "Parent",
    points: 0,
    gold: 245,
  },
  userPhotoUrl = "",
  activeView = "quests",
  onViewChange = () => {},
  isParent = true,
  childProfiles = [],
  sessionUserId = "parent",
  onSessionChange = () => {},
  onAddChild = () => {},
  notifications = [],
  onNotificationRead = () => {},
  onLogout = () => {},
  children,
}) {
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [childName, setChildName] = useState("");
  const [childNameError, setChildNameError] = useState("");
  const unreadNotificationCount = notifications.filter(
    (notification) => !notification.read,
  ).length;
  const pointsToGold = user.pointsToNextGold ?? user.points % 1000;
  const goldProgress = pointsToGold / 10;
  const isProfileMenuOpen = Boolean(profileMenuAnchor);
  const openProfileMenu = (event) => setProfileMenuAnchor(event.currentTarget);
  const closeProfileMenu = () => setProfileMenuAnchor(null);
  const submitChild = (event) => {
    event.preventDefault();
    if (!childName.trim()) {
      setChildNameError("Enter your child's name.");
      toast.error("Enter your child's name.");
      return;
    }
    const wasAdded = onAddChild(childName);
    if (!wasAdded) {
      setChildNameError("A child with that name already exists.");
      toast.error("A child with that name already exists.");
      return;
    }
    setChildName("");
    setChildNameError("");
    setIsAddChildOpen(false);
    toast.success(`${childName.trim()} was added to the household.`);
  };

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
                gap: 1,
                mr: "auto",
              }}>
              <Typography
                component='button'
                type='button'
                aria-label='Chorewars'
                onClick={() => onViewChange("quests")}
                sx={{
                  appearance: "none",
                  border: 0,
                  padding: 0,
                  bgcolor: "transparent",
                  color: "#111827",
                  fontFamily: "'League Script', cursive",
                  fontSize: { xs: 42, sm: 52 },
                  fontWeight: 600,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  "&:hover": { color: "#000" },
                  "&:focus-visible": {
                    outline: "2px solid #615fff",
                    outlineOffset: 3,
                    borderRadius: 0.5,
                  },
                }}>
                Chorewars
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                ml: "auto",
              }}>
              {!isParent && (
                <>
                  <Box sx={{ minWidth: { xs: 160, md: 220 }, flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.75,
                      }}>
                      <Typography variant='caption' sx={{ color: "#6b7280" }}>
                        Points to gold
                      </Typography>
                      <Typography variant='caption' sx={{ color: "#4b5563" }}>
                        {pointsToGold}/1000
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant='determinate'
                      value={goldProgress}
                      aria-label={`${pointsToGold} of 1000 points toward next gold`}
                      sx={{
                        height: 7,
                        borderRadius: 999,
                        bgcolor: "#e5e7eb",
                        ".MuiLinearProgress-bar": {
                          bgcolor: "#615fff",
                        },
                      }}
                    />
                    <Typography
                      variant='caption'
                      sx={{ mt: 0.4, display: "block", color: "#6b7280" }}>
                      {user.points} total points
                    </Typography>
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
                </>
              )}
              <Stack
                direction='row'
                spacing={0.75}
                sx={{
                  alignItems: "center",
                  border: "1px solid #e5e7eb",
                  borderRadius: 1,
                  px: 0.75,
                  py: 0.5,
                  bgcolor: "#fff",
                }}>
                <Typography
                  variant='caption'
                  sx={{ color: "#6b7280", fontWeight: 600, px: 0.5 }}>
                  Test as
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  size='small'
                  value={isParent ? "parent" : "child"}
                  aria-label='Switch test role between parent and child'
                  onChange={(_event, role) => {
                    if (!role) return;
                    if (role === "parent") {
                      onSessionChange({ role: "parent", userId: "parent" });
                    } else if (childProfiles.length) {
                      const selectedChild = childProfiles.find(
                        (child) => child.id === sessionUserId,
                      );
                      onSessionChange({
                        role: "child",
                        userId: selectedChild?.id || childProfiles[0].id,
                      });
                    }
                  }}
                  sx={{
                    "& .MuiToggleButton-root": {
                      px: 1,
                      py: 0.5,
                      border: 0,
                      borderRadius: "4px !important",
                      color: "#4b5563",
                      fontSize: 12,
                      fontWeight: 700,
                    },
                    "& .MuiToggleButton-root.Mui-selected": {
                      color: "#4f46e5",
                      bgcolor: "#eef2ff",
                    },
                    "& .MuiToggleButton-root.Mui-selected:hover": {
                      bgcolor: "#e0e7ff",
                    },
                  }}>
                  <ToggleButton value='parent' aria-label='Test as parent'>
                    Parent
                  </ToggleButton>
                  <ToggleButton
                    value='child'
                    aria-label='Test as child'
                    disabled={!childProfiles.length}>
                    Child
                  </ToggleButton>
                </ToggleButtonGroup>
                {!isParent && childProfiles.length > 1 && (
                  <FormControl size='small' sx={{ minWidth: 88 }}>
                    <Select
                      native
                      value={sessionUserId}
                      onChange={(event) =>
                        onSessionChange({
                          role: "child",
                          userId: event.target.value,
                        })
                      }
                      inputProps={{ "aria-label": "Select child test profile" }}
                      sx={{
                        height: 30,
                        fontSize: 12,
                        color: "#374151",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#e5e7eb",
                        },
                      }}>
                      {childProfiles.map((child) => (
                        <option key={child.id} value={child.id}>
                          {child.firstName || child.name.split(/\s+/)[0]}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Stack>
              <IconButton
                aria-label={`${unreadNotificationCount} unread notifications`}
                aria-controls={
                  notificationAnchor ? "notifications-menu" : undefined
                }
                aria-haspopup='true'
                onClick={(event) =>
                  setNotificationAnchor(event.currentTarget)
                }
                sx={{
                  width: 40,
                  height: 40,
                  color: "#4f46e5",
                  border: "1px solid #c7d2fe",
                  bgcolor: "#eef2ff",
                  "&:hover": { bgcolor: "#e0e7ff" },
                }}>
                <MUIBadge
                  color='error'
                  variant={unreadNotificationCount ? "dot" : "standard"}
                  badgeContent={
                    unreadNotificationCount > 9
                      ? "9+"
                      : unreadNotificationCount || undefined
                  }>
                  <Bell size={18} />
                </MUIBadge>
              </IconButton>
              <Menu
                id='notifications-menu'
                anchorEl={notificationAnchor}
                open={Boolean(notificationAnchor)}
                onClose={() => setNotificationAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1,
                      width: 320,
                      maxWidth: "calc(100vw - 32px)",
                      border: "1px solid rgba(107,114,128,0.2)",
                      boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
                    },
                  },
                }}>
                <Typography
                  variant='subtitle2'
                  sx={{ px: 2, py: 1, color: "#1f2937", fontWeight: 700 }}>
                  Notifications
                </Typography>
                <Divider />
                {notifications.length ? (
                  notifications.slice(0, 8).map((notification) => (
                    <MenuItem
                      key={notification.id}
                      onClick={() => onNotificationRead(notification.id)}
                      sx={{
                        whiteSpace: "normal",
                        alignItems: "flex-start",
                        bgcolor: notification.read ? "#fff" : "#eef2ff",
                      }}>
                      <Typography
                        variant='body2'
                        sx={{ color: "#374151", py: 0.5 }}>
                        {notification.message}
                      </Typography>
                    </MenuItem>
                  ))
                ) : (
                  <Typography
                    variant='body2'
                    sx={{ px: 2, py: 1.5, color: "#6b7280" }}>
                    No notifications yet.
                  </Typography>
                )}
              </Menu>
              <IconButton
                aria-label={`Open ${user.role} profile menu`}
                aria-controls={isProfileMenuOpen ? "profile-menu" : undefined}
                aria-haspopup='true'
                aria-expanded={isProfileMenuOpen ? "true" : undefined}
                onClick={openProfileMenu}
                sx={{
                  width: 40,
                  height: 40,
                  p: 0,
                  flexShrink: 0,
                  borderRadius: "50%",
                  color: "#4f46e5",
                  border: "1px solid #c7d2fe",
                  bgcolor: "#eef2ff",
                  "&:hover": { bgcolor: "#e0e7ff" },
                }}>
                <Avatar
                  src={userPhotoUrl || undefined}
                  sx={{
                    width: "100%",
                    height: "100%",
                    bgcolor: isParent
                      ? "#eef2ff"
                      : childProfiles.find((child) => child.id === sessionUserId)
                          ?.color || "#eef2ff",
                    color: "#4f46e5",
                  }}>
                  {!userPhotoUrl && <UserRound size={19} />}
                </Avatar>
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
                      minWidth: 220,
                      border: "1px solid rgba(107,114,128,0.2)",
                      boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
                    },
                  },
                }}>
                <Typography
                  variant='caption'
                  sx={{ px: 2, py: 1, display: "block", color: "#6b7280" }}>
                  Signed in as {user.name} · {user.role}
                </Typography>
                {isParent && (
                  <>
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        closeProfileMenu();
                        setIsAddChildOpen(true);
                      }}>
                      <ListItemIcon sx={{ color: "#615fff", minWidth: 34 }}>
                        <UserPlus size={17} />
                      </ListItemIcon>
                      Add child
                    </MenuItem>
                  </>
                )}
                <Divider />
                <MenuItem
                  onClick={() => {
                    closeProfileMenu();
                    onViewChange("settings");
                  }}>
                  <ListItemIcon sx={{ color: "#615fff", minWidth: 34 }}>
                    <Settings size={17} />
                  </ListItemIcon>
                  Account settings
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    closeProfileMenu();
                    onLogout();
                  }}>
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
                const label = item.id === "quests" ? "Tasks" : item.label;

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
                    <ListItemText primary={label} />
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
              label={item.id === "quests" ? "Tasks" : item.label}
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

      <Dialog
        open={isParent && isAddChildOpen}
        onClose={() => {
          setIsAddChildOpen(false);
          setChildNameError("");
        }}
        fullWidth
        maxWidth='xs'>
        <Box component='form' onSubmit={submitChild} noValidate>
          <DialogTitle sx={{ color: "#1f2937", fontWeight: 700 }}>
            Add a child
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              {childNameError && (
                <Typography variant='body2' sx={{ color: "#b91c1c" }}>
                  {childNameError}
                </Typography>
              )}
              <TextField
                autoFocus
                required
                fullWidth
                label="Child's name"
                value={childName}
                onChange={(event) => setChildName(event.target.value)}
                slotProps={{ htmlInput: { maxLength: 60 } }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setIsAddChildOpen(false)}
              sx={{ color: "#6b7280" }}>
              Cancel
            </Button>
            <Button
              type='submit'
              variant='contained'
              sx={{ bgcolor: "#615fff", "&:hover": { bgcolor: "#4f46e5" } }}>
              Add child
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

Layout.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
    points: PropTypes.number,
    pointsToNextGold: PropTypes.number,
    gold: PropTypes.number,
  }),
  userPhotoUrl: PropTypes.string,
  activeView: PropTypes.oneOf(["quests", "rewards", "activity", "settings"]),
  onViewChange: PropTypes.func,
  isParent: PropTypes.bool,
  childProfiles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      photoUrl: PropTypes.string,
    }),
  ),
  sessionUserId: PropTypes.string,
  onSessionChange: PropTypes.func,
  onAddChild: PropTypes.func,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      read: PropTypes.bool.isRequired,
    }),
  ),
  onNotificationRead: PropTypes.func,
  onLogout: PropTypes.func,
  children: PropTypes.node,
};
