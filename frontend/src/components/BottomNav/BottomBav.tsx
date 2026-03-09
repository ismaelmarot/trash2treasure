import { Link } from 'react-router-dom'
import { BottomNavContainer } from './BottomNav.style'

export function BottomNav() {
    return (
        <BottomNavContainer>
            <Link to="/">Map</Link>
            <Link to="/search">Search</Link>
            <Link to="/add">Add</Link>
            <Link to="/activity">Activity</Link>
            <Link to="/profile">Profile</Link>
        </BottomNavContainer>
    )
}