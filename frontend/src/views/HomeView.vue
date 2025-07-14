<template>
  <div class="home-view-container" v-if="error == null">
    <div class="features-bar d-flex justify-content-between align-items-center mb-3">
      <div class="left-controls d-flex align-items-center">
        <button class="feature-link me-4" @click="viewAllContent">전체보기</button>

        <div class="dropdown category-dropdown">
          <button class="feature-link dropdown-toggle" id="categoryDropdown" data-bs-toggle="dropdown" aria-expanded="false">
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
      

      <div class="right-controls d-flex align-items-center">
        <div class="dropdown sort-dropdown me-3">
          <button class="feature-link dropdown-toggle" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
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
        
        <a href="#" class="btn btn-primary idea-create-btn">아이디어 작성</a>
      </div>
    </div>

    <div class="main-content-box">
      <h2>이곳은 메인 페이지 콘텐츠입니다.</h2>
      <p>여기에 메인 페이지의 자세한 내용을 추가하세요.</p>
      <div v-if="allContent && allContent.length > 0">
        <div v-for="item in allContent" :key="item.id" class="content-item">
          <a href="">
            <h3>{{ item.idea.title }}</h3>
            <p>{{ item.idea.content }}</p>
            <p><small>조회수: {{ item.idea.viewCount }} | 스크랩: {{ item.idea.scrapCount }} | 댓글: {{ item.idea.commentCount }}</small></p>
          </a>
        </div>
      </div>
      <p v-else>표시할 콘텐츠가 없습니다. (데이터 로딩 중이거나 오류 발생)</p>
    </div>
  </div>
  <div class="home-view-container" v-else>{{ error }}</div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'HomeView',
    data() {
      return {
        error: null,
        categories: [],
        allContent: [],
        displayedContent: [],
        currentCategory: '카테고리별',
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
    methods: {
      // 카테고리 데이터를 가져오는 메서드
      async fetchCategories() {
        try {
          const response = await axios.get('http://localhost:8080/api/categories');
          this.categories = Array.isArray(response.data) ? response.data : [];
          if (!Array.isArray(response.data)) {
            console.error("Categories API 응답이 배열이 아닙니다:", response.data);
          }
        } catch (error) {
          console.error('카테고리를 불러오는 데 실패했습니다:', error);
        }
      },
      // 모든 아이디어 콘텐츠를 가져오는 메서드
      async fetchAllContent() {
        try {
          const categoryParam = this.currentCategory !== '카테고리별' ? `category=${this.currentCategory}` : '';
          const sortParam = `sort=${this.currentSort}`;
          const queryString = [categoryParam, sortParam].filter(Boolean).join('&');

          const response = await axios.get(`http://localhost:8080/api/ideas?${queryString}`);
          this.allContent = Array.isArray(response.data) ? response.data : [];
          if (!Array.isArray(response.data)) {
            this.error = 'Ideas API 응답이 배열이 아닙니다:' + response.data;
          }
        } catch (error) {
          this.error = '콘텐츠를 불러오는 데 실패했습니다:' + error;
        }
      },
      async selectedSort(sort) {
        this.currentSort = sort
        this.fetchAllContent()
      },
      async selectedCategory(categoryId) {
        this.currentCategory = categoryId
        this.fetchAllContent()
      },
      // 필터링 및 정렬 로직 적용
      applyFiltersAndSort() {
        // allContent가 배열인지 다시 한 번 확인하여 안전하게 복사
        let filtered = Array.isArray(this.allContent) ? [...this.allContent] : [];

        // 카테고리 필터링
        if (this.currentCategory !== null) { // null일 경우 전체보기
          filtered = filtered.filter(item => item.categoryId === this.currentCategory);
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
        this.currentCategory = '카테고리별';
        this.currentSort = 'latest';
      },
      // 카테고리 필터 적용 시
      filterByCategory(categoryId) {
        this.currentCategory = categoryId; // 선택된 카테고리 설정
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