<template>
 <div class="slider-container" @click="handleOutsideClick">
   <!-- Fade transition wrapper for smooth mounting/unmounting -->
   <transition name="fade">
     <div class="slider-wrapper" v-if="mounted">
       <div class="slider-content">
         <!-- Swiper component configuration with advanced features -->
         <swiper
           :modules="[Navigation, Pagination, EffectFade]"
           :slides-per-view="1"
           :initial-slide="initialIndex"
           :space-between="30"
           :pagination="{ clickable: true, dynamicBullets: true }"
           :navigation="true"
           :grab-cursor="true"
           :keyboard="{ enabled: true }"
           :effect="'fade'"
           :speed="400"
           :touchRatio="1.5"
           :resistance="false"
           :fade-effect="{ crossFade: true }"
           @swiper="onSwiperInitialized"
           @slideChange="onSlideChange"
           class="swiper-container"
         >
           <swiper-slide v-for="photo in photos" :key="photo.id">
             <div class="slide-content">
               <div class="profile-card" @click.stop>
                 <div class="image-container">
                   <img 
                     :src="photo.urls.regular" 
                     :data-src="photo.urls.full" 
                     :alt="photo.alt_description" 
                     class="slide-image" 
                     :class="{ 'loading': imageLoading }"
                     @load="imageLoaded"
                   />
                   <div class="image-loading" v-if="imageLoading">
                     <div class="spinner"></div>
                   </div>
                 </div>
                 <div class="photo-info">
                   <h2 class="photographer-name">{{ photo.user?.name || 'Unknown photographer' }}</h2>
                   <p class="photographer-location" v-if="photo.user?.location">{{ photo.user.location }}</p>
                 </div>
               </div>
             </div>
           </swiper-slide>
         </swiper>
       </div>
       <button class="close-button" @click.stop="close">
         <span>×</span>
       </button>
     </div>
   </transition>
 </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
// Import Swiper modules
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default {
 components: {
   Swiper,
   SwiperSlide,
 },
 props: {
   // Array of photo objects from Unsplash or similar service
   photos: {
     type: Array,
     required: true,
   },
   // Starting slide index when opening the slider
   initialIndex: {
     type: Number,
     default: 0,
   },
 },
 setup(props, { emit }) {
   // Controls component visibility and animation
   const mounted = ref(false);
   // Reference to current Swiper instance for programmatic control
   const currentSwiper = ref(null);
   // Controls loading state for progressive image loading
   const imageLoading = ref(true);

   // Lifecycle and event handlers...
   onMounted(async () => {
     // Delay mounting to ensure smooth entrance animation
     await nextTick();
     mounted.value = true;
     
     // Enable keyboard navigation
     document.addEventListener('keydown', handleKeydown);
   });

   const onSwiperInitialized = (swiper) => {
     currentSwiper.value = swiper;
     // Start loading high-res image for current slide
     loadHighResImage(swiper.activeIndex);
   };

   const onSlideChange = (swiper) => {
     imageLoading.value = true;
     // Load high-res image for new active slide
     loadHighResImage(swiper.activeIndex);
   };

   // Image loading optimization functions...
   const loadHighResImage = (index) => {
     // Progressive image loading strategy:
     // 1. Show regular quality image first
     // 2. Load high-res version in background
     // 3. Swap once high-res is ready
     const slide = document.querySelectorAll('.swiper-slide')[index];
     if (!slide) return;
     
     const img = slide.querySelector('img');
     if (!img) return;
     
     const highResSrc = img.getAttribute('data-src');
     
     // Preload high resolution image
     const preloadImg = new Image();
     preloadImg.onload = () => {
       img.src = highResSrc;
       imageLoading.value = false;
     };
     preloadImg.onerror = () => {
       imageLoading.value = false;
     };
     preloadImg.src = highResSrc;
   };

   const imageLoaded = () => {
     imageLoading.value = false;
   };

   // User interaction handlers...
   const handleKeydown = (e) => {
     // Support keyboard navigation and escape to close
     if (e.key === 'Escape') {
       close();
     } else if (e.key === 'ArrowLeft' && currentSwiper.value) {
       currentSwiper.value.slidePrev();
     } else if (e.key === 'ArrowRight' && currentSwiper.value) {
       currentSwiper.value.slideNext();
     }
   };

   const close = () => {
     // First set mounted to false to trigger exit animation
     mounted.value = false;
     
     // Remove keyboard event listeners
     document.removeEventListener('keydown', handleKeydown);
     
     // Emit close event after animation completes
     setTimeout(() => {
       emit('close');
     }, 300); // Match this with your CSS transition duration
   };

   const handleOutsideClick = (event) => {
     // Only close if clicking directly on the slider-container
     if (event.target.classList.contains('slider-container')) {
       close();
     }
   };

   return {
     mounted,
     imageLoading,
     Navigation,
     Pagination,
     EffectFade,
     onSwiperInitialized,
     onSlideChange,
     imageLoaded,
     close,
     handleOutsideClick,
   };
 },
};
</script>

