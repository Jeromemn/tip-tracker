import React, { useState } from "react";
import Styled from "styled-components";
import MobileMenuIcon from "@/icons/MobileMenuIcon";
import Button from "@/components/Button";
import Close from "@/icons/Close";
import Link from "next/link";
import { useRouter } from "next/router";

const HeaderWrapper = Styled.header`
  background: ${(props) => props.theme.colors.black};
  height:60px;
  width:100%;
  display:flex;
  align-items:center;
  top:0;
`;

const HeaderContent = Styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin:0 auto;
  width: 100%;
  max-width: 350px;
`;

const HeaderTitle = Styled.h1`
  color: ${(props) => props.theme.colors.white};
  font-size: 1.5rem;

`;

const MobileNav = Styled.div`
position: fixed;
top: 60px;
left: 0;
bottom: 0;
right: 0;
background: black;
display: flex;
transform: ${(props) => (props.$isOpen ? "translateY(0)" : "translateX(100%)")};
opacity: ${(props) => (props.$isOpen ? 1 : 0)};
transition: transform 0.4s ease-in-out, opacity 0.3s ease-in-out;
`;

const Nav = Styled.nav`
display: flex;
flex-direction: column;
gap: 24px;
justify-content: center;
align-items: center;

`;
const NavContent = Styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 32px;
  width: 100%;
`;

const NavItem = Styled(Link)`
  text-decoration: none;
  color: ${(props) =>
    props.$isActive ? props.theme.colors.orange : props.theme.colors.white};
  font-size: 24px;
`;

const NavOptions = {
  "/": "Home",
  "/shifts": "Shifts",
  "/manageCompanies": "Manage Companies",
  "/EarningsReport": "Earnings Report",
};

const Header = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <HeaderWrapper>
      <HeaderContent>
        <HeaderTitle>Tip Tracker</HeaderTitle>
        <Button variant="icon" onClick={handleMobileMenu}>
          {isMenuOpen ? <Close color="white" /> : <MobileMenuIcon />}
        </Button>
        <MobileNav $isOpen={isMenuOpen}>
          <NavContent>
            <Nav>
              {Object.entries(NavOptions).map(([path, text]) => (
                <NavItem
                  key={path}
                  href={path}
                  $isActive={currentPath === path}
                  onClick={handleMobileMenu}
                >
                  {text}
                </NavItem>
              ))}
            </Nav>
          </NavContent>
        </MobileNav>
      </HeaderContent>
    </HeaderWrapper>
  );
};

export default Header;
