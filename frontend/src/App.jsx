import { useEffect, useState } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import Layout from "./components/Layout";
import QuestBoardPanel from "./features/quests/QuestBoardPanel";
import RewardStorePanel from "./features/activity/RewardStorePanel";
import ActivityHeatmap from "./features/rewards/ActivityHeatmap";
import AccountSettings from "./features/settings/AccountSettings";
import LoginPage from "./features/auth/LoginPage";

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

// Each child owns a base color. The activity heatmap tints that color light or
// dark depending on how many chores the child has already completed.
const initialChildren = [
  {
    id: "roshesh",
    name: "Roshesh Sarabhai",
    username: "roshesh.sarabhai",
    color: "#2563eb",
    points: 0,
    redeemedGold: 0,
  },
  {
    id: "sahil",
    name: "Sahil Sarabhai",
    username: "sahil.sarabhai",
    color: "#db2777",
    points: 0,
    redeemedGold: 0,
  },
];

// Colors handed out, in order, to children added at runtime.
const childColorPalette = [
  "#0891b2",
  "#ea580c",
  "#7c3aed",
  "#65a30d",
  "#e11d48",
  "#0d9488",
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

const initialHouseholdName = "Sarabhai's";

const toLocalDateString = (date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

const getNextRecurringDate = (scheduledDate, frequency, today, task) => {
  const startDate = scheduledDate && scheduledDate > today ? scheduledDate : today;
  const [year, month, day] = startDate.split("-").map(Number);

  if (!year || !month || !day) {
    throw new Error(`Invalid recurring task date: ${startDate}`);
  }

  let nextDate = new Date(year, month - 1, day);
  if (frequency === "daily") {
    nextDate.setDate(nextDate.getDate() + 1);
  } else if (frequency === "weekly") {
    nextDate.setDate(nextDate.getDate() + 7);
  } else if (frequency === "custom") {
    const selectedDays = [...new Set(task.repeatDays || [])]
      .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
      .sort((a, b) => a - b);
    if (selectedDays.length === 0) {
      throw new Error("Custom recurring tasks must include at least one weekday.");
    }
    const daysUntilNext = selectedDays
      .map((day) => (day - nextDate.getDay() + 7) % 7 || 7)
      .sort((a, b) => a - b)[0];
    nextDate.setDate(nextDate.getDate() + daysUntilNext);
  } else if (frequency === "monthly") {
    const nextMonth = nextDate.getMonth() + 1;
    const nextYear = nextDate.getFullYear() + Math.floor(nextMonth / 12);
    const monthIndex = nextMonth % 12;
    const lastDayOfMonth = new Date(nextYear, monthIndex + 1, 0).getDate();
    nextDate = new Date(nextYear, monthIndex, Math.min(day, lastDayOfMonth));
  } else {
    throw new Error(`Unsupported recurring task frequency: ${frequency}`);
  }

  return toLocalDateString(nextDate);
};

const createNextRecurringTask = (task, today, id) => {
  if (!task.repeatEnabled || !task.repeatFrequency) return null;

  return {
    ...task,
    id,
    scheduledDate: getNextRecurringDate(
      task.scheduledDate,
      task.repeatFrequency,
      today,
      task,
    ),
    status: task.assignedTo === "parent" ? "assigned" : "pending",
    elapsedSeconds: 0,
    completedAt: undefined,
    completedBy: null,
  };
};

const createNotification = (message) => ({
  id: `${Date.now()}-${Math.random()}`,
  message,
  createdAt: new Date().toISOString(),
  read: false,
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState("quests");
  const [session, setSession] = useState({ role: "parent", userId: "parent" });
  const [children, setChildren] = useState(initialChildren);
  const [parentProfile, setParentProfile] = useState({
    firstName: "Maya",
    lastName: "Sarabhai",
    username: "maya.sarabhai",
    email: "",
  });
  const [parentPassword, setParentPassword] = useState("Thalafans1!");
  const [householdName, setHouseholdName] = useState(initialHouseholdName);
  const [parentPhotoUrl, setParentPhotoUrl] = useState("");
  const [tasks, setTasks] = useState(initialTasks);
  const [rewards, setRewards] = useState(initialRewards);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const isParent = session.role === "parent";
  const currentChild = children.find((child) => child.id === session.userId);
  const currentChildFirstName = currentChild?.name.trim().split(/\s+/)[0];
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
    name: isParent ? parentProfile.firstName : currentChildFirstName || "Child",
    username: isParent
      ? parentProfile.username
      : currentChild?.username || "",
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
    firstName: child.name.trim().split(/\s+/)[0],
    gold: Math.max(
      Math.floor(child.points / 1000) - child.redeemedGold,
      0,
    ),
  }));

  const loginParent = (identifier, password) => {
    const normalizedIdentifier = identifier.trim().toLocaleLowerCase();
    const validIdentifiers = [
      `${parentProfile.firstName} ${parentProfile.lastName}`,
      parentProfile.username,
      parentProfile.email,
    ]
      .filter(Boolean)
      .map((value) => value.trim().toLocaleLowerCase());
    if (
      password !== parentPassword ||
      !validIdentifiers.includes(normalizedIdentifier)
    ) {
      return false;
    }
    setSession({ role: "parent", userId: "parent" });
    setActiveView("quests");
    setIsAuthenticated(true);
    return true;
  };

  const registerParent = (details) => {
    const normalizedUsername = details.username.toLocaleLowerCase();
    if (
      normalizedUsername === parentProfile.username.toLocaleLowerCase() ||
      children.some(
        (child) => child.username.toLocaleLowerCase() === normalizedUsername,
      )
    ) {
      return false;
    }
    setParentProfile({
      firstName: details.firstName,
      lastName: details.lastName,
      username: details.username,
      email: details.email,
    });
    setParentPassword(details.password);
    setHouseholdName(null);
    setChildren([]);
    setTasks([]);
    setRewards([]);
    setCompletedTasks([]);
    setNotifications([]);
    setParentPhotoUrl("");
    setSession({ role: "parent", userId: "parent" });
    setActiveView("quests");
    setIsAuthenticated(true);
    return true;
  };

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
    if (!isParent || !householdName) return;
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
    if (!isParent || !householdName) return;
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
      const parentQuittingOwnTask =
        status === "pending" &&
        assignedTo === null &&
        task.assignedTo === "parent" &&
        ["inProgress", "paused", "midway"].includes(task.status);
      const parentReactivatingTask =
        status === "pending" && task.status === "completed";
      if (
        !parentPickingUnassignedTask &&
        !parentUpdatingOwnTask &&
        !parentQuittingOwnTask &&
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
        status === "pending" &&
        assignedTo === null &&
        task.assignedTo === currentChild.id &&
        ["inProgress", "paused", "midway"].includes(task.status)
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
    const completedTask = tasks.find((task) => task.id === taskId);
    if (!completedTask || completedTask.status === "completed") return;
    // oxlint-disable-next-line react/purity -- This timestamp is created only in the completion handler.
    const completedAt = new Date().toISOString();
    const nextRecurringTask = completedTask.repeatEnabled
      ? createNextRecurringTask(
          completedTask,
          completedAt.slice(0, 10),
          `${completedTask.id}-${completedAt}`,
        )
      : null;

    if (isParent) {
      if (
        completedTask.assignedTo !== "parent" ||
        !["inProgress", "paused", "midway"].includes(completedTask.status)
      ) {
        return;
      }
      setTasks((currentTasks) =>
        [
          ...currentTasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: "completed",
                  completedAt,
                  completedBy: "parent",
                  repeatEnabled: false,
                  repeatFrequency: null,
                }
              : task,
          ),
          ...(nextRecurringTask ? [nextRecurringTask] : []),
        ],
      );
      return;
    }
    if (
      !currentChild ||
      completedTask.assignedTo !== currentChild.id ||
      !["inProgress", "paused", "midway"].includes(completedTask.status)
    ) return;

    setTasks((currentTasks) => [
      ...currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "completed",
              completedAt,
              completedBy: currentChild.id,
              repeatEnabled: false,
              repeatFrequency: null,
            }
          : task,
      ),
      ...(nextRecurringTask ? [nextRecurringTask] : []),
    ]);
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
    toast.success(`${currentChildFirstName} completed “${completedTask.title}”.`);
    setNotifications((currentNotifications) => [
      createNotification(
        `${currentChildFirstName} completed “${completedTask.title}” (+${completedTask.pointsReward} points).`,
      ),
      ...currentNotifications,
    ]);
  };

  const addChild = (name) => {
    if (!isParent || !householdName) return false;
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
    const usedColors = children.map((child) => child.color);
    const color =
      childColorPalette.find((item) => !usedColors.includes(item)) ||
      childColorPalette[children.length % childColorPalette.length];
    const baseUsername = normalizedName
      .toLocaleLowerCase()
      .replace(/[^a-z0-9]+/g, ".")
      .replace(/^\.+|\.+$/g, "")
      .slice(0, 30)
      .replace(/[._]+$/g, "") || "child";
    const takenUsernames = new Set([
      parentProfile.username.toLocaleLowerCase(),
      ...children.map((child) => child.username.toLocaleLowerCase()),
    ]);
    let username = baseUsername;
    let suffix = 2;
    while (takenUsernames.has(username.toLocaleLowerCase())) {
      const suffixText = `.${suffix}`;
      username = `${baseUsername.slice(0, 30 - suffixText.length)}${suffixText}`;
      suffix += 1;
    }
    setChildren((currentChildren) => [
      ...currentChildren,
      {
        id,
        name: normalizedName,
        username,
        color,
        points: 0,
        redeemedGold: 0,
      },
    ]);
    return true;
  };

  const removeChild = (childId) => {
    if (!isParent) return;
    const child = children.find((item) => item.id === childId);
    if (!child) return;
    setChildren((currentChildren) =>
      currentChildren.filter((item) => item.id !== childId),
    );
    setTasks((currentTasks) =>
      currentTasks.filter(
        (task) =>
          task.assignedTo !== childId && task.completedBy !== childId,
      ),
    );
    setCompletedTasks((currentActivity) =>
      currentActivity.filter((item) => item.userId !== childId),
    );
    setNotifications((currentNotifications) =>
      currentNotifications.filter(
        (notification) =>
          !notification.message.startsWith(`${child.name.split(/\s+/)[0]} `),
      ),
    );
    if (session.userId === childId) {
      setSession({ role: "parent", userId: "parent" });
    }
  };

  const updateChildPhoto = (childId, photoUrl) => {
    if (!isParent && childId !== currentChild?.id) return;
    setChildren((currentChildren) =>
      currentChildren.map((child) =>
        child.id === childId ? { ...child, photoUrl } : child,
      ),
    );
  };

  const addReward = (details) => {
    if (!isParent || !householdName) return;
    setRewards((currentRewards) => [
      ...currentRewards,
      { ...details, id: `${Date.now()}-${Math.random()}` },
    ]);
  };

  const editReward = (rewardId, details) => {
    if (!isParent || !householdName) return;
    setRewards((currentRewards) =>
      currentRewards.map((reward) =>
        reward.id === rewardId ? { ...reward, ...details } : reward,
      ),
    );
  };

  const deleteReward = (rewardId) => {
    if (!isParent || !householdName) return;
    setRewards((currentRewards) =>
      currentRewards.filter((reward) => reward.id !== rewardId),
    );
  };

  const deleteSpace = () => {
    if (!isParent || !householdName) return;
    setHouseholdName(null);
    setChildren([]);
    setTasks([]);
    setRewards([]);
    setCompletedTasks([]);
    setNotifications([]);
    setSession({ role: "parent", userId: "parent" });
    setActiveView("quests");
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
        `${currentChildFirstName} redeemed “${reward.name}” for ${reward.goldCost} gold.`,
      ),
      ...currentNotifications,
    ]);
    toast.success(`${reward.name} redeemed for ${reward.goldCost} gold.`);
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
      case "settings":
        return (
          <AccountSettings
            userName={user.name}
            profile={
              isParent
                ? parentProfile
                : {
                    firstName: currentChildFirstName || "",
                    lastName:
                      currentChild?.name.trim().split(/\s+/).slice(1).join(" ") ||
                      "",
                    username: currentChild?.username || "",
                    email: "",
                  }
            }
            takenUsernames={children.map((child) => child.username)}
            onSaveProfile={setParentProfile}
            email={parentProfile.email}
            userPhotoUrl={isParent ? parentPhotoUrl : currentChild?.photoUrl}
            currentChildPhotoUrl={currentChild?.photoUrl || ""}
            householdName={householdName || ""}
            childProfiles={childProfiles}
            isParent={isParent}
            onSaveHouseholdName={(name) => {
              if (isParent) setHouseholdName(name);
            }}
            onAddChild={addChild}
            onRemoveChild={removeChild}
            onUpdateChildPhoto={updateChildPhoto}
            onUpdateOwnPhoto={(photoUrl) => {
              if (isParent) {
                setParentPhotoUrl(photoUrl);
              } else if (currentChild) {
                updateChildPhoto(currentChild.id, photoUrl);
              }
            }}
          />
        );
      case "rewards":
        return (
          <RewardStorePanel
            isParent={isParent}
            rewards={rewards}
            childGold={user.gold}
            onAddReward={addReward}
            onEditReward={editReward}
            onDeleteReward={deleteReward}
            onRedeemReward={redeemReward}
          />
        );
      case "activity":
        return (
          <ActivityHeatmap
            childProfiles={
              isParent
                ? childProfiles
                : childProfiles.filter(
                    (child) => child.id === currentChild?.id,
                  )
            }
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
            householdName={householdName || ""}
            onSaveHouseholdName={setHouseholdName}
            onDeleteSpace={deleteSpace}
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
      {isAuthenticated ? (
        <Layout
          user={user}
          userPhotoUrl={isParent ? parentPhotoUrl : currentChild?.photoUrl || ""}
          activeView={activeView}
          onViewChange={setActiveView}
          isParent={isParent}
          hasSpace={Boolean(householdName)}
          childProfiles={childProfiles}
          sessionUserId={session.userId}
          onSessionChange={(nextSession) => {
            setSession(nextSession);
            setActiveView("quests");
          }}
          onAddChild={addChild}
          notifications={notifications}
          onNotificationRead={markNotificationRead}
          onLogout={() => {
            setIsAuthenticated(false);
            setSession({ role: "parent", userId: "parent" });
            setActiveView("quests");
          }}>
          {renderView()}
        </Layout>
      ) : (
        <LoginPage
          onLogin={loginParent}
          onRegister={registerParent}
          takenUsernames={[
            parentProfile.username,
            ...children.map((child) => child.username),
          ]}
        />
      )}
      <ToastContainer
        position='top-right'
        autoClose={3600}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        theme='light'
        toastClassName='chorewars-toast'
        bodyClassName='chorewars-toast-body'
        progressClassName='chorewars-toast-progress'
      />
    </ThemeProvider>
  );
}

export default App;
