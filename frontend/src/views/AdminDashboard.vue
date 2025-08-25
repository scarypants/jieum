<!-- src/views/AdminDashboard.vue -->
<template>
  <div class="admin-wrap">
    <!-- 좌측: 헤더 + 세로 버튼 + 우측 구분선 -->
    <aside class="left-pane">
      <div class="admin-header">관리자 페이지</div>

      <button
        class="menu-item"
        :class="{ active: activeMenu === 'members' }"
        @click="activeMenu = 'members'"
        type="button"
      >
        회원 리스트
      </button>

      <button
        class="menu-item"
        :class="{ active: activeMenu === 'categories' }"
        @click="activeMenu = 'categories'"
        type="button"
      >
        카테고리 관리
      </button>

      <button
        class="menu-item"
        :class="{ active: activeMenu === 'inquiries' }"
        @click="activeMenu = 'inquiries'"
        type="button"
      >
        문의사항 확인
      </button>

      <div class="sections-divider"></div>
    </aside>

    <!-- 우측: 콘텐츠 영역 -->
    <main class="right-pane">
      <!-- 회원 리스트 (6열: 닉네임/아이디/비번/역할/비고/저장) -->
      <section v-if="activeMenu === 'members'" class="panel">
        <h2 class="sr-only">회원 관리</h2>

        <div class="table-wrap">
          <table class="member-table">
            <colgroup>
              <col style="width:20%" />
              <col style="width:20%" />
              <col style="width:16%" />
              <col style="width:16%" />
              <col style="width:14%" />
              <col style="width:14%" />
            </colgroup>
            <thead>
              <tr>
                <th>닉네임</th>
                <th>아이디</th>
                <th>비밀번호</th>
                <th>회원 역할</th>
                <th>회원 삭제</th>
                <th>  </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in members" :key="member.id">
                <td>{{ member.nickname }}</td>
                <td>{{ member.loginId }}</td>
                <td>******</td>

                <!-- 역할 드롭다운(기존 분기 유지) -->
                <td v-if="member.role == 'admin'">
                  <select v-model="member.role" class="role-select" @change="selectedMemberRole">
                    <option value="admin" selected>관리자</option>
                    <option value="member">사용자</option>
                  </select>
                </td>
                <td v-else-if="member.role == 'member'">
                  <select v-model="member.role" class="role-select" @change="selectedMemberRole">
                    <option value="admin">관리자</option>
                    <option value="member" selected>사용자</option>
                  </select>
                </td>
                <!-- 안전장치: 혹시 다른 값이면 기본 셀 -->
                <td v-else>
                  <select v-model="member.role" class="role-select" @change="selectedMemberRole">
                    <option value="admin">관리자</option>
                    <option value="member">사용자</option>
                  </select>
                </td>

                <!-- 비고: 회원 삭제 -->
                <td>
                  <button class="member-delete-btn" @click="deleteMember(member)">
                    회원 삭제
                  </button>
                </td>

                <!-- ✅ 저장 열: 행별 저장 버튼 -->
                <td>
                  <button class="member-save-btn" @click="saveMember(member)">
                    저장
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 카테고리 관리 -->
      <section v-else-if="activeMenu === 'categories'" class="panel">
        <h2 class="sr-only">카테고리 관리</h2>

        <div class="category-wrap">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-chip"
          >
            <span class="chip-text">{{ category.name }}</span>
            <button
              class="chip-delete"
              type="button"
              @click.stop="requestDeleteCategory(category)"
              title="삭제"
            >
              삭제
            </button>
          </div>

          <!-- +추가 칩 -->
          <div
            v-if="!isAddingCategory"
            class="category-chip add-chip"
            @click="startAddCategory"
            title="카테고리 추가"
          >
            <span class="chip-text add-placeholder">+추가</span>
          </div>

          <!-- 입력 모드 -->
          <div v-else class="category-chip add-chip editing">
            <input
              v-model.trim="newCategoryName"
              class="chip-input"
              type="text"
              placeholder="카테고리 입력"
              @keyup.enter="confirmAddCategory"
              autofocus
            />
            <div class="add-actions">
              <button class="mini-btn primary" type="button" @click="confirmAddCategory">확인</button>
              <button class="mini-btn" type="button" @click="cancelAddCategory">취소</button>
            </div>
          </div>
        </div>
      </section>

      <!-- 문의사항 확인 -->
      <section v-else-if="activeMenu === 'inquiries'" class="panel">
        <h2 class="sr-only">문의사항 확인</h2>

        <div class="inquiry-list">
          <div
            v-for="inquiry in inquiries"
            :key="inquiry.inquiry.id"
            class="inquiry-card"
          >
            <div class="inquiry-title">회원 탈퇴</div>
            <div class="inquiry-body">({{ inquiry.user.nickname }}) 탈퇴 문의 드립니다</div>
            <button class="inquiry-delete-btn" @click="deleteInquiry(inquiry)">
              문의사항 삭제
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { fetchAPI, authFetchAPI } from '@/components/appClient';
export default {
  name: 'AdminDashboard',
  data() {
    return {
      activeMenu: 'members',
      members: [],
      currentMemberRole: null,
      categories: [],
      isAddingCategory: false,
      newCategoryName: '',
      inquiries: [],
      error: null
    };
  },
  methods: {
    /* ---------- 회원 ---------- */
    async fetchUsers() {
      try {
        const response = await authFetchAPI.get('/users');
        this.members = response.data;
      } catch (error) {
        this.error = '사용자 목록를 가져오는데 실패했습니다.';
      }
    },
    // ✅ 행별 저장
    async saveMember(member) {
      try {
        // 여기서는 role만 저장. (비밀번호는 표에서 수정하지 않으니 제외)
        await authFetchAPI.patch(`/users/${member.id}/role`, {
          role: this.currentMemberRole
        });
        alert('변경 사항이 저장되었습니다.');
      } catch (e) {
        alert(e?.response?.data?.message ?? '저장에 실패하였습니다. 다시 시도해주십시오');
      }
    },
    async deleteMember(member) {
      const ok = confirm(`[${member.nickname}] 회원을 삭제하시겠습니까?`);
      if (!ok) return;
      try {
        await authFetchAPI.delete(`/users/${member.id}`);
        await this.fetchUsers();
      } catch (error) {
        this.error = '사용자를 삭제할 수 없습니다.';
      }
    },
    selectedMemberRole(event) {
      this.currentMemberRole = event.target.value
      console.log(this.currentMemberRole)
    },

    /* ---------- 카테고리 ---------- */
    async fetchCategories() {
      try {
        const response = await fetchAPI.get('/categories');
        this.categories = response.data;
      } catch (error) {
        this.error = '카테고리를 가져오는데 실패했습니다.';
      }
    },
    startAddCategory() {
      this.isAddingCategory = true;
      this.newCategoryName = '';
    },
    async confirmAddCategory() {
      if (!this.newCategoryName) return;
      try {
        await authFetchAPI.post('/categories', { name: this.newCategoryName });
        await this.fetchCategories();
        this.isAddingCategory = false;
        this.newCategoryName = '';
      } catch (error) {
        this.error = '카테고리를 생성할 수 없습니다.';
      }
    },
    cancelAddCategory() {
      this.isAddingCategory = false;
      this.newCategoryName = '';
    },
    async requestDeleteCategory(category) {
      const ok = confirm(`'${category.name}' 카테고리를 삭제하시겠습니까?`);
      if (!ok) return;
      try {
        await authFetchAPI.delete(`/categories/${category.id}`);
        await this.fetchCategories();
      } catch (error) {
        this.error = '카테고리를 삭제할 수 없습니다.';
      }
    },

    /* ---------- 문의 ---------- */
    async fetchInquiries() {
      try {
        const response = await fetchAPI.get('/inquiries');
        this.inquiries = response.data;
      } catch (error) {
        this.error = '문의사항 목록를 가져오는데 실패했습니다.';
      }
    },
    async deleteInquiry(inquiry) {
      const ok = confirm(`(${inquiry.user.nickname}) 문의를 삭제하시겠습니까?`);
      if (!ok) return;
      try {
        await authFetchAPI.delete(`/inquiries/${inquiry.inquiry.id}`);
        await this.fetchInquiries();
      } catch (error) {
        this.error = '문의사항을 삭제할 수 없습니다.';
      }
    },
  },
  async created() {
    await this.fetchUsers();
    await this.fetchCategories();
    await this.fetchInquiries();
  }
};
</script>

