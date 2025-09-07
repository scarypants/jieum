<template>
  <div class="idea-write-container" v-if="ideaLoaded">
    <!-- 카테고리 드롭다운 -->
    <div class="dropdown category-dropdown mb-3">
      <button class="idea-button dropdown-toggle" id="categoryDropdown" data-bs-toggle="dropdown">
        {{ currentCategory }}
      </button>
      <ul class="dropdown-menu" aria-labelledby="categoryDropdown">
        <li v-for="category in categories" :key="category.id">
          <button class="dropdown-item" @click="selectedCategory(category.name)">
            {{ category.name }}
          </button>
        </li>
      </ul>
    </div>

    <!-- 노트 스타일 입력 영역 -->
    <div class="note-paper">
      <!-- 제목 -->
      <input
        type="text"
        v-model="title"
        class="note-title"
        placeholder="제목을 입력하세요"
      />

      <!-- 본문 -->
      <textarea
        v-model="content"
        ref="contentArea"
        class="note-content"
        @input="resizeTextarea"
      ></textarea>

      <!-- 해시태그 -->
      <input
        type="text"
        v-model="tagsInput"
        placeholder="#해시태그를 쉼표로 구분해 입력하세요"
        class="note-tags"
      />

      <!-- 수정 저장 버튼 -->
      <div class="submit-area">
        <button class="submit-button" @click="updateIdea">
          수정 저장
        </button>
      </div>
    </div>
  </div>

  <div v-else class="idea-write-container">불러오는 중...</div>
</template>

<script>
import { fetchAPI, authFetchAPI } from '@/components/appClient';

export default {
  name: 'IdeaEdit',
  data() {
    return {
      ideaLoaded: false,
      id: this.$route.params.id,
      writerId: '',
      title: '',
      content: '',
      currentCategory: '카테고리 선택',
      tagsInput: '',
      categories: []
    };
  },
  methods: {
    async fetchCategories() {
      try {
        const res = await fetchAPI.get('/categories');
        this.categories = res.data;
      } catch (e) {
        alert('카테고리를 불러올 수 없습니다.');
      }
    },
    async fetchIdea() {
      try {
        const res = await fetchAPI.get(`/ideas/${this.id}`);
        const data = res.data;

        // 기존 데이터 채우기
        this.writerId = data.idea.writerId
        this.title = data.idea.title;
        this.content = data.idea.content;
        this.currentCategory = this.categories.find(c => c.id === data.idea.categoryId)?.name || '카테고리 선택';
        this.tagsInput = (data.tags || []).map(tag => tag.name).join(', ');

        this.ideaLoaded = true;
      } catch (e) {
        alert('아이디어를 불러올 수 없습니다.');
      }
    },
    selectedCategory(category) {
      this.currentCategory = category;
    },
    selectedCategoryId() {
      const found = this.categories.find(c => c.name === this.currentCategory);
      return found ? found.id : null;
    },
    async updateIdea() {
      if (!this.title || !this.content || !this.selectedCategoryId()) {
        alert('제목, 내용, 카테고리를 모두 입력해주세요.');
        return;
      }

      const tagNames = this.tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      const updatedIdea = {
        idea: {
          writerId: this.writerId,
          categoryId: this.selectedCategoryId(),
          title: this.title,
          content: this.content
        },
        tags: tagNames.map(name => ({ name }))
      };

      try {
        await authFetchAPI.patch(`/ideas/${this.id}`, updatedIdea);
        alert('수정이 완료되었습니다.');
        this.$router.push(`/idea/${this.id}`);
      } catch (e) {
        alert('수정에 실패했습니다. 다시 시도해주세요.');
      }
    },
    resizeTextarea() {
      const area = this.$refs.contentArea;
      if (area) {
        area.style.height = 'auto';
        area.style.height = area.scrollHeight + 'px';
      }
    }
  },
  async created() {
    await this.fetchCategories();
    await this.fetchIdea();
  }
};
</script>

<style scoped>
/* Idea.vue와 동일 스타일 유지 */
.idea-write-container {
  background-color: white;
  padding: 60px 20px;
  max-width: 900px;
  margin: 0 auto;
}
.note-paper {
  background-color: #FFF9DB;
  border: 1px solid #E5D89A;
  padding: 30px 25px;
  border-radius: 10px;
  background-image: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 35px,
    #e9e4c9 36px
  );
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.note-title{
  font-size: 20px;
  font-weight: bold;
  border: none; 
  background: transparent;
  outline: none;
}

.note-content, .note-tags {
  border: none; 
  background: transparent;
  outline: none;
}
.note-content {
  resize: none;
  overflow: hidden;
  min-height: 200px;
}
.submit-area {
  display: flex;
  justify-content: flex-end;
}
.submit-button {
  padding: 8px 20px;
  font-weight: bold;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  background-color: #ffe97f;
  color: black;
  transition: 0.3s ease;
}
.submit-button:hover {
  opacity: 0.85;
}
.idea-button {
  padding: 8px 15px;
  border-radius: 20px;
  border: 2px solid #5C1E94;
  color: #5C1E94;
  background: #f8f5f9;
  font-weight: bold;
}
</style>
