/*
 * AccountSettings provides responsive profile, household, and security forms
 * so household members have a dedicated place to manage account preferences.
 */
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Camera,
  Eye,
  EyeOff,
  Pencil,
  Home,
  Mail,
  Plus,
  Save,
  Send,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import Card from "../../components/Card";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[A-Za-z0-9]+(?:[._][A-Za-z0-9]+)*$/;

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1,
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#615fff",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#4f46e5" },
};

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          borderRadius: 1,
          bgcolor: "#eef2ff",
          color: "#4f46e5",
        }}>
        <Icon size={18} aria-hidden='true' />
      </Box>
      <Box>
        <Typography variant='subtitle1' sx={{ color: "#1f2937", fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant='body2' sx={{ color: "#6b7280", mt: 0.25 }}>
          {description}
        </Typography>
      </Box>
    </Box>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <Box
      sx={{
        border: "1px solid #e5e7eb",
        borderRadius: 1,
        px: 1.5,
        py: 1,
        minHeight: 58,
      }}>
      <Typography
        variant='caption'
        sx={{ display: "block", color: "#6b7280", lineHeight: 1.3 }}>
        {label}
      </Typography>
      <Typography
        variant='body2'
        sx={{ color: value ? "#1f2937" : "#9ca3af", mt: 0.35 }}>
        {value || "Not set"}
      </Typography>
    </Box>
  );
}

ReadOnlyField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

SectionHeading.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

