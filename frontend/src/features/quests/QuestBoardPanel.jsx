import { useState } from "react";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { ClipboardList, Coins, Plus, Sparkles, UserRound } from "lucide-react";
import Card from "../../components/Card";
import QuestCard from "./QuestCard";

const emptyForm = {
  title: "",
  description: "",
  difficulty: "Easy",
  pointsReward: "50",
  adultOnly: false,
  assignedTo: "",
};

export default function QuestBoardPanel({
  isParent,
  currentChild,
  childList,
  pointsToNextGold,
  gold,
  tasks,
  onAddTask,
  onEditTask,
  onUpdateStatus,
  onCompleteTask,
  onPickTask,
  onDeleteTask,
}) {
  const [dialogTask, setDialogTask] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const activeTasks = tasks.filter((task) => task.status !== "completed");
  const archivedTasks = tasks.filter((task) => task.status === "completed");
  const pendingCount = isParent
    ? activeTasks.length
    : activeTasks.filter(
        (task) =>
          !task.adultOnly &&
          (!task.assignedTo || task.assignedTo === currentChild?.id),
      ).length;
  const pointsInCurrentGold = pointsToNextGold;
  const pointsRemaining = 1000 - pointsInCurrentGold;

  const openAddDialog = () => {
    setForm(emptyForm);
    setFormError("");
    setDialogTask(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      difficulty: task.difficulty,
      pointsReward: String(task.pointsReward),
      adultOnly: task.adultOnly,
      assignedTo: task.assignedTo || "",
    });
    setFormError("");
    setDialogTask(task);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogTask(null);
    setForm(emptyForm);
    setFormError("");
  };

  const updateForm = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitTask = (event) => {
    event.preventDefault();
    const pointsReward = Number(form.pointsReward);
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !Number.isInteger(pointsReward) ||
      pointsReward < 0
    ) {
      setFormError(
        "Enter a task name, description, and non-negative whole-number points.",
      );
      return;
    }
    const details = {
      title: form.title.trim(),
      description: form.description.trim(),
      difficulty: form.difficulty,
      pointsReward,
      adultOnly: form.adultOnly,
      assignedTo: form.assignedTo || null,
    };
    if (dialogTask) {
      onEditTask(dialogTask.id, details);
    } else {
      onAddTask(details);
    }
    closeDialog();
  };

  const personName = (childId) =>
    childList.find((child) => child.id === childId)?.name;

  return (
    <Stack spacing={2}>
      <Card padding={16}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                display: "grid",
                placeItems: "center",
                borderRadius: 1,
                color: "#4f46e5",
                bgcolor: "#eef2ff",
              }}>
              <ClipboardList size={20} aria-hidden='true' />
            </Box>
            <Box>
              <Typography
                variant='caption'
                sx={{
                  color: "#6b7280",
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  lineHeight: 1.2,
                  display: "block",
                }}>
                {isParent ? "Task Board" : `${currentChild?.name}'s Tasks`}
              </Typography>
              <Typography
                variant='h6'
                sx={{ color: "#1f2937", fontWeight: 700 }}>
                {isParent ? "Household tasks" : "Available quests"}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1,
              flexWrap: "wrap",
            }}>
            {isParent && childList.length > 0 && (
              <Box
                aria-label='Children and their available gold'
                sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                {childList.map((child, index) => (
                  <Tooltip
                    key={child.id}
                    title={`${child.name}: ${child.gold} gold`}
                    arrow>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: 0.4,
                        minWidth: 42,
                        px: 0.5,
                        py: 0.4,
                        borderRadius: 1,
                        "&:hover": { bgcolor: "#f9fafb" },
                      }}>
                      <Avatar
                        sx={{
                          width: 27,
                          height: 27,
                          bgcolor: index % 2 === 0 ? "#eef2ff" : "#f5f3ff",
                          color: "#4f46e5",
                          fontSize: 12,
                          fontWeight: 700,
                        }}>
                        <UserRound size={16} />
                      </Avatar>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.35,
                          color: "#4f46e5",
                        }}>
                        <Coins size={12} aria-hidden='true' />
                        <Typography
                          variant='caption'
                          component='span'
                          sx={{ color: "inherit", fontWeight: 700 }}>
                          {child.gold}
                        </Typography>
                      </Box>
                    </Box>
                  </Tooltip>
                ))}
              </Box>
            )}
            <Box
              sx={{
                border: "1px solid #c7d2fe",
                bgcolor: "#eef2ff",
                borderRadius: 1,
                px: 1.5,
                py: 0.75,
                color: "#4f46e5",
                fontSize: 13,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}>
              {pendingCount} {pendingCount === 1 ? "task" : "tasks"} pending
            </Box>
            {isParent && (
              <IconButton
                aria-label='Add task'
                title='Add task'
                onClick={openAddDialog}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "#615fff",
                  color: "#fff",
                  borderRadius: 1,
                  "&:hover": { bgcolor: "#4f46e5" },
                }}>
                <Plus size={19} />
              </IconButton>
            )}
          </Box>
        </Box>
      </Card>

      {!isParent && (
        <Box
          sx={{
            display: "grid",
            gap: 1,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3, minmax(0, 1fr))",
            },
          }}>
          <Card padding={12}>
            <Stack spacing={0.75}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 1,
                    bgcolor: "#eef2ff",
                    color: "#615fff",
                  }}>
                  <Sparkles size={17} aria-hidden='true' />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant='caption'
                    sx={{
                      color: "#6b7280",
                      display: "block",
                      lineHeight: 1.2,
                    }}>
                    To Gold
                  </Typography>
                  <Typography
                    variant='subtitle1'
                    sx={{
                      color: "#1f2937",
                      mt: 0.25,
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}>
                    {pointsInCurrentGold}/1000 pts
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant='determinate'
                value={pointsInCurrentGold / 10}
                aria-label={`${pointsInCurrentGold} of 1000 points toward next gold`}
                sx={{
                  height: 5,
                  borderRadius: 999,
                  bgcolor: "#e5e7eb",
                  "& .MuiLinearProgress-bar": { bgcolor: "#615fff" },
                }}
              />
              <Typography variant='caption' sx={{ color: "#6b7280" }}>
                {pointsRemaining} points to next gold
              </Typography>
            </Stack>
          </Card>
          <Card padding={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  flexShrink: 0,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 1,
                  bgcolor: "#eef2ff",
                  color: "#615fff",
                }}>
                <Coins size={17} aria-hidden='true' />
              </Box>
              <Box>
                <Typography
                  variant='caption'
                  sx={{ color: "#6b7280", display: "block", lineHeight: 1.2 }}>
                  Gold available
                </Typography>
                <Typography
                  variant='subtitle1'
                  sx={{
                    color: "#1f2937",
                    mt: 0.25,
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}>
                  {gold}
                </Typography>
              </Box>
            </Box>
          </Card>
          <Card padding={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  flexShrink: 0,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 1,
                  bgcolor: "#eef2ff",
                  color: "#615fff",
                  fontSize: 12,
                  fontWeight: 700,
                }}>
                1k
              </Box>
              <Box>
                <Typography
                  variant='caption'
                  sx={{ color: "#6b7280", display: "block", lineHeight: 1.2 }}>
                  Points convert to
                </Typography>
                <Typography
                  variant='subtitle1'
                  sx={{
                    color: "#1f2937",
                    mt: 0.25,
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}>
                  1 gold
                </Typography>
              </Box>
            </Box>
          </Card>
        </Box>
      )}

      {activeTasks.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gap: 1.5,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            alignItems: "stretch",
          }}>
          {activeTasks.map((task) => (
            <QuestCard
              key={task.id}
              task={task}
              isParent={isParent}
              currentChild={currentChild}
              assignedName={personName(task.assignedTo)}
              onEdit={() => openEditDialog(task)}
              onDelete={() => onDeleteTask(task.id)}
              onAssign={() =>
                onUpdateStatus(task.id, "assigned", currentChild?.id)
              }
              onStart={() => onUpdateStatus(task.id, "inProgress")}
              onPause={() => onUpdateStatus(task.id, "paused")}
              onResume={() => onUpdateStatus(task.id, "inProgress")}
              onMidway={() => onUpdateStatus(task.id, "midway")}
              onComplete={() => onCompleteTask(task.id)}
              onPick={() => onPickTask(task.id)}
            />
          ))}
        </Box>
      ) : (
        <Card padding={16}>
          <Typography variant='body2' sx={{ color: "#6b7280" }}>
            {isParent
              ? "No active tasks. Add a task to get started."
              : "There are no active tasks right now."}
          </Typography>
        </Card>
      )}

      {archivedTasks.length > 0 && (
        <Stack spacing={1.5}>
          <Box>
            <Typography variant='h6' sx={{ color: "#1f2937", fontWeight: 700 }}>
              Completed tasks
            </Typography>
            <Typography variant='body2' sx={{ color: "#6b7280" }}>
              Finished tasks are archived here.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gap: 1.5,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
            }}>
            {archivedTasks.map((task) => (
              <QuestCard
                key={task.id}
                task={task}
                isParent={isParent}
                currentChild={currentChild}
                assignedName={personName(task.assignedTo)}
                onEdit={() => openEditDialog(task)}
                onDelete={() => onDeleteTask(task.id)}
                onComplete={() => onCompleteTask(task.id)}
                onReactivate={() => onUpdateStatus(task.id, "pending", null)}
              />
            ))}
          </Box>
        </Stack>
      )}

      <Dialog
        open={isParent && isDialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth='sm'
        sx={{
          "& .MuiBackdrop-root": {
            backdropFilter: "blur(5px)",
            bgcolor: "rgba(31,41,55,0.2)",
          },
        }}
        keepMounted={false}>
        <Box component='form' onSubmit={submitTask}>
          <DialogTitle sx={{ color: "#1f2937", fontWeight: 700 }}>
            {dialogTask ? "Edit task" : "Add a task"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              {formError && (
                <Typography variant='body2' sx={{ color: "#b91c1c" }}>
                  {formError}
                </Typography>
              )}
              <TextField
                autoFocus
                required
                fullWidth
                name='title'
                label='Task name'
                value={form.title}
                onChange={updateForm}
                slotProps={{ htmlInput: { maxLength: 80 } }}
              />
              <TextField
                required
                fullWidth
                multiline
                minRows={3}
                name='description'
                label='Description'
                value={form.description}
                onChange={updateForm}
                slotProps={{ htmlInput: { maxLength: 500 } }}
              />
              <TextField
                select
                fullWidth
                name='difficulty'
                label='Difficulty'
                value={form.difficulty}
                onChange={updateForm}>
                {["Easy", "Medium", "Hard"].map((difficulty) => (
                  <MenuItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                required
                fullWidth
                type='number'
                name='pointsReward'
                label='Points'
                value={form.pointsReward}
                onChange={updateForm}
                slotProps={{ htmlInput: { min: 0, step: 1 } }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name='adultOnly'
                    checked={form.adultOnly}
                    onChange={updateForm}
                    sx={{
                      color: "#615fff",
                      "&.Mui-checked": { color: "#615fff" },
                    }}
                  />
                }
                label='Adult only — children cannot take this task themselves'
              />
              <TextField
                select
                fullWidth
                name='assignedTo'
                label='Assign to a child'
                value={form.assignedTo}
                onChange={updateForm}>
                <MenuItem value=''>Unassigned</MenuItem>
                {childList.map((child) => (
                  <MenuItem key={child.id} value={child.id}>
                    {child.name}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              variant='text'
              onClick={closeDialog}
              sx={{ color: "#6b7280" }}>
              Cancel
            </Button>
            <Button
              type='submit'
              variant='contained'
              sx={{ bgcolor: "#615fff", "&:hover": { bgcolor: "#4f46e5" } }}>
              {dialogTask ? "Save task" : "Add task"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Stack>
  );
}

QuestBoardPanel.propTypes = {
  isParent: PropTypes.bool.isRequired,
  currentChild: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  childList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      gold: PropTypes.number.isRequired,
    }),
  ).isRequired,
  pointsToNextGold: PropTypes.number.isRequired,
  gold: PropTypes.number.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAddTask: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
  onCompleteTask: PropTypes.func.isRequired,
  onPickTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
};
