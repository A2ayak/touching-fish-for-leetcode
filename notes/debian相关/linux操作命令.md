##### 1. 查看所有正在运行的服务：

```
systemctl list-units --type=service
```

##### 2. 查看网络占用的端口

```
# 可以列出打开的文件和网络连接
lsof -i -P -n
# 常用的网络工具
netstat -tuln
# 所有正在监听的端口及其对应的服务
ss -tulnp
# 系统资源
top


```

##### 3. nano操作

```
ctrl + O // 保存
ctrl + X // 退出
```


##### 4.查看占用某端口的程序

```
# 查看8080端口占用情况
ss -tulnp | grep 8080

# 显示如下
tcp    LISTEN     0      128       *:3080                  *:*                   users:(("python3",pid=11378,fd=13))

# 可以选择 kill 掉 
```
