import { Outlet } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'

export function Layout() {
    return (
        <div className="screen">
            <div className="content">
                <Outlet />
                <BottomNav />
            </div>
        </div>
    )
}