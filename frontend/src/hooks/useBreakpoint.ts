import { useEffect, useState } from 'react'
import { breakpoints } from '../styles'

export const useBreakpoint = () => {
    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const isMobile = width < breakpoints.mobile
    const isTable = width >= breakpoints.mobile && width < breakpoints.tablet
    const isDesktop = width >= breakpoints.tablet

    return {
        isMobile,
        isTable,
        isDesktop
    }
}