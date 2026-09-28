import { Box, Stack, Typography } from "@mui/material";
import Button from "../../components/Button";
import Card from "../../components/Card";

const rewards = [
  { name: "Movie Night", cost: 120 },
  { name: "Takeout Treat", cost: 180 },
  { name: "Weekend Pass", cost: 250 },
];

export default function RewardStorePanel() {
  return (
    <Card>
      <Stack spacing={2}>
        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant='h6' sx={{ color: "#1f2937" }}>
            Reward Store
          </Typography>
          <Typography variant='caption' sx={{ color: "#6b7280" }}>
            Redeem perks
          </Typography>
        </Box>

        <Stack spacing={1.5}>
          {rewards.map((reward) => (
            <Box
              key={reward.name}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                border: "1px solid rgba(107,114,128,0.2)",
                borderRadius: 1,
                bgcolor: "#f9fafb",
                p: 2,
              }}>
              <Box>
                <Typography sx={{ color: "#1f2937", fontWeight: 600 }}>
                  {reward.name}
                </Typography>
                <Typography
                  variant='caption'
                  sx={{
                    display: "inline-block",
                    mt: 0.75,
                    color: "#4b5563",
                    border: "1px solid rgba(107,114,128,0.2)",
                    borderRadius: 999,
                    px: 1,
                    py: 0.4,
                  }}>
                  {reward.cost} gold
                </Typography>
              </Box>
              <Button variant='outlined'>Redeem</Button>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
