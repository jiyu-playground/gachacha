import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ListItem from "../components/ListItem";
import "../styles/List.css";

export type postType = {
  id: number;
  userId: string;
  text: string;
  createdAt: string;
  spot: string;
  image?: string | null;
};

const List = () => {
  const [posts, setPosts] = useState<postType[]>([]);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("feed")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("데이터 가져오기 실패:", error);
        return;
      }

      const postsData: postType[] = data.map((item) => ({
        id: item.id,
        userId: item.userId,
        text: item.text,
        createdAt: item.created_at,
        spot: item.spot,
        image: item.image,
      }));

      setPosts(postsData);
    } catch (error) {
      console.error("데이터 가져오기 중 오류:", error);
    }
  };

  const onClickEdit = (id: number) => {
    navigate(`/write?id=${id}`);
  };

  const onClickDelete = async (id: number) => {
    if (!confirm("삭제하시겠습니까?")) return;
    try {
      const { error } = await supabase.from("feed").delete().eq("id", id);
      if (error) throw error;
      alert("해당 게시물이 삭제되었습니다.");
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("삭제 중 오류 발생 >> ", error);
      alert("게시물 삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="feed active">
      {posts.map((post) => (
        <ListItem
          key={post.id}
          {...post}
          onEdit={onClickEdit}
          onDelete={onClickDelete}
        />
      ))}
    </div>
  );
};

export default List;
