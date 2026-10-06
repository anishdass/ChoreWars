import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Coins, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Card from "../../components/Card";

const blankReward = { name: "", goldCost: "1" };

export default function RewardStorePanel({
  isParent,
  rewards,
  childGold,
  onAddReward,
  onEditReward,
  onDeleteReward,
  onRedeemReward,
}) {
  const [dialogReward, setDialogReward] = useState(null);
  const [rewardToDelete, setRewardToDelete] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState(blankReward);
  const [formError, setFormError] = useState("");

  const openAddDialog = () => {
    setDialogReward(null);
    setForm(blankReward);
    setFormError("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (reward) => {
    setDialogReward(reward);
    setForm({ name: reward.name, goldCost: String(reward.goldCost) });
    setFormError("");
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogReward(null);
    setForm(blankReward);
    setFormError("");
  };

  const deleteReward = () => {
    if (!rewardToDelete) return;
    onDeleteReward(rewardToDelete.id);
    toast.success(`${rewardToDelete.name} removed from the store.`);
    setRewardToDelete(null);
  };

  const submitReward = (event) => {
    event.preventDefault();
    const goldCost = Number(form.goldCost);
    if (
      !form.name.trim() ||
      !Number.isInteger(goldCost) ||
      goldCost < 1
    ) {
      setFormError("Enter a reward name and a whole-number gold cost of at least 1.");
      toast.error("Enter a reward name and a whole-number gold cost of at least 1.");
      return;
    }
    const reward = { name: form.name.trim(), goldCost };
    if (dialogReward) {
      onEditReward(dialogReward.id, reward);
      toast.success("Reward changes saved.");
    } else {
      onAddReward(reward);
      toast.success("Reward added to the store.");
    }
    closeDialog();
  };

  return (
    <Card>
      <Stack spacing={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}>
          <Box>
            <Typography variant='h6' sx={{ color: "#1f2937" }}>
              Reward Store
            </Typography>
            <Typography variant='caption' sx={{ color: "#6b7280" }}>
              {isParent
                ? "Set rewards for your children"
                : `${childGold} gold available to redeem`}
            </Typography>
          </Box>
          {isParent && (
            <Button
              aria-label='Add reward'
              title='Add reward'
              variant='contained'
              onClick={openAddDialog}
              startIcon={<Plus size={17} />}
              sx={{
                bgcolor: "#615fff",
                "&:hover": { bgcolor: "#4f46e5" },
              }}>
              Add reward
            </Button>
          )}
        </Box>

        {rewards.length > 0 ? (
          <Stack spacing={1.5}>
            {rewards.map((reward) => (
              <Box
                key={reward.id}
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
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 0.75,
                      color: "#4b5563",
                      border: "1px solid rgba(107,114,128,0.2)",
                      borderRadius: 999,
                      px: 1,
                      py: 0.4,
                    }}>
                    <Coins size={13} aria-hidden='true' />
                    {reward.goldCost}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {!isParent && (
                    <Button
                      variant='outlined'
                      disabled={childGold < reward.goldCost}
                      onClick={() => onRedeemReward(reward.id)}
                      sx={{
                        color: "#4f46e5",
                        borderColor: "#c7d2fe",
                        whiteSpace: "nowrap",
                      }}>
                      Redeem
                    </Button>
                  )}
                  {isParent && (
                    <>
                      <IconButton
                        aria-label={`Edit ${reward.name}`}
                        title='Edit reward'
                        onClick={() => openEditDialog(reward)}
                        sx={{ color: "#615fff" }}>
                        <Pencil size={17} />
                      </IconButton>
                      <IconButton
                        aria-label={`Delete ${reward.name}`}
                        title='Delete reward'
                        onClick={() => setRewardToDelete(reward)}
                        sx={{
                          color: "#9ca3af",
                          "&:hover": {
                            color: "#dc2626",
                            bgcolor: "#fef2f2",
                          },
                        }}>
                        <Trash2 size={17} />
                      </IconButton>
                    </>
                  )}
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography variant='body2' sx={{ color: "#6b7280" }}>
            {isParent
              ? "Add a reward for your children to work toward."
              : "There are no rewards available yet."}
          </Typography>
        )}
      </Stack>

      <Dialog
        open={isParent && isDialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth='xs'
        sx={{
          "& .MuiBackdrop-root": {
            backdropFilter: "blur(5px)",
            bgcolor: "rgba(31,41,55,0.2)",
          },
        }}>
        <Box component='form' onSubmit={submitReward} noValidate>
          <DialogTitle sx={{ color: "#1f2937", fontWeight: 700 }}>
            {dialogReward ? "Edit reward" : "Add reward"}
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
                label='Reward name'
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                slotProps={{ htmlInput: { maxLength: 80 } }}
              />
              <TextField
                required
                fullWidth
                type='number'
                label='Golds required'
                value={form.goldCost}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    goldCost: event.target.value,
                  }))
                }
                slotProps={{ htmlInput: { min: 1, step: 1 } }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={closeDialog} sx={{ color: "#6b7280" }}>
              Cancel
            </Button>
            <Button
              type='submit'
              variant='contained'
              sx={{ bgcolor: "#615fff", "&:hover": { bgcolor: "#4f46e5" } }}>
              {dialogReward ? "Save reward" : "Add reward"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Dialog
        open={isParent && Boolean(rewardToDelete)}
        onClose={() => setRewardToDelete(null)}
        sx={{
          "& .MuiBackdrop-root": {
            backdropFilter: "blur(4px)",
            bgcolor: "rgba(31,41,55,0.2)",
          },
        }}>
        <DialogTitle sx={{ color: "#1f2937", fontWeight: 700 }}>
          Delete reward?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#6b7280" }}>
            Remove {rewardToDelete?.name} from the reward store? This cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setRewardToDelete(null)}
            sx={{ color: "#6b7280" }}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={deleteReward}
            sx={{ bgcolor: "#dc2626", "&:hover": { bgcolor: "#b91c1c" } }}>
            Delete reward
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

RewardStorePanel.propTypes = {
  isParent: PropTypes.bool.isRequired,
  rewards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      goldCost: PropTypes.number.isRequired,
    }),
  ).isRequired,
  childGold: PropTypes.number.isRequired,
  onAddReward: PropTypes.func.isRequired,
  onEditReward: PropTypes.func.isRequired,
  onDeleteReward: PropTypes.func.isRequired,
  onRedeemReward: PropTypes.func.isRequired,
};
