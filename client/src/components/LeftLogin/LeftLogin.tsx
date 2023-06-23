import React, { useEffect, useState } from "react";
import styled from "styled-components";

const StyledLeftLogin = styled.div`
  background-image: url("https://static.cdninstagram.com/rsrc.php/v3/y4/r/ItTndlZM2n2.png");
  background-position: -46px 0;
  background-size: auto;
  background-repeat: no-repeat;
  width: 382px;
  height: 582px;
  position: relative;

  .left-image {
    width: 250px;
    height: 538px;
    position: absolute;
    top: 27px;
    right: 22px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .fadeIn {
    animation: fadeIn 1.5s;
    @keyframes fadeIn {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }
  }

  @media screen and (max-width: 786px) {
    display: none;
  }
`;

const LeftLogin = () => {
  const [img, setImg] = useState<React.ReactNode>(
    <img src="https://i.imgur.com/ZDgrPx8.png" alt="" className="fadeIn" />
  );

  useEffect(() => {
    const imgList = [
      <img src="https://i.imgur.com/SqOeWM6.png" alt="" />,
      <img src="https://i.imgur.com/plQ78mZ.png" alt="" />,
      <img src="https://i.imgur.com/qKnrjB5.png" alt="" />,
      <img src="https://i.imgur.com/ZDgrPx8.png" alt="" />,
    ];
    let index = 0;
    const idInterval = setInterval(() => {
      if (index >= imgList.length) {
        index = 0;
      } else {
        setImg(imgList[index++]);
        const imgEle = document.querySelector(".left-image img");
        imgEle?.classList.add("fadeIn");
        setTimeout(() => {
          imgEle?.classList.remove("fadeIn");
        }, 1000);
      }
    }, 3000);

    return () => {
      clearInterval(idInterval);
    };
  }, []);

  return (
    <StyledLeftLogin>
      <div className="left-image">{img}</div>
    </StyledLeftLogin>
  );
};

export default LeftLogin;
