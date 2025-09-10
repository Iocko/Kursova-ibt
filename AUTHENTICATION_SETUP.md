# Authentication Setup

The `useAuth` hook has been successfully connected to the backend API. Here's what was implemented:

## Files Created/Modified

### New Files:

- `src/utils/api.ts` - Generic API client with token management
- `src/utils/authApi.ts` - Authentication-specific API functions
- `src/types/authApi.ts` - TypeScript types for auth API requests/responses
- `src/contexts/AuthContext.tsx` - React context for global auth state management

### Modified Files:

- `src/types/userModel.ts` - Updated to match backend user structure (email, name)
- `src/hooks/auth/useAuth.tsx` - Now uses the AuthContext instead of mock data
- `src/main.tsx` - Wrapped app with AuthProvider
- `src/utils/index.ts` - Exports new API utilities

## Features

### Authentication Context

- **Global state management** for user authentication
- **Automatic token persistence** in localStorage
- **Token validation** on app initialization
- **Loading states** for better UX

### API Integration

- **Login/Register** with backend endpoints
- **Automatic token attachment** to requests
- **Error handling** with user-friendly messages
- **Type-safe** API calls with TypeScript

### Backend Endpoints Used

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user (protected)

## Environment Configuration

Create a `.env` file in the root directory with:

```
VITE_API_URL=http://localhost:5000/api
```

## Usage

The `useAuth` hook now provides:

- `user` - Current user object (null if not authenticated)
- `isAuthenticated` - Boolean authentication status
- `isLoading` - Loading state for initial auth check
- `login(email, password)` - Login function
- `register(email, password, name)` - Registration function
- `logout()` - Logout function

## Backend Requirements

Make sure your backend is running on port 5000 with the following environment variables:

- `JWT_SECRET` - Secret key for JWT token signing
- `DATABASE_URL` - Prisma database connection string

The authentication system is now fully integrated and ready to use!
