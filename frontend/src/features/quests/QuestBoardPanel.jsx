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
import { Check, Coins, Home, Pencil, Plus, Sparkles, UserRound, X } from "lucide-react";
import { toast } from "react-toastify";
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
  householdName,
  onSaveHouseholdName,
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
  const [isEditingHouseholdName, setIsEditingHouseholdName] = useState(false);
  const [householdNameDraft, setHouseholdNameDraft] = useState(householdName);
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
      toast.error(
        "Add a task name, description, and valid non-negative points.",
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
      toast.success("Task changes saved.");
    } else {
      onAddTask(details);
      toast.success("Task added to the household.");
    }
    closeDialog();
  };

  const personName = (childId) =>
    childList.find((child) => child.id === childId)?.name;

  const saveHouseholdName = (event) => {
    event.preventDefault();
    const nextName = householdNameDraft.trim();
    if (!nextName) {
      toast.error("Enter a shared space name before saving.");
      return;
    }
    onSaveHouseholdName(nextName);
    setHouseholdNameDraft(nextName);
    setIsEditingHouseholdName(false);
    toast.success("Your shared space name has been saved.");
  };

  const cancelHouseholdNameEdit = () => {
    setHouseholdNameDraft(householdName);
    setIsEditingHouseholdName(false);
  };

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
              <Home size={20} aria-hidden='true' />
            </Box>
            <Box>
              {isParent && isEditingHouseholdName ? (
                <Box
                  component='form'
                  onSubmit={saveHouseholdName}
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <TextField
                    autoFocus
                    size='small'
                    value={householdNameDraft}
                    onChange={(event) =>
                      setHouseholdNameDraft(event.target.value)
                    }
                    aria-label='Shared space name'
                    sx={{
                      width: { xs: 180, sm: 220 },
                      "& .MuiOutlinedInput-root": { borderRadius: 1 },
                    }}
                  />
                  <IconButton
                    type='submit'
                    aria-label='Save shared space name'
                    size='small'
                    sx={{ color: "#4f46e5" }}>
                    <Check size={17} />
                  </IconButton>
                  <IconButton
                    type='button'
                    aria-label='Cancel shared space name edit'
                    onClick={cancelHouseholdNameEdit}
                    size='small'
                    sx={{ color: "#6b7280" }}>
                    <X size={17} />
                  </IconButton>
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                  <Typography
                    variant='h6'
                    sx={{
                      color: "#1f2937",
                      fontWeight: 700,
                      display: "block",
                    }}>
                    {householdName}
                  </Typography>
                  {isParent && (
                    <IconButton
                      aria-label='Edit shared space name'
                      size='small'
                      onClick={() => {
                        setHouseholdNameDraft(householdName);
                        setIsEditingHouseholdName(true);
                      }}
                      sx={{
                        p: 0.5,
                        color: "#6b7280",
                        "&:hover": { color: "#4f46e5", bgcolor: "#eef2ff" },
                      }}>
                      <Pencil size={13} />
                    </IconButton>
                  )}
                </Box>
              )}
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
                    title={`${child.firstName || child.name.split(/\s+/)[0]}: ${child.gold} gold`}
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
                        src={child.photoUrl}
                        sx={{
                          width: 27,
                          height: 27,
                          bgcolor:
                            child.color ||
                            (index % 2 === 0 ? "#2563eb" : "#db2777"),
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 700,
                        }}>
                        {!child.photoUrl && <UserRound size={16} />}
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
              onDelete={() => {
                onDeleteTask(task.id);
                toast.success("Task removed.");
              }}
              onAssign={() => {
                onUpdateStatus(task.id, "assigned", currentChild?.id);
                toast.success("Task added to your list.");
              }}
              onStart={() => onUpdateStatus(task.id, "inProgress")}
              onPause={() => onUpdateStatus(task.id, "paused")}
              onResume={() => onUpdateStatus(task.id, "inProgress")}
              onMidway={() => onUpdateStatus(task.id, "midway")}
              onComplete={() => onCompleteTask(task.id)}
              onPick={() => {
                onPickTask(task.id);
                toast.success("Task assigned to you.");
              }}
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
        <Box component='form' onSubmit={submitTask} noValidate>
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
                    {child.firstName || child.name.split(/\s+/)[0]}
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
  householdName: PropTypes.string.isRequired,
  onSaveHouseholdName: PropTypes.func.isRequired,
  currentChild: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  childList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      gold: PropTypes.number.isRequired,
      color: PropTypes.string,
      photoUrl: PropTypes.string,
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
