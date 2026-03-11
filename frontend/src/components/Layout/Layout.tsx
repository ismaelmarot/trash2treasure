// import { Outlet } from 'react-router-dom'
// import { BottomNav } from '../components/BottomNav'

// export function Layout() {
//     return (
//         <div className="screen">
//             <div className="content">
//                 <Outlet />
//                 <BottomNav />
//             </div>
//         </div>
//     )
// }


// Layout.tsx
// import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import { MapPin, Search, PlusCircle, Activity, User } from "lucide-react";
// import styled from "styled-components";

// // ---------------- Styled Components ----------------

// const Container = styled.div`
//   display: flex;
//   height: 100vh;
//   background-color: #f9fafb;
// `;

// const Sidebar = styled.aside`
//   display: none;
//   @media (min-width: 768px) {
//     display: flex;
//     flex-direction: column;
//     width: 18rem; /* 72 */
//     background: rgba(255,255,255,0.8);
//     backdrop-filter: blur(10px);
//     border-right: 1px solid rgba(229,231,235,0.5);
//   }
// `;

// const LogoSection = styled.div`
//   padding: 2rem 1.5rem 1.5rem;
//   border-bottom: 1px solid rgba(229,231,235,0.5);
//   display: flex;
//   align-items: center;
//   gap: 0.75rem;
// `;

// const LogoIcon = styled.div`
//   width: 2.5rem;
//   height: 2.5rem;
//   background: linear-gradient(135deg,#34d399,#059669);
//   border-radius: 1rem;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const NavSection = styled.nav`
//   flex: 1;
//   padding: 1.5rem 1rem;
//   display: flex;
//   flex-direction: column;
//   gap: 0.25rem;
// `;

// const NavButton = styled.button<{ active?: boolean }>`
//   display: flex;
//   align-items: center;
//   gap: 0.75rem;
//   width: 100%;
//   padding: 0.75rem 1rem;
//   border-radius: 1rem;
//   background-color: ${(props) => (props.active ? "#059669" : "transparent")};
//   color: ${(props) => (props.active ? "#fff" : "#374151")};
//   font-weight: ${(props) => (props.active ? 600 : 500)};
//   transition: all 0.2s;

//   &:hover {
//     background-color: ${(props) => (props.active ? "#059669" : "#f3f4f6")};
//   }

//   svg {
//     stroke-width: ${(props) => (props.active ? 2.5 : 2)};
//     color: ${(props) => (props.active ? "#fff" : "#374151")};
//   }
// `;

// const UserCard = styled.div`
//   padding: 1.5rem 1rem;
//   border-top: 1px solid rgba(229,231,235,0.5);
// `;

// const UserButton = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.75rem;
//   padding: 0.75rem 1rem;
//   border-radius: 1rem;
//   background-color: #f9fafb;
//   cursor: pointer;
//   transition: background 0.2s;

//   &:hover {
//     background-color: #f3f4f6;
//   }
// `;

// const Avatar = styled.div`
//   width: 2.5rem;
//   height: 2.5rem;
//   border-radius: 50%;
//   background: linear-gradient(135deg,#34d399,#059669);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   svg {
//     color: #fff;
//   }
// `;

// const Main = styled.div`
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   max-width: 430px;
//   width: 100%;
//   margin: 0 auto;
//   position: relative;
// `;

// const Content = styled.div`
//   flex: 1;
//   overflow: hidden;
// `;

// const BottomNav = styled.nav`
//   display: flex;
//   justify-content: space-around;
//   padding: 0.5rem 0;
//   border-top: 1px solid #e5e7eb;
//   background: #fff;

//   @media (min-width: 768px) {
//     display: none;
//   }
// `;

// const BottomButton = styled.button<{ active?: boolean }>`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   min-width: 64px;
//   padding: 0.25rem 0.5rem;
//   border-radius: 0.5rem;
//   background-color: transparent;
//   font-size: 10px;
//   color: ${(props) => (props.active ? "#059669" : "#6b7280")};
//   font-weight: ${(props) => (props.active ? 600 : 400)};
//   transition: all 0.2s;

//   svg {
//     margin-bottom: 0.25rem;
//     stroke-width: ${(props) => (props.active ? 2.5 : 2)};
//     color: ${(props) => (props.active ? "#059669" : "#6b7280")};
//   }

//   &:active {
//     background-color: #f3f4f6;
//   }
// `;

// // ---------------- Layout Component ----------------

// export const Layout = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const navItems = [
//     { path: "/", icon: MapPin, label: "Map" },
//     { path: "/search", icon: Search, label: "Search" },
//     { path: "/add", icon: PlusCircle, label: "Add" },
//     { path: "/activity", icon: Activity, label: "Activity" },
//     { path: "/profile", icon: User, label: "Profile" },
//   ];

//   const isActive = (path: string) => {
//     if (path === "/") return location.pathname === "/";
//     return location.pathname.startsWith(path);
//   };

//   const hideBottomNav =
//     location.pathname.includes("/item/") ||
//     location.pathname.includes("/claimed/");

//   return (
//     <Container>
//       {/* Sidebar */}
//       <Sidebar>
//         <LogoSection>
//           <LogoIcon>
//             <MapPin size={24} />
//           </LogoIcon>
//           <div>
//             <h1 style={{ fontWeight: 600, fontSize: "1rem" }}>Street Recycle</h1>
//             <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>Urban Recycling</p>
//           </div>
//         </LogoSection>

//         <NavSection>
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <NavButton
//                 key={item.path}
//                 active={isActive(item.path)}
//                 onClick={() => navigate(item.path)}
//               >
//                 <Icon size={20} />
//                 {item.label}
//               </NavButton>
//             );
//           })}
//         </NavSection>

//         <UserCard>
//           <UserButton>
//             <Avatar>
//               <User size={20} />
//             </Avatar>
//             <div>
//               <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                 Alex Johnson
//               </p>
//               <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>1,240 Eco Points</p>
//             </div>
//           </UserButton>
//         </UserCard>
//       </Sidebar>

//       {/* Main Content */}
//       <Main>
//         <Content>
//           <Outlet />
//         </Content>

//         {!hideBottomNav && (
//           <BottomNav>
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <BottomButton
//                   key={item.path}
//                   active={isActive(item.path)}
//                   onClick={() => navigate(item.path)}
//                 >
//                   <Icon size={24} />
//                   {item.label}
//                 </BottomButton>
//               );
//             })}
//           </BottomNav>
//         )}
//       </Main>
//     </Container>
//   );
// };



import { Outlet } from 'react-router-dom'
import { Container, Main, Content } from './Layout.styles'


import { BottomNav } from '../BottomNav/BottomNav'
import { Sidebar } from '..'

export const Layout = () => {
  return (
    <Container>

      <Sidebar />

      <Main>
        <Content>
          <Outlet />
        </Content>

        <BottomNav />
      </Main>

    </Container>
  )
}
