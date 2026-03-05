#!/bin/bash
#
# 小青蛙的奇妙冒险 - 关卡 JSON 部署脚本
# 部署关卡 JSON 文件到 CDN
#

set -e

# 配置
SERVER="lanser@lanser.fun"
REMOTE_BASE="/var/www/html/game/frog/assets/data"
REMOTE_TEMP="/tmp/frog-levels-temp"
LOCAL_DATA="public/assets/data"

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "========================================="
echo "  关卡 JSON 部署到 CDN"
echo "========================================="
echo ""
echo "服务器: $SERVER"
echo "本地目录: $LOCAL_DATA"
echo "远程目录: $REMOTE_BASE"
echo ""

# 检查本地目录
if [ ! -d "$LOCAL_DATA" ]; then
    echo "❌ 错误: 本地目录不存在: $LOCAL_DATA"
    exit 1
fi

# 计数 JSON 文件
JSON_COUNT=$(ls "$LOCAL_DATA"/*.json 2>/dev/null | wc -l)
echo "找到 $JSON_COUNT 个 JSON 文件"

if [ "$JSON_COUNT" -eq 0 ]; then
    echo "❌ 错误: 没有找到 JSON 文件"
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
echo "========================================="

# 1. 创建远程临时目录
echo ""
echo -e "${YELLOW}[1/5] 创建远程临时目录...${NC}"
sshpass -p "$SSHPASS" ssh "$SERVER" "mkdir -p $REMOTE_TEMP"
echo "✓ 临时目录已创建: $REMOTE_TEMP"

# 2. 上传到临时目录（用户有权限）
echo ""
echo -e "${YELLOW}[2/5] 上传 JSON 文件到临时目录...${NC}"
sshpass -p "$SSHPASS" scp "$LOCAL_DATA"/*.json "$SERVER:$REMOTE_TEMP/"
echo "✓ JSON 文件上传完成"

# 3. 删除远程现有 JSON 文件
echo ""
echo -e "${YELLOW}[3/5] 删除远程现有 JSON 文件...${NC}"
sshpass -p "$SSHPASS" ssh "$SERVER" "echo '$SUDOPASS' | sudo -S rm -f $REMOTE_BASE/*.json 2>/dev/null || true"
echo "✓ 远程 JSON 文件已删除"

# 4. 移动文件到目标目录（使用 sudo）
echo ""
echo -e "${YELLOW}[4/5] 移动文件到目标目录...${NC}"
sshpass -p "$SSHPASS" ssh "$SERVER" "echo '$SUDOPASS' | sudo -S mv $REMOTE_TEMP/*.json $REMOTE_BASE/"
echo "✓ 文件已移动到目标目录"

# 5. 设置权限
echo ""
echo -e "${YELLOW}[5/5] 设置文件权限...${NC}"
sshpass -p "$SSHPASS" ssh "$SERVER" "echo '$SUDOPASS' | sudo -S chmod 644 $REMOTE_BASE/*.json && echo '$SUDOPASS' | sudo -S chown www-data:www-data $REMOTE_BASE/*.json"
echo "✓ 权限设置完成"

# 6. 清理临时目录
echo ""
echo -e "${YELLOW}[6/6] 清理临时目录...${NC}"
sshpass -p "$SSHPASS" ssh "$SERVER" "rm -rf $REMOTE_TEMP"
echo "✓ 临时目录已清理"

# 7. 验证上传
echo ""
echo -e "${YELLOW}验证上传...${NC}"
REMOTE_COUNT=$(sshpass -p "$SSHPASS" ssh "$SERVER" "ls $REMOTE_BASE/*.json 2>/dev/null | wc -l")
echo "✓ 远程 JSON 文件数: $REMOTE_COUNT"

if [ "$REMOTE_COUNT" -ne "$JSON_COUNT" ]; then
    echo "⚠️  警告: 远程文件数 ($REMOTE_COUNT) 与本地 ($JSON_COUNT) 不匹配"
else
    echo "✓ 验证通过"
fi

echo ""
echo "========================================="
echo -e "${GREEN}✓ 部署完成！${NC}"
echo "========================================="
echo ""
echo "访问地址示例:"
echo "  https://lanser.fun/game/frog/assets/data/level1.json"
echo ""
