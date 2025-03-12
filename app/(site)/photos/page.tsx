import { getAllPhotoCategories, getPhotosByCategory, getAllTags, Photo } from "@/lib/photos"
import { PhotoGallery } from "./photo-gallery"

// Generate static metadata for the photos page
export const metadata = {
  title: "Photography Portfolio",
  description: "A collection of my favorite photographs from around the world."
}

export default async function PhotosPage() {
  // Fetch all data at build time
  const categoriesData = await getAllPhotoCategories();
  const categories = categoriesData.map(category => ({
    id: category,
    name: category.charAt(0).toUpperCase() + category.slice(1)
  }));
  
  const allTags = await getAllTags();
  
  // Get photos for each category
  const photosByCategory: Record<string, Photo[]> = {};
  for (const category of categories) {
    photosByCategory[category.id] = await getPhotosByCategory(category.id);
  }
  
  // Default active category
  const defaultCategory = categories.length > 0 ? categories[0].id : "";
  
  return (
    <div className="container py-12">
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Photography Portfolio</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A collection of my favorite photographs from around the world. Browse by category to explore landscapes,
            urban scenes, portraits, and travel photography.
          </p>
        </div>
        
        {/* Client component for interactive gallery */}
        <PhotoGallery 
          categories={categories}
          photosByCategory={photosByCategory}
          allTags={allTags}
          defaultCategory={defaultCategory}
        />
      </div>
    </div>
  )
}
