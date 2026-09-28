import { Box, Stack, Typography } from "@mui/material";
import Card from "../../components/Card";

export default function LeaderboardPanel() {
  const players = [
    { name: "Ava", points: 1480, badge: "⚔️" },
    { name: "Noah", points: 1320, badge: "🔥" },
    { name: "Mia", points: 1180, badge: "💎" },
  ];

  return (
    <Card>
      <Stack spacing={2}>
        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant='h6' sx={{ color: "#1f2937" }}>
            Leaderboard
          </Typography>
          <Typography variant='caption' sx={{ color: "#6b7280" }}>
            This week
          </Typography>
        </Box>

        <Stack spacing={1.5}>
          {players.map((player, index) => (
            <Box
              key={player.name}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid rgba(107,114,128,0.2)",
                borderRadius: 1,
                bgcolor: "#f9fafb",
                px: 2,
                py: 1.5,
              }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#eef2ff",
                    color: "#4f46e5",
                    fontSize: 12,
                    fontWeight: 700,
                  }}>
                  #{index + 1}
                </Box>
                <Box>
                  <Typography sx={{ color: "#1f2937", fontWeight: 600 }}>
                    {player.name}
                  </Typography>
                  <Typography variant='caption' sx={{ color: "#6b7280" }}>
                    {player.badge} Champion
                  </Typography>
                </Box>
              </Box>
              <Typography sx={{ color: "#1f2937", fontWeight: 700 }}>
                {player.points} XP
              </Typography>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
