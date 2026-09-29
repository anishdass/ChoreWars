import { useEffect, useState } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Layout from "./components/Layout";
import QuestBoardPanel from "./features/quests/QuestBoardPanel";
import RewardStorePanel from "./features/activity/RewardStorePanel";
import ActivityHeatmap from "./features/rewards/ActivityHeatmap";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#615fff" },
    background: { default: "#ffffff", paper: "#ffffff" },
    text: { primary: "#1f2937", secondary: "#6b7280" },
    divider: "rgba(107,114,128,0.2)",
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Outfit", "Segoe UI", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 6, textTransform: "none", fontWeight: 700 },
      },
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 8, backgroundImage: "none" } },
    },
  },
});

const initialChildren = [
  { id: "rahul", name: "Rahul", points: 0, redeemedGold: 0 },
  { id: "riya", name: "Riya", points: 0, redeemedGold: 0 },
];

const initialTasks = [
  {
    id: "kitchen-reset",
    title: "Kitchen Reset",
    description:
      "Wash dishes, wipe counters, and make the kitchen sparkle before dinner.",
    difficulty: "Easy",
    pointsReward: 60,
    adultOnly: false,
    assignedTo: null,
  },
  {
    id: "laundry-sprint",
    title: "Laundry Sprint",
    description: "Sort, wash, dry, and fold the family laundry for the week.",
    difficulty: "Medium",
    pointsReward: 120,
    adultOnly: false,
    assignedTo: null,
  },
  {
    id: "deep-clean-bathroom",
    title: "Deep Clean Bathroom",
    description:
      "Scrub the bathroom, sanitize surfaces, and refresh the towels.",
    difficulty: "Hard",
    pointsReward: 180,
    adultOnly: true,
    assignedTo: null,
  },
].map((task) => ({
  ...task,
  status: "pending",
  elapsedSeconds: 0,
}));

const initialRewards = [
  { id: "movie-night", name: "Movie Night", goldCost: 1 },
  { id: "takeout-treat", name: "Takeout Treat", goldCost: 2 },
  { id: "weekend-pass", name: "Weekend Pass", goldCost: 3 },
];

const createNotification = (message) => ({
  id: `${Date.now()}-${Math.random()}`,
  message,
  createdAt: new Date().toISOString(),
  read: false,
});

