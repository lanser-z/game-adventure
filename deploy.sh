#!/bin/bash
#
# 小青蛙的奇妙冒险 - 资源部署脚本
# 只部署资源文件到 CDN，不包含 HTML/JS
#

set -e

# 配置
SERVER="lanser@lanser.fun"
REMOTE_PATH="/var/www/html/game/frog"
LOCAL_ASSETS="public/assets"
TEMP_DIR="~/frog-temp"

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "========================================="
echo "  小青蛙的奇妙冒险 - 资源部署脚本"
echo "========================================="
echo ""
echo "服务器: $SERVER"
echo "本地资源: $LOCAL_ASSETS"
echo "远程路径: $REMOTE_PATH"
echo ""

# 检查本地资源目录
if [ ! -d "$LOCAL_ASSETS" ]; then
    echo "❌ 错误: 本地资源目录不存在: $LOCAL_ASSETS"
    exit 1
fi

# 询问密码
echo -n "请输入 SSH 密码: "
read -s SSHPASS
echo ""
export SSHPASS="$SSHPASS"

echo -n "请输入 Sudo 密码: "
read -s SUDOPASS
echo ""
export SUDOPASS="$SUDOPASS"

if [ -z "$SSHPASS" ] || [ -z "$SUDOPASS" ]; then
    echo "❌ 密码不能为空"
    exit 1
fi

echo ""
echo "🔄 开始部署..."
echo ""

# 1. 清理服务器上的临时目录
echo -e "${YELLOW}📁 清理临时目录...${NC}"
sshpass -p "$SSHPASS" ssh -o StrictHostKeyChecking=no $SERVER "rm -rf $TEMP_DIR"

# 2. 创建临时目录
echo -e "${YELLOW}📁 创建临时目录...${NC}"
sshpass -p "$SSHPASS" ssh -o StrictHostKeyChecking=no $SERVER "mkdir -p $TEMP_DIR/assets"

# 3. 上传资源文件
echo -e "${YELLOW}📤 上传资源文件...${NC}"
sshpass -p "$SSHPASS" scp -o StrictHostKeyChecking=no -r "$LOCAL_ASSETS"/* "$SERVER:$TEMP_DIR/assets/"

# 4. 删除旧资源并部署新资源
echo -e "${YELLOW}🗑️  删除服务器上的旧资源...${NC}"
sshpass -p "$SSHPASS" ssh -o StrictHostKeyChecking=no $SERVER "echo '$SUDOPASS' | sudo -S rm -rf $REMOTE_PATH"

echo -e "${YELLOW}📁 创建目标目录...${NC}"
sshpass -p "$SSHPASS" ssh -o StrictHostKeyChecking=no $SERVER "echo '$SUDOPASS' | sudo -S mkdir -p $(dirname $REMOTE_PATH)"

echo -e "${YELLOW}📦 移动文件到目标位置...${NC}"
sshpass -p "$SSHPASS" ssh -o StrictHostKeyChecking=no $SERVER "echo '$SUDOPASS' | sudo -S mv $TEMP_DIR $REMOTE_PATH"

echo -e "${YELLOW}🔐 设置文件权限...${NC}"
sshpass -p "$SSHPASS" ssh -o StrictHostKeyChecking=no $SERVER "echo '$SUDOPASS' | sudo -S chown -R www-data:www-data $REMOTE_PATH"
sshpass -p "$SSHPASS" ssh -o StrictHostKeyChecking=no $SERVER "echo '$SUDOPASS' | sudo -S chmod -R 755 $REMOTE_PATH"

# 5. 清理临时目录
echo -e "${YELLOW}🧹 清理临时目录...${NC}"
sshpass -p "$SSHPASS" ssh -o StrictHostKeyChecking=no $SERVER "rm -rf $TEMP_DIR"

# 6. 验证部署
echo ""
echo -e "${YELLOW}🔍 验证部署...${NC}"
FILES=$(sshpass -p "$SSHPASS" ssh -o StrictHostKeyChecking=no $SERVER "ls -1 $REMOTE_PATH/assets/audio/ 2>/dev/null | wc -l")
echo "音频文件数量: $FILES"

# 清除密码变量
unset SSHPASS
unset SUDOPASS

echo ""
echo "========================================="
echo -e "${GREEN}✅ 部署完成!${NC}"
echo "========================================="
echo ""
echo "🌐 CDN 访问地址: https://lanser.fun/game/frog/assets/"
echo ""
echo "🔗 资源链接测试:"
echo "   - 音频: https://lanser.fun/game/frog/assets/audio/bgm_main.mp3"
echo "   - 图片: https://lanser.fun/game/frog/assets/images/..."
echo ""
