<template>
  <div v-if="!(idea || scrap)">loading...</div>
  <div class="idea-read-container" v-if="error == null && idea">
    
    <!-- 노트 스타일 영역 -->
    <div class="note-paper">
      <!-- 우측 상단 스크랩 아이콘 -->
      <img
        :src="isScrapped ? require('@/assets/scrap(After).svg') : require('@/assets/scrap(Before).svg')"
        alt="스크랩 아이콘"
        class="scrap-icon"
        @click="toggleScrap"
        v-if="isLoggedIn"
      />

      <!-- 제목 -->
      <div class="title-with-bg">
        <span class="idea-title">{{ idea.idea.title }}</span>
      </div>

      <!-- 본문 -->
      <div class="idea-content">{{ idea.idea.content }}</div>

      <!-- 해시태그 -->
      <div class="idea-tags" v-if="idea.tags && idea.tags.length">
        <span v-for="tag in idea.tags" :key="tag.item" class="tag">#{{ tag.name }}</span>
      </div>

      <!-- 작성 정보 -->
      <div class="idea-meta">
        <div class="meta-right">
          <div class="author-pill">
            <span class="author-label">작성자</span>
            <span class="author-nickname">{{ idea.writer.nickname }}</span>
          </div>
          <div class="date">{{ formatDate(idea.idea.createdAt) }}</div>
        </div>
      </div>
    </div>

    <!-- 구분선 -->
    <hr class="divider" />

    <!-- 댓글 영역 -->
    <div class="comments-section">
      <h5>댓글</h5>

      <div v-for="comment in idea.comments" :key="comment.id" class="comment-box">
        <div class="comment-content">
          <strong>{{ comment.commentWriter.nickname }}</strong>
          <button class="delete-btn" @click="deleteComment(comment.comment.id)">삭제</button>
        </div>
        <p>{{ comment.comment.content }}</p>
      </div>

      <div class="comment-input mt-3" v-if="isLoggedIn">
        <textarea
          v-model="newComment"
          class="form-control"
          placeholder="댓글을 입력하세요"
        ></textarea>
        <button class="submit-comment" @click="submitComment">댓글 작성</button>
      </div>
    </div>
  </div>
  <div class="home-view-container" v-else>{{ error }}</div>
</template>

<script>
import { fetchAPI, authFetchAPI } from '@/components/appClient';
import { mapGetters } from 'vuex';

export default {
  name: 'IdeaReadView',
  data() {
    return {
      error: null,
      id: this.$route.params.id,
      idea: null,
      isScrapped: false,
      scrap: null,
      newComment: ''
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn'])
  },
  methods: {
    async fetchIdea() {
      try {
        const response = await fetchAPI.get(`/ideas/${this.id}`)
        this.idea = response.data
      } catch (error) {
          this.error = error.message ?? '아이디어를 가져오는데 실패했습니다.'
      } 
    },
    async fetchScraps() {
      try {
        const response = await fetchAPI.get('/scraps')
        const scraps = response.data
        const found = scraps.find(scrap => scrap.scrap.ideaId == this.id)
        if (found) {
          this.isScrapped = true
          this.scrap = found
        }
      } catch (error) {
        const status = error?.response?.status
        if (status === 400 || status === 401 || status === 404) {
          this.isScrapped = false
          this.scrap = null
        } else {
          this.error = '스크랩 목록를 가져오는데 실패했습니다.'
        }
      }    
    },
    async toggleScrap() {
      if (this.isScrapped) {
        try {
          await authFetchAPI.delete(`/scraps/${this.scrap.scrap.id}`)
          alert("삭제되었습니다.")
        } catch (error) {
          this.error = error.message ?? '스크랩을 삭제할 수 없습니다.'
        }  
      } else {
        try {
          const ideaId = Number(this.id)
          await authFetchAPI.post('/scraps', {
            ideaId
          })
        } catch (error) {
          this.error = error.message ?? '스크랩을 생성할 수 없습니다.'
        }
      }
      this.isScrapped = !this.isScrapped;
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    },
    async submitComment() {
      if (!this.newComment.trim()) return;
      try {
        const ideaId = Number(this.id)
        await authFetchAPI.post('/comments', { 
            ideaId: ideaId,
            content: this.newComment
        })
        this.newComment = '';
        await this.fetchIdea()
        await authFetchAPI.patch(`/ideas/${ideaId}/comments`, {
          action: 'add'
        })
      } catch (error) {
        this.error = error.message ?? '댓글을 생성할 수 없습니다.'
      }    
    },
    async deleteComment(id) {
      try {
        await authFetchAPI.delete(`/comments/${id}`)
        await authFetchAPI.patch(`/ideas/${this.id}/comments`, {
          action: 'sub'
        })
        await this.fetchIdea()
      } catch (error) {
          this.error = error.message ?? '댓글을 삭제할 수 없습니다.'
      }
    }
  },
  async created() {
    await this.fetchIdea();
    if (this.isLoggedIn) {
      await this.fetchScraps();
    }
  }
};
</script>

<style scoped>
.idea-read-container {
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
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.scrap-icon {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  
}

.title-with-bg .idea-title {
  background-color: #FFE97F;
  padding: 6px 15px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 20px;
  color:black;
}

.idea-content {
  font-size: 16px;
  color: #333;
  line-height: 1.8;
  white-space: pre-wrap;
}

.idea-tags {
  margin-top: 10px;
}

.tag {
  background-color: #FFF2C3;
  color: #5C1E94;
  padding: 4px 10px;
  border-radius: 12px;
  margin-right: 5px;
  font-size: 13px;
}

.idea-meta {
  display: flex;
  justify-content: flex-end;
}

.meta-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.author-pill {
  display: flex;
  align-items: center;
  background-color: #FFE97F;
  border: 2px solid #FFE97F;
  border-radius: 40px;
  padding: 5px 15px;
  gap: 10px;
}

.author-label {
  background-color: #FFE97F;
  color: black;
  padding: 5px 10px;
  border-radius: 40px;
  font-size: 14px;
  white-space: nowrap;
}

.author-nickname {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.date {
  font-size: 12px;
  color: #999;
}

.divider {
  margin: 40px 0;
  border-top: 1px solid #ccc;
}

.comments-section {
  margin-top: 20px;
}

.comment-box {
  background: #f5f5f5;
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.comment-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete-btn {
  background: transparent;
  border: none;
  color: #c0392b;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
}

.delete-btn:hover {
  text-decoration: underline;
}

.comment-input textarea {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  resize: vertical;
  margin-bottom: 10px;
}

.submit-comment {
  background-color: #ffe97f;
  color: black;
  padding: 6px 16px;
  border-radius: 20px;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

.submit-comment:hover {
  opacity: 0.85;
}
</style>
