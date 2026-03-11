// import { createBrowserRouter } from 'react-router-dom'
// import {
//     ActivityScreen,
//     AddItemScreen,
//     ClaimConfirmationScreen,
//     ItemDetailScreen,
//     MapScreen, 
//     ProfileScreen,
//     SearchScreen,
//  } from '../screens'
//  import { Layout } from '../Layout'

// export const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Layout />,
//     children: [
//       {
//         index: true,
//         element: <MapScreen />,
//       },
//       {
//         path: 'search',
//         element: <SearchScreen />,
//       },
//       {
//         path: 'add',
//         element: <AddItemScreen />,
//       },
//       {
//         path: 'activity',
//         element: <ActivityScreen />,
//       },
//       {
//         path: 'profile',
//         element: <ProfileScreen />,
//       },
//       {
//         path: 'item',
//         element: <ItemDetailScreen />,
//       },
//       {
//         path: 'claimed',
//         element: <ClaimConfirmationScreen />,
//       },
//     ],
//   },
// ])


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
import { Layout } from '../components'

export const router = createBrowserRouter([
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
        path: 'item/:id',
        element: <ItemDetailScreen />,
      },
      {
        path: 'claimed/:id',
        element: <ClaimConfirmationScreen />,
      },
    ],
  },
])