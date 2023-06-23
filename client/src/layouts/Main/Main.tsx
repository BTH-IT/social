import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import NavMobileBottom from "../../components/Nav/NavMobileBottom/NavMobileBottom";
import Navbar from "../Navbar/Navbar";

const StyledOutlet = styled.div`
  padding-left: 220px;
  @media only screen and (max-width: 768px) {
    padding-left: 0;
  }
`;

const StyledMain = styled.div`
  .nav {
    &-mobile {
      display: none;
    }
  }

  @media only screen and (max-width: 768px) {
    .nav {
      &-pc {
        display: none;
      }

      &-mobile {
        display: block;
      }
    }
  }
`;

const Main = () => {
  return (
    <StyledMain>
      <div className="nav-pc">
        <Navbar></Navbar>
      </div>
      <div className="nav-mobile">
        <NavMobileBottom></NavMobileBottom>
      </div>

      <StyledOutlet>
        <Outlet></Outlet>
      </StyledOutlet>
    </StyledMain>
  );
};

export default Main;
