import { Outlet } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'

export function Layout() {
    return (
        <div className='screen'>
            <Outlet />
            <BottomNav />
        </div>
    )
}