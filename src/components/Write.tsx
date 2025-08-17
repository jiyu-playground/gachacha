import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../supabaseClient";
import "../styles/Write.css";

type PostData = {
  userId: string;
  spot: string;
  text: string;
  image?: File | null;
  existingImageUrl?: string | null;
};

const Write = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const postId = Number(searchParams.get("id"));

  const [post, setPost] = useState<PostData>({
    userId: user?.id || "",
    spot: "",
    text: "",
    image: null,
    existingImageUrl: null,
  });

  useEffect(() => {
    if (!user) {
      alert("글쓰기는 로그인이 필요합니다.");
      navigate("/");
      return;
    }

    if (postId) {
      const fetchPost = async () => {
        try {
          const { data, error } = await supabase
            .from("feed")
            .select("*")
            .eq("id", postId)
            .single();

          if (error) throw error;

          if (data) {
            if (data.userId !== user.id) {
              alert("수정 권한이 없습니다.");
              return;
            }
            setPost({
              userId: data.userId,
              spot: data.spot,
              text: data.text,
              existingImageUrl: data.image,
            });
          }
        } catch (error) {
          console.error("게시물 정보를 가져오지 못했습니다.", error);
          alert("게시물 정보를 가져오는 데 실패했습니다.");
          navigate("/");
        }
      };
      fetchPost();
    }
  }, [postId, user, navigate]);

  const uploadImage = async (file: File, userId: string): Promise<string> => {
    try {
      const fileExt = file.name.split(".").pop() || "";
      const originalFileName = file.name.substring(
        0,
        file.name.lastIndexOf(".") || file.name.length
      );
      const sanitizedFileName = originalFileName.replace(
        /[^\w\/!\-.\*'\(\)\s&\$@=;:+,\?]/g,
        "_"
      );
      const timestamp = Date.now();
      const fileName = `${userId}/${timestamp}_${sanitizedFileName}.${fileExt}`;

      const { error } = await supabase.storage
        .from("images")
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      throw error;
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!post.spot.trim() || !post.text.trim()) {
      alert("가챠 위치와 내용을 입력해주세요.");
      return;
    }

    try {
      let imageUrl = post.existingImageUrl;

      if (post.image) {
        imageUrl = await uploadImage(post.image, user.id);
      }

      const postData = {
        userId: user.id,
        spot: post.spot,
        text: post.text,
        image: imageUrl,
      };

      if (postId) {
        const { error } = await supabase
          .from("feed")
          .update(postData)
          .eq("id", postId);
        if (error) throw error;
        alert("게시물이 수정되었습니다!");
      } else {
        const { error } = await supabase.from("feed").insert([postData]);
        if (error) throw error;
        alert("게시물이 등록되었습니다!");
      }
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("작업을 완료하지 못했습니다.");
    }
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "image" && files && files[0]) {
      if (files[0].size > 5 * 1024 * 1024) {
        alert("이미지 크기는 5MB 이하여야 합니다.");
        return;
      }
      setPost((prev) => ({ ...prev, image: files[0] }));
    } else {
      setPost((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div>
      <div className="post-form">
        <h3 className="section-title">
          {postId ? "📝 게시물 수정" : "📍 오늘 나의 가차차"}
        </h3>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">가챠샵 위치</label>
            <input
              type="text"
              className="form-control"
              placeholder="예: 강남역 가챠샵"
              onChange={onChange}
              name="spot"
              value={post.spot}
            />
          </div>
          <div className="form-group">
            <label className="form-label">득템 내용</label>
            <textarea
              className="form-control"
              placeholder="어떤 가챠를 득템했나요?"
              name="text"
              onChange={onChange}
              value={post.text}
            />
          </div>
          <div className="form-group">
            <label className="form-label">사진 업로드 (최대 5MB)</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              name="image"
              onChange={onChange}
            />
            {(post.image || post.existingImageUrl) && (
              <div>
                <img
                  src={
                    post.image
                      ? URL.createObjectURL(post.image)
                      : post.existingImageUrl || ""
                  }
                  alt="미리보기"
                  className="image-preview"
                />
              </div>
            )}
          </div>
          <div className="flex-div">
            <button type="submit" className="btn primary center">
              {postId ? "수정하기" : "게시하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Write;
