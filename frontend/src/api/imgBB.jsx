import axios from "axios";

const API_KEY = "c1546aafb6c07a4f2d5beda27752d31e"

export const uploadImage = async (imageFile) => {

    const formData = new FormData();
    formData.append("image", imageFile);
    const response = await axios.post(
        // ImgBB사이트 이미지 업로드 주소
        `https://api.imgbb.com/1/upload?key=${API_KEY}`,
        formData
    );

    return response.data.data.url
}