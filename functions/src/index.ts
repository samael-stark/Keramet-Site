import { onDocumentDeleted } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

admin.initializeApp();

const bucket = admin.storage().bucket();

export const deleteProductImages = onDocumentDeleted(
  "products/{productId}",
  async (event) => {
    const data = event.data?.data();

    if (!data) {
      console.log("No data on deleted document.");
      return;
    }

    const images = data.images as string[] | undefined;

    if (!images || !Array.isArray(images) || images.length === 0) {
      console.log("No images to delete.");
      return;
    }

    await Promise.all(
      images.map(async (url) => {
        try {
          // URL looks like:
          // https://firebasestorage.googleapis.com/v0/b/<bucket>/o/products%2Ffile.jpg?alt=media&token=...
          const decoded = decodeURIComponent(url);
          const match = decoded.match(/\/o\/(.*?)\?/);
          const filePath = match?.[1];

          if (!filePath) {
            console.log("Could not parse file path from URL:", url);
            return;
          }

          await bucket.file(filePath).delete();
          console.log("Deleted:", filePath);
        } catch (err) {
          console.error("Failed deleting image:", err);
        }
      }),
    );

    console.log("Finished deleting images for deleted product.");
  },
);
