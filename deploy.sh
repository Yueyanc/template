#!/bin/bash

# 确保脚本在遇到错误时停止执行
set -e

export NVM_DIR=~/.nvm
. ~/.nvm/nvm.sh

# 1. 根据lock文件安装依赖
echo "Installing dependencies..."
pnpm install

# 2. 运行构建命令
echo "Building the project..."
pnpm run build:web

# 3. 复制打包后的dist到指定目录
# 请将TARGET_DIRECTORY替换为你的目标目录路径
TARGET_DIRECTORY="/opt/1panel/apps/openresty/openresty/www/sites/book.yueyanc.cn/index"
echo "Copying dist to $TARGET_DIRECTORY..."
cp -r ./apps/web/dist/* "$TARGET_DIRECTORY"

echo "Script completed successfully."
