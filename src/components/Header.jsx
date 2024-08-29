import React from "react";
import Styled from "styled-components";
import MobileMenuIcon from "@/icons/MobileMenuIcon";

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

const Header = () => {
  return (
    <HeaderWrapper>
      <HeaderContent>
        <HeaderTitle>Tip Tracker</HeaderTitle>
        <MobileMenuIcon />
      </HeaderContent>
    </HeaderWrapper>
  );
};

export default Header;
