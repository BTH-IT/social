import Stories from "react-insta-stories";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper";
import { history } from "../../utils/history";

const StyledStorySlide = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .swiper_container {
    height: 100%;
    max-height: 88vh;
    position: relative;
  }

  .swiper-slide {
    width: 40rem;
    height: 64rem;
    position: relative;
  }

  .story-image {
    width: 100%;
    height: 100%;
  }

  .story-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export interface HeaderStoryType {
  heading: string;
  subheading: string;
  profileImage: string;
}

export interface StoriesType {
  url: string;
  type: string;
  header: HeaderStoryType;
  duration?: number;
}

const StorySlide = ({ stories }: { stories: StoriesType[] }) => {
  return (
    <StyledStorySlide>
      <Stories
        keyboardNavigation
        defaultInterval={8000}
        onAllStoriesEnd={() => history.back()}
        stories={stories}
        storyContainerStyles={{
          borderRadius: 8,
          overflow: "hidden",
          margin: "0 auto",
          maxWidth: "400px",
        }}
        width={"100%"}
      />
      {/* <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 250,
          modifier: 2.5,
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
          enabled: true,
        }}
        modules={[EffectCoverflow, Navigation]}
        className="swiper_container"
      >
        <SwiperSlide>
          
        <div className="slider-controler">
          <div className="swiper-button-prev slider-arrow"></div>
          <div className="swiper-button-next slider-arrow"></div>
        </div>
      </Swiper> */}
    </StyledStorySlide>
  );
};

export default StorySlide;