function App() {
  const [activeView, setActiveView] = useState("quests");
  const [session, setSession] = useState({ role: "parent", userId: "parent" });
  const [children, setChildren] = useState(initialChildren);
  const [tasks, setTasks] = useState(initialTasks);
  const [rewards, setRewards] = useState(initialRewards);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const isParent = session.role === "parent";
  const currentChild = children.find((child) => child.id === session.userId);
  const householdPoints = children.reduce(
    (total, child) => total + child.points,
    0,
  );
  const currentPoints = isParent ? householdPoints : currentChild?.points || 0;
  const householdGold = children.reduce(
    (total, child) =>
      total + Math.max(Math.floor(child.points / 1000) - child.redeemedGold, 0),
    0,
  );
  const pointsToNextGold = isParent
    ? children.reduce(
        (closestProgress, child) =>
          Math.max(closestProgress, child.points % 1000),
        0,
      )
    : (currentChild?.points || 0) % 1000;
  const user = {
    name: isParent ? "Ava" : currentChild?.name || "Child",
    role: isParent ? "Parent" : "Child",
    points: currentPoints,
    pointsToNextGold,
    gold: isParent
      ? householdGold
      : Math.max(
          Math.floor((currentChild?.points || 0) / 1000) -
            (currentChild?.redeemedGold || 0),
          0,
        ),
  };
  const childProfiles = children.map((child) => ({
    ...child,
    gold: Math.max(
      Math.floor(child.points / 1000) - child.redeemedGold,
      0,
    ),
  }));

  const hasRunningTask = tasks.some((task) => task.status === "inProgress");

  useEffect(() => {
    if (!hasRunningTask) return undefined;

    const timer = window.setInterval(() => {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.status === "inProgress"
            ? { ...task, elapsedSeconds: task.elapsedSeconds + 1 }
            : task,
        ),
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [hasRunningTask]);

  const addTask = (details) => {
    if (!isParent) return;
    setTasks((currentTasks) => [
      ...currentTasks,
      {
        ...details,
        id: `${Date.now()}-${Math.random()}`,
        status: "pending",
        elapsedSeconds: 0,
        completedBy: null,
      },
    ]);
  };

  const editTask = (taskId, details) => {
    if (!isParent) return;
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, ...details } : task,
      ),
    );
  };

  const updateTaskStatus = (taskId, status, assignedTo) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;
    if (isParent) {
      const parentPickingUnassignedTask =
        status === "assigned" &&
        task.status === "pending" &&
        !task.assignedTo &&
        assignedTo === "parent";
      const parentUpdatingOwnTask =
        task.assignedTo === "parent" &&
        ["inProgress", "paused", "midway"].includes(status);
      const parentReactivatingTask =
        status === "pending" && task.status === "completed";
      if (
        !parentPickingUnassignedTask &&
        !parentUpdatingOwnTask &&
        !parentReactivatingTask
      ) {
        return;
      }
    } else {
      if (!currentChild || task.adultOnly || task.status === "completed") return;
      if (
        status === "assigned" &&
        task.status === "pending" &&
        !task.assignedTo &&
        assignedTo === currentChild.id
      ) {
      } else if (
        task.assignedTo !== currentChild.id ||
        !["inProgress", "paused", "midway"].includes(status)
      ) {
        return;
      }
    }
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
              ...(assignedTo === undefined ? {} : { assignedTo }),
              ...(status === "pending"
                ? { completedAt: undefined, completedBy: null, elapsedSeconds: 0 }
                : {}),
            }
          : task,
      ),
    );
  };

  const completeTask = (taskId) => {
    const completedAt = new Date().toISOString();
    const completedTask = tasks.find((task) => task.id === taskId);
    if (!completedTask || completedTask.status === "completed") return;

    if (isParent) {
      if (
        completedTask.assignedTo !== "parent" ||
        !["inProgress", "paused", "midway"].includes(completedTask.status)
      ) {
        return;
      }
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? { ...task, status: "completed", completedAt, completedBy: "parent" }
            : task,
        ),
      );
      return;
    }
    if (
      !currentChild ||
      completedTask.assignedTo !== currentChild.id ||
      !["inProgress", "paused", "midway"].includes(completedTask.status)
    ) return;

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "completed",
              completedAt,
              completedBy: currentChild.id,
            }
          : task,
      ),
    );
    setChildren((currentChildren) =>
      currentChildren.map((child) =>
        child.id === currentChild.id
          ? { ...child, points: child.points + completedTask.pointsReward }
          : child,
      ),
    );
    setCompletedTasks((activity) => [
      ...activity,
      {
        title: completedTask.title,
        difficulty: completedTask.difficulty,
        completedAt,
        userId: currentChild.id,
      },
    ]);
    setNotifications((currentNotifications) => [
      createNotification(
        `${currentChild.name} completed “${completedTask.title}” (+${completedTask.pointsReward} points).`,
      ),
      ...currentNotifications,
    ]);
  };

  const addChild = (name) => {
    if (!isParent) return false;
    const normalizedName = name.trim();
    if (
      !normalizedName ||
      children.some(
        (child) =>
          child.name.toLocaleLowerCase() === normalizedName.toLocaleLowerCase(),
      )
    ) {
      return false;
    }
    const id = `${normalizedName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    setChildren((currentChildren) => [
      ...currentChildren,
      { id, name: normalizedName, points: 0, redeemedGold: 0 },
    ]);
    return true;
  };

  const addReward = (details) => {
    if (!isParent) return;
    setRewards((currentRewards) => [
      ...currentRewards,
      { ...details, id: `${Date.now()}-${Math.random()}` },
    ]);
  };

  const editReward = (rewardId, details) => {
    if (!isParent) return;
    setRewards((currentRewards) =>
      currentRewards.map((reward) =>
        reward.id === rewardId ? { ...reward, ...details } : reward,
      ),
    );
  };

  const redeemReward = (rewardId) => {
    if (isParent || !currentChild) return;
    const reward = rewards.find((item) => item.id === rewardId);
    if (!reward) return;
    const childGold =
      Math.floor(currentChild.points / 1000) - currentChild.redeemedGold;
    if (childGold < reward.goldCost) return;

    setChildren((currentChildren) =>
      currentChildren.map((child) =>
        child.id === currentChild.id
          ? { ...child, redeemedGold: child.redeemedGold + reward.goldCost }
          : child,
      ),
    );
    setNotifications((currentNotifications) => [
      createNotification(
        `${currentChild.name} redeemed “${reward.name}” for ${reward.goldCost} gold.`,
      ),
      ...currentNotifications,
    ]);
  };

  const markNotificationRead = (notificationId) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );
  };

  const renderView = () => {
    switch (activeView) {
      case "rewards":
        return (
          <RewardStorePanel
            isParent={isParent}
            rewards={rewards}
            childGold={user.gold}
            onAddReward={addReward}
            onEditReward={editReward}
            onRedeemReward={redeemReward}
          />
        );
      case "activity":
        return (
          <ActivityHeatmap
            activity={
              isParent
                ? completedTasks
                : completedTasks.filter(
                    (task) => task.userId === currentChild?.id,
                  )
            }
          />
        );
      case "quests":
      default:
        return (
          <QuestBoardPanel
            isParent={isParent}
            currentChild={currentChild}
            childList={childProfiles}
            pointsToNextGold={pointsToNextGold}
            gold={user.gold}
            tasks={tasks}
            onAddTask={addTask}
            onEditTask={editTask}
            onUpdateStatus={updateTaskStatus}
            onCompleteTask={completeTask}
            onPickTask={(taskId) =>
              updateTaskStatus(taskId, "assigned", "parent")
            }
            onDeleteTask={(taskId) =>
              setTasks((currentTasks) =>
                currentTasks.filter((task) => task.id !== taskId),
              )
            }
          />
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout
        user={user}
        activeView={activeView}
        onViewChange={setActiveView}
        isParent={isParent}
        childProfiles={childProfiles}
        onSessionChange={(nextSession) => {
          setSession(nextSession);
          setActiveView("quests");
        }}
        onAddChild={addChild}
        notifications={notifications}
        onNotificationRead={markNotificationRead}>
        {renderView()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
