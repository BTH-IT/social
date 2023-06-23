import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import postApi from "../../api/postApi";
import { useAppDispatch } from "../../app/hooks";
import PostGrid from "../../components/PostGrid/PostGrid";
import Post, { PostType } from "../../components/Posts/Post";
import PostDetail from "../../components/Posts/PostDetail";
import PostDetailMobile from "../../components/Posts/PostDetailMobile";
import { authActions } from "../../redux/features/auth/authSlice";

const StyledPostDetailPage = styled.div`
  padding: 40px 20px 0 20px;
  background-color: #fafafa;

  @media screen and (max-width: 786px) {
    padding-top: 20px;
    padding-bottom: 90px;
  }
`;

const StyledPostDetailPC = styled.div`
  @media screen and (max-width: 786px) {
    display: none;
  }
`;

const StyledPostDetailMobile = styled.div`
  @media screen and (min-width: 786px) {
    display: none;
  }
`;

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [post, setPost] = useState<PostType | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        if (postId) {
          const res = await postApi.getPost(postId);
          setPost(res.data);
        }
      } catch (error: any) {
        if (error.response.status === 401) {
          navigate("/login");
          dispatch(authActions.logout());
        }
      }
    }

    fetchPost();
  }, [postId]);

  return (
    <StyledPostDetailPage>
      <StyledPostDetailPC>
        {post && <PostDetail post={post}></PostDetail>}
      </StyledPostDetailPC>

      <StyledPostDetailMobile>
        {post && <PostDetailMobile post={post}></PostDetailMobile>}
      </StyledPostDetailMobile>
    </StyledPostDetailPage>
  );
};

export default PostDetailPage;
