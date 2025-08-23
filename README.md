# Konnect.kr React Frontend

A modern React frontend for the Konnect.kr platform, designed to help foreigners navigate life in Korea.

## Features

- **Material UI Design System** with custom theme (#57d1d6)
- **Dark/Light Mode Toggle** for user preference
- **Responsive Design** optimized for all devices
- **AI-Powered Chat** integration for instant assistance
- **Buzz Feed** for Korea-related news and updates
- **Library System** for educational resources
- **User Authentication** with Auth0 integration
- **Profile Management** with customizable settings

## Technology Stack

- **React 18.2.0** - Modern React with hooks and concurrent features
- **Material UI 5.15.15** - Comprehensive component library
- **React Router 6.22.3** - Client-side routing
- **Axios 1.6.8** - HTTP client for API communication
- **Emotion** - CSS-in-JS styling solution

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.js    # Main navigation with drawer
│   └── Footer.js        # Site footer with links
├── contexts/            # React contexts
│   └── ThemeContext.js  # Theme management (dark/light mode)
├── pages/               # Main application pages
│   ├── Home.js          # Landing page with search
│   ├── AboutUs.js       # Company information
│   ├── Buzz.js          # News and content feed
│   ├── Library.js       # Learning resources
│   ├── Profile.js       # User profile management
│   ├── Login.js         # User authentication
│   ├── Signup.js        # User registration
│   ├── Terms.js         # Terms of service
│   └── Privacy.js       # Privacy policy
├── services/            # API service layer
│   └── api.js           # Axios configuration and endpoints
├── theme/               # Material UI theme configuration
│   └── theme.js         # Custom themes with brand colors
├── App.js               # Main application component
└── index.js             # Application entry point
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Theme Configuration

The application uses a custom Material UI theme with:

- **Primary Color**: #57d1d6 (Konnect brand color)
- **Secondary Color**: #ff6b6b (Accent color)
- **Background**: Dynamic based on light/dark mode
- **Typography**: Roboto font family
- **Custom Components**: Styled buttons, cards, and navigation

## Dark/Light Mode

Users can toggle between dark and light modes using the theme switcher in the navigation bar. The preference is saved in localStorage and persists across sessions.

## API Integration

The frontend communicates with the Flask backend through:

- **Proxy Configuration**: Development requests proxy to `http://localhost:5000`
- **Authentication**: Bearer token-based authentication
- **Error Handling**: Comprehensive error handling with user feedback
- **Request Interceptors**: Automatic token attachment for authenticated requests

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Ensure Flask Backend is Running**
   The React app expects the Flask backend to be running on `http://localhost:5000`

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_AUTH0_DOMAIN=your-auth0-domain
REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
```

## Features Overview

### Home Page
- Hero section with search functionality
- Quick action cards for common tasks
- Integrated chat interface for AI assistance
- Responsive design with smooth animations

### Navigation
- Collapsible drawer for mobile devices
- Theme toggle switch
- User authentication status
- Dynamic menu items based on auth state

### Buzz Feed
- Category-based content filtering
- Search functionality
- Card-based layout for articles
- Pagination support

### Library
- Course progress tracking
- Bookmark functionality
- User-specific dashboard
- Resource categorization

### Profile
- Editable user information
- Preference management
- Account settings
- Theme and notification controls

### Authentication
- Social login integration (Google, Facebook, KakaoTalk)
- Form validation with error handling
- Password visibility toggle
- Terms acceptance workflow

## Deployment

### Build for Production
```bash
npm run build
```

### Serve Static Files
The build folder contains static files that can be served by any web server.

### Integration with Flask
The Flask backend can serve the React build files for a single-domain deployment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary to Konnect.kr.

## Support

For technical support or questions, contact the development team at dev@konnect.kr.
