import { useState } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
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
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Bell,
  ChartNoAxesColumnIncreasing,
  ClipboardList,
  Coins,
  Settings,
  ShoppingBag,
  UserRound,
  UserPlus,
} from "lucide-react";

const navItems = [
  { id: "quests", label: "Tasks", Icon: ClipboardList },
  { id: "rewards", label: "Reward Store", Icon: ShoppingBag },
  { id: "activity", label: "Activity", Icon: ChartNoAxesColumnIncreasing },
];

export default function Layout({
  user = {
    name: "Ava",
    role: "Parent",
    points: 0,
    gold: 245,
  },
  activeView = "quests",
  onViewChange = () => {},
  isParent = true,
  childProfiles = [],
  onSessionChange = () => {},
  onAddChild = () => {},
  notifications = [],
  onNotificationRead = () => {},
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
      return;
    }
    const wasAdded = onAddChild(childName);
    if (!wasAdded) {
      setChildNameError("A child with that name already exists.");
      return;
    }
    setChildName("");
    setChildNameError("");
    setIsAddChildOpen(false);
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
              {isParent && (
                <>
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
                          onClick={() =>
                            onNotificationRead(notification.id)
                          }
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
                </>
              )}
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
                <UserRound size={19} />
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
                    {childProfiles.map((child) => (
                      <MenuItem
                        key={child.id}
                        onClick={() => {
                          closeProfileMenu();
                          onSessionChange({ role: "child", userId: child.id });
                        }}>
                        <ListItemIcon sx={{ color: "#615fff", minWidth: 34 }}>
                          <UserRound size={17} />
                        </ListItemIcon>
                        Switch to {child.name}
                      </MenuItem>
                    ))}
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
                {!isParent && (
                  <MenuItem
                    onClick={() => {
                      closeProfileMenu();
                      onSessionChange({ role: "parent", userId: "parent" });
                    }}>
                    <ListItemIcon sx={{ color: "#615fff", minWidth: 34 }}>
                      <UserRound size={17} />
                    </ListItemIcon>
                    Return to parent
                  </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={closeProfileMenu}>
                  <ListItemIcon sx={{ color: "#615fff", minWidth: 34 }}>
                    <Settings size={17} />
                  </ListItemIcon>
                  Account settings
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
        <Box component='form' onSubmit={submitChild}>
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
  activeView: PropTypes.oneOf(["quests", "rewards", "activity"]),
  onViewChange: PropTypes.func,
  isParent: PropTypes.bool,
  childProfiles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
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
  children: PropTypes.node,
};
