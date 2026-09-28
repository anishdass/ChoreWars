import { useEffect, useState } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Layout from "./components/Layout";
import QuestBoardPanel from "./features/quests/QuestBoardPanel";
import LeaderboardPanel from "./features/leaderboard/LeaderboardPanel";
import RewardStorePanel from "./features/rewards/RewardStorePanel";
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

const initialQuests = [
  {
    id: "kitchen-reset",
    title: "Kitchen Reset",
    description:
      "Wash dishes, wipe counters, and make the kitchen sparkle before dinner.",
    difficulty: "Easy",
    xpReward: 60,
    goldReward: 12,
  },
  {
    id: "laundry-sprint",
    title: "Laundry Sprint",
    description: "Sort, wash, dry, and fold the family laundry for the week.",
    difficulty: "Medium",
    xpReward: 120,
    goldReward: 25,
  },
  {
    id: "deep-clean-bathroom",
    title: "Deep Clean Bathroom",
    description:
      "Scrub the bathroom, sanitize surfaces, and refresh the towels.",
    difficulty: "Hard",
    xpReward: 180,
    goldReward: 40,
  },
].map((quest) => ({ ...quest, status: "pending", elapsedSeconds: 0 }));

const themeUser = {
  name: "Ava",
  level: 8,
  currentXp: 720,
  xpGoal: 1000,
  gold: 245,
};

function App() {
  const [activeView, setActiveView] = useState("quests");
  const [questList, setQuestList] = useState(initialQuests);
  const [completedQuests, setCompletedQuests] = useState([]);

  const hasRunningQuest = questList.some(
    (quest) => quest.status === "inProgress",
  );

  useEffect(() => {
    if (!hasRunningQuest) return undefined;

    const timer = window.setInterval(() => {
      setQuestList((currentQuests) =>
        currentQuests.map((quest) =>
          quest.status === "inProgress"
            ? { ...quest, elapsedSeconds: quest.elapsedSeconds + 1 }
            : quest,
        ),
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [hasRunningQuest]);

  const updateQuestStatus = (questId, status) => {
    setQuestList((currentQuests) =>
      currentQuests.map((quest) =>
        quest.id === questId ? { ...quest, status } : quest,
      ),
    );
  };

  const addQuest = (questDetails) => {
    setQuestList((currentQuests) => [
      ...currentQuests,
      {
        ...questDetails,
        id: `${Date.now()}-${Math.random()}`,
        status: "pending",
        elapsedSeconds: 0,
      },
    ]);
  };

  const completeQuest = (questId) => {
    const completedAt = new Date().toISOString();
    const completedQuest = questList.find((quest) => quest.id === questId);
    if (!completedQuest) return;

    setQuestList((currentQuests) =>
      currentQuests.map((quest) =>
        quest.id === questId
          ? { ...quest, status: "completed", completedAt }
          : quest,
      ),
    );
    setCompletedQuests((activity) => [
      ...activity,
      {
        title: completedQuest.title,
        difficulty: completedQuest.difficulty,
        completedAt,
      },
    ]);
  };

  const renderView = () => {
    switch (activeView) {
      case "leaderboard":
        return <LeaderboardPanel />;
      case "rewards":
        return <RewardStorePanel />;
      case "activity":
        return <ActivityHeatmap activity={completedQuests} />;
      case "quests":
      default:
        return (
          <QuestBoardPanel
            quests={questList}
            onAddQuest={addQuest}
            onUpdateStatus={updateQuestStatus}
            onCompleteQuest={completeQuest}
            onDeleteQuest={(questId) =>
              setQuestList((currentQuests) =>
                currentQuests.filter((quest) => quest.id !== questId),
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
        user={themeUser}
        activeView={activeView}
        onViewChange={setActiveView}>
        {renderView()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
