import ListItem from "../components/ListItem";
import "../styles/List.css";
import { db } from "../../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useState, useEffect } from "react";

export type postType = {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  spot: string;
};

const List = () => {
  const [posts, setPosts] = useState<postType[]>([]);
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.data().userId || "익명",
        text: doc.data().text,
        createdAt: doc.data().createdAt,
        spot: doc.data().spot,
      })) as postType[];
      setPosts(postsData);
    } catch (error) {
      console.log("가져오기 실패:", error);
    }
  };
  return (
    <div className="feed active">
      {posts.map((post) => {
        return <ListItem key={post.id} {...post} />;
      })}
    </div>
  );
};

export default List;
