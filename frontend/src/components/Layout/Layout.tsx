import { BottomNav } from '..'

export const Layout = ({ children }: { children: React.ReactNode }) => (
    <>
        {children}
        <BottomNav />
    </>
)