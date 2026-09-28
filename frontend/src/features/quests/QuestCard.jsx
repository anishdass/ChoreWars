import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button as MUIButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  Check,
  CirclePause,
  Clock3,
  Play,
  Timer,
  Trash2,
} from "lucide-react";
import Badge from "../../components/Badge";
import Card from "../../components/Card";

const difficultyTone = {
  Easy: "easy",
  Medium: "medium",
  Hard: "hard",
};

const formatDuration = (totalSeconds = 0) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
};

export default function QuestCard({
  quest,
  onClaim,
  onPause,
  onResume,
  onMidway,
  onComplete,
  onDelete,
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isCompleted = quest.status === "completed";
  const isRunning = quest.status === "inProgress";
  const canResume = quest.status === "paused" || quest.status === "midway";

  return (
    <>
      <Card padding={14}>
        <Stack spacing={1.25}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant='caption'
                sx={{ letterSpacing: 1.5, color: "#6b7280" }}>
                QUEST
              </Typography>
              <Typography
                variant='h6'
                sx={{
                  color: "#1f2937",
                  mt: 0.25,
                  fontSize: 18,
                  lineHeight: 1.3,
                  overflowWrap: "anywhere",
                }}>
                {quest.title}
              </Typography>
            </Box>
            <IconButton
              aria-label={`Delete ${quest.title}`}
              title='Delete quest'
              size='small'
              onClick={() => setIsDeleteDialogOpen(true)}
              sx={{
                color: "#9ca3af",
                alignSelf: "flex-start",
                "&:hover": { color: "#dc2626", bgcolor: "#fef2f2" },
              }}>
              <Trash2 size={17} />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              flexWrap: "wrap",
            }}>
            <Badge tone={difficultyTone[quest.difficulty] || "default"}>
              {quest.difficulty}
            </Badge>
            {isRunning && <Badge tone='default'>In progress</Badge>}
            {quest.status === "paused" && <Badge tone='default'>Paused</Badge>}
            {quest.status === "midway" && <Badge tone='default'>Left midway</Badge>}
            {isCompleted && <Badge tone='easy'>Completed</Badge>}
          </Box>

          <Typography
            variant='body2'
            sx={{ color: "#6b7280", lineHeight: 1.5, overflowWrap: "anywhere" }}>
            {quest.description}
          </Typography>

          <Stack direction='row' spacing={1}>
            <Box
              sx={{
                flex: 1,
                border: "1px solid rgba(107,114,128,0.2)",
                borderRadius: 1,
                bgcolor: "#f9fafb",
                px: 1.25,
                py: 0.75,
              }}>
              <Typography variant='caption' sx={{ color: "#6b7280" }}>
                XP
              </Typography>
              <Typography
                variant='body1'
                sx={{ color: "#1f2937", fontWeight: 700, lineHeight: 1.2 }}>
                +{quest.xpReward}
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                border: "1px solid rgba(107,114,128,0.2)",
                borderRadius: 1,
                bgcolor: "#f9fafb",
                px: 1.25,
                py: 0.75,
              }}>
              <Typography variant='caption' sx={{ color: "#6b7280" }}>
                GOLD
              </Typography>
              <Typography
                variant='body1'
                sx={{ color: "#1f2937", fontWeight: 700, lineHeight: 1.2 }}>
                +{quest.goldReward}
              </Typography>
            </Box>
          </Stack>

          {quest.status === "pending" && (
            <MUIButton
              variant='contained'
              fullWidth
              onClick={onClaim}
              sx={{
                bgcolor: "#615fff",
                "&:hover": { bgcolor: "#4f46e5" },
              }}>
              Claim Quest
            </MUIButton>
          )}

          {!isCompleted && quest.status !== "pending" && (
            <>
              {canResume && (
                <MUIButton
                  variant='contained'
                  fullWidth
                  startIcon={<Play size={16} />}
                  onClick={onResume}
                  sx={{
                    bgcolor: "#615fff",
                    "&:hover": { bgcolor: "#4f46e5" },
                  }}>
                  Resume Quest
                </MUIButton>
              )}
              <Stack direction='row' spacing={1}>
                <MUIButton
                  variant='contained'
                  fullWidth
                  startIcon={<Check size={16} />}
                  onClick={onComplete}
                  sx={{
                    bgcolor: "#615fff",
                    "&:hover": { bgcolor: "#4f46e5" },
                  }}>
                  Completed
                </MUIButton>
                {isRunning && (
                  <MUIButton
                    variant='outlined'
                    fullWidth
                    onClick={onMidway}
                    sx={{ color: "#4f46e5", borderColor: "#c7d2fe" }}>
                    Left midway
                  </MUIButton>
                )}
              </Stack>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                sx={{
                  borderTop: "1px solid rgba(107,114,128,0.16)",
                  pt: 1,
                  mt: 0.25,
                }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  {isRunning ? (
                    <Timer size={16} color='#615fff' aria-hidden='true' />
                  ) : (
                    <Clock3 size={16} color='#6b7280' aria-hidden='true' />
                  )}
                  <Typography
                    component='span'
                    variant='body2'
                    sx={{
                      fontVariantNumeric: "tabular-nums",
                      color: "#4b5563",
                      fontWeight: 700,
                    }}>
                    {formatDuration(quest.elapsedSeconds)}
                  </Typography>
                </Box>
                {isRunning && (
                  <MUIButton
                    variant='text'
                    size='small'
                    startIcon={<CirclePause size={16} />}
                    onClick={onPause}
                    sx={{ color: "#4f46e5", minWidth: "auto" }}>
                    Pause
                  </MUIButton>
                )}
              </Box>
            </>
          )}

          {isCompleted && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Clock3 size={15} color='#6b7280' aria-hidden='true' />
              <Typography variant='caption' sx={{ color: "#6b7280" }}>
                Time spent: {formatDuration(quest.elapsedSeconds)}
              </Typography>
            </Box>
          )}
        </Stack>
      </Card>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        sx={{
          "& .MuiBackdrop-root": {
            backdropFilter: "blur(4px)",
            bgcolor: "rgba(31,41,55,0.2)",
          },
        }}>
        <DialogTitle sx={{ color: "#1f2937", fontWeight: 700 }}>
          Delete quest?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#6b7280" }}>
            “{quest.title}” will be permanently removed from your quest board.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <MUIButton
            onClick={() => setIsDeleteDialogOpen(false)}
            sx={{ color: "#6b7280" }}>
            Cancel
          </MUIButton>
          <MUIButton
            variant='contained'
            onClick={() => {
              setIsDeleteDialogOpen(false);
              onDelete();
            }}
            sx={{
              bgcolor: "#dc2626",
              "&:hover": { bgcolor: "#b91c1c" },
            }}>
            Delete
          </MUIButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

QuestCard.propTypes = {
  quest: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    difficulty: PropTypes.oneOf(["Easy", "Medium", "Hard"]).isRequired,
    xpReward: PropTypes.number.isRequired,
    goldReward: PropTypes.number.isRequired,
    status: PropTypes.oneOf([
      "pending",
      "inProgress",
      "paused",
      "midway",
      "completed",
    ]).isRequired,
    elapsedSeconds: PropTypes.number.isRequired,
  }).isRequired,
  onClaim: PropTypes.func,
  onPause: PropTypes.func,
  onResume: PropTypes.func,
  onMidway: PropTypes.func,
  onComplete: PropTypes.func,
  onDelete: PropTypes.func.isRequired,
};
