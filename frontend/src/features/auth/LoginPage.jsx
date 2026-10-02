import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { toast } from "react-toastify";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[A-Za-z0-9]+(?:[._][A-Za-z0-9]+)*$/;

export default function LoginPage({
  onLogin,
  onRegister,
  takenUsernames = [],
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmation: "",
  });
  const [registerErrors, setRegisterErrors] = useState({});
  const [visibleRegisterPasswords, setVisibleRegisterPasswords] = useState({
    password: false,
    confirmation: false,
  });

  const signIn = (event) => {
    event.preventDefault();
    if (!onLogin(username, password)) {
      setError("The name or password is incorrect. Please try again.");
      toast.error("The name or password is incorrect. Please try again.");
      return;
    }
    setError("");
  };

  const updateRegisterField = (event) => {
    const { name, value } = event.target;
    setRegisterForm((current) => ({ ...current, [name]: value }));
    setRegisterErrors((current) => ({ ...current, [name]: "" }));
  };

  const toggleRegisterPassword = (field) => {
    setVisibleRegisterPasswords((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  const submitRegistration = (event) => {
    event.preventDefault();
    const errors = {};
    const normalizedUsername = registerForm.username.trim().replace(/^@+/, "");
    if (!registerForm.firstName.trim()) {
      errors.firstName = "Enter your first name.";
    }
    if (!registerForm.lastName.trim()) {
      errors.lastName = "Enter your last name.";
    }
    if (
      normalizedUsername.length < 1 ||
      normalizedUsername.length > 30 ||
      !usernamePattern.test(normalizedUsername)
    ) {
      errors.username =
        "Use 1–30 letters or numbers, with periods or underscores only between characters.";
    } else if (
      takenUsernames.some(
        (taken) => taken.toLocaleLowerCase() === normalizedUsername.toLocaleLowerCase(),
      )
    ) {
      errors.username = "That username is already taken.";
    }
    if (!emailPattern.test(registerForm.email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (registerForm.password.length < 8) {
      errors.password = "Use at least 8 characters.";
    } else if (!/[A-Z]/.test(registerForm.password)) {
      errors.password = "Add at least one uppercase letter.";
    } else if (!/[a-z]/.test(registerForm.password)) {
      errors.password = "Add at least one lowercase letter.";
    } else if (!/\d/.test(registerForm.password)) {
      errors.password = "Add at least one number.";
    } else if (!/[^A-Za-z0-9]/.test(registerForm.password)) {
      errors.password = "Add at least one special character.";
    }
    if (registerForm.confirmation !== registerForm.password) {
      errors.confirmation = "The passwords do not match.";
    }
    setRegisterErrors(errors);
    if (Object.keys(errors).length) {
      toast.error(Object.values(errors)[0]);
      return;
    }

    const created = onRegister({
      firstName: registerForm.firstName.trim(),
      lastName: registerForm.lastName.trim(),
      username: normalizedUsername,
      email: registerForm.email.trim(),
      password: registerForm.password,
    });
    if (!created) {
      setRegisterErrors((current) => ({
        ...current,
        username: "That username is already taken.",
      }));
      toast.error("That username is already taken.");
      return;
    }
    setIsRegisterOpen(false);
    toast.success("Your account has been created.");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: 4,
        bgcolor: "#fff",
      }}>
      <Paper
        component='section'
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 360,
          px: { xs: 3, sm: 4 },
          py: 4,
          border: "1px solid #e5e7eb",
          borderRadius: 2,
          boxShadow: "0 8px 28px rgba(15, 23, 42, 0.06)",
        }}>
        <Stack
          component='form'
          onSubmit={signIn}
          spacing={2}
          noValidate
          aria-labelledby='login-title'>
          <Box
            sx={{
              alignSelf: "center",
              mx: "auto",
              mb: 0.5,
              width: 64,
              height: 64,
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              bgcolor: "#eef2ff",
              color: "#4f46e5",
            }}>
            <LockKeyhole size={30} aria-hidden='true' />
          </Box>
          <Typography
            id='login-title'
            component='h1'
            variant='h5'
            sx={{
              mb: 1,
              textAlign: "center",
              color: "#1f2937",
              fontWeight: 700,
            }}>
            Sign in
          </Typography>
          {error && (
            <Typography role='alert' variant='body2' sx={{ color: "#b91c1c" }}>
              {error}
            </Typography>
          )}
          <TextField
            autoFocus
            fullWidth
            required
            label='Name or username'
            autoComplete='username'
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
              setError("");
            }}
          />
          <TextField
            fullWidth
            required
            label='Password'
            type={showPassword ? "text" : "password"}
            autoComplete='current-password'
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((visible) => !visible)}
                      edge='end'>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{
              mt: 0.5,
              py: 1.1,
              bgcolor: "#615fff",
              "&:hover": { bgcolor: "#4f46e5" },
            }}>
            Sign in
          </Button>
          <Button
            type='button'
            onClick={() =>
              toast.info("Password recovery is not configured for this demo.")
            }
            sx={{
              alignSelf: "center",
              color: "#4f46e5",
              fontSize: 14,
              fontWeight: 500,
            }}>
            Forgot password?
          </Button>
          <Typography
            variant='body2'
            sx={{ textAlign: "center", color: "#6b7280" }}>
            New to Chorewars?{" "}
            <Button
              type='button'
              onClick={() => {
                setRegisterErrors({});
                setIsRegisterOpen(true);
              }}
              sx={{
                minWidth: 0,
                p: 0,
                verticalAlign: "baseline",
                color: "#4f46e5",
                fontWeight: 700,
              }}>
              Create account
            </Button>
          </Typography>
        </Stack>
      </Paper>
      <Dialog
        open={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        fullWidth
        maxWidth='sm'>
        <Box component='form' onSubmit={submitRegistration} noValidate>
          <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>
            Create your account
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Typography variant='body2' sx={{ color: "#6b7280" }}>
                Set up your Chorewars parent profile.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextField
                  autoFocus
                  fullWidth
                  required
                  label='First name'
                  name='firstName'
                  value={registerForm.firstName}
                  onChange={updateRegisterField}
                  error={Boolean(registerErrors.firstName)}
                  helperText={registerErrors.firstName}
                />
                <TextField
                  fullWidth
                  required
                  label='Last name'
                  name='lastName'
                  value={registerForm.lastName}
                  onChange={updateRegisterField}
                  error={Boolean(registerErrors.lastName)}
                  helperText={registerErrors.lastName}
                />
              </Stack>
              <TextField
                fullWidth
                required
                label='Username'
                name='username'
                value={registerForm.username}
                onChange={updateRegisterField}
                error={Boolean(registerErrors.username)}
                helperText={
                  registerErrors.username ||
                  "1–30 characters: letters, numbers, periods, or underscores."
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>@</InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                fullWidth
                required
                type='email'
                label='Email address'
                name='email'
                autoComplete='email'
                value={registerForm.email}
                onChange={updateRegisterField}
                error={Boolean(registerErrors.email)}
                helperText={registerErrors.email}
              />
              <TextField
                fullWidth
                required
                label='Password'
                name='password'
                autoComplete='new-password'
                type={visibleRegisterPasswords.password ? "text" : "password"}
                value={registerForm.password}
                onChange={updateRegisterField}
                error={Boolean(registerErrors.password)}
                helperText={
                  registerErrors.password ||
                  "At least 8 characters, including uppercase and lowercase letters, a number, and a special character."
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label={
                            visibleRegisterPasswords.password
                              ? "Hide registration password"
                              : "Show registration password"
                          }
                          onClick={() => toggleRegisterPassword("password")}
                          edge='end'>
                          {visibleRegisterPasswords.password ? (
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
                label='Confirm password'
                name='confirmation'
                autoComplete='new-password'
                type={
                  visibleRegisterPasswords.confirmation ? "text" : "password"
                }
                value={registerForm.confirmation}
                onChange={updateRegisterField}
                error={Boolean(registerErrors.confirmation)}
                helperText={registerErrors.confirmation}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label={
                            visibleRegisterPasswords.confirmation
                              ? "Hide password confirmation"
                              : "Show password confirmation"
                          }
                          onClick={() =>
                            toggleRegisterPassword("confirmation")
                          }
                          edge='end'>
                          {visibleRegisterPasswords.confirmation ? (
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
            <Button onClick={() => setIsRegisterOpen(false)}>Cancel</Button>
            <Button
              type='submit'
              variant='contained'
              sx={{ bgcolor: "#615fff", "&:hover": { bgcolor: "#4f46e5" } }}>
              Create account
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
  takenUsernames: PropTypes.arrayOf(PropTypes.string),
};
