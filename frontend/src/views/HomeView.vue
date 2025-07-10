<template>
  <div class="home-view-container">
    <div class="features-bar d-flex justify-content-between align-items-center mb-3">
      <div class="left-controls d-flex align-items-center">
        <a href="#" class="feature-link me-4" @click.prevent="viewAllContent">전체보기</a>

        <div class="dropdown category-dropdown">
          <a class="feature-link dropdown-toggle" href="#" role="button" id="categoryDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            카테고리별
          </a>
          <ul class="dropdown-menu" aria-labelledby="categoryDropdown">
            <li v-for="category in categories" :key="category.id">
              <a class="dropdown-item" href="#" @click.prevent="filterByCategory(category.id)">
                {{ category.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="right-controls d-flex align-items-center">
        <div class="dropdown sort-dropdown me-3">
          <a class="feature-link dropdown-toggle" href="#" role="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            {{ this.currentSortKorean }}
          </a>
          <ul class="dropdown-menu" aria-labelledby="sortDropdown">
            <li><a class="dropdown-item" href="#" @click.prevent="selectedSort('views')">조회수</a></li>
            <li><a class="dropdown-item" href="#" @click.prevent="selectedSort('scraps')">스크랩</a></li>
            <li><a class="dropdown-item" href="#" @click.prevent="selectedSort('latest')">최신순</a></li>
            <li><a class="dropdown-item" href="#" @click.prevent="selectedSort('comments')">댓글 많은 순</a></li>
          </ul>
        </div>
        
        <button class="btn btn-primary idea-create-btn">아이디어 작성</button>
      </div>
    </div>

    <div class="main-content-box">
      <h2>이곳은 메인 페이지 콘텐츠입니다.</h2>
      <p>여기에 메인 페이지의 자세한 내용을 추가하세요.</p>
      <div v-if="allContent && allContent.length > 0">
        <div v-for="item in allContent" :key="item.id" class="content-item">
          <h3>{{ item.idea.title }}</h3>
          <p>{{ item.idea.content }}</p>
          <p><small>조회수: {{ item.idea.viewCount }} | 스크랩: {{ item.idea.scrapCount }} | 댓글: {{ item.idea.commentCount }}</small></p>
        </div>
      </div>
      <p v-else>표시할 콘텐츠가 없습니다. (데이터 로딩 중이거나 오류 발생)</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomeView',
  data() {
    return {
      categories: [],        // 카테고리 목록
      allContent: [],        // 모든 아이디어 콘텐츠 (원본 데이터)
      displayedContent: [],  // 필터링 및 정렬된 아이디어 콘텐츠
      selectedCategory: null, // 현재 선택된 카테고리 ID
      currentSort: 'latest', // 현재 정렬 기준
      currentSortKorean: '정렬',
    };
  },
  methods: {
    // 카테고리 데이터를 가져오는 메서드
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:8080/api/categories'); 
        // 응답이 배열인지 확인하고 할당
        this.categories = Array.isArray(response.data) ? response.data : [];
        if (!Array.isArray(response.data)) {
          console.error("Categories API 응답이 배열이 아닙니다:", response.data);
        }
      } catch (error) {
        console.error('카테고리를 불러오는 데 실패했습니다:', error);
        // 오류 발생 시 대체 데이터 (안전한 빈 배열 또는 기본 카테고리)
        this.categories = [{ id: null, name: '전체 카테고리' }, { id: 1, name: 'IT' }, { id: 2, name: '예술' }];
      }
    },
    // 모든 아이디어 콘텐츠를 가져오는 메서드
    async fetchAllContent() {
      try {
        const response = await axios.get(`http://localhost:8080/api/ideas?sort=${this.currentSort}`);
        // 응답이 배열인지 확인하고 할당
        this.allContent = Array.isArray(response.data) ? response.data : [];
        if (!Array.isArray(response.data)) {
          console.error("Ideas API 응답이 배열이 아닙니다:", response.data);
        }
        // 데이터 로드 후 필터링 및 정렬 적용
        // this.applyFiltersAndSort();
      } catch (error) {
        console.error('콘텐츠를 불러오는 데 실패했습니다:', error);
        // 오류 발생 시 대체 데이터 (예시 데이터)
        this.allContent = [
          { id: 1, categoryId: 1, title: '아이디어 1 (IT)', content: '콘텐츠 내용...', views: 100, scraps: 50, comments: 10, date: '2025-06-20' },
          { id: 2, categoryId: 2, title: '아이디어 2 (예술)', content: '콘텐츠 내용...', views: 80, scraps: 60, comments: 15, date: '2025-06-22' },
          { id: 3, categoryId: 1, title: '아이디어 3 (IT)', content: '콘텐츠 내용...', views: 120, scraps: 40, comments: 5, date: '2025-06-21' },
          { id: 4, categoryId: 3, title: '아이디어 4 (기타)', content: '콘텐츠 내용...', views: 50, scraps: 20, comments: 20, date: '2025-06-23' },
        ];
        // 대체 데이터 로드 후 필터링 및 정렬 적용
        this.applyFiltersAndSort();
      }
    },
    async selectedSort(sort) {
      this.currentSort = sort
      switch (sort) {
        case 'views':
          this.currentSortKorean = '조회수순'
          break;
        case 'scraps':
          this.currentSortKorean = '스크랩순'
          break;
        case 'comments':
          this.currentSortKorean = '댓글순'
          break;
        default:
          this.currentSortKorean = '최신순'
          break;
      }
      this.fetchAllContent()
    },
    // 필터링 및 정렬 로직 적용
    applyFiltersAndSort() {
      // allContent가 배열인지 다시 한 번 확인하여 안전하게 복사
      let filtered = Array.isArray(this.allContent) ? [...this.allContent] : [];

      // 카테고리 필터링
      if (this.selectedCategory !== null) { // null일 경우 전체보기
        filtered = filtered.filter(item => item.categoryId === this.selectedCategory);
      }

      // 정렬
      filtered.sort((a, b) => {
        if (this.currentSort === 'views') {
          return b.views - a.views;
        } else if (this.currentSort === 'scraps') {
          return b.scraps - a.scraps;
        } else if (this.currentSort === 'latest') {
          // 날짜 문자열을 Date 객체로 변환하여 비교
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        } else if (this.currentSort === 'comments') {
          return b.comments - a.comments;
        }
        return 0; // 기본 반환값
      });

      // 필터링 및 정렬된 결과를 displayedContent에 할당
      this.displayedContent = filtered;
    },
    // '전체보기' 클릭 시
    viewAllContent() {
      this.selectedCategory = null; // 선택된 카테고리 초기화
      this.applyFiltersAndSort(); // 필터 및 정렬 다시 적용
    },
    // 카테고리 필터 적용 시
    filterByCategory(categoryId) {
      this.selectedCategory = categoryId; // 선택된 카테고리 설정
      this.applyFiltersAndSort(); // 필터 및 정렬 다시 적용
    },
    // 정렬 기준 변경 시
    sortContent(sortBy) {
      this.currentSort = sortBy; // 정렬 기준 설정
      this.applyFiltersAndSort(); // 필터 및 정렬 다시 적용
    },
    //  이 컴포넌트에서는 로그인/회원가입 관련 메서드를 제거
  },
  // 컴포넌트가 생성될 때 데이터 로드
  async created() {
    await this.fetchCategories(); // 카테고리 먼저 로드
    await this.fetchAllContent(); // 이어서 콘텐츠 로드
  }
};
</script>

