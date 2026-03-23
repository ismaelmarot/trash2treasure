import { createBrowserRouter } from 'react-router-dom'
import {
  ActivityScreen,
  AddItemScreen,
  ClaimConfirmationScreen,
  EditItemScreen,
  EditProfileScreen,
  ItemDetailScreen,
  MapScreen,
  NotFoundScreen,
  PointsScreen,
  ProfileScreen,
  SearchScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  SplashScreen,
  WelcomeScreen,
  VerificationScreen,
  AboutScreen,
  LegalScreen,
  SiteMapScreen,
} from '../screens'
import { Layout } from '../components'
import { ProtectedRoute } from '../components/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SplashScreen />,
    errorElement: <NotFoundScreen />,
  },
  {
    path: '/welcome',
    element: <WelcomeScreen />,
  },
  {
    path: '/login',
    element: <LoginScreen />,
  },
  {
    path: '/register',
    element: <RegisterScreen />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordScreen />,
  },
  {
    path: '/verify',
    element: <VerificationScreen />,
  },

  {
    element: <ProtectedRoute />,
    errorElement: <NotFoundScreen />,
    children: [
      {
        path: '/app',
        element: <Layout />,
        errorElement: <NotFoundScreen />,
        children: [
          {
            index: true,
            element: <MapScreen />,
          },
          {
            path: 'search',
            element: <SearchScreen />,
          },
          {
            path: 'add',
            element: <AddItemScreen />,
          },
          {
            path: 'activity',
            element: <ActivityScreen />,
          },
          {
            path: 'profile',
            element: <ProfileScreen />,
          },
          {
            path: 'edit-profile',
            element: <EditProfileScreen />,
          },
          {
            path: 'points',
            element: <PointsScreen />,
          },
          {
            path: 'about',
            element: <AboutScreen />,
          },
          {
            path: 'legal/:documentType',
            element: <LegalScreen />,
          },
          {
            path: 'sitemap',
            element: <SiteMapScreen />,
          },
          {
            path: 'item/:id',
            element: <ItemDetailScreen />,
          },
          {
            path: 'edit/:id',
            element: <EditItemScreen />,
          },
          {
            path: 'claimed/:id',
            element: <ClaimConfirmationScreen />,
          },
          {
            path: '*',
            element: <NotFoundScreen />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundScreen />,
  },
])