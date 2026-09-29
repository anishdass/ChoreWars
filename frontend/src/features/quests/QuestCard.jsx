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
  Pencil,
  Play,
  RotateCcw,
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
  task,
  isParent,
  currentChild,
  assignedName,
  onEdit,
  onDelete,
  onAssign,
  onPick,
  onStart,
  onPause,
  onResume,
  onMidway,
  onComplete,
  onReactivate,
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isCompleted = task.status === "completed";
  const isRunning = task.status === "inProgress";
  const canResume = task.status === "paused" || task.status === "midway";
  const isAssignedToCurrentChild = task.assignedTo === currentChild?.id;
  const isAssignedToParent = task.assignedTo === "parent";
  const canSelfAssign =
    !isParent &&
    !isCompleted &&
    !task.adultOnly &&
    (!task.assignedTo || isAssignedToCurrentChild);
  const needsAssignment =
    canSelfAssign && !task.assignedTo && task.status === "pending";
  const canStart =
    (isParent && isAssignedToParent && task.status === "assigned") ||
    (!isParent &&
      isAssignedToCurrentChild &&
      (task.status === "pending" || task.status === "assigned"));
  const canParentPick =
    isParent && !isCompleted && task.status === "pending" && !task.assignedTo;
  const canControlTask =
    !isCompleted &&
    ((isParent && isAssignedToParent) ||
      (!isParent && isAssignedToCurrentChild));

  return (
    <>
      <Card padding={14}>
        <Stack spacing={1.25}>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant='caption'
                sx={{ letterSpacing: 1.5, color: "#6b7280" }}>
                {isParent ? "TASK" : "TASK"}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                {task.adultOnly && !isParent && (
                  <Box
                    aria-label='Adult only'
                    title='Adult only'
                    sx={{
                      width: 7,
                      height: 7,
                      flexShrink: 0,
                      borderRadius: "50%",
                      bgcolor: "#dc2626",
                    }}
                  />
                )}
                <Typography
                  variant='h6'
                  sx={{
                    color: "#1f2937",
                    mt: 0.25,
                    fontSize: 18,
                    lineHeight: 1.3,
                    overflowWrap: "anywhere",
                  }}>
                  {task.title}
                </Typography>
              </Box>
            </Box>
            {isParent && (
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <IconButton
                  aria-label={`Edit ${task.title}`}
                  title='Edit task'
                  size='small'
                  onClick={onEdit}
                  sx={{
                    color: "#615fff",
                    "&:hover": { bgcolor: "#eef2ff" },
                  }}>
                  <Pencil size={16} />
                </IconButton>
                <IconButton
                  aria-label={`Delete ${task.title}`}
                  title='Delete task'
                  size='small'
                  onClick={() => setIsDeleteDialogOpen(true)}
                  sx={{
                    color: "#9ca3af",
                    "&:hover": { color: "#dc2626", bgcolor: "#fef2f2" },
                  }}>
                  <Trash2 size={16} />
                </IconButton>
              </Box>
            )}
          </Box>

          {!isParent && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                flexWrap: "wrap",
              }}>
              <Badge tone={difficultyTone[task.difficulty] || "default"}>
                {task.difficulty}
              </Badge>
              {task.adultOnly && <Badge tone='hard'>Adult only</Badge>}
              {task.status === "assigned" && (
                <Badge tone='default'>Assigned</Badge>
              )}
              {isRunning && <Badge tone='default'>In progress</Badge>}
              {task.status === "paused" && <Badge tone='default'>Paused</Badge>}
              {task.status === "midway" && (
                <Badge tone='default'>Left midway</Badge>
              )}
              {isCompleted && <Badge tone='easy'>Completed</Badge>}
            </Box>
          )}

          <Typography
            variant='body2'
            sx={{
              color: "#6b7280",
              lineHeight: 1.5,
              overflowWrap: "anywhere",
            }}>
            {task.description}
          </Typography>

          {canParentPick && (
            <MUIButton
            variant='contained'
            fullWidth
            onClick={onPick}
            sx={{
              bgcolor: "#615fff",
              "&:hover": { bgcolor: "#4f46e5" },
            }}>
            Pick task
            </MUIButton>
          )}

          {assignedName && (
            <Typography variant='caption' sx={{ color: "#6b7280" }}>
              Assigned to {assignedName}
            </Typography>
          )}

          {!isParent && (
            <Box
              sx={{
                border: "1px solid rgba(107,114,128,0.2)",
                borderRadius: 1,
                bgcolor: "#f9fafb",
                px: 1.25,
                py: 0.75,
              }}>
              <Typography variant='caption' sx={{ color: "#6b7280" }}>
                POINTS
              </Typography>
              <Typography
                variant='body1'
                sx={{ color: "#1f2937", fontWeight: 700, lineHeight: 1.2 }}>
                +{task.pointsReward}
              </Typography>
            </Box>
          )}

          {needsAssignment && (
            <MUIButton
              variant='contained'
              fullWidth
              onClick={onAssign}
              sx={{
                bgcolor: "#615fff",
                "&:hover": { bgcolor: "#4f46e5" },
              }}>
              Take task
            </MUIButton>
          )}

          {canStart && (
            <MUIButton
              variant='contained'
              fullWidth
              startIcon={<Play size={16} />}
              onClick={onStart}
              sx={{
                bgcolor: "#615fff",
                "&:hover": { bgcolor: "#4f46e5" },
              }}>
              Start task
            </MUIButton>
          )}

          {!isParent && task.adultOnly && !isCompleted && (
            <Typography variant='caption' sx={{ color: "#b91c1c" }}>
              This task must be assigned by a parent.
            </Typography>
          )}

          {canControlTask && !canStart && (
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
                  Resume task
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
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
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
                    {formatDuration(task.elapsedSeconds)}
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

          {!isParent && task.assignedTo && !isAssignedToCurrentChild && !isCompleted && (
            <Typography variant='caption' sx={{ color: "#6b7280" }}>
              This task is assigned to {assignedName || "another child"}.
            </Typography>
          )}

          {isCompleted && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Clock3 size={15} color='#6b7280' aria-hidden='true' />
              <Typography variant='caption' sx={{ color: "#6b7280" }}>
                Time spent: {formatDuration(task.elapsedSeconds)}
              </Typography>
            </Box>
          )}

          {isParent && isCompleted && (
            <MUIButton
              variant='outlined'
              fullWidth
              startIcon={<RotateCcw size={16} />}
              onClick={onReactivate}
              sx={{ color: "#4f46e5", borderColor: "#c7d2fe" }}>
              Reactivate task
            </MUIButton>
          )}
        </Stack>
      </Card>

      {isParent && (
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
            Delete task?
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: "#6b7280" }}>
              “{task.title}” will be permanently removed from your task board.
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
      )}
    </>
  );
}

QuestCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    difficulty: PropTypes.oneOf(["Easy", "Medium", "Hard"]).isRequired,
    pointsReward: PropTypes.number.isRequired,
    adultOnly: PropTypes.bool.isRequired,
    assignedTo: PropTypes.string,
    status: PropTypes.oneOf([
      "pending",
      "assigned",
      "inProgress",
      "paused",
      "midway",
      "completed",
    ]).isRequired,
    elapsedSeconds: PropTypes.number.isRequired,
  }).isRequired,
  isParent: PropTypes.bool.isRequired,
  currentChild: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  assignedName: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onAssign: PropTypes.func,
  onPick: PropTypes.func,
  onStart: PropTypes.func,
  onPause: PropTypes.func,
  onResume: PropTypes.func,
  onMidway: PropTypes.func,
  onComplete: PropTypes.func,
  onReactivate: PropTypes.func,
};
