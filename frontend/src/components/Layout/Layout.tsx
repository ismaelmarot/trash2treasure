// import { BottomNav } from '..'
import { Wrapper, Content } from './Layout.style'

export const MobileLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Wrapper>
            <Content>{children}</Content>
        </Wrapper>
    )
}