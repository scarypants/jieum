<template>
  <footer class="footer mt-auto text-white">
    <div class="container-fluid footer-container"> <div class="left-section">
        <div class="d-flex flex-column justify-content-end h-100">
          <p class="mb-0 text-white footer-link">
            <a href="#" class="text-white text-decoration-none footer-link-text">이용 약관</a>
          </p>
          <p class="mb-0 text-white footer-link">
            <a href="mailto:jium@naver.com" class="text-white text-decoration-none footer-link-text">문의: jium@naver.com</a>
          </p>
        </div>
      </div>
      
      <div class="right-section text-end">
        <p class="mb-0 text-white copyright-text">@2025 지음</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
};
</script>

<style scoped>
.footer {
  background-color: #3C096C; /* 푸터 배경색: 직접 지정한 보라색 */
  padding: 3px 0; /* 상하 패딩 15px, 좌우 0px. */
}

/* container-fluid를 사용하면 Bootstrap이 기본적으로 제공하는 좌우 패딩이 있습니다.
   이것마저 없애려면 .footer-container에 직접 padding: 0 !important; 를 적용해야 합니다. */
.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  min-height: 40px;
  /* Bootstrap의 .container-fluid 기본 패딩을 제거하려면 아래를 추가 */
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.left-section {
  flex-grow: 1;
  display: flex;
  align-items: flex-end;
  /* padding-left: 20px; <-- 이 줄을 제거하거나 0으로 변경 */
}

.left-section .d-flex.flex-column {
  height: 100%;
}

.right-section {
  flex-shrink: 0;
  /* padding-right: 20px; <-- 이 줄을 제거하거나 0으로 변경 */
}

/* 나머지 스타일은 그대로 유지 */
.footer-link {
  line-height: 0.7;
  margin-bottom: 0;
  padding-left: 20px; /* 텍스트 자체에 좌측 여백을 주어 벽에 붙지 않도록 */
}

.copyright-text {
  font-size: 0.7rem !important;
  color: white !important;
  padding-right: 20px; /* 텍스트 자체에 우측 여백을 주어 벽에 붙지 않도록 */
}

.footer-link-text {
  font-size: 0.7rem !important;
  color: white !important;
}

.mb-0 {
  margin-bottom: 0 !important;
}

.footer a {
  color: white !important;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}
</style>