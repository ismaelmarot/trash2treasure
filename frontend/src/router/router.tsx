import { createBrowserRouter } from 'react-router-dom'
import {
  ActivityScreen,
  AddItemScreen,
  ClaimConfirmationScreen,
  EditItemScreen,
  EditProfileScreen,
  ItemDetailScreen,
  MapScreen,
  PointsScreen,
  ProfileScreen,
  SearchScreen,
  LoginScreen,
  RegisterScreen,
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
    path: '/splash',
    element: <SplashScreen />,
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
    path: '/verify',
    element: <VerificationScreen />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Layout />,
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
        ],
      },
    ],
  },
])