/* eslint-disable */
// Import the createApp function from the vue library
import { createApp } from 'vue';
// Import the main App component
import App from './App.vue';
// Import the createRouter and createWebHistory functions from the vue-router library
import { createRouter, createWebHistory } from 'vue-router';

// Define the routes for the application
const routes = [
  {
    path: '/',
    component: App,
  },
];

// Create the router instance
const router = createRouter({
  // Use the web history mode
  history: createWebHistory(),
  // Define the routes
  routes,
});

// Create the app instance
const app = createApp(App);
// Use the router
app.use(router);
// Mount the app to the element with the id "app"
app.mount('#app');
/* eslint-enable */
