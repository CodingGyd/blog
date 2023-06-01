---
# icon: lock
date: 2023-05-24
category:
  - SOP
tag:
  - NoClassDefFoundError
  - 异常
---

# 异常SOP

## java.lang.NoClassDefFoundError:javassist/bytecode/ClassFile
错误信息：<br/>
![NoclassdeffoundError](/images/cszl-sop/problem-manual-1.png)

解决方式：<br/>
是javassist.jar这个jar包出问题了, 去MAVEN仓库里找到这个jar包, 删除, 然后重新构建程序让其重新下载一个即可。

我的javassist在本地MAVEN仓库的路径是D:\developer\apache-maven-3.3.9-bin\repository\org\javassist