<style scoped>
/* 색상 변수 */
.admin-wrap {
  --purple: #3C096C;      /* 진한 보라 */
  --purple-200: #E8D8F6;  /* 연한 보라 */
  --purple-300: #dcc7f1;  /* 더 연한 보라 */
  --chip-bg: #efe7fb;     /* 카테고리 칩 배경 */
  --chip-del-bg: #cdb4f3; /* 칩 삭제 버튼 배경 */
  --divider: #e6e6e6;     /* 옅은 회색 선 */
  --text: #111;
  --white: #fff;
}

/* 레이아웃 */
.admin-wrap {
  display: grid;
  grid-template-columns: 300px 1fr;
  min-height: calc(100vh - 140px);
  background: #fff;
}

/* 좌측 */
.left-pane {
  position: relative;
  background: #fff;
  padding: 16px 14px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 좌측 상단 타이틀 */
.admin-header {
  background: var(--purple);
  color: var(--white);
  font-weight: 800;
  border-radius: 10px;
  padding: 14px 16px;
  text-align: center;
}

/* 좌측 메뉴(텍스트 조금 두껍게) */
.menu-item {
  background: #fff;
  color: var(--text);
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 14px 16px;
  text-align: left;
  cursor: pointer;
  transition: background-color .15s ease, color .15s ease, border-color .15s ease;
  font-weight: 700; /* 두껍게 */
}
.menu-item:hover {
  background: var(--purple-200);
  color: var(--text);
}
.menu-item.active {
  background: var(--purple);
  color: var(--white);
  border-color: var(--purple);
}

/* 좌측-우측 구분선 */
.sections-divider {
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background: var(--divider);
}

/* 우측 콘텐츠 */
.right-pane {
  position: relative;
  background: #fff;
  padding: 24px;
}

/* 패널 */
.panel {
  background: #fff;
  border-radius: 12px;
}

/* 접근성용 숨김 제목 */
.sr-only {
  position: absolute!important;
  clip: rect(1px,1px,1px,1px);
  padding:0!important; border:0!important; height:1px!important; width:1px!important;
  overflow:hidden;
}

/* ===== 회원 리스트 테이블 ===== */
.table-wrap {
  overflow: auto;
  border-radius: 10px;
  border: 1px solid #eee;
}
.member-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  min-width: 720px;
  table-layout: fixed;
}
.member-table th,
.member-table td {
  border-bottom: 1px solid #f2f2f2;
  padding: 12px 10px;
  text-align: center; /* 전체 가운데 정렬 */
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* 헤더 행: 진한 보라 + 흰 텍스트 */
.member-table thead th {
  background: var(--purple);
  color: var(--white);
  font-weight: 800;
}
/* 바디 행: 연한 보라 + 검은 텍스트 */
.member-table tbody tr {
  background: var(--purple-200);
  color: #000;
}
/* 역할 드롭다운 */
.role-select {
  width: 100%;
  max-width: 140px;
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid #cbb6ea;
  background: #fff;
  outline: none;
}
/* 비고란 삭제 버튼 */
.member-delete-btn {
  background: var(--purple);
  color: var(--white);
  padding: 6px 10px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
}
.member-delete-btn:hover {
  filter: brightness(0.95);
}
/* ✅ 저장 버튼 */
.member-save-btn {
  background: #3C096C;
  color: #fff;
  padding: 6px 10px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
}
.member-save-btn:hover {
  filter: brightness(1.05);
}

/* ===== 카테고리 칩 ===== */
.category-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.category-chip {
  position: relative;
  display: inline-flex;
  align-items: center;
  background: var(--chip-bg);
  color: #000;
  border-radius: 10px;
  padding: 10px 48px 26px 12px; /* 삭제 버튼 자리 확보 */
  line-height: 1;
}
.chip-text {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}
.chip-delete {
  position: absolute;
  right: 6px;
  bottom: 6px;
  background: var(--chip-del-bg);
  color: #000;
  border: 1px solid #bda0ee;
  border-radius: 6px;
  padding: 2px 6px;
  font-size: 12px;
  cursor: pointer;
}

/* '+추가' 칩 */
.add-chip {
  background: #f4f4f4;
  color: #999;
  border: 1px dashed #ddd;
}
.add-chip .add-placeholder {
  font-weight: 600;
}
.add-chip.editing {
  background: var(--chip-bg);
  color: #000;
  border: 1px solid #dcd1fb;
}
.chip-input {
  border: none;
  background: transparent;
  outline: none;
  min-width: 140px;
  font-size: 14px;
}
.add-actions {
  display: inline-flex;
  gap: 6px;
  margin-left: 8px;
}
.mini-btn {
  background: #eee;
  color: #222;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
}
.mini-btn.primary {
  background: var(--purple-300);
  color: #222;
  border-color: #ccb9f3;
}

/* ===== 문의사항 카드 ===== */
.inquiry-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
.inquiry-card {
  position: relative;            /* 삭제 버튼 기준 */
  background: var(--purple-200); /* 연한 보라색 */
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px 16px 54px 16px;  /* 우하단 버튼 자리 */
}
.inquiry-title {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 6px;
  color: #111;
}
.inquiry-body {
  font-size: 14px;
  color: #000;
}
.inquiry-delete-btn {
  position: absolute;
  right: 12px;
  bottom: 12px;
  background: var(--purple);
  color: var(--white);
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}
.inquiry-delete-btn:hover {
  filter: brightness(0.95);
}

/* 반응형 */
@media (max-width: 900px) {
  .admin-wrap {
    grid-template-columns: 1fr;
  }
  .left-pane {
    flex-direction: row;
    align-items: center;
    gap: 10px;
    overflow-x: auto;
    white-space: nowrap;
    border-bottom: 1px solid var(--divider);
  }
  .sections-divider {
    display: none;
  }
}
</style>
