<template>
  <div class="home-view-container" v-if="error == null">
    <!-- 상단 필터 및 정렬 바 -->
    <div class="features-bar d-flex justify-content-between align-items-center mb-3">
      <!-- 왼쪽: 전체보기, 카테고리 선택 -->
      <div class="left-controls d-flex align-items-center">
        <button class="idea-button me-4" @click="viewAllContent">전체보기</button>

        <div class="dropdown category-dropdown">
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
      </div>

      <!-- 오른쪽: 정렬, 아이디어 작성 -->
      <div class="right-controls d-flex align-items-center">
        <div class="dropdown sort-dropdown me-3">
          <button class="idea-button dropdown-toggle" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            {{ currentSortKorean }}
          </button>
          <ul class="dropdown-menu" aria-labelledby="sortDropdown">
            <li v-for="option in sortOptions" :key="option.key">
              <button class="dropdown-item" @click="selectedSort(option.key)">
                {{ option.label }}
              </button>
            </li>
          </ul>
        </div>

        <div class="Idea-link">
          <button class="idea-button" @click="goWriteIdea">아이디어작성</button>
        </div>
      </div>
    </div>

    <!-- 콘텐츠 영역 -->
    <div class="main-content-box">
      <div v-if="allContent && allContent.length > 0" class="card-grid">
<div
  v-for="item in allContent"
  :key="item.idea.id"
  class="idea-card"
  @click="goToIdea(item.idea.id)"
  style="cursor: pointer;"
>
          <!-- 제목 -->
          <div class="idea-header">
            <span class="idea-title with-bg">{{ item.idea.title }}</span>
          </div>

          <!-- 본문 미리보기 -->
          <div class="idea-desc">
            {{ item.idea.content }}
          </div>

          <!-- 해시태그 -->
          <div class="idea-tags" v-if="item.idea.tags && item.idea.tags.length">
            <span v-for="tag in item.idea.tags" :key="tag" class="tag">#{{ tag }}</span>
          </div>

          <!-- 조회수/스크랩/댓글 -->
          <div class="idea-meta">
            <span>조회수 {{ item.idea.viewCount }}</span>
            <span>스크랩 {{ item.idea.scrapCount }}</span>
            <span>댓글 {{ item.idea.commentCount }}</span>
          </div>

          <!-- 작성자/작성일 -->
          <div class="idea-footer">
            <span class="nickname">by {{ item.writer.nickname }}</span>
            <span class="created-at">{{ formatDate(item.idea.createdAt) }}</span>
          </div>
        </div>
      </div>

      <p v-else>표시할 콘텐츠가 없습니다.</p>
    </div>
  </div>

  <div class="home-view-container" v-else>{{ error }}</div>
</template>

<script>
import { fetchAPI } from '@/components/appClient';

export default {
  name: 'HomeView',
  data() {
    return {
      error: null,
      categories: [],
      allContent: [],
      currentCategory: '카테고리별',
      searchTerm: null,
      currentSort: 'latest',
      sortOptions: [
        { key: 'views', label: '조회수순' },
        { key: 'scraps', label: '스크랩순' },
        { key: 'latest', label: '최신순' },
        { key: 'comments', label: '댓글순' },
      ]
    };
  },
  computed: {
    currentSortKorean() {
      const found = this.sortOptions.find(option => option.key === this.currentSort)
      return found ? found.label : '정렬';
    }
  },
  watch: {
    "$route.query.search": {
      immediate: true,
      handler(newSearch) {
        if (newSearch) {
          this.searchTerm = newSearch
          this.fetchAllContent()
          this.$router.replace({ query: {} })
        }
      }
    }
  },
  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    },
    goWriteIdea() {
    const isLoggedIn = this.$store?.getters?.isLoggedIn;
    if (!isLoggedIn) {
      alert('로그인 후 제공하는 서비스 입니다');
      return;
    }
    this.$router.push('/Idea');
  },
    async fetchCategories() {
      try {
        const response = await fetchAPI.get('/categories')
        this.categories = response.data
      } catch (error) {
        this.error = error.message ?? '카테고리를 가져오는데 실패했습니다.'
      }   
    },
    async fetchAllContent() {
      try {
        const params = {};
        // 카테고리가 기본값이 아닐 때만 category 필드 추가
        if (this.currentCategory !== '카테고리별') {
          params.category = this.currentCategory;
        }
        // 검색어가 있을 때만 search 필드 추가
        if (this.searchTerm) {
          params.search = this.searchTerm;
        }
        // 정렬 키가 있을 때만 sort 필드 추가
        if (this.currentSort) {
          params.sort = this.currentSort;
        }

        const response = await fetchAPI.get('/ideas', { params })
        this.allContent = response.data
      } catch (error) {
        this.error = error.message ?? '아이디어 목록을 가져오는데 실패했습니다.'
      }
    },
    async selectedSort(sort) {
      this.currentSort = sort;
      this.fetchAllContent();
    },
    async selectedCategory(category) {
      this.currentCategory = category;
      this.fetchAllContent();
    },
    async viewAllContent() {
      this.currentCategory = '카테고리별';
      this.currentSort = 'latest';
      this.searchTerm = null
      await this.fetchAllContent();
    },
    async goToIdea(id) {
      try {
        await fetchAPI.patch(`/ideas/${id}/views`)
        this.$router.push(`/idea/${id}`);
      } catch (error) {
        this.error = '아이디어를 조회할 수 없습니다.'
      }
    }
  },
  async created() {
    await this.fetchCategories();
    await this.fetchAllContent();
  }
};

</script>

<style scoped>
.home-view-container {
  padding: 20px;
  background-color: white;
}

.features-bar {
  background-color: white;
  padding: 10px 20px;
  border-bottom: 1px solid white;
  border-radius: 5px;
}

.idea-button {
  display: inline-block;
  padding: 8px 15px;
  background-color: #f8f5f9;
  border: 2px solid #5C1E94;
  color: #5C1E94;
  border-radius: 20px;
  text-decoration: none;
  font-weight: bold;
  font-family: 'Noto Sans KR', sans-serif;
  transition: all 0.3s ease;
}

.idea-button:hover {
  background-color: #e8e0f0;
  color: #4B0082;
  border-color: #4B0082;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.idea-card {
  background-color: #fff5c2;
  border: 1px solid #FFE97F;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out;
}

.idea-card:hover {
  transform: translateY(-4px);
}

.idea-header {
  margin-bottom: 12px;
}

.idea-title.with-bg {
  display: inline-block;
  background-color: #FFE97F;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #111;
  max-width: 100%;
}

.idea-desc {
  font-size: 14px;
  color: #444;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.idea-tags {
  margin-top: 10px;
  font-size: 12px;
}

.tag {
  background-color: #FFF2C3;
  color: #5C1E94;
  padding: 2px 8px;
  border-radius: 12px;
  margin-right: 5px;
  font-weight: 500;
}

.idea-meta {
  font-size: 12px;
  color: #666;
  margin-top: 6px;
  display: flex;
  gap: 10px;
}

.idea-footer {
  font-size: 11px;
  color: #999;
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
}
</style>
