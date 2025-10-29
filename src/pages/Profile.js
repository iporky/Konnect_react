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
  const [homepageWidgets, setHomepageWidgets] = useState(true);
  const [intro, setIntro] = useState("");
  const [location, setLocation] = useState("");
  const [locationToggle, setLocationToggle] = useState(false);

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 4, md: 5 }, px: { xs: 2, sm: 3 } }}>
        <Typography variant="body1">Please log in to view your profile.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 4, md: 5 }, px: { xs: 2, sm: 3 } }}>
      {/* -------- Account Section -------- */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          mb: { xs: 2, sm: 2.5, md: 3 },
          fontSize: { xs: "1.1rem", sm: "1.25rem" }
        }}
      >
        Account
      </Typography>

      {/* Top Profile */}
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "center", sm: "center" },
          justifyContent: { xs: "center", sm: "space-between" },
          flexDirection: { xs: "column", sm: "row" },
          mb: { xs: 2.5, sm: 3, md: 3 },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            width: { xs: "100%", sm: "auto" },
            textAlign: { xs: "center", sm: "left" }
          }}
        >
          <Avatar
            src={user.picture}
            sx={{
              width: { xs: 72, sm: 64 },
              height: { xs: 72, sm: 64 },
              mr: { xs: 0, sm: 2 },
              mb: { xs: 1.5, sm: 0 }
            }}
          >
            {user.name?.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontSize: { xs: "1rem", sm: "1rem" } }}>
              {user.name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.8rem", sm: "0.8rem" } }}
            >
              {user.username}
            </Typography>
          </Box>
        </Box>
        <Button
          size="small"
          variant="outlined"
          sx={{
            mt: { xs: 0, sm: 0 },
            width: { xs: "100%", sm: "auto" },
            fontSize: { xs: "0.8rem", sm: "0.875rem" }
          }}
        >
          Change avatar
        </Button>
      </Box>

      {/* Full Name */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          mb: { xs: 2, sm: 2, md: 2 },
          gap: { xs: 1.5, sm: 0 },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
          >
            Full Name
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            {user.name}
          </Typography>
        </Box>
        <Button
          size="small"
          variant="outlined"
          sx={{
            width: { xs: "100%", sm: "auto" },
            fontSize: { xs: "0.8rem", sm: "0.875rem" }
          }}
        >
          Change full name
        </Button>
      </Box>

      {/* Username */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          mb: { xs: 2, sm: 2, md: 2 },
          gap: { xs: 1.5, sm: 0 },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
          >
            Username
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            {user.username}
          </Typography>
        </Box>
        <Button
          size="small"
          variant="outlined"
          sx={{
            width: { xs: "100%", sm: "auto" },
            fontSize: { xs: "0.8rem", sm: "0.875rem" }
          }}
        >
          Change username
        </Button>
      </Box>

      {/* Email */}
      <Box sx={{ mb: { xs: 3, sm: 3.5, md: 4 } }}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
        >
          Email
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "0.9rem", sm: "1rem" },
            wordBreak: "break-word"
          }}
        >
          {user.email}
        </Typography>
      </Box>

      <Divider sx={{ my: { xs: 3, sm: 3, md: 3 } }} />

      {/* -------- Preferences Section -------- */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          mb: { xs: 2, sm: 2.5, md: 3 },
          fontSize: { xs: "1.1rem", sm: "1.25rem" }
        }}
      >
        Preferences
      </Typography>

      {/* Appearance */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: { xs: 2.5, sm: 2.5, md: 2.5 },
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "0.9rem", sm: "0.95rem" }
            }}
          >
            Appearance
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              fontSize: { xs: "0.75rem", sm: "0.8rem" }
            }}
          >
            How Perplexity looks on your device
          </Typography>
        </Box>
        <FormControl
          size="small"
          sx={{
            minWidth: { xs: "100%", sm: 180 },
            mt: { xs: 0, sm: 0 }
          }}
        >
          <Select
            value={appearance}
            onChange={(e) => setAppearance(e.target.value)}
            sx={{ fontSize: { xs: "0.85rem", sm: "0.875rem" } }}
          >
            <MenuItem value="System (light)">System (light)</MenuItem>
            <MenuItem value="Dark">Dark</MenuItem>
            <MenuItem value="Light">Light</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Language */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: { xs: 2.5, sm: 2.5, md: 2.5 },
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "0.9rem", sm: "0.95rem" }
            }}
          >
            Language
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              fontSize: { xs: "0.75rem", sm: "0.8rem" }
            }}
          >
            The language used in the user interface
          </Typography>
        </Box>
        <FormControl
          size="small"
          sx={{
            minWidth: { xs: "100%", sm: 180 },
            mt: { xs: 0, sm: 0 }
          }}
        >
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            sx={{ fontSize: { xs: "0.85rem", sm: "0.875rem" } }}
          >
            <MenuItem value="Default">Default</MenuItem>
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Hindi">Hindi</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Preferred response language */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: { xs: 2.5, sm: 2.5, md: 2.5 },
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "0.9rem", sm: "0.95rem" }
            }}
          >
            Preferred response language
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              fontSize: { xs: "0.75rem", sm: "0.8rem" }
            }}
          >
            The language used for AI responses
          </Typography>
        </Box>
        <FormControl
          size="small"
          sx={{
            minWidth: { xs: "100%", sm: 180 },
            mt: { xs: 0, sm: 0 }
          }}
        >
          <Select
            value={responseLang}
            onChange={(e) => setResponseLang(e.target.value)}
            sx={{ fontSize: { xs: "0.85rem", sm: "0.875rem" } }}
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
          alignItems: "flex-start",
          mb: { xs: 2.5, sm: 2.5, md: 3 },
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1, pr: { xs: 1, sm: 2 } }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "0.9rem", sm: "0.95rem" }
            }}
          >
            Autosuggest
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              fontSize: { xs: "0.75rem", sm: "0.8rem" }
            }}
          >
            Enable dropdown and tab-complete suggestions while typing a query
          </Typography>
        </Box>
        <Switch
          checked={autosuggest}
          onChange={() => setAutosuggest(!autosuggest)}
          sx={{ flexShrink: 0 }}
        />
      </Box>

      {/* Homepage widgets */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: { xs: 3, sm: 3.5, md: 4 },
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1, pr: { xs: 1, sm: 2 } }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "0.9rem", sm: "0.95rem" }
            }}
          >
            Homepage widgets
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              fontSize: { xs: "0.75rem", sm: "0.8rem" }
            }}
          >
            Enable personalized widgets on the homepage
          </Typography>
        </Box>
        <Switch
          checked={homepageWidgets}
          onChange={() => setHomepageWidgets(!homepageWidgets)}
          sx={{ flexShrink: 0 }}
        />
      </Box>

      <Divider sx={{ my: { xs: 3, sm: 3, md: 3 } }} />

      {/* -------- Personalization Section -------- */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          mb: { xs: 2, sm: 2.5, md: 3 },
          fontSize: { xs: "1.1rem", sm: "1.25rem" }
        }}
      >
        Personalization
      </Typography>

      <Typography
        variant="subtitle2"
        sx={{
          mb: 1.5,
          fontWeight: "bold",
          fontSize: { xs: "0.9rem", sm: "0.95rem" }
        }}
      >
        Introduce yourself
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={2}
        value={intro}
        onChange={(e) => setIntro(e.target.value)}
        placeholder="I'm a software engineer who likes to play guitar and go hiking."
        sx={{
          mb: { xs: 2, sm: 2, md: 2 },
          '& .MuiInputBase-root': {
            fontSize: { xs: "0.9rem", sm: "1rem" }
          }
        }}
      />

      <Box
        sx={{
          display: "flex",
          gap: { xs: 1.5, sm: 2 },
          justifyContent: "flex-end",
          mb: { xs: 3, sm: 3.5, md: 4 },
          flexDirection: { xs: "column", sm: "row" }
        }}
      >
        <Button
          variant="outlined"
          onClick={() => setIntro("")}
          sx={{
            order: { xs: 2, sm: 1 },
            fontSize: { xs: "0.85rem", sm: "0.875rem" }
          }}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{
            order: { xs: 1, sm: 2 },
            fontSize: { xs: "0.85rem", sm: "0.875rem" }
          }}
        >
          Save
        </Button>
      </Box>

      {/* Location Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: { xs: 2, sm: 2, md: 2.5 },
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1, pr: { xs: 1, sm: 2 } }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "0.9rem", sm: "0.95rem" }
            }}
          >
            Location
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              fontSize: { xs: "0.75rem", sm: "0.8rem" }
            }}
          >
            Enter a location or enable precise location to get more accurate
            weather and sports
          </Typography>
        </Box>
        <Switch
          checked={locationToggle}
          onChange={() => setLocationToggle(!locationToggle)}
          sx={{ flexShrink: 0 }}
        />
      </Box>

      <TextField
        fullWidth
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter Location"
        sx={{
          mb: { xs: 2, sm: 2, md: 2 },
          '& .MuiInputBase-root': {
            fontSize: { xs: "0.9rem", sm: "1rem" }
          }
        }}
      />

      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "flex-end",
          mb: { xs: 3, sm: 3.5, md: 4 }
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{
            width: { xs: "100%", sm: "auto" },
            fontSize: { xs: "0.85rem", sm: "0.875rem" }
          }}
        >
          Save
        </Button>
      </Box>

      <Divider sx={{ my: { xs: 3, sm: 3, md: 3 } }} />

      {/* -------- Watchlists Section -------- */}
      <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.1rem", sm: "1.25rem" }
          }}
        >
          Watchlists
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            fontSize: { xs: "0.75rem", sm: "0.8rem" }
          }}
        >
          This is watchlist
        </Typography>
      </Box>

      {/* Sports Watchlist */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          mb: { xs: 2.5, sm: 2.5, md: 2.5 },
          gap: { xs: 1.5, sm: 0 },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "0.95rem", sm: "1rem" }
            }}
          >
            Sports
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              fontSize: { xs: "0.75rem", sm: "0.8rem" }
            }}
          >
            This is watchlist
          </Typography>
        </Box>
        <Button
          size="small"
          variant="outlined"
          sx={{
            width: { xs: "100%", sm: "auto" },
            fontSize: { xs: "0.8rem", sm: "0.875rem" }
          }}
        >
          Manage
        </Button>
      </Box>

      {/* Finance Watchlist */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          mb: { xs: 3, sm: 3.5, md: 4 },
          gap: { xs: 1.5, sm: 0 },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "0.95rem", sm: "1rem" }
            }}
          >
            Finance
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              fontSize: { xs: "0.75rem", sm: "0.8rem" }
            }}
          >
            Set your watchlist for daily updates and summaries
          </Typography>
        </Box>
        <Button
          size="small"
          variant="outlined"
          sx={{
            width: { xs: "100%", sm: "auto" },
            fontSize: { xs: "0.8rem", sm: "0.875rem" }
          }}
        >
          Manage
        </Button>
      </Box>

      <Divider sx={{ my: { xs: 3, sm: 3, md: 3 } }} />

      {/* -------- System Section -------- */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          mb: { xs: 2, sm: 2.5, md: 3 },
          fontSize: { xs: "1.1rem", sm: "1.25rem" }
        }}
      >
        System
      </Typography>

      {/* Support */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: { xs: 2, sm: 2, md: 2 },
          gap: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontSize: { xs: "0.85rem", sm: "0.875rem" } }}
        >
          Support
        </Typography>
        <Button
          size="small"
          variant="outlined"
          sx={{
            flexShrink: 0,
            fontSize: { xs: "0.8rem", sm: "0.875rem" }
          }}
        >
          Contact
        </Button>
      </Box>

      {/* Signed in as */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          mb: { xs: 2.5, sm: 2, md: 2 },
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: "0.85rem", sm: "0.875rem" },
            flex: 1
          }}
        >
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
          sx={{
            width: { xs: "100%", sm: "auto" },
            flexShrink: 0,
            fontSize: { xs: "0.8rem", sm: "0.875rem" }
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
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          mb: { xs: 2.5, sm: 2, md: 2 },
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: "0.85rem", sm: "0.875rem" },
            flex: 1
          }}
        >
          Sign out of all sessions
        </Typography>
        <Button
          size="small"
          variant="outlined"
          sx={{
            width: { xs: "100%", sm: "auto" },
            flexShrink: 0,
            fontSize: { xs: "0.8rem", sm: "0.875rem" }
          }}
        >
          Sign out of all sessions
        </Button>
      </Box>

      {/* Delete account */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: "0.85rem", sm: "0.875rem" },
            flex: 1
          }}
        >
          Delete account
        </Typography>
        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          sx={{
            width: { xs: "100%", sm: "auto" },
            flexShrink: 0,
            fontSize: { xs: "0.8rem", sm: "0.875rem" }
          }}
        >
          Learn more
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;