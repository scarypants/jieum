<template>
  <div class="idea-write-container">
    <!-- 카테고리 드롭다운 버튼 -->
    <div class="dropdown category-dropdown mb-3">
      <button class="idea-button dropdown-toggle" id="categoryDropdown" data-bs-toggle="dropdown" aria-expanded="false">
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
      <!-- 제목 입력 -->
      <input
        type="text"
        v-model="title"
        placeholder="제목을 입력하세요"
        class="note-title"
      />

      <!-- 본문 입력 (자동 높이 조절) -->
      <textarea
        v-model="content"
        ref="contentArea"
        placeholder="아이디어 내용을 작성해보세요"
        class="note-content"
        @input="resizeTextarea"
      ></textarea>

      <!-- 해시태그 입력 -->
      <input
        type="text"
        v-model="tagsInput"
        placeholder="#해시태그를 쉼표로 구분해 입력하세요"
        class="note-tags"
      />

      <!-- 등록 버튼 -->
      <div class="submit-area">
        <button class="submit-button" @click="submitIdea">
          등록하기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchAPI, authFetchAPI } from '@/components/appClient';
export default {
  name: 'IdeaPost',
  data() {
    return {
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
        const response = await fetchAPI.get('/categories')
        this.categories = response.data
      } catch (error) {
        this.error = error.message ?? '카테고리를 가져오는데 실패했습니다.'
      }   
    },
    // 카테고리 선택 시 값 저장함
    async selectedCategory(category) {
      this.currentCategory = category;
    },
    selectedCategoryId() {
      if (this.currentCategory == '카테고리 선택') return
      const found = this.categories.find(option => option.name === this.currentCategory)
      return found.id
    },
    // 아이디어 등록 시 localStorage에 저장하고 메인 페이지로 이동함
    async submitIdea() {
      if (!this.title || !this.content || !this.selectedCategory) {
        alert('제목, 내용, 카테고리를 모두 입력해주세요.');
        return;
      }

      const tagNames = this.tagsInput
                      .split(',')
                      .map(tag => tag.trim())
                      .filter(tag => tag);

      const newIdea = {
        idea: {
          categoryId: this.selectedCategoryId(),
          title: this.title,
          content: this.content
        },
        tags: tagNames.map(name => ({ name }))
      };

      try {
        await authFetchAPI.post('/ideas', newIdea)
      } catch (error) {
        this.error = error.message ?? '아이디어를 생성할 수 없습니다.'
      }
      
      this.$router.push('/');
    },
    // textarea 높이를 내용에 따라 자동 조절함
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
  }
}
</script>

<style scoped>
/* 페이지 전체 배경 흰색으로 설정함 */
.idea-write-container {
  background-color: white;
  padding: 60px 20px;
  max-width: 900px;
  margin: 0 auto;
}

/* 드롭다운 버튼 스타일 (HomeView 기준) */
.feature-link {
  color: #7B2CBF;
  text-decoration: none;
  font-weight: bold;
  padding: 5px 15px;
  border: 2px solid #7B2CBF;
  border-radius: 20px;
  background-color: transparent;
  transition: all 0.2s ease;
}
.feature-link:hover {
  background-color: #f1f1f1;
}
.category-dropdown {
  display: inline-block;
}
.dropdown-menu {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border-radius: 8px;
}
.dropdown-item:hover {
  background-color: #f8f5f9;
  color: #7B2CBF;
}

/* 노트 배경 스타일 지정함 */
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
  position: relative;
}

/* 제목 입력창 */
.note-title {
  width: 100%;
  font-size: 20px;
  font-weight: bold;
  border: none;
  background: transparent;
  outline: none;
}

/* 본문 입력창 (자동 높이 적용) */
.note-content {
  width: 100%;
  font-size: 15px;
  line-height: 36px;
  border: none;
  background: transparent;
  resize: none;
  outline: none;
  overflow: hidden;
  height: auto;
  min-height: 200px;
}

/* 해시태그 입력창 */
.note-tags {
  width: 100%;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  border: none;
  border-bottom: 1px solid #ccc;
  background: transparent;
  outline: none;
  padding: 6px 0;
}
.note-tags::placeholder {
  color: #aaa;
}

/* 등록 버튼 우측 하단 정렬 */
.submit-area {
  display: flex;
  justify-content: flex-end;
}

/* 등록 버튼 디자인 (색상은 자유롭게 수정 가능) */
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
</style>
