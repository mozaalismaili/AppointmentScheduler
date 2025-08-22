# Appointment Scheduler Frontend

A modern, responsive React application for managing appointments between customers and service providers.

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   │   ├── AuthForm.jsx # Main auth form (login/signup)
│   │   └── AuthForm.css
│   ├── dashboard/       # Dashboard components
│   │   ├── CustomerDashboard.jsx
│   │   ├── CustomerDashboard.css
│   │   ├── ProviderDashboard.jsx
│   │   └── ProviderDashboard.css
│   ├── Navbar.jsx       # Navigation component
│   ├── Navbar.css
│   └── ProtectedRoute.jsx
├── pages/               # Page components
│   ├── BookingPage.jsx  # Customer booking flow
│   ├── BookingPage.css
│   ├── AvailabilityPage.jsx # Provider availability management
│   └── AvailabilityPage.css
├── features/            # Redux slices
│   └── auth/
│       └── authSlice.js
├── theme/               # Design system
│   └── theme.js        # Centralized theme configuration
├── api/                 # API integration
├── queries/             # React Query hooks
├── App.jsx              # Main app component
└── main.jsx            # App entry point
```

## 🎨 Design System

The application uses a centralized theme system (`src/theme/theme.js`) that provides:

- **Colors**: Primary, secondary, accent, and semantic color palettes
- **Typography**: Font families, sizes, weights, and line heights
- **Spacing**: Consistent spacing scale
- **Shadows**: Elevation and depth
- **Breakpoints**: Responsive design breakpoints
- **Transitions**: Animation timing and easing

## 🔐 Authentication

- **AuthForm**: Unified component for login and signup
- **Role-based access**: Customer and Provider roles
- **Protected routes**: Role-specific navigation
- **Redux state management**: Centralized auth state

## 👥 User Types

### Customer
- View and manage appointments
- Book new appointments
- View appointment history
- Cancel/reschedule appointments

### Service Provider
- Manage availability and time slots
- View and manage bookings
- Set working hours and break times
- Dashboard with booking statistics

## 🚀 Key Features

- **Multi-step booking flow**: Service → Provider → Date → Time → Confirmation
- **Availability management**: Day-by-day time slot configuration
- **Responsive design**: Mobile-first approach
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Real-time updates**: Live availability and booking status

## 🛠️ Development

### Prerequisites
- Node.js 16+
- npm or pnpm

### Setup
```bash
cd frontend
npm install
npm run dev
```

### Building
```bash
npm run build
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 768px
- **Desktop**: > 768px

## 🎯 Component Architecture

- **Atomic Design**: Components are built with reusability in mind
- **CSS Modules**: Scoped styling for each component
- **Props Interface**: Clear component APIs
- **Error Handling**: Graceful error states and loading indicators

## 🔄 State Management

- **Redux Toolkit**: For global state (auth, user preferences)
- **Local State**: Component-specific state management
- **React Query**: For server state and caching (planned)

## 🎨 Styling Approach

- **CSS-in-JS**: Component-scoped styles
- **CSS Variables**: Theme-based design tokens
- **Flexbox/Grid**: Modern layout techniques
- **Animations**: Smooth transitions and micro-interactions

## 📋 TODO

- [ ] Integrate with backend API
- [ ] Add real-time notifications
- [ ] Implement calendar view
- [ ] Add appointment reminders
- [ ] Create admin dashboard
- [ ] Add payment integration
- [ ] Implement search and filtering
- [ ] Add dark mode support
