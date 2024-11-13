# 使用官方的Node.js作为基础镜像
FROM node:lts

# 设置工作目录
WORKDIR /app

# 将项目文件复制到工作目录
COPY . .

# 安装项目依赖
RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

# 使用Vite构建项目
RUN npm run build:web

# 使用nginx作为服务器来提供静态文件
FROM nginx:stable
COPY --from=0 /app/apps/web/dist /usr/share/nginx/html

# 暴露80端口
EXPOSE 80
EXPOSE 443

# 启动nginx以提供服务
CMD ["nginx", "-g", "daemon off;"]
