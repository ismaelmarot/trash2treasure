import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MapPage } from '../pages/MapPage/MapPage'
import { Layout } from '../components'
// import { ItemDetailPage } from '../pages/ItemDetailPage/ItemDetailPage'
// import { SearchPage } from '../pages/SearchPage/SearchPage'
// import { AddItemPage } from '../pages/AddItemPage/AddItemPage'
// import { ActivityPage } from '../pages/ActivityPage/ActivityPage'
// import { ProfilePage } from '../pages/ProfilePage/ProfilePage'
// import { ClaimConfirmationPage } from '../pages/ClaimConfirmationPage/ClaimConfirmationPage'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout><MapPage /></Layout>} />
        {/* <Route path='/item/:id' element={<ItemDetailPage />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path='/add' element={<AddItemPage />} />
        <Route path='/activity' element={<ActivityPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/claim/:id' element={<ClaimConfirmationPage />} /> */}
      </Routes>
    </BrowserRouter>
  )
}