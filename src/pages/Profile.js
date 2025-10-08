import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Switch,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Delete, Logout } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { clearUser } from "../store";
import { useState } from "react";

const Profile = ({ user }) => {
  const dispatch = useDispatch();
  const [appearance, setAppearance] = useState("System (light)");
  const [language, setLanguage] = useState("Default");
  const [responseLang, setResponseLang] = useState("Automatic (detect input)");
  const [autosuggest, setAutosuggest] = useState(true);
  const [intro, setIntro] = useState("");
  const [location, setLocation] = useState("");
  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography>Please log in to view your profile.</Typography>
      </Container>
    );
  }
  // console.log(user.username)

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* -------- Account Section -------- */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Account
      </Typography>

      {/* Top Profile */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar src={user.picture} sx={{ width: 64, height: 64, mr: 2 }}>
            {user.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body1">{user.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {user.username}
            </Typography>
          </Box>
        </Box>
        <Button size="small" variant="outlined">
          Change avatar
        </Button>
      </Box>

      {/* Full Name */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Full Name
          </Typography>
          <Typography variant="body1">{user.name}</Typography>
        </Box>
        <Button size="small" variant="outlined">
          Change full name
        </Button>
      </Box>

      {/* Username */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Username
          </Typography>
          <Typography variant="body1">{user.username}</Typography>
        </Box>
        <Button size="small" variant="outlined">
          Change username
        </Button>
      </Box>

      {/* Email */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Email
        </Typography>
        <Typography variant="body1">{user.email}</Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* -------- Preferences Section -------- */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Preferences
      </Typography>

      {/* Appearance */}
      <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}>
        <Typography variant="subtitle2" color="text.secondary">
          <strong>Appearance</strong>
          <p style={{ marginTop: 0, marginBottom: 0 }}>How Perplexity looks on your device</p>

        </Typography>
        <FormControl size="small" sx={{ mt: 1 }}>
          <Select
            value={appearance}
            onChange={(e) => setAppearance(e.target.value)}
          >
            <MenuItem value="System (light)">System (light)</MenuItem>
            <MenuItem value="Dark">Dark</MenuItem>
            <MenuItem value="Light">Light</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Language */}
      <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}>
        <Typography variant="subtitle2" color="text.secondary">
          <strong>Language</strong>
          <p style={{ marginTop: 0, marginBottom: 0 }}>The language used in the user interface</p>
        </Typography>
        <FormControl size="small" sx={{ mt: 1 }}>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <MenuItem value="Default">Default</MenuItem>
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Hindi">Hindi</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Preferred response language */}
      <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}>
        <Typography variant="subtitle2" color="text.secondary">
          <strong>Preferred response language</strong>
          <p style={{ marginTop: 0, marginBottom: 0 }}>The language used for AI responses</p>
        </Typography>
        <FormControl size="small" sx={{ mt: 1 }}>
          <Select
            value={responseLang}
            onChange={(e) => setResponseLang(e.target.value)}
          >
            <MenuItem value="Automatic (detect input)">
              Automatic (detect input)
            </MenuItem>
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Hindi">Hindi</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Autosuggest */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          <strong>Autosuggest</strong>
          <p style={{ marginTop: 0, marginBottom: 0 }}>Enable dropdown and tab-complete suggestions while typing a query</p>
        </Typography>
        <Switch
          checked={autosuggest}
          onChange={() => setAutosuggest(!autosuggest)}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
        <strong>Homepage widgets</strong>
        <p style={{ marginTop: 0, marginBottom: 0 }}>Enable personalized widgets on the homepage</p>
        </Typography>
        <Switch
          checked={autosuggest}
          onChange={() => setAutosuggest(!autosuggest)}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* -------- Personalization Section -------- */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Personalization
      </Typography>

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        <strong>Introduce yourself</strong>
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={2}
        value={intro}
        onChange={(e) => setIntro(e.target.value)}
        placeholder="I’m a software engineer who likes to play guitar and go hiking."
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: "flex", gap: 2, justifyContent: "end" }}>
        <Button
          variant="outlined"
          onClick={() => setIntro("")}
        >
          Clear
        </Button>
        <Button variant="contained" color="primary">
          Save
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          <strong>Location</strong>
          <p style={{ marginTop: 0, marginBottom: 0 }}>Enter a location or enable precise location to get more accurate weather and sports</p>

        </Typography>
        <Switch
          checked={autosuggest}
          onChange={() => setAutosuggest(!autosuggest)}
        />
      </Box>

      <TextField
        fullWidth
        multiline
        rows={1}
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter Location"
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: "flex", gap: 2, justifyContent: "end" }}>
        
        <Button variant="contained" color="primary">
          Save
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* -------- Watchlists Section -------- */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        <strong>Watchlists</strong>
        <p style={{ marginTop: 0, marginBottom: 0 }}>this is watchlist</p>
      </Typography>
      


      {/* Sports Watchlist */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <div>
          <Typography variant="body1"><strong>Sports</strong></Typography>
          <p style={{ marginTop: 0, marginBottom: 0 }}>this is watchlist</p>
        </div>


        <Button size="small" variant="outlined">
          Manage
        </Button>

      </Box>

      {/* Finance Watchlist */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="body1"><strong>Finance</strong>
          <p style={{ marginTop: 0, marginBottom: 0 }}>Set your watchlist for daily updates and summaries</p>
        </Typography>
        <Button size="small" variant="outlined">
          Manage
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* -------- System Section -------- */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        System
      </Typography>

      {/* Support */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="body2">Support</Typography>
        <Button size="small" variant="outlined">
          Contact
        </Button>
      </Box>

      {/* Signed in as */}
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}>
        <Typography variant="body2">
          You are signed in as <strong>{user.username}</strong>
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Logout />}
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            dispatch(clearUser());
            window.location.hash = "#/";
          }}
        >
          Sign out
        </Button>
      </Box>

      {/* Sign out of all sessions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="body2">Sign out of all sessions</Typography>
        <Button size="small" variant="outlined">
          Sign out of all sessions
        </Button>
      </Box>

      {/* Delete account */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2">Delete account</Typography>
        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<Delete />}
        >
          Learn more
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;
