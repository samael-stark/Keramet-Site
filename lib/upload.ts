import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export async function uploadImagesToStorage(files: File[]) {
  const urls: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}.${ext}`;

    const storageRef = ref(storage, `products/${fileName}`);
    await uploadBytes(storageRef, file);

    const url = await getDownloadURL(storageRef);
    urls.push(url);
  }

  return urls;
}
