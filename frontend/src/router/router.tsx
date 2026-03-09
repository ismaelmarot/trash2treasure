import { createBrowserRouter } from 'react-router-dom'
import {
    ActivityScreen,
    AddItemScreen,
    ClaimConfirmationScreen,
    ItemDetailScreen,
    MapScreen,
    ProfileScreen,
    SearchScreen,
 } from '../screens'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MapScreen />,
    },
    {
        path: '/search',
        element: <SearchScreen />,
    },
    {
    path: "/add",
    element: <AddItemScreen />,
  },
  {
    path: '/activity',
    element: <ActivityScreen />,
  },
  {
    path: '/profile',
    element: <ProfileScreen />,
  },
  {
    path: '/item',
    element: <ItemDetailScreen />,
  },
  {
    path: '/claimed',
    element: <ClaimConfirmationScreen />,
  },
])