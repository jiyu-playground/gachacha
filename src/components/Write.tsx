import { useNavigate } from "react-router-dom";
import "../styles/Write.css";
import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../hooks/useAuth";
import { uploadImage } from "../utils/uploadImage";

type newPost = {
  userId: string;
  userName: string;
  spot: string;
  text: string;
  image: File | null;
  date: string;
};

const Write = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const storage = getStorage();

  useEffect(() => {
    if (!user) {
      alert("글쓰기는 로그인이 필요합니다.");
      return navigate("/");
    }
  }, [user, navigate]);

  const [newPost, setNewPost] = useState<newPost>({
    userId: user?.uid || "",
    userName: user?.displayName,
    spot: "",
    text: "",
    image: null,
    date: new Date().toLocaleDateString(),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("글쓰기는 로그인이 필요합니다.");
      return;
    }

    if (!newPost.spot.trim() || !newPost.text.trim()) {
      alert("가챠 위치와 내용을 입력해주세요.");
      return;
    }

    try {
      let imageUrl = "";
      if (newPost.image) {
        imageUrl = await uploadImage(newPost.image, user.uid);
      }

      await addDoc(collection(db, "posts"), {
        userId: user.uid,
        userName: user.displayName,
        text: newPost.text,
        spot: newPost.spot,
        image: imageUrl,
        createdAt: new Date(),
      });

      alert("게시물이 등록되었습니다.");
      navigate("/list");
    } catch (err) {
      console.error(err);
      alert("게시물 등록을 실패하였습니다.");
    }
  };

  const onChangeWrite = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files && files[0]) {
      setNewPost((prev) => ({ ...prev, image: files[0] }));
    } else {
      setNewPost((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div>
      <div className="post-form">
        <h3 className="section-title">📍오늘 나의 가차차</h3>
        <form>
          <div className="form-group">
            <label className="form-label">가챠샵 위치</label>
            <input
              type="text"
              className="form-control"
              placeholder="예: 강남역 가챠샵"
              onChange={onChangeWrite}
              name="spot"
            />
          </div>
          <div className="form-group">
            <label className="form-label">득템 내용</label>
            <textarea
              className="form-control"
              placeholder="어떤 가챠를 득템했나요?"
              name="text"
              onChange={onChangeWrite}
            ></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">사진 업로드</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              name="image"
              onChange={onChangeWrite}
            />
          </div>
          <div className="flex-div">
            <button
              type="submit"
              className="btn primary center"
              onClick={onSubmit}
            >
              게시하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Write;
