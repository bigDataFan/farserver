## 简介 ##
farserver是一个开源的web应用服务器，它是基于FAR（Fetch and Run）理念构建的，这个理念基于以下想法：

1 服务器的部署和运营应该尊重用户的选择。 SaaS只是一个选择而已。

2 服务器及数据库实现应该基于一些公开的规范和理念。

3 用户能自由选择使用什么应用，特别是第三方应用。

4 用户为应用而付费， 只有需要托管运营时才需要额外为运营付费。


为此，farserver主要提供了一个应用动态执行的容器，用户使用时，服务器才从应用的代码存储库下载代码并执行业务。 应用的业务代码编写技术是 js + ftl ，即用服务器端js技术编写业务逻辑(C)， FreeMarker模板技术构建页面(V 可选)，业务信息使用NoSQL数据库存储(M)

![http://farserver.googlecode.com/svn-history/r363/trunk/Pics/2.jpg](http://farserver.googlecode.com/svn-history/r363/trunk/Pics/2.jpg)

在这种结构下，第三方应用具有以下特征：

1 动态加载执行。 程序都是用动态脚本开发。用户即安即用，不需要在服务器上部署

2 业务逻辑不会过于复杂， 通常一个服务几十行代码就完成。

3 数据存储使用NoSQL技术，数据之间松耦合。  不适用复杂的数据模型



发布的应用注册在 http://www.g-qu.net

