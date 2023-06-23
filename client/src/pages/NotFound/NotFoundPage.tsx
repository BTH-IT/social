import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledNotFoundPage = styled.section`
  padding: 40px 0;
  background: #fff;
  text-align: center;
  width: 100vw;
  height: 100vh;
  font-family: "Arvo", serif;
  font img {
    width: 100%;
    object-fit: cover;
  }
  .four_zero_four_bg {
    background-image: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif);
    height: 600px;
    background-position: center;
    background-repeat: no-repeat;
  }

  .four_zero_four_bg h1 {
    font-size: 8rem;
    background: linear-gradient(to top right, orange, deeppink);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .link_404 {
    color: #fff !important;
    padding: 10px 20px;
    background: linear-gradient(to top right, orange, deeppink);
    margin: 20px 0;
    display: inline-block;
    font-size: 2rem;
    text-decoration: none;
    border-radius: 4px;
  }
  .contant_box_404 {
    margin-top: -50px;
    font-size: 2rem;
  }
`;

const NotFoundPage = () => {
  return (
    <StyledNotFoundPage>
      <div className="container">
        <div className="row">
          <div className="col-sm-12 ">
            <div className="col-sm-10 col-sm-offset-1  text-center">
              <div className="four_zero_four_bg">
                <h1 className="text-center ">404</h1>
              </div>

              <div className="contant_box_404">
                <h3 className="h2">Look like you're lost</h3>

                <p>the page you are looking for not avaible!</p>

                <Link to="/" className="link_404">
                  Go to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledNotFoundPage>
  );
};

export default NotFoundPage;
