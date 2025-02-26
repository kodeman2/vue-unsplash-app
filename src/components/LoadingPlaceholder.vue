<template>
  <div class="loading-placeholder">
    <div class="image"></div>
    <div class="text"></div>
    <div class="text"></div>
  </div>
</template>

<style scoped lang="scss">
.loading-placeholder {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #eee;
  padding: 15px;

  .image {
    width: 100%;
    height: 150px;
    background-color: #ddd;
    margin-bottom: 10px;
  }

  .text {
    width: 70%;
    height: 10px;
    background-color: #ddd;
    margin-bottom: 5px;

    &:last-child {
      width: 40%;
    }
  }
}
</style>