<style scoped>
/* HomeView.vue의 스타일 */
.home-view-container {
  padding: 20px;
  background-color: white;
}

.features-bar { /* 기능 바 스타일 */
  background-color: white;
  padding: 10px 20px;
  border-bottom: 1px solid white;
  border-radius: 5px;
}

.feature-link {
  color: #333;
  text-decoration: none;
  font-weight: bold;
  padding: 5px 10px;
  transition: color 0.2s ease;
}

.feature-link:hover {
  color: #7B2CBF;
}

.dropdown-toggle::after {
  margin-left: 0.5em;
  vertical-align: middle;
}

.category-dropdown, .sort-dropdown {
  margin-right: 15px;
}

.sort-dropdown .dropdown-toggle {
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 5px 15px;
  background-color: #f8f9fa;
}

.sort-dropdown .dropdown-toggle:hover {
  background-color: #e2e6ea;
}

.dropdown-menu {
  margin-top: 5px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.dropdown-item:hover {
  background-color: #f1f1f1;
  color: #7B2CBF;
}

/* 아이디어 작성 버튼 */
.idea-create-btn {
  background-color: #3C096C; /* 푸터 색상과 동일 */
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

.idea-create-btn:hover { /* 호버 시 색상 변경 */
  background-color: #5d229a;
}

/* 메인 콘텐츠 박스 */
.main-content-box { 
  padding: 20px;
  border: 1px solid #7B2CBF;
  margin: 20px auto;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  border-radius: 8px;
}

.content-item {
  border-bottom: 1px dashed #eee;
  padding: 10px 0;
  margin-bottom: 10px;
}
.content-item:last-child {
  border-bottom: none;
}
</style>