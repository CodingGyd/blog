---
# icon: lock
date: 2023-02-05
category:
  - SOP
---

# 跨域访问解决方案
 
## 什么是跨域？
- 跨域是 浏览器 为了安全而作出的限制策略（所以服务端不涉及到跨域）；  
- 浏览器请求必须遵循同源策略，即同域名、同端口、同协议；  
例如：
```
1. http://www.abc.com到http://www.def.com的请求会出现跨域（域名不同）
2. http://www.abc.com:3000到http://www.abc.com:3001的请求会出现跨域（端口不同）
3. http://www.abc.com到https://www.abc.com的请求会出现跨域（协议不同）
```

## 解决方法
1. CORS跨域 （前端不用动，后端设置Access-Control-Allow-Origin等）

- 服务端进行接口请求设置，前端直接调用  
  说明：后台设置前端某个站点进行访问  

  如果是springboot程序可以按如下方式设置：
  ```java
   @Configuration
	public class CosWebConfig implements WebMvcConfigurer{

		@Override
		public void addCorsMappings(CorsRegistry registry) {
			registry.addMapping("/**")
					.allowedOrigins("*")
					.allowCredentials(true)
					.allowedMethods("GET", "POST", "DELETE", "PUT")
					.maxAge(3600);
		}
	}

  ```
2. JSONP （动态创建script标签）  

- JSONP跨域-前端适配，后端配合  
- 前后端同时改造  
jsonp原理：img、srcipt，link标签的src或href属性不受同源策略限制，可以用来作为请求，后端接受请求后返回一个回调函数callback，调用前端已经定义好的函数，从而实现跨域请求，如：
```
$('#btn').click(function(){
	var frame = document.createElement('script');
	frame.src = 'http://localhost:3000/article-listname=leo&age=30&callback=func';
	$('body').append(frame);
});

// 此为回调函数，其中res为后端返回的数据
function func(res){
	alert(res.message+res.name+'你已经'+res.age+'岁了');
}
```
其中， func 这个回调函数命名，需要前后端沟通一致  

3. 接口代理  

通过修改nginx服务器配置实现代理转发  
前端修改，后端不用  
前端请求 a 地址，设置nginx服务，将 a 地址代理到 b 地址。  

如vue项目中可以在 vue.config.js 中设置：  

```javascript
devServer: {
    host: 'localhost', // 主机地址
    port: '8000', // 端口
	proxy: {
		'/api': {
			target: 'xxxxxxxx', // 真实地址
			changeOrigin: true,
			pathRewrite: {
				'/api': ''
			}
		}
    }
}
```