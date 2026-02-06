# NumBall Pro 🎯

실시간 멀티플레이어 숫자야구 게임

## 기능

- **12가지 게임 모드**: Classic 3-6자리, Speed, Blitz, Marathon, Duplicate, Reverse, Team 2v2
- **ELO 랭킹 시스템**: Bronze 5부터 Legend까지 28단계 티어
- **실시간 매칭**: 레이팅 기반 자동 매칭
- **AI 힌트 시스템**: 정보 엔트로피 기반 추천
- **연습 모드**: 컴퓨터와 연습

## 기술 스택

### Backend
- Node.js + Express
- Socket.IO (실시간 통신)
- PostgreSQL + Prisma ORM
- Redis (캐싱, 세션)
- JWT 인증

### Frontend
- React 18 + TypeScript
- Vite
- Redux Toolkit
- Tailwind CSS
- Framer Motion

## 시작하기

### 필수 조건
- Node.js 20+
- Docker & Docker Compose
- npm 또는 yarn

### 개발 환경 설정

1. **저장소 클론**
```bash
git clone <repository-url>
cd numball-pro
```

2. **데이터베이스 실행** (Docker)
```bash
docker-compose -f docker-compose.dev.yml up -d
```

3. **의존성 설치**
```bash
npm install
```

4. **Shared 패키지 빌드**
```bash
cd shared
npm run build
cd ..
```

5. **데이터베이스 마이그레이션**
```bash
cd server
npx prisma migrate dev
npx prisma db seed
cd ..
```

6. **개발 서버 실행**

터미널 1 - 백엔드:
```bash
cd server
npm run dev
```

터미널 2 - 프론트엔드:
```bash
cd client
npm run dev
```

7. **접속**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### 테스트 계정
- `player1@test.com` / `password123` (Gold 1)
- `player2@test.com` / `password123` (Platinum 3)
- `player3@test.com` / `password123` (Bronze 1)
- `legend@test.com` / `password123` (Legend)

## 프로덕션 배포

```bash
docker-compose up -d --build
```

## 프로젝트 구조

```
numball-pro/
├── shared/                 # 공유 타입 및 유틸리티
│   └── src/
│       ├── types/         # TypeScript 인터페이스
│       └── utils/         # 게임 로직, ELO 계산기
├── server/                 # Express 백엔드
│   ├── prisma/            # DB 스키마 및 마이그레이션
│   └── src/
│       ├── controllers/   # REST API 핸들러
│       ├── routes/        # API 라우트
│       ├── socket/        # Socket.IO 핸들러
│       ├── services/      # 비즈니스 로직
│       └── middleware/    # 인증, 에러 처리
├── client/                 # React 프론트엔드
│   └── src/
│       ├── components/    # UI 컴포넌트
│       ├── contexts/      # React Context
│       ├── hooks/         # Custom Hooks
│       ├── pages/         # 페이지 컴포넌트
│       └── store/         # Redux 스토어
└── docker-compose.yml      # Docker 설정
```

## 게임 모드

| 모드 | 설명 |
|------|------|
| Classic 3-6 | 3~6자리 숫자, 중복 없음 |
| Speed | 10초 턴 제한 |
| Blitz | 5초 턴 제한 |
| Marathon | 긴 전략적 게임 |
| Duplicate | 중복 숫자 허용 |
| Reverse | 자신의 숫자 맞추기 |
| Team 2v2 | 2대2 팀전 |

## 티어 시스템

| 티어 | 레이팅 |
|------|--------|
| Bronze 5-1 | 0 - 499 |
| Silver 5-1 | 500 - 999 |
| Gold 5-1 | 1000 - 1499 |
| Platinum 5-1 | 1500 - 1999 |
| Diamond 5-1 | 2000 - 2499 |
| Master 3-1 | 2500 - 2799 |
| Legend | 2800+ |

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### 사용자
- `GET /api/users/:id` - 사용자 정보
- `GET /api/users/:id/history` - 매치 히스토리

### 랭킹
- `GET /api/ranking` - 리더보드
- `GET /api/ranking/:userId` - 사용자 랭킹

## Socket.IO 이벤트

### Client → Server
- `room:create` - 방 생성
- `room:join` - 방 참가
- `room:leave` - 방 나가기
- `room:ready` - 준비 완료
- `game:setSecret` - 비밀번호 설정
- `game:guess` - 추측
- `match:join` - 매칭 시작
- `match:cancel` - 매칭 취소

### Server → Client
- `room:created` - 방 생성됨
- `room:playerJoined` - 플레이어 입장
- `game:started` - 게임 시작
- `game:yourTurn` - 내 턴
- `game:guessResult` - 추측 결과
- `game:ended` - 게임 종료
- `match:found` - 매칭 성공

## 라이선스

MIT License
