import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";

export const uploadImage = async (file: File, userId: string) => {
  try {
    // 파일 이름 만들기(중복 방지)
    const timestamp = Date.now();
    const fileName = `image/${userId}/${timestamp}_${file.name}`;

    // Storage 참조 만들기
    const storageRef = ref(storage, fileName);
    console.log("이미지 업로드 시작");
    const snapshot = await uploadBytes(storageRef, file);

    // 다운로드 URL 가져오기
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("이미지 업로드 완료:", downloadURL);

    return downloadURL;
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    throw error;
  }
};
