import { supabase } from "./supabase";

// export async function testBucketConnection() {
//   try {
//     const { data: buckets, error: bucketsError } =
//       await supabase.storage.listBuckets();

//     if (bucketsError) {
//       console.error("❌ Bucket list error:", bucketsError);
//       return false;
//     }

//     const listingImagesBucket = buckets?.find(
//       (bucket) => bucket.name === "listing-images"
//     );

//     if (!listingImagesBucket) {
//       console.error("❌ Bucket 'listing-images' not found");
//       return false;
//     }

//     const testBlob = new Blob(["test"], { type: "text/plain" });
//     const testFile = new File([testBlob], "test.txt");

//     const { error: uploadError } = await supabase.storage
//       .from("listing-images")
//       .upload("test-file.txt", testFile);

//     if (uploadError) {
//       console.error("❌ Upload test failed:", uploadError);
//       return false;
//     }

//     const { error: deleteError } = await supabase.storage
//       .from("listing-images")
//       .remove(["test-file.txt"]);

//     if (deleteError) {
//       console.error("❌ Delete test failed:", deleteError);
//       return false;
//     }

//     return true;
//   } catch (error) {
//     console.error("💥 Storage test error:", error);
//     return false;
//   }
// }

// testBucketConnection().then((success) => {
//   console.log(
//     success
//       ? "🎉 Storage configured correctly"
//       : "❌ Storage configuration failed"
//   );
// });

export async function deleteImagesFromStorage(
  imageUrls: string[]
): Promise<void> {
  if (!imageUrls || imageUrls.length === 0) {
    return;
  }

  try {
    const filePaths = imageUrls.map((url) => {
      const parts = url.split("/");
      const fileNameWithFolder = parts.slice(-2).join("/");
      return fileNameWithFolder;
    });

    const { error } = await supabase.storage
      .from("listing-images")
      .remove(filePaths);

    if (error) {
      console.error("❌ Error deleting images from storage:", error);
      throw new Error(`Failed to delete images: ${error.message}`);
    }
  } catch (error) {
    console.error("💥 Failed to delete images:", error);
    throw error;
  }
}

export async function deleteSingleImage(imageUrl: string): Promise<void> {
  return deleteImagesFromStorage([imageUrl]);
}

export async function cleanupUnusedImages(): Promise<void> {
  try {
    const { data: allFiles, error: listError } = await supabase.storage
      .from("listing-images")
      .list(undefined, { limit: 1000 });

    if (listError) {
      console.error("❌ Error listing files:", listError);
      return;
    }

    const { data: allListings, error: listingsError } = await supabase
      .from("listings")
      .select("id, images");

    if (listingsError) {
      console.error("❌ Error fetching listings:", listingsError);
      return;
    }

    const usedImages = new Set<string>();
    allListings?.forEach((listing) => {
      listing.images?.forEach((imageUrl: string) => {
        const fileName = imageUrl.split("/").pop();
        if (fileName) {
          usedImages.add(fileName);
        }
      });
    });

    const unusedFiles =
      allFiles?.filter((file) => !usedImages.has(file.name)) || [];

    if (unusedFiles.length > 0) {
      const filePaths = unusedFiles.map((file) => file.name);

      const { error: deleteError } = await supabase.storage
        .from("listing-images")
        .remove(filePaths);

      if (deleteError) {
        console.error("❌ Error deleting unused files:", deleteError);
      }
    }
  } catch (error) {
    console.error("💥 Cleanup error:", error);
  }
}

export async function ensureBucketExists() {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error("❌ Error checking buckets:", error);
      return false;
    }

    const listingImagesBucket = buckets?.find(
      (bucket) => bucket.name === "listing-images"
    );

    if (!listingImagesBucket) {
      const { error: createError } = await supabase.storage.createBucket(
        "listing-images",
        {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        }
      );

      if (createError) {
        console.error("❌ Error creating bucket:", createError);
        return false;
      }

      return true;
    }

    return true;
  } catch (error) {
    console.error("💥 Bucket check failed:", error);
    return false;
  }
}

export async function deleteListingImages(listingId: string): Promise<void> {
  try {
    const { data: files, error } = await supabase.storage
      .from("listing-images")
      .list(listingId);

    if (error) {
      console.error("❌ Error listing files:", error);
      return;
    }

    if (!files || files.length === 0) {
      return;
    }

    const filePaths = files.map((file) => `${listingId}/${file.name}`);

    const { error: deleteError } = await supabase.storage
      .from("listing-images")
      .remove(filePaths);

    if (deleteError) {
      console.error("❌ Error deleting files:", deleteError);
    }
  } catch (error) {
    console.error("💥 Delete error:", error);
  }
}

export async function deleteImageByUrl(imageUrl: string): Promise<void> {
  try {
    const urlParts = imageUrl.split("/");
    const fileNameWithFolder = urlParts.slice(-2).join("/");

    const { error } = await supabase.storage
      .from("listing-images")
      .remove([fileNameWithFolder]);

    if (error) {
      console.error("❌ Error deleting image:", error);
    }
  } catch (error) {
    console.error("💥 Delete error:", error);
  }
}
