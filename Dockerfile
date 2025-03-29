# 빌드 단계
FROM node:18-alpine as build

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사 및 의존성 설치
COPY package.json package-lock.json ./
RUN npm ci

# 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# 실행 단계
FROM nginx:alpine

# Nginx 설정 파일 복사 (아래에서 생성할 파일)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 결과물을 Nginx의 서브 디렉토리로 복사
COPY --from=build /app/build /usr/share/nginx/html

# 80 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]