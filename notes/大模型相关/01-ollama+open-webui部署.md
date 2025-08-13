### 一、上传代码到服务器（或git clone open-webui）

### 二、安装依赖&启动

```
Node 版本20.18.1
npm i -g pnpm
pnpm i

# 配置python环境
pip install uv
# 或 curl -LsSf https://astral.sh/uv/install.sh | sh
# source ~/.bashrc
# 初始化，构建虚拟环境并根据pyproject.toml下载依赖
uv sync
# 或uv venv构建虚拟环境
# 或uv pip install -r requirements.txt -U 从
# 进入虚拟环境
source .venv/bin/activate
# （退出使用deactivete）

# 启动可以 cd backend 然后执行 start.sh，或实际执行配置：
python3 -m uvicorn open_webui.main:app --host 0.0.0.0 --port 3080
# 后台启动（关闭终端窗口不影响程序）
nohup python3 -m uvicorn open_webui.main:app --host 0.0.0.0 --port 3080 &

# 安装&启动ollama
curl -fsSL https://ollama.com/install.sh | sh

# 后台启动ollama
nohup ollama serve &

# 安装模型
ollama run deepseek-r1:1.5b

# 查看模型列表
ollama list

# 开机启动
sudo systemctl enable ollama
```

### 三、查看已启动的后台

```
ps aux | grep "python3 -m uvicorn open_webui.main:app"

# 显示对味的内容👇，如不小心重复 nohup xxx（启动命令） & 的话，可以kill掉相应的id（第二列）
root      5284  0.0  0.0 326940   964 pts/6    S+   15:34   0:00 grep --color=auto python3 -m uvicorn open_webui.main:app
root     11378  2.1  0.5 10844532 763460 pts/6 Sl   14:57   0:47 python3 -m uvicorn open_webui.main:app --host 0.0.0.0 --port 3080

```