function ProfilePicture({
  name,
  photoUrl,
  color,
  onChange,
  onRemove,
  showAvatar = true,
  onPreview,
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      sx={{ alignItems: { sm: "center" } }}>
      {showAvatar && (
        <Avatar
          component={photoUrl ? "button" : "div"}
          type={photoUrl ? "button" : undefined}
          src={photoUrl || undefined}
          alt={`${name}'s profile picture`}
          aria-label={photoUrl ? `View ${name}'s profile picture` : undefined}
          onClick={photoUrl ? () => onPreview(photoUrl, name) : undefined}
          sx={{
            width: 56,
            height: 56,
            bgcolor: color || "#eef2ff",
            color: "#fff",
            border: 0,
            p: 0,
            cursor: "default",
          }}>
          {!photoUrl && <UserRound size={24} />}
        </Avatar>
      )}
      <Box sx={{ flex: 1 }}>
        <Typography variant='body2' sx={{ color: "#1f2937", fontWeight: 600 }}>
          Display picture
        </Typography>
        <Typography
          variant='caption'
          sx={{ display: "block", color: "#6b7280", mt: 0.25 }}>
          JPEG or PNG only. Square or non-square images are accepted; the
          shorter side must be at least 400 pixels (max 2 MB). Crop to a square
          in the next step.
        </Typography>
        <Stack
          direction='row'
          spacing={1}
          sx={{ mt: 0.75, flexWrap: "wrap" }}>
          <Button
            component='label'
            size='small'
            startIcon={<Camera size={15} />}
            sx={{
              color: "#4f46e5",
              "&:hover": { bgcolor: "#eef2ff" },
            }}>
            {photoUrl ? "Change picture" : "Upload picture"}
            <input
              hidden
              type='file'
              accept='image/jpeg,image/png,.jpg,.jpeg,.png'
              aria-label={`Upload ${name}'s JPEG or PNG profile picture. Square or non-square images accepted, shorter side at least 400 pixels, max 2 MB.`}
              onChange={onChange}
            />
          </Button>
          {photoUrl && (
            <Button
              size='small'
              color='error'
              startIcon={<Trash2 size={14} />}
              onClick={onRemove}>
              Remove picture
            </Button>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}

ProfilePicture.propTypes = {
  name: PropTypes.string.isRequired,
  photoUrl: PropTypes.string,
  color: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  showAvatar: PropTypes.bool,
  onPreview: PropTypes.func.isRequired,
};

function PasswordStatusField({ onChangePassword }) {
  return (
    <TextField
      fullWidth
      label='Password'
      value='••••••••'
      slotProps={{
        htmlInput: {
          readOnly: true,
          "aria-label": "Password, hidden",
        },
        input: {
          endAdornment: (
            <InputAdornment position='end'>
              <Button
                size='small'
                onClick={onChangePassword}
                sx={{ color: "#4f46e5", whiteSpace: "nowrap" }}>
                Change password
              </Button>
            </InputAdornment>
          ),
        },
      }}
      sx={fieldSx}
    />
  );
}

PasswordStatusField.propTypes = {
  onChangePassword: PropTypes.func.isRequired,
};

export default function AccountSettings({
  userName = "",
  email = "",
  profile: profileDetails = {},
  takenUsernames = [],
  onSaveProfile = () => {},
  householdName = "Sarabhai's",
  childProfiles = [],
  isParent = false,
  onSaveHouseholdName = () => {},
  onAddChild = () => false,
  onRemoveChild = () => {},
  onUpdateChildPhoto = () => {},
  userPhotoUrl = "",
  currentChildPhotoUrl = "",
  onUpdateOwnPhoto = () => {},
}) {
  const [profile, setProfile] = useState({
    firstName: profileDetails.firstName || userName.split(/\s+/)[0] || "",
    lastName:
      profileDetails.lastName ||
      userName.split(/\s+/).slice(1).join(" ") ||
      "",
    username:
      profileDetails.username || userName.replace(/^@+/, "").toLowerCase(),
    email: profileDetails.email ?? email,
  });
  const [householdNameDraft, setHouseholdNameDraft] = useState(householdName);
  const [profileErrors, setProfileErrors] = useState({});
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [newChildName, setNewChildName] = useState("");
  const [childError, setChildError] = useState("");
  const [removeTarget, setRemoveTarget] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);
  const [photoToCrop, setPhotoToCrop] = useState(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [cropViewportSize, setCropViewportSize] = useState(260);
  const cropViewportRef = useRef(null);
  const cropDragRef = useRef(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingHousehold, setIsEditingHousehold] = useState(false);
  const [password, setPassword] = useState({
    current: "",
    next: "",
    confirmation: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [visiblePasswords, setVisiblePasswords] = useState({
    current: false,
    next: false,
    confirmation: false,
  });

  useEffect(() => {
    if (!photoToCrop || !cropViewportRef.current) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      setCropViewportSize(entry.contentRect.width);
    });
    observer.observe(cropViewportRef.current);
    return () => observer.disconnect();
  }, [photoToCrop]);

  const updateProfile = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({
      ...current,
      [name]: name === "username" ? value.replace(/^@+/, "") : value,
    }));
    setProfileErrors((current) => ({ ...current, [name]: "" }));
  };

  const saveProfile = (event) => {
    event.preventDefault();
    const errors = {};
    if (!profile.firstName.trim()) {
      errors.firstName = "Enter your first name.";
    }
    if (!profile.lastName.trim()) {
      errors.lastName = "Enter your last name.";
    }
    if (
      profile.username.length < 1 ||
      profile.username.length > 30 ||
      !usernamePattern.test(profile.username)
    ) {
      errors.username =
        "Use 1–30 letters or numbers, with underscores or periods only between characters.";
    } else if (
      takenUsernames.some(
        (username) => username.toLowerCase() === profile.username.toLowerCase(),
      )
    ) {
      errors.username = "That username is already taken.";
    }
    if (!emailPattern.test(profile.email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    setProfileErrors(errors);
    if (Object.keys(errors).length) {
      toast.error(Object.values(errors)[0]);
      return;
    }
    const savedProfile = {
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      username: profile.username,
      email: profile.email.trim(),
    };
    setProfile(savedProfile);
    onSaveProfile(savedProfile);
    toast.success("Your profile information has been saved.");
    setIsEditingProfile(false);
  };

  const cancelProfileEdit = () => {
    setProfile({
      firstName: profileDetails.firstName || userName.split(/\s+/)[0] || "",
      lastName:
        profileDetails.lastName ||
        userName.split(/\s+/).slice(1).join(" ") ||
        "",
      username:
        profileDetails.username || userName.replace(/^@+/, "").toLowerCase(),
      email: profileDetails.email ?? email,
    });
    setProfileErrors({});
    setIsEditingProfile(false);
  };

  const saveHouseholdName = (event) => {
    event.preventDefault();
    const nextName = householdNameDraft.trim();
    if (!nextName) {
      setProfileErrors((current) => ({
        ...current,
        householdName: "Enter a household name.",
      }));
      toast.error("Enter a shared space name before saving.");
      return;
    }
    setProfileErrors((current) => ({ ...current, householdName: "" }));
    onSaveHouseholdName(nextName);
    toast.success("Your shared space name has been saved.");
    setIsEditingHousehold(false);
  };

  const cancelHouseholdEdit = () => {
    setHouseholdNameDraft(householdName);
    setProfileErrors((current) => ({ ...current, householdName: "" }));
    setIsEditingHousehold(false);
  };

  const addHouseholdChild = (event) => {
    event.preventDefault();
    if (!newChildName.trim()) {
      setChildError("Enter your child's name.");
      toast.error("Enter your child's name.");
      return;
    }
    if (!onAddChild(newChildName)) {
      setChildError("A child with that name already exists.");
      toast.error("A child with that name already exists.");
      return;
    }
    setNewChildName("");
    setChildError("");
    toast.success(
      `${newChildName.trim().split(/\s+/)[0]} was added to the household.`,
    );
  };

  const updatePhoto = (event, onUpdate) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Choose a JPEG or PNG image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Choose an image smaller than 2 MB.");
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(imageUrl);
      if (Math.min(image.width, image.height) < 400) {
        toast.error("Use an image with both sides at least 400 pixels.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPhotoToCrop({
            dataUrl: reader.result,
            mimeType: file.type,
            width: image.naturalWidth,
            height: image.naturalHeight,
            onUpdate,
          });
          setCropZoom(1);
          setCropOffset({ x: 0, y: 0 });
        } else {
          toast.error("The selected image could not be read.");
        }
      };
      reader.onerror = () => toast.error("The selected image could not be read.");
      reader.readAsDataURL(file);
    };
    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      toast.error("The selected image could not be opened.");
    };
    image.src = imageUrl;
  };

  const closePhotoCrop = () => {
    setPhotoToCrop(null);
    cropDragRef.current = null;
  };

  const clampCropOffset = (offset, zoom = cropZoom) => {
    const viewSize = cropViewportRef.current?.getBoundingClientRect().width ?? 260;
    const minSide = Math.min(photoToCrop?.width ?? 400, photoToCrop?.height ?? 400);
    const scale = (viewSize / minSide) * zoom;
    const maxOffsetX = Math.max(0, ((photoToCrop?.width ?? minSide) * scale - viewSize) / 2);
    const maxOffsetY = Math.max(0, ((photoToCrop?.height ?? minSide) * scale - viewSize) / 2);
    return {
      x: Math.max(-maxOffsetX, Math.min(maxOffsetX, offset.x)),
      y: Math.max(-maxOffsetY, Math.min(maxOffsetY, offset.y)),
    };
  };

  const updateCropZoom = (event) => {
    const zoom = Number(event.target.value);
    setCropZoom(zoom);
    setCropOffset((offset) => clampCropOffset(offset, zoom));
  };

  const startCropDrag = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    cropDragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      offset: cropOffset,
    };
  };

  const moveCrop = (event) => {
    const drag = cropDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setCropOffset(
      clampCropOffset({
        x: drag.offset.x + event.clientX - drag.x,
        y: drag.offset.y + event.clientY - drag.y,
      }),
    );
  };

  const finishCropDrag = (event) => {
    if (cropDragRef.current?.pointerId !== event.pointerId) return;
    cropDragRef.current = null;
  };

  const saveCroppedPhoto = () => {
    if (!photoToCrop || !cropViewportRef.current) return;
    const source = new Image();
    source.onload = () => {
      const viewSize = cropViewportRef.current?.getBoundingClientRect().width;
      if (!viewSize) {
        toast.error("The crop preview could not be measured. Please try again.");
        return;
      }
      const scale = (viewSize / Math.min(source.naturalWidth, source.naturalHeight)) * cropZoom;
      const displayWidth = source.naturalWidth * scale;
      const displayHeight = source.naturalHeight * scale;
      const imageLeft = (viewSize - displayWidth) / 2 + cropOffset.x;
      const imageTop = (viewSize - displayHeight) / 2 + cropOffset.y;
      const sourceSize = viewSize / scale;
      const sourceX = -imageLeft / scale;
      const sourceY = -imageTop / scale;
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 400;
      const context = canvas.getContext("2d");
      if (!context) {
        toast.error("Your browser could not prepare the cropped picture.");
        return;
      }
      try {
        context.drawImage(
          source,
          sourceX,
          sourceY,
          sourceSize,
          sourceSize,
          0,
          0,
          canvas.width,
          canvas.height,
        );
        const croppedPhoto = canvas.toDataURL(photoToCrop.mimeType);
        photoToCrop.onUpdate(croppedPhoto);
        closePhotoCrop();
        toast.success("Profile picture updated.");
      } catch {
        toast.error("The cropped picture could not be saved. Please try again.");
      }
    };
    source.onerror = () =>
      toast.error("The selected image could not be opened. Please try again.");
    source.src = photoToCrop.dataUrl;
  };

  const clearPhoto = (onUpdate) => {
    onUpdate("");
    toast.success("Profile picture removed.");
  };

  const sendInvite = (event) => {
    event.preventDefault();
    if (!emailPattern.test(inviteEmail.trim())) {
      setInviteError("Enter a valid email address.");
      toast.error("Enter a valid partner email address.");
      return;
    }
    setInviteError("");
    toast.success(`Partner invite prepared for ${inviteEmail.trim()}.`);
  };

  const updatePassword = (event) => {
    const { name, value } = event.target;
    setPassword((current) => ({ ...current, [name]: value }));
    setPasswordErrors((current) => ({ ...current, [name]: "" }));
  };

  const togglePasswordVisibility = (field) => {
    setVisiblePasswords((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  const openPasswordDialog = () => {
    setPasswordErrors({});
    setVisiblePasswords({
      current: false,
      next: false,
      confirmation: false,
    });
    setIsPasswordDialogOpen(true);
  };

  const savePassword = (event) => {
    event.preventDefault();
    const errors = {};
    if (!password.current) errors.current = "Enter your current password.";
    if (password.next.length < 8) {
      errors.next = "Use at least 8 characters for your new password.";
    } else if (!/[A-Z]/.test(password.next)) {
      errors.next = "Add at least one uppercase letter.";
    } else if (!/[a-z]/.test(password.next)) {
      errors.next = "Add at least one lowercase letter.";
    } else if (!/\d/.test(password.next)) {
      errors.next = "Add at least one number.";
    } else if (!/[^A-Za-z0-9]/.test(password.next)) {
      errors.next = "Add at least one special character.";
    }
    if (password.confirmation !== password.next) {
      errors.confirmation = "The passwords do not match.";
    }
    setPasswordErrors(errors);
    if (Object.keys(errors).length) {
      toast.error(Object.values(errors)[0]);
      return;
    }
    setPassword({ current: "", next: "", confirmation: "" });
    setVisiblePasswords({
      current: false,
      next: false,
      confirmation: false,
    });
    setIsPasswordDialogOpen(false);
    toast.success(
      "Password details passed validation. Connect account services to apply the change.",
    );
  };

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant='h5' sx={{ color: "#1f2937", fontWeight: 700 }}>
          Account Settings
        </Typography>
        <Typography variant='body2' sx={{ color: "#6b7280", mt: 0.5 }}>
          Manage your profile, household, and security preferences.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: 2,
          alignItems: "start",
        }}>
        <Card>
          <Box
            component='form'
            id='profile-settings-form'
            onSubmit={saveProfile}
            noValidate>
            <Stack spacing={2}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 1,
                }}>
                <SectionHeading
                  icon={UserRound}
                  title='Profile Information'
                  description='Manage your profile and display picture.'
                />
                {isParent && !isEditingProfile && (
                  <Button
                    type='button'
                    size='small'
                    startIcon={<Pencil size={15} />}
                    onClick={() => setIsEditingProfile(true)}
                    sx={{ color: "#4f46e5", flexShrink: 0 }}>
                    Edit
                  </Button>
                )}
              </Box>
              <ProfilePicture
                name={userName || "Your"}
                photoUrl={isParent ? userPhotoUrl : currentChildPhotoUrl}
                onChange={(event) =>
                  updatePhoto(event, (photo) => onUpdateOwnPhoto(photo))
                }
                onRemove={() => clearPhoto(() => onUpdateOwnPhoto(""))}
                onPreview={(photoUrl, name) =>
                  setPicturePreview({ photoUrl, name })
                }
              />
              {isParent ? isEditingProfile ? (
                <>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <TextField
                      fullWidth
                      required
                      label='First name'
                      name='firstName'
                      value={profile.firstName}
                      onChange={updateProfile}
                      error={Boolean(profileErrors.firstName)}
                      helperText={profileErrors.firstName}
                      sx={fieldSx}
                    />
                    <TextField
                      fullWidth
                      required
                      label='Last name'
                      name='lastName'
                      value={profile.lastName}
                      onChange={updateProfile}
                      error={Boolean(profileErrors.lastName)}
                      helperText={profileErrors.lastName}
                      sx={fieldSx}
                    />
                  </Stack>
                  <TextField
                    fullWidth
                    required
                    label='Username'
                    name='username'
                    onChange={updateProfile}
                    error={Boolean(profileErrors.username)}
                    helperText={
                      profileErrors.username ||
                      "1–30 characters: letters, numbers, periods, or underscores. Separators must be between letters or numbers."
                    }
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position='start'>@</InputAdornment>
                        ),
                      },
                    }}
                    value={profile.username}
                    sx={fieldSx}
                  />
                  <PasswordStatusField onChangePassword={openPasswordDialog} />
                  <TextField
                    fullWidth
                    required
                    type='email'
                    label='Email address'
                    name='email'
                    value={profile.email}
                    onChange={updateProfile}
                    error={Boolean(profileErrors.email)}
                    helperText={profileErrors.email}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Mail
                              size={17}
                              color='#9ca3af'
                              aria-hidden='true'
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={fieldSx}
                  />
                  {isEditingProfile && (
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}>
                      <Button
                        type='submit'
                        variant='contained'
                        startIcon={<Save size={17} />}
                        sx={{
                          bgcolor: "#615fff",
                          "&:hover": { bgcolor: "#4f46e5" },
                        }}>
                        Save Changes
                      </Button>
                      <Button
                        type='button'
                        startIcon={<X size={16} />}
                        onClick={cancelProfileEdit}
                        sx={{ color: "#6b7280" }}>
                        Cancel
                      </Button>
                    </Stack>
                  )}
                </>
              ) : (
                <Stack spacing={1}>
                  <ReadOnlyField label='First name' value={profile.firstName} />
                  <ReadOnlyField label='Last name' value={profile.lastName} />
                  <ReadOnlyField
                    label='Username'
                    value={`@${profile.username}`}
                  />
                  <PasswordStatusField onChangePassword={openPasswordDialog} />
                  <ReadOnlyField label='Email address' value={profile.email} />
                </Stack>
              ) : (
                <Stack spacing={1}>
                  <ReadOnlyField label='First name' value={profile.firstName} />
                  <ReadOnlyField label='Last name' value={profile.lastName} />
                  <ReadOnlyField
                    label='Username'
                    value={`@${profile.username}`}
                  />
                  <PasswordStatusField onChangePassword={openPasswordDialog} />
                  <ReadOnlyField label='Email address' value={profile.email} />
                </Stack>
              )}
            </Stack>
          </Box>
        </Card>

        <Card>
          <Stack spacing={2}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 1,
              }}>
              <SectionHeading
                icon={Home}
                title='Household Details'
                description='Manage your shared space and the children in your household.'
              />
              {isParent && !isEditingHousehold && (
                <Button
                  type='button'
                  size='small'
                  startIcon={<Pencil size={15} />}
                  onClick={() => setIsEditingHousehold(true)}
                  sx={{ color: "#4f46e5", flexShrink: 0 }}>
                  Edit
                </Button>
              )}
            </Box>
            {isParent ? (
              <Box component='form' onSubmit={saveHouseholdName} noValidate>
                <Stack spacing={1.25}>
                  {isEditingHousehold ? (
                    <TextField
                      fullWidth
                      required
                      label='Shared space name'
                      name='householdName'
                      value={householdNameDraft}
                      error={Boolean(profileErrors.householdName)}
                      helperText={profileErrors.householdName}
                      onChange={(event) => {
                        setHouseholdNameDraft(event.target.value);
                      }}
                      sx={fieldSx}
                    />
                  ) : (
                    <ReadOnlyField
                      label='Shared space name'
                      value={householdName || "No space yet"}
                    />
                  )}
                  {isEditingHousehold && (
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}>
                      <Button
                        type='submit'
                        variant='contained'
                        startIcon={<Save size={17} />}
                        sx={{
                          bgcolor: "#615fff",
                          "&:hover": { bgcolor: "#4f46e5" },
                        }}>
                        Save shared space
                      </Button>
                      <Button
                        type='button'
                        startIcon={<X size={16} />}
                        onClick={cancelHouseholdEdit}
                        sx={{ color: "#6b7280" }}>
                        Cancel
                      </Button>
                    </Stack>
                  )}
                </Stack>
              </Box>
            ) : (
              <Typography variant='body2' sx={{ color: "#374151" }}>
                {householdName}
              </Typography>
            )}
            <Box>
              <Typography
                variant='body2'
                sx={{ color: "#374151", fontWeight: 600, mb: 1 }}>
                Children
              </Typography>
              {childProfiles.length ? (
                <Stack spacing={1}>
                  {childProfiles.map((child) => (
                    <Box
                      key={child.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        border: "1px solid #e5e7eb",
                        borderRadius: 1,
                        p: 1,
                      }}>
                      <Avatar
                        component={child.photoUrl ? "button" : "div"}
                        type={child.photoUrl ? "button" : undefined}
                        src={child.photoUrl || undefined}
                        alt={`${child.firstName || child.name.split(/\s+/)[0]}'s profile picture`}
                        aria-label={
                          child.photoUrl
                            ? `View ${child.firstName || child.name.split(/\s+/)[0]}'s profile picture`
                            : undefined
                        }
                        onClick={
                          child.photoUrl
                            ? () =>
                                setPicturePreview({
                                  photoUrl: child.photoUrl,
                                  name: child.firstName || child.name.split(/\s+/)[0],
                                })
                            : undefined
                        }
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: child.color || "#eef2ff",
                          color: "#fff",
                          border: 0,
                          p: 0,
                          cursor: "default",
                        }}>
                        {!child.photoUrl && <UserRound size={20} />}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant='body2'
                          sx={{ color: "#1f2937", fontWeight: 600 }}>
                          {child.firstName || child.name.split(/\s+/)[0]}
                        </Typography>
                        {isParent && isEditingHousehold ? (
                          <ProfilePicture
                            name={child.firstName || child.name.split(/\s+/)[0]}
                            photoUrl={child.photoUrl}
                            color={child.color}
                            showAvatar={false}
                            onChange={(event) =>
                              updatePhoto(event, (photo) =>
                                onUpdateChildPhoto(child.id, photo),
                              )
                            }
                            onRemove={() =>
                              clearPhoto(() =>
                                onUpdateChildPhoto(child.id, ""),
                              )
                            }
                            onPreview={(photoUrl, name) =>
                              setPicturePreview({ photoUrl, name })
                            }
                          />
                        ) : null}
                      </Box>
                      {isParent && isEditingHousehold && (
                        <IconButton
                          aria-label={`Remove ${child.firstName || child.name.split(/\s+/)[0]}`}
                          onClick={() => setRemoveTarget(child)}
                          disabled={!isEditingHousehold}
                          sx={{
                            color: "#9ca3af",
                            "&:hover": { color: "#dc2626", bgcolor: "#fef2f2" },
                          }}>
                          <Trash2 size={18} />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography variant='body2' sx={{ color: "#6b7280" }}>
                  No children have been added yet.
                </Typography>
              )}
              {isParent && isEditingHousehold && (
                <Box
                  component='form'
                  onSubmit={addHouseholdChild}
                  noValidate
                  sx={{ mt: 1.5 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    sx={{ alignItems: { sm: "flex-start" } }}>
                    <TextField
                      fullWidth
                      size='small'
                      label="Child's name"
                      value={newChildName}
                      onChange={(event) => {
                        setNewChildName(event.target.value);
                        setChildError("");
                      }}
                      error={Boolean(childError)}
                      helperText={childError}
                      sx={fieldSx}
                    />
                    <Button
                      type='submit'
                      variant='outlined'
                      startIcon={<Plus size={17} />}
                      sx={{
                        minHeight: 40,
                        flexShrink: 0,
                        borderColor: "#c7d2fe",
                        color: "#4f46e5",
                      }}>
                      Add child
                    </Button>
                  </Stack>
                </Box>
              )}
            </Box>
            {isParent && isEditingHousehold && (
              <Box component='form' onSubmit={sendInvite} noValidate>
                <Stack spacing={1.25}>
                  <Typography
                    variant='body2'
                    sx={{ color: "#374151", fontWeight: 600 }}>
                    Invite your partner
                  </Typography>
                  <TextField
                    fullWidth
                    type='email'
                    label='Partner email address'
                    value={inviteEmail}
                    onChange={(event) => {
                      setInviteEmail(event.target.value);
                      setInviteError("");
                    }}
                    error={Boolean(inviteError)}
                    helperText={
                      inviteError ||
                      "They can join your household using this email."
                    }
                    sx={fieldSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Mail
                              size={17}
                              color='#9ca3af'
                              aria-hidden='true'
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <Button
                    type='submit'
                    variant='outlined'
                    startIcon={<Send size={16} />}
                    sx={{
                      alignSelf: { xs: "stretch", sm: "flex-start" },
                      borderColor: "#c7d2fe",
                      color: "#4f46e5",
                      "&:hover": {
                        borderColor: "#818cf8",
                        bgcolor: "#eef2ff",
                      },
                    }}>
                    Send invite
                  </Button>
                </Stack>
              </Box>
            )}
          </Stack>
        </Card>

      </Box>

      <Dialog
        open={Boolean(picturePreview)}
        onClose={() => setPicturePreview(null)}
        fullWidth
        maxWidth='sm'>
        <DialogTitle sx={{ pr: 7 }}>
          {picturePreview?.name}&apos;s display picture
          <IconButton
            aria-label='Close picture preview'
            onClick={() => setPicturePreview(null)}
            sx={{ position: "absolute", top: 10, right: 12, color: "#6b7280" }}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: "grid", placeItems: "center", pb: 3 }}>
          {picturePreview && (
            <Box
              component='img'
              src={picturePreview.photoUrl}
              alt={`${picturePreview.name}'s enlarged profile picture`}
              sx={{
                display: "block",
                width: "min(100%, 480px)",
                maxHeight: "min(65vh, 480px)",
                aspectRatio: "1 / 1",
                objectFit: "contain",
                borderRadius: 2,
                bgcolor: "#f3f4f6",
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(photoToCrop)}
        onClose={closePhotoCrop}
        fullWidth
        maxWidth='sm'>
        <DialogTitle>Crop your display picture</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Typography variant='body2' sx={{ color: "#6b7280" }}>
            Drag the image to reposition it and use the slider to zoom. You
            can crop non-square images; the circle shows exactly what will
            appear in your profile.
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 2, sm: 4 },
                flexWrap: "wrap",
              }}>
              <Box
                ref={cropViewportRef}
                role='img'
                aria-label='Image crop area. Drag to reposition the picture inside the circular guide.'
                onPointerDown={startCropDrag}
                onPointerMove={moveCrop}
                onPointerUp={finishCropDrag}
                onPointerCancel={finishCropDrag}
                sx={{
                  position: "relative",
                  width: { xs: 240, sm: 260 },
                  height: { xs: 240, sm: 260 },
                  maxWidth: "100%",
                  overflow: "hidden",
                  borderRadius: 1,
                  bgcolor: "#111827",
                  cursor: "grab",
                  touchAction: "none",
                  userSelect: "none",
                  "&:active": { cursor: "grabbing" },
                }}>
                {photoToCrop && (
                  <Box
                    component='img'
                    src={photoToCrop.dataUrl}
                    alt=''
                    draggable={false}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: `${(photoToCrop.width / Math.min(photoToCrop.width, photoToCrop.height)) * cropViewportSize * cropZoom}px`,
                      height: `${(photoToCrop.height / Math.min(photoToCrop.width, photoToCrop.height)) * cropViewportSize * cropZoom}px`,
                      maxWidth: "none",
                      transform: `translate(calc(-50% + ${cropOffset.x}px), calc(-50% + ${cropOffset.y}px))`,
                      pointerEvents: "none",
                    }}
                  />
                )}
                <Box
                  aria-hidden='true'
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle, transparent 69%, rgba(15, 23, 42, 0.62) 70%)",
                    pointerEvents: "none",
                  }}
                />
                <Box
                  aria-hidden='true'
                  sx={{
                    position: "absolute",
                    inset: 0,
                    border: "2px solid rgba(255, 255, 255, 0.95)",
                    borderRadius: "50%",
                    boxShadow: "0 0 0 1px rgba(79, 70, 229, 0.7)",
                    pointerEvents: "none",
                  }}
                />
              </Box>
              <Stack
                spacing={1}
                sx={{ alignItems: "center", minWidth: 130, maxWidth: "100%" }}>
                <Box
                  sx={{
                    position: "relative",
                    width: 104,
                    height: 104,
                    flexShrink: 0,
                    overflow: "hidden",
                    borderRadius: "50%",
                    bgcolor: "#eef2ff",
                    border: "3px solid #c7d2fe",
                  }}>
                  {photoToCrop && (
                    <Box
                      component='img'
                      src={photoToCrop.dataUrl}
                      alt='Live circular display picture preview'
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: `${(photoToCrop.width / Math.min(photoToCrop.width, photoToCrop.height)) * 104 * cropZoom}px`,
                        height: `${(photoToCrop.height / Math.min(photoToCrop.width, photoToCrop.height)) * 104 * cropZoom}px`,
                        maxWidth: "none",
                        objectFit: "cover",
                        transform: `translate(calc(-50% + ${(cropOffset.x / cropViewportSize) * 104}px), calc(-50% + ${(cropOffset.y / cropViewportSize) * 104}px))`,
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </Box>
                <Typography
                  variant='body2'
                  sx={{ color: "#1f2937", fontWeight: 600, textAlign: "center" }}>
                  Circular preview
                </Typography>
                <Typography
                  variant='caption'
                  sx={{ color: "#6b7280", textAlign: "center" }}>
                  This is how your display picture will look.
                </Typography>
              </Stack>
            </Box>
            <Box>
              <Typography
                component='label'
                htmlFor='profile-picture-zoom'
                variant='body2'
                sx={{ display: "block", color: "#374151", fontWeight: 600 }}>
                Zoom
              </Typography>
              <Box
                id='profile-picture-zoom'
                component='input'
                type='range'
                min='1'
                max='3'
                step='0.01'
                value={cropZoom}
                onChange={updateCropZoom}
                aria-label='Zoom profile picture'
                sx={{ width: "100%", accentColor: "#615fff", mt: 0.75 }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closePhotoCrop}>Cancel</Button>
          <Button
            variant='contained'
            onClick={saveCroppedPhoto}
            sx={{ bgcolor: "#615fff", "&:hover": { bgcolor: "#4f46e5" } }}>
            Use this picture
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(removeTarget)}
        onClose={() => setRemoveTarget(null)}
        fullWidth
        maxWidth='xs'>
        <DialogTitle>
          Remove{" "}
          {removeTarget?.firstName || removeTarget?.name.split(/\s+/)[0]}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This removes the child profile, points, completed-task history, and
            tasks assigned to them from this household. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRemoveTarget(null)}>Cancel</Button>
          <Button
            color='error'
            variant='contained'
            onClick={() => {
              onRemoveChild(removeTarget.id);
              toast.success(
                `${removeTarget.firstName || removeTarget.name.split(/\s+/)[0]} was removed from the household.`,
              );
              setRemoveTarget(null);
            }}>
            Remove child
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
        fullWidth
        maxWidth='sm'>
        <Box component='form' onSubmit={savePassword} noValidate>
          <DialogTitle>Change password</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                fullWidth
                required
                type={visiblePasswords.current ? "text" : "password"}
                label='Current password'
                name='current'
                value={password.current}
                onChange={updatePassword}
                error={Boolean(passwordErrors.current)}
                helperText={passwordErrors.current}
                sx={fieldSx}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label={
                            visiblePasswords.current
                              ? "Hide current password"
                              : "Show current password"
                          }
                          onClick={() => togglePasswordVisibility("current")}
                          edge='end'>
                          {visiblePasswords.current ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                fullWidth
                required
                type={visiblePasswords.next ? "text" : "password"}
                label='New password'
                name='next'
                value={password.next}
                onChange={updatePassword}
                error={Boolean(passwordErrors.next)}
                helperText={
                  passwordErrors.next ||
                  "At least 8 characters, including uppercase and lowercase letters, a number, and a special character."
                }
                sx={fieldSx}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label={
                            visiblePasswords.next
                              ? "Hide new password"
                              : "Show new password"
                          }
                          onClick={() => togglePasswordVisibility("next")}
                          edge='end'>
                          {visiblePasswords.next ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                fullWidth
                required
                type={visiblePasswords.confirmation ? "text" : "password"}
                label='Confirm new password'
                name='confirmation'
                value={password.confirmation}
                onChange={updatePassword}
                error={Boolean(passwordErrors.confirmation)}
                helperText={passwordErrors.confirmation}
                sx={fieldSx}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label={
                            visiblePasswords.confirmation
                              ? "Hide password confirmation"
                              : "Show password confirmation"
                          }
                          onClick={() =>
                            togglePasswordVisibility("confirmation")
                          }
                          edge='end'>
                          {visiblePasswords.confirmation ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setIsPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type='submit'
              variant='contained'
              sx={{ bgcolor: "#615fff", "&:hover": { bgcolor: "#4f46e5" } }}>
              Update password
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Stack>
  );
}

AccountSettings.propTypes = {
  userName: PropTypes.string,
  email: PropTypes.string,
  profile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
  }),
  takenUsernames: PropTypes.arrayOf(PropTypes.string),
  onSaveProfile: PropTypes.func,
  householdName: PropTypes.string,
  childProfiles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      firstName: PropTypes.string,
      username: PropTypes.string,
      color: PropTypes.string,
      photoUrl: PropTypes.string,
    }),
  ),
  isParent: PropTypes.bool,
  onSaveHouseholdName: PropTypes.func,
  onAddChild: PropTypes.func,
  onRemoveChild: PropTypes.func,
  onUpdateChildPhoto: PropTypes.func,
  userPhotoUrl: PropTypes.string,
  currentChildPhotoUrl: PropTypes.string,
  onUpdateOwnPhoto: PropTypes.func,
};
