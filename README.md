# BSS-LAB 프론트엔드

[![React](https://img.shields.io/badge/React-v18.3.1-blue.svg)](https://reactjs.org/)
[![Material UI](https://img.shields.io/badge/MaterialUI-v5.13.7-blue.svg)](https://mui.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

BSS-LAB 연구소 웹사이트를 위한 현대적이고 반응형 프론트엔드 애플리케이션으로, 사용자 인증, 연구 정보, 게시판 시스템, 그리고 연구원 지원자를 위한 지원 시스템을 포함하고 있습니다.

![BSS-LAB 미리보기](https://via.placeholder.com/1200x600)

## 🚀 주요 기능

- **반응형 디자인** - 모든 기기에서 작동하는 완전 반응형 UI
- **사용자 인증** - 안전한 로그인 및 회원가입 시스템
- **연구 정보** - 연구 프로젝트와 성과를 보여주는 페이지
- **게시판 시스템** - 게시글 생성, 조회, 수정 및 삭제 기능
- **지원 시스템** - 예비 연구원을 위한 온라인 지원 프로세스
- **관리자 대시보드** - 콘텐츠 관리를 위한 종합적인 관리자 기능
- **프로필 관리** - 사용자 프로필 편집 및 관리
- **다국어 지원** - 한국어 및 영어(기본) 지원

## 🛠️ 기술 스택

- **React** (v18.3.1) - 프론트엔드 라이브러리
- **React Router** (v6.30.0) - 네비게이션 및 라우팅
- **Material UI** (v5.13.7) - UI 컴포넌트 라이브러리
- **Framer Motion** (v10.18.0) - 애니메이션
- **Axios** (v1.8.4) - API 요청
- **JWT** - 인증 토큰
- **Date-fns** (v2.29.3) - 날짜 조작
- **React Icons** (v4.11.0) - 아이콘 라이브러리

## 📂 프로젝트 구조

```
bss-lab-frontend/
├── public/
│   ├── assets/
│   │   └── images/
│   └── ...
├── src/
│   ├── admin/            # 관리자 대시보드 컴포넌트
│   ├── api/              # API 통합
│   ├── components/       # 재사용 가능한 컴포넌트
│   │   ├── common/
│   │   ├── layout/
│   │   └── main/
│   ├── context/          # React 컨텍스트 프로바이더
│   ├── hooks/            # 커스텀 React 훅
│   ├── pages/            # 페이지 컴포넌트
│   ├── styles/           # 전역 스타일 및 테마
│   ├── utils/            # 유틸리티 함수
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## 📥 설치 및 설정

### 사전 요구사항

- Node.js 16.x 이상
- npm 8.x 이상

### 설치 단계

1. 저장소 복제:
```bash
git clone https://github.com/your-username/bss-lab-frontend.git
cd bss-lab-frontend
```

2. 의존성 설치:
```bash
npm install
```

3. 루트 디렉토리에 다음 변수로 `.env` 파일 생성:
```env
REACT_APP_API_URL=http://localhost:8080/api
```

4. 개발 서버 시작:
```bash
npm start
```

5. 애플리케이션은 [http://localhost:3000](http://localhost:3000)에서 접근 가능합니다.

## 📋 사용 가능한 스크립트

프로젝트 디렉토리에서 다음 명령을 실행할 수 있습니다:

### `npm start`

개발 모드에서 앱을 실행합니다.\
브라우저에서 [http://localhost:3000](http://localhost:3000)으로 확인할 수 있습니다.

### `npm test`

인터랙티브 모드에서 테스트 러너를 실행합니다.

### `npm run build`

프로덕션용 앱을 `build` 폴더에 빌드합니다.

### `npm run eject`

**참고: 이것은 일방통행 작업입니다. 한 번 `eject`하면 돌아갈 수 없습니다!**

## 🔌 API 통합

프론트엔드는 Spring Boot 백엔드 API와 통신합니다. API 통합은 `src/api/index.js` 파일에 구성되어 있으며 다음을 포함합니다:

- 인증 API (`authAPI`)
- 게시글/게시판 API (`postAPI`)
- 지원 API (`applicationAPI`)
- 관리자 API (`adminAPI`)

API 사용 예:

```javascript
import { authAPI } from '../api';

// 사용자 로그인
const login = async (credentials) => {
  try {
    const response = await authAPI.login(credentials);
    return response.data;
  } catch (error) {
    console.error('로그인 실패:', error);
    throw error;
  }
};
```

## 🧩 주요 기능 상세 설명

### 인증 시스템

- JWT 기반 인증
- 인증된 사용자를 위한 보호된 라우트
- 역할 기반 접근 제어 (관리자 vs 일반 사용자)
- 프로필 관리

### 게시판 시스템

- 게시글 생성, 조회, 수정, 삭제
- 카테고리별 게시글
- 이미지 업로드 지원
- 게시글 검색 및 필터링

### 예비 연구원을 위한 지원 시스템

- 다단계 지원 양식
- 양식 검증
- 파일 업로드
- 지원서 상태 추적

### 관리자 대시보드

- 사용자 관리
- 게시글 관리
- 지원 양식 관리
- 지원서 검토 시스템

## 🔐 인증 흐름

1. 사용자가 사용자명과 비밀번호로 로그인
2. 서버가 자격 증명을 검증하고 JWT 토큰 반환
3. 토큰이 localStorage에 저장됨
4. Axios 인터셉터가 모든 후속 API 요청에 토큰 추가
5. 보호된 라우트는 유효한 토큰 확인
6. 토큰 만료는 자동으로 처리됨

## 📱 반응형 디자인

이 애플리케이션은 완전 반응형으로 모든 크기의 기기에서 작동합니다:

- 데스크톱 (1200px 이상)
- 노트북 (992px-1199px)
- 태블릿 (768px-991px)
- 모바일 (768px 미만)

## 🌐 브라우저 지원

- 크롬 (최신 2개 버전)
- 파이어폭스 (최신 2개 버전)
- 사파리 (최신 2개 버전)
- 엣지 (최신 2개 버전)

## 🤝 기여하기

기여는 환영합니다! Pull Request를 자유롭게 제출해 주세요.

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/멋진기능`)
3. 변경사항 커밋 (`git commit -m '멋진기능 추가'`)
4. 브랜치에 푸시 (`git push origin feature/멋진기능`)
5. Pull Request 열기

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 있습니다 - 자세한 내용은 LICENSE 파일을 참조하세요.

## 📞 연락처

BSS LAB - contact@bsslab.com

프로젝트 링크: [https://github.com/your-username/bss-lab-frontend](https://github.com/your-username/bss-lab-frontend)
