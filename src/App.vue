<template>
  <!-- Main application container -->
  <div id="app">
    <!-- Search container -->
    <div class="search-container">
      <!-- Search header -->
      <div class="search-header">
        <!-- Conditional rendering for the header based on search state -->
        <template v-if="!activeSearchTerm || showingSearch">
          <h1></h1>
        </template>
        <template v-else>
          <h1>
            <!-- Search again button -->
            <div @click="resetSearch" class="search-again">
              <img src="https://img.icons8.com/search" />
            </div>
            <!-- Display search results for the search term -->
            Search Results for <div class="search-term">"{{ activeSearchTerm }}"</div>
           
    
          </h1>
        </template>
      </div>
      <!-- Display back button if there is an active search term and not showing search -->
      <!-- <div v-if="activeSearchTerm && !showingSearch" class="results-meta">
        <button class="back-button mobile-back" @click="resetSearch">
          <span class="back-icon">&#8592;</span> New Search
        </button>
      </div> -->
      
      <!-- Search bar, displayed when there is no active search term or showing search -->
      <div class="search-bar" v-if="!activeSearchTerm || showingSearch">
        <div class="input-container">
          <span class="search-icon">&#x1F50E;&#xFE0E;</span>
          <input
            type="text"
            placeholder="Search for photo"
            v-model="searchTerm"
            @keyup.enter="submitSearch"
          />
        </div>
      </div>
      
     
    </div>
    
    <!-- Image grid component -->
    <ImageGrid 
      class="image-grid" 
      :search-term="activeSearchTerm" 
      @loading-started="isSearching = true"
      @results-loaded="handleResultsLoaded" 
    />
  </div>
</template>

<script>
// Import necessary modules from vue
import { ref, watch } from 'vue';
// Import the ImageGrid component
import ImageGrid from './components/ImageGrid.vue';

// Export the default component
export default {
  // Register the components used in this component
  components: {
    ImageGrid,
  },
  // Setup function for the component
  setup() {
    // Define reactive variables using ref
    const searchTerm = ref('');
    const activeSearchTerm = ref('');
    const isSearching = ref(false);
    const showingSearch = ref(true);
    
    // Function to submit the search
    const submitSearch = () => {
      if (searchTerm.value.trim()) {
        activeSearchTerm.value = searchTerm.value;
        isSearching.value = true;
        showingSearch.value = false;
      }
    };
    
    // Function to reset the search
    const resetSearch = () => {
      searchTerm.value = '';
      activeSearchTerm.value = '';
      isSearching.value = false;
      showingSearch.value = true;
    };
    
    // Function to handle the results loaded event
    const handleResultsLoaded = () => {
      isSearching.value = false;
      // Ensure showingSearch stays false when results are loaded
      showingSearch.value = false;
    };
    
    // Add a watcher to make sure state changes are consistent
    watch(activeSearchTerm, (newVal) => {
      if (newVal) {
        showingSearch.value = false;
      } else {
        showingSearch.value = true;
      }
    });
    
    // Return the reactive variables and functions
    return {
      searchTerm,
      activeSearchTerm,
      isSearching,
      showingSearch,
      submitSearch,
      resetSearch,
      handleResultsLoaded
    };
  },
};
</script>

<style lang="scss">
// Import the Roboto font from Google Fonts
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

// Apply styles to the main app container
#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #474849;
  margin: -7px;
}

// Style the search container
.search-container {
  background-color: #edf2f7;
  padding-bottom: 20px;
  height: 200px;

}

// Style the search header
.search-header {
  padding: 40px 0 10px;
  text-align: center;
  
  h1 {
    font-size: 32px;
    color: #283a5a;
    margin: 0;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
  }
  .search-again{
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    margin-right: 10px;

  }
  .search-again img{
    width: 24px;
    height: 24px;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.2);
    }
  }


  .search-term{
    font-weight: 600;
    color: #747575;
  }
}

// Style the search bar
.search-bar {
  display: flex;
  justify-content: center;
  padding: 20px;
  margin-bottom: 30px;
  
}

// Style the input container
.input-container {
  position: relative;
  
  width: 85%;
  
  input[type="text"] {
    padding: 20px 20px 20px 50px;
    border: none;
    border-radius: 8px;
    width: 95%;
    font-size: 16px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .search-icon {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: #718096;
  }
}

// Style the back button
.back-button {
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: background-color 0.2s;
  margin-left: 10px;
  
  &:hover {
    background-color: #3182ce;
  }
  

}

// Style the results meta
.results-meta {
  display: none;
  text-align: center;
  margin-bottom: 20px;
}

// Style the mobile back button
.mobile-back {
  margin: 0 auto;
}

/* Make sure button appears on smaller screens */
@media (max-width: 768px) {
  .search-header h1 {
    font-size: 24px;
    
    .back-button {
      display: none;
    }
  }
  
  .results-meta {
    display: block;
  }
.search-bar {
  display: flex;
  justify-content: flex-start;
  padding: 20px;
  margin-bottom: 30px;
  
}
}
</style>
