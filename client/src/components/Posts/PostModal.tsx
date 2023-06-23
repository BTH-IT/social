import Modal from "../Modal/Modal";
import { PostType } from "./Post";
import PostDetail from "./PostDetail";

const PostModal = ({
  post,
  show,
  onClose,
  className,
}: {
  post: PostType;
  show: boolean;
  onClose: () => void;
  className?: string;
}) => {
  return (
    <Modal
      visible={show}
      onClose={onClose}
      overlay={true}
      hasIconClose={true}
      containerClassName={className}
    >
      {post && <PostDetail post={post}></PostDetail>}
    </Modal>
  );
};

export default PostModal;
