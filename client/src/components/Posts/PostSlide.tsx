import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import { FileUploadsType } from "../Create/Create";
import { SERVER } from "../../utils/constant";

interface PostSlideProps {
  width: string;
  height: string;
  fileUploads: FileUploadsType[];
}

const PostSlide = ({ width, height, fileUploads }: PostSlideProps) => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={0}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      allowTouchMove={true}
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
            key={file.id}
          >
            <div className="post-image">
              {file.type === "image" ? (
                <img src={file.url} alt={file.id} className="post-img" />
              ) : (
                <video src={file.url} className="post-img" controls></video>
              )}
            </div>
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default PostSlide;
