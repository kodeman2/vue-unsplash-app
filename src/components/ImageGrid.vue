<template>
  <!-- Main container for the image grid -->
  <div class="image-grid">
    <!-- Loading placeholder while images are loading -->
    <div v-if="loading" class="loading-container">
      <LoadingPlaceholder v-for="i in 6" :key="i" />
    </div>
    <!-- Grid layout for displaying images -->
    <div v-else class="grid">
      <!-- Loop through the photos array and display each photo -->
      <div
        v-for="(photo, index) in photos"
        :key="photo.id"
        class="grid-item"
        :class="{ 'first-row': index < 4 }"
        @click="openSlider(index)"
      >
        <!-- Container for the image and overlay -->
        <div class="image-container">
          <img :src="photo.urls.regular" :alt="photo.alt_description" />
          <!-- Overlay for displaying image details -->
          <div class="overlay">
            <div class="details">
              <!-- Display the author's name -->
              <p class="author">{{ photo.user?.name }}</p>
              <!-- Display the location or 'Unknown' if not available -->
              <p class="location">{{ photo.user?.location || 'Unknown' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Image slider component for displaying images in a slider -->
    <ImageSlider 
      v-if="showSlider" 
      :photos="photos" 
      :initialIndex="currentSlideIndex" 
      @close="closeSlider" 
    />
  </div>
</template>

<script>
// Import necessary modules from vue
import { ref, onMounted, watch } from 'vue';
// Import axios for making HTTP requests
import axios from 'axios';
// Import the LoadingPlaceholder component
import LoadingPlaceholder from './LoadingPlaceholder.vue';
// Import the ImageSlider component
import ImageSlider from './imageSlider.vue';

// Export the default component
export default {
  // Register the components used in this component
  components: {
    LoadingPlaceholder,
    ImageSlider,
  },
  // Define the props for this component
  props: {
    searchTerm: {
      type: String,
      default: '',
    },
  },
  // Setup function for the component
  setup(props) {
    // Define reactive variables using ref
    const photos = ref([]);
    const loading = ref(true);
    const showSlider = ref(false);
    const currentSlideIndex = ref(0);

    // Define the API key and URL
    const apiKey = 'kpgX9Ck6lwsljljHUWG-LDsRSkZVA028BvCoQs6vNi8';
    const apiUrl = 'https://api.unsplash.com/search/photos';

    // Function to fetch photos from the Unsplash API
    const fetchPhotos = async () => {
      loading.value = true;
      try {
        const response = await axios.get(apiUrl, {
          params: {
            client_id: apiKey,
            query: props.searchTerm || 'African',
            per_page: 8, // Fetch 8 photos
            order_by: 'random', // Fetch random photos
          },
        });
        photos.value = response.data.results;
        console.log('Photos:', photos.value);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        loading.value = false;
      }
    };

    // Call fetchPhotos on component mount
    onMounted(() => {
      fetchPhotos();
    });

    // Watch for changes in the searchTerm prop and fetch photos
    watch(
      () => props.searchTerm,
      () => {
        fetchPhotos();
      }
    );

    // Function to open the image slider
    const openSlider = (index) => {
      currentSlideIndex.value = index;
      showSlider.value = true;
      // Prevent scrolling on body when slider is open
      document.body.style.overflow = 'hidden';
    };

    // Function to close the image slider
    const closeSlider = () => {
      showSlider.value = false;
      // Re-enable scrolling
      document.body.style.overflow = 'auto';
    };

    // Return the reactive variables and functions
    return {
      photos,
      loading,
      showSlider,
      currentSlideIndex,
      openSlider,
      closeSlider,
    };
  },
};
</script>

<style scoped lang="scss">
.image-grid {
  padding: 0px 200px;
  margin-top: -30px;

  .loading-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    align-items: start; // Ensures natural staggered effect

    .grid-item {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
      cursor: pointer;

      // Varying heights for staggered layout
      &:nth-child(odd) {
        height: 320px;
      }
      &:nth-child(even) {
        height: 280px;
      }

      .image-container {
        position: relative;
        width: 100%;
        height: 100%;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        // Full overlay with gradient
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.2),
            rgba(0, 0, 0, 0.4) 70%,
            rgba(0, 0, 0, 0.7)
          );
          color: white;
          opacity: 1; // Changed from 0 to 1
          transition: all 0.3s ease;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;

          .details {
            transform: translateY(0); // Changed from translateY(20px)
            transition: transform 0.3s ease;
            padding-bottom: 10px;

            .author {
              font-weight: bold;
              margin: 0;
              font-size: 16px;
              line-height: 1.4;
            }

            .location {
              font-size: 14px;
              opacity: 0.8;
              margin: 4px 0 0 0;
              line-height: 1.2;
            }
          }
        }

        // Hover effects
        &:hover {
          img {
            transform: scale(1.05);
          }
        }
      }

      // Hover effect (subtle zoom)
      &:hover {
        transform: scale(1.02);
      }
    }
  }
}

// Responsive Adjustments
@media (max-width: 1024px) {
  .image-grid {
    padding: 30px 50px;
  }
}

@media (max-width: 768px) {
  .image-grid {
    padding: 20px;
    
    .grid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

      .grid-item {
        height: 250px;
      }
    }
  }
}
</style>
/* eslint-enable */
