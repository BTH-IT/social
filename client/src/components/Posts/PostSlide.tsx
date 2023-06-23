import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import { FileNameType } from "../Create/Create";
import { SERVER } from "../../utils/constant";

interface PostSlideProps {
  width: string;
  height: string;
  fileUploads: FileNameType[];
}

const PostSlide = ({ width, height, fileUploads }: PostSlideProps) => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={0}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      allowTouchMove={false}
      style={{
        width,
        height,
      }}
    >
      {fileUploads &&
        fileUploads.length > 0 &&
        fileUploads.map((file) => (
          <SwiperSlide
            style={{
              width,
              height,
            }}
            key={"bth" + file.filename + "3103"}
          >
            <div className="post-image">
              {file.type === "image" ? (
                <img
                  src={`${SERVER}files/${file.filename}`}
                  alt=""
                  className="post-img"
                />
              ) : (
                <video
                  src={`${SERVER}files/${file.filename}`}
                  className="post-img"
                  controls
                ></video>
              )}
            </div>
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default PostSlide;
