// src/lib/storage.ts - NOWY PLIK
import { supabase } from "./supabase";

export async function testBucketConnection() {
  try {
    console.log("🧪 Testing bucket connection...");

    // Test 1: Sprawdź czy bucket istnieje
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error("❌ Bucket list error:", bucketsError);
      return false;
    }

    const listingImagesBucket = buckets?.find(
      (bucket) => bucket.name === "listing-images"
    );

    if (!listingImagesBucket) {
      console.error("❌ Bucket 'listing-images' not found");
      return false;
    }

    console.log("✅ Bucket found:", listingImagesBucket);

    // Test 2: Spróbuj upload testowego pliku
    const testBlob = new Blob(["test"], { type: "text/plain" });
    const testFile = new File([testBlob], "test.txt");

    const { error: uploadError } = await supabase.storage
      .from("listing-images")
      .upload("test-file.txt", testFile);

    if (uploadError) {
      console.error("❌ Upload test failed:", uploadError);
      return false;
    }

    console.log("✅ Upload test successful");

    // Test 3: Spróbuj pobrać publiczny URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("listing-images").getPublicUrl("test-file.txt");

    console.log("✅ Public URL test:", publicUrl);

    // Test 4: Spróbuj usunąć testowy plik
    const { error: deleteError } = await supabase.storage
      .from("listing-images")
      .remove(["test-file.txt"]);

    if (deleteError) {
      console.error("❌ Delete test failed:", deleteError);
      return false;
    }

    console.log("✅ All storage tests passed!");
    return true;
  } catch (error) {
    console.error("💥 Storage test error:", error);
    return false;
  }
}

// Wywołaj test przy starcie aplikacji
testBucketConnection().then((success) => {
  console.log(
    success
      ? "🎉 Storage configured correctly"
      : "❌ Storage configuration failed"
  );
});

export async function deleteImagesFromStorage(
  imageUrls: string[]
): Promise<void> {
  if (!imageUrls || imageUrls.length === 0) {
    console.log("📭 No images to delete");
    return;
  }

  console.log("🗑️ Deleting images from storage:", imageUrls);

  try {
    // Ekstrahuj nazwy plików z URLi
    const filePaths = imageUrls.map((url) => {
      // URL format: https://xxx.supabase.co/storage/v1/object/public/listing-images/listing-id/filename.jpg
      const parts = url.split("/");
      const fileNameWithFolder = parts.slice(-2).join("/"); // "listing-id/filename.jpg"
      return fileNameWithFolder;
    });

    console.log("📝 File paths to delete:", filePaths);

    const { error } = await supabase.storage
      .from("listing-images")
      .remove(filePaths);

    if (error) {
      console.error("❌ Error deleting images from storage:", error);
      throw new Error(`Failed to delete images: ${error.message}`);
    }

    console.log("✅ Successfully deleted images from storage");
  } catch (error) {
    console.error("💥 Failed to delete images:", error);
    throw error;
  }
}

// Funkcja do usuwania pojedynczego zdjęcia
export async function deleteSingleImage(imageUrl: string): Promise<void> {
  return deleteImagesFromStorage([imageUrl]);
}

export async function cleanupUnusedImages(): Promise<void> {
  try {
    console.log("🧹 Cleaning up unused images...");

    // Pobierz wszystkie pliki z bucketu
    const { data: allFiles, error: listError } = await supabase.storage
      .from("listing-images")
      .list(undefined, { limit: 1000 });

    if (listError) {
      console.error("❌ Error listing files:", listError);
      return;
    }

    console.log("📁 Files in storage:", allFiles?.length);

    // Pobierz wszystkie listingi z bazy
    const { data: allListings, error: listingsError } = await supabase
      .from("listings")
      .select("id, images");

    if (listingsError) {
      console.error("❌ Error fetching listings:", listingsError);
      return;
    }

    // Zbierz wszystkie używane zdjęcia
    const usedImages = new Set<string>();
    allListings?.forEach((listing) => {
      listing.images?.forEach((imageUrl: string) => {
        const fileName = imageUrl.split("/").pop();
        if (fileName) {
          usedImages.add(fileName);
        }
      });
    });

    console.log("🔍 Used images:", usedImages.size);

    // Znajdź nieużywane pliki
    const unusedFiles =
      allFiles?.filter((file) => !usedImages.has(file.name)) || [];

    console.log("🗑️ Unused files to delete:", unusedFiles.length);

    if (unusedFiles.length > 0) {
      const filePaths = unusedFiles.map((file) => file.name);

      const { error: deleteError } = await supabase.storage
        .from("listing-images")
        .remove(filePaths);

      if (deleteError) {
        console.error("❌ Error deleting unused files:", deleteError);
      } else {
        console.log("✅ Deleted unused files:", unusedFiles.length);
      }
    }
  } catch (error) {
    console.error("💥 Cleanup error:", error);
  }
}

export async function ensureBucketExists() {
  try {
    console.log("🔍 Checking if bucket exists...");

    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error("❌ Error checking buckets:", error);
      return false;
    }

    const listingImagesBucket = buckets?.find(
      (bucket) => bucket.name === "listing-images"
    );

    if (!listingImagesBucket) {
      console.log("📦 Bucket doesn't exist, creating...");

      // Spróbuj utworzyć bucket
      const { data, error: createError } = await supabase.storage.createBucket(
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

      console.log("✅ Bucket created successfully");
      return true;
    }

    console.log("✅ Bucket exists");
    return true;
  } catch (error) {
    console.error("💥 Bucket check failed:", error);
    return false;
  }
}

export async function deleteListingImages(listingId: string): Promise<void> {
  try {
    console.log("🗑️ Deleting all images for listing:", listingId);

    // List wszystkie pliki w folderze listinga
    const { data: files, error } = await supabase.storage
      .from("listing-images")
      .list(listingId);

    if (error) {
      console.error("❌ Error listing files:", error);
      return;
    }

    if (!files || files.length === 0) {
      console.log("📭 No files to delete");
      return;
    }

    const filePaths = files.map((file) => `${listingId}/${file.name}`);
    console.log("📝 Files to delete:", filePaths);

    const { error: deleteError } = await supabase.storage
      .from("listing-images")
      .remove(filePaths);

    if (deleteError) {
      console.error("❌ Error deleting files:", deleteError);
    } else {
      console.log("✅ Successfully deleted files:", filePaths.length);
    }
  } catch (error) {
    console.error("💥 Delete error:", error);
  }
}

// Usuń pojedyncze zdjęcie po URL
export async function deleteImageByUrl(imageUrl: string): Promise<void> {
  try {
    // Wyodrębnij ścieżkę z URL
    // URL format: https://xxx.supabase.co/storage/v1/object/public/listing-images/listing-id/filename.jpg
    const urlParts = imageUrl.split("/");
    const fileNameWithFolder = urlParts.slice(-2).join("/"); // "listing-id/filename.jpg"

    console.log("🗑️ Deleting image:", fileNameWithFolder);

    const { error } = await supabase.storage
      .from("listing-images")
      .remove([fileNameWithFolder]);

    if (error) {
      console.error("❌ Error deleting image:", error);
    } else {
      console.log("✅ Image deleted:", fileNameWithFolder);
    }
  } catch (error) {
    console.error("💥 Delete error:", error);
  }
}

// Wywołaj przy starcie aplikacji
// ensureBucketExists();
