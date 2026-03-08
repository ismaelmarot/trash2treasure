import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MapPage } from '../pages'

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<MapPage />} />
            </Routes>
        </BrowserRouter>
    )
}