<style scoped lang="scss">
// Layout styles
.slider-container {
 // Fixed positioning creates a modal-like overlay
 position: fixed;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 background-color: rgba(0, 0, 0, 0.55);
 z-index: 9999;
 display: flex;
 justify-content: center;
 align-items: center;
 backdrop-filter: blur(0px);
}

.slider-wrapper {
 width: 100%;
 height: 100%;
 display: flex;
 flex-direction: column;
 justify-content: center;
}

.slider-content {
 width: 100%;
 height: 100%;
 display: flex;
 align-items: center;
 justify-content: center;
}

.swiper-container {
 width: 100%;
 height: 100%;
}

.slide-content {
 display: flex;
 flex-direction: column;
 align-items: center;
 justify-content: center;
 height: 100%;
 padding: 20px;
}

// Card and image styles
.profile-card {
 // Modern card design with subtle hover effect
 max-width: 400px;
 width: 90%;
 background-color: white;
 border-radius: 16px;
 overflow: hidden;
 box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
 transition: transform 0.3s ease-out;
  
 &:hover {
   transform: translateY(-2px);
 }
}

.image-container {
 position: relative;
 width: 100%;
 height: 0;
 padding-bottom: 100%; /* 1:1 Aspect Ratio */
 overflow: hidden;
}

.slide-image {
 position: absolute;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 object-fit: cover;
 transition: opacity 0.3s ease, transform 0.5s ease;
 transform-origin: center;
 
 &.loading {
   opacity: 0.5;
 }
 
 &:hover {
   transform: scale(1.05);
 }
}

.image-loading {
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
}

.spinner {
 width: 40px;
 height: 40px;
 border: 4px solid rgba(255, 255, 255, 0.3);
 border-radius: 50%;
 border-top-color: white;
 animation: spin 1s ease-in-out infinite;
}

// Animation keyframes and transitions
@keyframes spin {
 to { transform: rotate(360deg); }
}

.photo-info {
 padding: 20px;
 background-color: white;
 color: #1a2b4a;
 
 .photographer-name {
   font-size: 20px;
   font-weight: 700;
   margin: 0 0 8px 0;
   color: #1a2b4a;
 }
 
 .photographer-location {
   font-size: 16px;
   color: #6b7280;
   margin: 0 0 12px 0;
 }
 
 .photo-description {
   font-size: 14px;
   line-height: 1.5;
   margin: 0;
   color: #4b5563;
 }
}

.close-button {
 position: absolute;
 top: 20px;
 right: 20px;
 width: 44px;
 height: 44px;
 background: rgba(0, 0, 0, 0.5);
 border: none;
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 color: white;
 font-size: 28px;
 cursor: pointer;
 transition: background-color 0.3s;
 z-index: 10;
 
 &:hover {
   background: rgba(0, 0, 0, 0.8);
 }
 
 span {
   line-height: 1;
 }
}

// Fade transition
.fade-enter-active,
.fade-leave-active {
 transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
 opacity: 0;
}

// Update the fade transition
.fade-enter-active {
  transition: all 0.4s ease-out;
}
.fade-leave-active {
  transition: all 0.3s ease-in;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

// Add slide transition styles for swiper
:deep(.swiper) {
  .swiper-slide {
    transition: transform 0.4s ease-out;
    
    img {
      transition: opacity 0.4s ease-out, transform 0.4s ease-out;
    }
  }

  .swiper-slide-active {
    transform: scale(1);
    z-index: 2;
    
    img {
      opacity: 1;
    }
  }

  .swiper-slide-prev,
  .swiper-slide-next {
    transform: scale(0.9);
    opacity: 0.7;
  }
}

// Enhance navigation button transitions
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  transition: all 0.3s ease;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
}

// Style overrides for Swiper navigation
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
 color: white;
 background: rgba(0, 0, 0, 0.5);
 width: 50px;
 height: 50px;
 border-radius: 50%;
 
 &:after {
   font-size: 22px;
 }
 
 &:hover {
   background: rgba(0, 0, 0, 0.8);
 }
}

:deep(.swiper-pagination-bullet) {
 background: white;
 opacity: 0.7;
}

:deep(.swiper-pagination-bullet-active) {
 opacity: 1;
}

// Responsive design breakpoints
@media (max-width: 768px) {
 // Mobile-optimized styles
 .profile-card {
   max-width: 90%;
 }
 
 .photo-info {
   padding: 16px;
 }
 
 // Smaller navigation buttons on mobile
 :deep(.swiper-button-next),
 :deep(.swiper-button-prev) {
   width: 40px;
   height: 40px;
   
   &:after {
     font-size: 18px;
   }
 }
 
 .close-button {
   top: 10px;
   right: 10px;
   width: 40px;
   height: 40px;
 }
}
</style>