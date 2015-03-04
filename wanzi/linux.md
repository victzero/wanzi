linux mongodb:
/usr/local/mongodb/bin/mongod --auth --dbpath=/usr/local/mongodb/data/db/ --logpath=/usr/local/mongodb/logs/mongodb.log --fork

CentOS系统环境下安装MongoDB:
	http://my.oschina.net/chinaearl/blog/111077

MongoDB权限管理之用户名和密码的操作:
	http://database.51cto.com/art/201107/278042.htm

查看进程: ps aux |grep mongodb

删除文件夹: rm -rf directory

使用forever进行后台运行
$ sudo npm install forever -g   #安装
$ forever start app.js          #启动
$ forever stop app.js           #关闭
$ forever start -l forever.log -o out.log -e err.log app.js   #输出日志和错误


windows: 
mongodb:
cd D:\mongodb\mongodb-2.4.9\bin
mongod --dbpath="D:\mongodb\data"

kali-linux: root:zero@zero-kali