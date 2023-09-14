---
title: Spring Boot系列笔记-Spring Boot的迭代史
shortTitle: Spring Boot的迭代史
date: 2023-08-23
category:
  - JAVA企业级开发
tag:
  - spring
head:
  - - meta
    - name: keywords
      content: JAVA企业级开发,Spring Boot笔记,Spring Boot2,Spring Boot总结,Spring Boot的迭代史
---

# Spring Boot的迭代史

![](http://cdn.gydblog.com/images/sucai/sc-1.jpg)

2013年，Pivotal团队开始研发Spring Boot。
2014年4月，发布全新开源的轻量级框架的第一个Spring Boot版本。

截至20230823，Spring Boot已经发布了非常多的版本，下面小郭花了2小时把Spring Boot各个版本和依赖组件的版本关系整理了一份表格，方便大家查阅

> 整理不易，大家点个赞再走呀~

**系统环境要求：**

![](http://cdn.gydblog.com/images/sucai/sc-3.jpg)

<table>
	<tbody>
		<tr>
			<td><strong>Spring Boot</strong></td>
			<td><strong>Spring</strong></td>
			<td><strong>Java</strong></td>
			<td><strong>Maven</strong></td>
			<td><strong>Gradle</strong></td>
		</tr>  
        <tr>
			<td colspan="5"><strong>Spring Boot 3.1.x</strong></td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/3.1.2/reference/htmlsingle/#getting-started-system-requirements">3.1.2</a>
			</td>
			<td>Spring Framework 6.0.11</td>
            <td>Java 17~20</td>
			<td>3.6.3</td>
			<td>7.5以上,8.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/3.1.1/reference/htmlsingle/#getting-started-system-requirements">3.1.1</a>
			</td>
			<td>Spring Framework 6.0.10</td>
            <td>Java 17~20</td>
			<td>3.6.3</td>
			<td>7.5以上,8.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/3.1.0/reference/htmlsingle/#getting-started-system-requirements">3.1.0</a>
			</td>
			<td>Spring Framework 6.0.9</td>
            <td>Java 17~20</td>
			<td>3.6.3</td>
			<td>7.5以上,8.x</td>
		</tr> 
        <tr>
			<td colspan="5"><strong>Spring Boot 3.0.x</strong></td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/3.0.9/reference/htmlsingle/#getting-started-system-requirements">3.0.9</a>
			</td>
			<td>Spring Framework 6.0.11</td>
            <td>Java 17~20</td>
			<td>3.5+</td>
			<td>7.5以上,8.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/3.0.8/reference/htmlsingle/#getting-started-system-requirements">3.0.8</a>
			</td>
			<td>Spring Framework 6.0.10</td>
            <td>Java 17~20</td>
			<td>3.5+</td>
			<td>7.5以上,8.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/3.0.7/reference/htmlsingle/#getting-started-system-requirements">3.0.7</a>
			</td>
			<td>Spring Framework 6.0.9</td>
            <td>Java 17~20</td>
			<td>3.5+</td>
			<td>7.5以上,8.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/3.0.6/reference/htmlsingle/#getting-started-system-requirements">3.0.6</a>
			</td>
			<td>Spring Framework 6.0.8</td>
            <td>Java 17~20</td>
			<td>3.5+</td>
			<td>7.5以上,8.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/3.0.5/reference/htmlsingle/#getting-started-system-requirements">3.0.5</a>
			</td>
			<td>Spring Framework 6.0.7</td>
            <td>Java 17~20</td>
			<td>3.5+</td>
			<td>7.5以上,8.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/3.0.4/reference/htmlsingle/#getting-started-system-requirements">3.0.4</a>
			</td>
			<td>Spring Framework 6.0.6</td>
            <td>Java 17~19</td>
			<td>3.5+</td>
			<td>7.5以上,8.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/3.0.3/reference/htmlsingle/#getting-started-system-requirements">3.0.3</a>
			</td>
			<td>Spring Framework 6.0.5</td>
            <td>Java 17~19</td>
			<td>3.5+</td>
			<td>7.5以上,8.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/3.0.2/reference/htmlsingle/#getting-started-system-requirements">3.0.2</a>
			</td>
			<td>Spring Framework 6.0.4</td>
            <td>Java 17~19</td>
			<td>3.5+</td>
			<td>7.5以上,8.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/3.0.1/reference/htmlsingle/#getting-started-system-requirements">3.0.1</a>
			</td>
			<td>Spring Framework 6.0.3</td>
            <td>Java 17~19</td>
			<td>3.5+</td>
			<td>7.5以上,8.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/3.0.0/reference/htmlsingle/#getting-started-system-requirements">3.0.0</a>
			</td>
			<td>Spring Framework 6.0.2</td>
            <td>Java 17~19</td>
			<td>3.5+</td>
			<td>7.5以上,8.x</td>
		</tr> 
        <tr>
			<td colspan="5"><strong>Spring Boot 2.7.x</strong></td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.7.14/reference/htmlsingle/#getting-started-system-requirements">2.7.14</a>
			</td>
			<td>Spring Framework 5.3.29</td>
            <td>Java 8~20</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.7.13/reference/htmlsingle/#getting-started-system-requirements">2.7.13</a>
			</td>
			<td>Spring Framework 5.3.28</td>
            <td>Java 8~20</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.7.12/reference/htmlsingle/#getting-started-system-requirements">2.7.12</a>
			</td>
			<td>Spring Framework 5.3.27</td>
            <td>Java 8~20</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.7.11/reference/htmlsingle/#getting-started-system-requirements">2.7.11</a>
			</td>
			<td>Spring Framework 5.3.27</td>
            <td>Java 8~20</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.7.10/reference/htmlsingle/#getting-started-system-requirements">2.7.10</a>
			</td>
			<td>Spring Framework 5.3.26</td>
            <td>Java 8~20</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.7.9/reference/htmlsingle/#getting-started-system-requirements">2.7.9</a>
			</td>
			<td>Spring Framework 5.3.25</td>
            <td>Java 8~19</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.7.8/reference/htmlsingle/#getting-started-system-requirements">2.7.8</a>
			</td>
			<td>Spring Framework 5.3.25</td>
            <td>Java 8~19</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.7.7/reference/htmlsingle/#getting-started-system-requirements">2.7.7</a>
			</td>
			<td>Spring Framework 5.3.24</td>
            <td>Java 8~19</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.7.6/reference/htmlsingle/#getting-started-system-requirements">2.7.6</a>
			</td>
			<td>Spring Framework 5.3.24</td>
            <td>Java 8~19</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.7.5/reference/htmlsingle/#getting-started-system-requirements">2.7.5</a>
			</td>
			<td>Spring Framework 5.3.23</td>
            <td>Java 8~19</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.7.4/reference/htmlsingle/#getting-started-system-requirements">2.7.4</a>
			</td>
			<td>Spring Framework 5.3.23</td>
            <td>Java 8~19</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.7.3/reference/htmlsingle/#getting-started-system-requirements">2.7.3</a>
			</td>
			<td>Spring Framework 5.3.22</td>
            <td>Java 8~18</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.7.2/reference/htmlsingle/#getting-started-system-requirements">2.7.2</a>
			</td>
			<td>Spring Framework 5.3.22</td>
            <td>Java 8~18</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.7.1/reference/htmlsingle/#getting-started-system-requirements">2.7.1</a>
			</td>
			<td>Spring Framework 5.3.21</td>
            <td>Java 8~18</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.7.0/reference/htmlsingle/#getting-started-system-requirements">2.7.0</a>
			</td>
			<td>Spring Framework 5.3.20</td>
            <td>Java 8~18</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
			<td colspan="5"><strong>Spring Boot 2.6.x</strong></td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.6.15/reference/htmlsingle/#getting-started-system-requirements">2.6.15</a>
			</td>
			<td>Spring Framework 5.3.27</td>
            <td>Java 8~19</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.6.14/reference/htmlsingle/#getting-started-system-requirements">2.6.14</a>
			</td>
			<td>Spring Framework 5.3.24</td>
            <td>Java 8~19</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.6.13/reference/htmlsingle/#getting-started-system-requirements">2.6.13</a>
			</td>
			<td>Spring Framework 5.3.23</td>
            <td>Java 8~19</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.6.12/reference/htmlsingle/#getting-started-system-requirements">2.6.12</a>
			</td>
			<td>Spring Framework 5.3.23</td>
            <td>Java 8~19</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.6.11/reference/htmlsingle/#getting-started-system-requirements">2.6.11</a>
			</td>
			<td>Spring Framework 5.3.22</td>
            <td>Java 8~18</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.6.10/reference/htmlsingle/#getting-started-system-requirements">2.6.10</a>
			</td>
			<td>Spring Framework 5.3.22</td>
            <td>Java 8~18</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.6.9/reference/htmlsingle/#getting-started-system-requirements">2.6.9</a>
			</td>
			<td>Spring Framework 5.3.21</td>
            <td>Java 8~18</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.6.8/reference/htmlsingle/#getting-started-system-requirements">2.6.8</a>
			</td>
			<td>Spring Framework 5.3.20</td>
            <td>Java 8~18</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.6.7/reference/htmlsingle/#getting-started-system-requirements">2.6.7</a>
			</td>
			<td>Spring Framework 5.3.19</td>
            <td>Java 8~17</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.6.6/reference/htmlsingle/#getting-started-system-requirements">2.6.6</a>
			</td>
			<td>Spring Framework 5.3.18</td>
            <td>Java 8~17</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.6.5/reference/htmlsingle/#getting-started-system-requirements">2.6.5</a>
			</td>
			<td>Spring Framework 5.3.17</td>
            <td>Java 8~17</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.6.4/reference/htmlsingle/#getting-started-system-requirements">2.6.4</a>
			</td>
			<td>Spring Framework 5.3.16</td>
            <td>Java 8~17</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.6.3/reference/htmlsingle/#getting-started-system-requirements">2.6.3</a>
			</td>
			<td>Spring Framework 5.3.15</td>
            <td>Java 8~17</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.6.2/reference/htmlsingle/#getting-started-system-requirements">2.6.2</a>
			</td>
			<td>Spring Framework 5.3.14</td>
            <td>Java 8~17</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.6.1/reference/htmlsingle/#getting-started-system-requirements">2.6.1</a>
			</td>
			<td>Spring Framework 5.3.13</td>
            <td>Java 8~17</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.6.0/reference/htmlsingle/#getting-started-system-requirements">2.6.0</a>
			</td>
			<td>Spring Framework 5.3.13</td>
            <td>Java 8~17</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
			<td colspan="5"><strong>Spring Boot 2.5.x</strong></td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.5.15/reference/htmlsingle/#getting-started-system-requirements">2.5.15</a>
			</td>
			<td>Spring Framework 5.3.27</td>
            <td>Java 8~18</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.5.14/reference/htmlsingle/#getting-started-system-requirements">2.5.14</a>
			</td>
			<td>Spring Framework 5.3.20</td>
            <td>Java 8~18</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.5.13/reference/htmlsingle/#getting-started-system-requirements">2.5.13</a>
			</td>
			<td>Spring Framework 5.3.19</td>
            <td>Java 8~17</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.5.12/reference/htmlsingle/#getting-started-system-requirements">2.5.12</a>
			</td>
			<td>Spring Framework 5.3.18</td>
            <td>Java 8~17</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.5.11/reference/htmlsingle/#getting-started-system-requirements">2.5.11</a>
			</td>
			<td>Spring Framework 5.3.17</td>
            <td>Java 8~17</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.5.10/reference/htmlsingle/#getting-started-system-requirements">2.5.10</a>
			</td>
			<td>Spring Framework 5.3.16</td>
            <td>Java 8~17</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.5.9/reference/htmlsingle/#getting-started-system-requirements">2.5.9</a>
			</td>
			<td>Spring Framework 5.3.15</td>
            <td>Java 8~17</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.5.8/reference/htmlsingle/#getting-started-system-requirements">2.5.8</a>
			</td>
			<td>Spring Framework 5.3.14</td>
            <td>Java 8~17</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.5.7/reference/htmlsingle/#getting-started-system-requirements">2.5.7</a>
			</td>
			<td>Spring Framework 5.3.13</td>
            <td>Java 8~17</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.5.6/reference/htmlsingle/#getting-started-system-requirements">2.5.6</a>
			</td>
			<td>Spring Framework 5.3.12</td>
            <td>Java 8~17</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.5.5/reference/htmlsingle/#getting-started-system-requirements">2.5.5</a>
			</td>
			<td>Spring Framework 5.3.10</td>
            <td>Java 8~17</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.5.4/reference/htmlsingle/#getting-started-system-requirements">2.5.4</a>
			</td>
			<td>Spring Framework 5.3.9</td>
            <td>Java 8~16</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.5.3/reference/htmlsingle/#getting-started-system-requirements">2.5.3</a>
			</td>
			<td>Spring Framework 5.3.9</td>
            <td>Java 8~16</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.5.2/reference/htmlsingle/#getting-started-system-requirements">2.5.2</a>
			</td>
			<td>Spring Framework 5.3.8</td>
            <td>Java 8~16</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.5.1/reference/htmlsingle/#getting-started-system-requirements">2.5.1</a>
			</td>
			<td>Spring Framework 5.3.8</td>
            <td>Java 8~16</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.5.0/reference/htmlsingle/#getting-started-system-requirements">2.5.0</a>
			</td>
			<td>Spring Framework 5.3.7</td>
            <td>Java 8~16</td>
			<td>3.5+</td>
			<td>6.8x,6.9x,7.x</td>
		</tr> 
        <tr>
			<td colspan="5"><strong>Spring Boot 2.4.x</strong></td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.4.13/reference/htmlsingle/#getting-started-system-requirements">2.4.13</a>
			</td>
			<td>Spring Framework 5.3.13</td>
            <td>Java 8~16</td>
			<td>3.5+</td>
			<td>6.3+</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.4.12/reference/htmlsingle/#getting-started-system-requirements">2.4.12</a>
			</td>
			<td>Spring Framework 5.3.12</td>
            <td>Java 8~16</td>
			<td>3.5+</td>
			<td>6.3+</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.4.11/reference/htmlsingle/#getting-started-system-requirements">2.4.11</a>
			</td>
			<td>Spring Framework 5.3.10</td>
            <td>Java 8~16</td>
			<td>3.5+</td>
			<td>6.3+</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.4.10/reference/htmlsingle/#getting-started-system-requirements">2.4.10</a>
			</td>
			<td>Spring Framework 5.3.9</td>
            <td>Java 8~16</td>
			<td>3.5+</td>
			<td>6.3+</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.4.9/reference/htmlsingle/#getting-started-system-requirements">2.4.9</a>
			</td>
			<td>Spring Framework 5.3.9</td>
            <td>Java 8~16</td>
			<td>3.5+</td>
			<td>6.3+</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.4.8/reference/htmlsingle/#getting-started-system-requirements">2.4.8</a>
			</td>
			<td>Spring Framework 5.3.8</td>
            <td>Java 8~16</td>
			<td>3.5+</td>
			<td>6.3+</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.4.7/reference/htmlsingle/#getting-started-system-requirements">2.4.7</a>
			</td>
			<td>Spring Framework 5.3.8</td>
            <td>Java 8~16</td>
			<td>3.5+</td>
			<td>6.3+</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.4.6/reference/htmlsingle/#getting-started-system-requirements">2.4.6</a>
			</td>
			<td>Spring Framework 5.3.7</td>
            <td>Java 8~16</td>
			<td>3.5+</td>
			<td>6.3+</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.4.5/reference/htmlsingle/#getting-started-system-requirements">2.4.5</a>
			</td>
			<td>Spring Framework 5.3.6</td>
            <td>Java 8~16</td>
			<td>3.5+</td>
			<td>6.3+</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.4.4/reference/htmlsingle/#getting-started-system-requirements">2.4.4</a>
			</td>
			<td>Spring Framework 5.3.5</td>
            <td>Java 8~16</td>
			<td>3.3+</td>
			<td>6.3+</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.4.3/reference/htmlsingle/#getting-started-system-requirements">2.4.3</a>
			</td>
			<td>Spring Framework 5.3.4</td>
            <td>Java 8~15</td>
			<td>3.3+</td>
			<td>6.3+</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.4.2/reference/htmlsingle/#getting-started-system-requirements">2.4.2</a>
			</td>
			<td>Spring Framework 5.3.3</td>
            <td>Java 8~15</td>
			<td>3.3+</td>
			<td>6.3+</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.4.1/reference/htmlsingle/#getting-started-system-requirements">2.4.1</a>
			</td>
			<td>Spring Framework 5.3.2</td>
            <td>Java 8~15</td>
			<td>3.3+</td>
			<td>6.3+</td>
		</tr> 
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.4.0/reference/htmlsingle/#getting-started-system-requirements">2.4.0</a>
			</td>
			<td>Spring Framework 5.3.1</td>
            <td>Java 8~15</td>
			<td>3.3+</td>
			<td>6.3+</td>
		</tr> 
        <tr>
			<td colspan="5"><strong>Spring Boot 2.3.x</strong></td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.3.12.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.3.12.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.15.RELEASE</td>
            <td>Java 8~15</td>
			<td>3.3+</td>
			<td>6.3+</td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.3.11.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.3.11.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.15.RELEASE</td>
            <td>Java 8~15</td>
			<td>3.3+</td>
			<td>6.3+</td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.3.10.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.3.10.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.14.RELEASE</td>
            <td>Java 8~15</td>
			<td>3.3+</td>
			<td>6.3+</td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.3.9.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.3.9.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.13.RELEASE</td>
            <td>Java 8~15</td>
			<td>3.3+</td>
			<td>6.3+</td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.3.8.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.3.8.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.12.RELEASE</td>
            <td>Java 8~15</td>
			<td>3.3+</td>
			<td>6.3+</td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.3.7.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.3.7.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.12.RELEASE</td>
            <td>Java 8~15</td>
			<td>3.3+</td>
			<td>6.3+</td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.3.6.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.3.6.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.11.RELEASE</td>
            <td>Java 8~15</td>
			<td>3.3+</td>
			<td>6.3+</td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.3.5.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.3.5.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.10.RELEASE</td>
            <td>Java 8~15</td>
			<td>3.3+</td>
			<td>6.3+</td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.3.4.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.3.4.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.9.RELEASE</td>
            <td>Java 8~14</td>
			<td>3.3+</td>
			<td>6.3+</td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.3.3.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.3.3.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.8.RELEASE</td>
            <td>Java 8~14</td>
			<td>3.3+</td>
			<td>6.3+</td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.3.2.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.3.2.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.8.RELEASE</td>
            <td>Java 8~14</td>
			<td>3.3+</td>
			<td>6.3+</td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.3.1.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.3.1.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.7.RELEASE</td>
            <td>Java 8~14</td>
			<td>3.3+</td>
			<td>6.3+</td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.3.0.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.3.0.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.6.RELEASE</td>
            <td>Java 8~14</td>
			<td>3.3+</td>
			<td>6.3+</td>
		</tr>
        <tr>
			<td colspan="5"><strong>Spring Boot 2.2.x</strong></td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.2.13.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.2.13.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.12.RELEASE</td>
            <td>Java 8~15</td>
			<td>3.3+</td>
			<td>5.x,6.x</td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.2.12.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.2.12.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.12.RELEASE</td>
            <td>Java 8~15</td>
			<td>3.3+</td>
			<td>5.x,6.x</td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.2.11.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.2.11.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.10.RELEASE</td>
            <td>Java 8~15</td>
			<td>3.3+</td>
			<td>5.x,6.x</td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.2.10.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.2.10.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.9.RELEASE</td>
            <td>Java 8~14</td>
			<td>3.3+</td>
			<td>5.x,6.x</td>
		</tr>
        <tr>
        	<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.2.9.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.2.9.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.8.RELEASE</td>
            <td>Java 8~14</td>
			<td>3.3+</td>
			<td>5.x,6.x</td>
		</tr>
        <tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.2.8.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.2.8.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.7.RELEASE</td>
            <td>Java 8~14</td>
			<td>3.3+</td>
			<td>5.x,6.x</td>
		</tr>
        <tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.2.7.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.2.7.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.6.RELEASE</td>
            <td>Java 8~14</td>
			<td>3.3+</td>
			<td>5.x,6.x</td>
		</tr>
        <tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.2.6.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.2.6.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.5.RELEASE</td>
            <td>Java 8~13</td>
			<td>3.3+</td>
			<td>5.x,6.x</td>
		</tr>
        <tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.2.5.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.2.5.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.4.RELEASE</td>
            <td>Java 8~13</td>
			<td>3.3+</td>
			<td>5.x,6.x</td>
		</tr>
        <tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.2.4.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.2.4.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.3.RELEASE</td>
            <td>Java 8~13</td>
			<td>3.3+</td>
			<td>5.x,6.x</td>
		</tr>
        <tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.2.3.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.2.3.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.3.RELEASE</td>
            <td>Java 8~13</td>
			<td>3.3+</td>
			<td>5.x,6.x</td>
		</tr>
        <tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.2.2.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.2.2.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.2.RELEASE</td>
            <td>Java 8~13</td>
			<td>3.3+</td>
			<td>5.x,6.x</td>
		</tr>
        <tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.2.1.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.2.1.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.1.RELEASE</td>
            <td>Java 8~13</td>
			<td>3.3+</td>
			<td>5.x</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.2.0.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.2.0.RELEASE</a>
			</td>
			<td>Spring Framework 5.2.0.RELEASE</td>
            <td>Java 8~13</td>
			<td>3.3+</td>
			<td>5.x</td>
		</tr>
		<tr>
			<td colspan="5"><strong>Spring Boot 2.1.x</strong></td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.1.0.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.1.0.RELEASE</a>
			</td>
			<td>Spring Framework 5.1.2.RELEASE</td>
			<td>Java 8 or 9</td>
			<td>3.3+</td>
			<td>4.4+</td>
		</tr>
		<tr>
			<td colspan="5"><strong>Spring Boot 2.0.x</strong></td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.0.6.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.0.6.RELEASE</a>
			</td>
			<td>Spring Framework 5.0.10.RELEASE</td>
			<td rowspan="7">Java 8 or 9</td>
			<td rowspan="7">3.2+</td>
			<td>4.x</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.0.5.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.0.5.RELEASE</a>
			</td>
			<td>Spring Framework 5.0.9.RELEASE</td>
			<td>4.x</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.0.4.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.0.4.RELEASE</a>
			</td>
			<td>Spring Framework 5.0.8.RELEASE</td>
			<td>4</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.0.3.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.0.3.RELEASE</a>
			</td>
			<td>Spring Framework 5.0.7.RELEASE</td>
			<td>4</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.0.2.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.0.2.RELEASE</a>
			</td>
			<td>Spring Framework 5.0.6.RELEASE</td>
			<td>4</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.0.1.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.0.1.RELEASE</a>
			</td>
			<td>Spring Framework 5.0.5.RELEASE</td>
			<td>4</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/2.0.0.RELEASE/reference/htmlsingle/#getting-started-system-requirements">2.0.0.RELEASE</a>
			</td>
			<td>Spring Framework 5.0.4.RELEASE</td>
			<td>4</td>
		</tr>
		<tr>
			<td colspan="5">
				<strong>Spring Boot 1.5.x</strong>
			</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/1.5.17.RELEASE/reference/htmlsingle/#getting-started-system-requirements">1.5.17.RELEASE</a>
			</td>
			<td>Spring Framework 4.3.20.RELEASE</td>
			<td rowspan="18">Java 7</td>
			<td rowspan="18">3.2+</td>
			<td rowspan="18">[2.9, 3.x]</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/1.5.16.RELEASE/reference/htmlsingle/#getting-started-system-requirements">1.5.16.RELEASE</a>
			</td>
			<td>Spring Framework 4.3.19.RELEASE</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/1.5.15.RELEASE/reference/htmlsingle/#getting-started-system-requirements">1.5.15.RELEASE</a>
			</td>
			<td>Spring Framework 4.3.18.RELEASE</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/1.5.14.RELEASE/reference/htmlsingle/#getting-started-system-requirements">1.5.14.RELEASE</a>
			</td>
			<td>Spring Framework 4.3.18.RELEASE</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/1.5.13.RELEASE/reference/htmlsingle/#getting-started-system-requirements">1.5.13.RELEASE</a>
			</td>
			<td>Spring Framework 4.3.17.RELEASE</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/1.5.12.RELEASE/reference/htmlsingle/#getting-started-system-requirements">1.5.12.RELEASE</a>
			</td>
			<td>Spring Framework 4.3.16.RELEASE</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/1.5.11.RELEASE/reference/htmlsingle/#getting-started-system-requirements">1.5.11.RELEASE</a>
			</td>
			<td>Spring Framework 4.3.15.RELEASE</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/1.5.10.RELEASE/reference/htmlsingle/#getting-started-system-requirements">1.5.10.RELEASE</a>
			</td>
			<td>Spring Framework 4.3.14.RELEASE</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/1.5.9.RELEASE/reference/htmlsingle/#getting-started-system-requirements">1.5.9.RELEASE</a>
			</td>
			<td>Spring Framework 4.3.13.RELEASE</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/1.5.8.RELEASE/reference/htmlsingle/#getting-started-system-requirements">1.5.8.RELEASE</a>
			</td>
			<td>Spring Framework 4.3.12.RELEASE</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/1.5.7.RELEASE/reference/htmlsingle/#getting-started-system-requirements">1.5.7.RELEASE</a>
			</td>
			<td>Spring Framework 4.3.11.RELEASE</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/1.5.6.RELEASE/reference/htmlsingle/#getting-started-system-requirements">1.5.6.RELEASE</a>
			</td>
			<td>Spring Framework 4.3.10.RELEASE</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/1.5.5.RELEASE/reference/htmlsingle/#getting-started-system-requirements">1.5.5.RELEASE</a>
			</td>
			<td>Spring Framework 4.3.10.RELEASE</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/1.5.4.RELEASE/reference/htmlsingle/#getting-started-system-requirements">1.5.4.RELEASE</a>
			</td>
			<td>Spring Framework 4.3.9.RELEASE</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/1.5.3.RELEASE/reference/htmlsingle/#getting-started-system-requirements">1.5.3.RELEASE</a>
			</td>
			<td>Spring Framework 4.3.8.RELEASE</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/1.5.2.RELEASE/reference/htmlsingle/#getting-started-system-requirements">1.5.2.RELEASE</a>
			</td>
			<td>Spring Framework 4.3.7.RELEASE</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/1.5.1.RELEASE/reference/htmlsingle/#getting-started-system-requirements">1.5.1.RELEASE</a>
			</td>
			<td>Spring Framework 4.3.6.RELEASE</td>
		</tr>
		<tr>
			<td>
				<a href="https://docs.spring.io/spring-boot/docs/1.5.0.RELEASE/reference/htmlsingle/#getting-started-system-requirements">1.5.0.RELEASE</a>
			</td>
			<td>Spring Framework 4.3.6.RELEASE</td>
		</tr>
		<tr>
			<td colspan="5">
				<strong>Spring Boot 1.4.x</strong>
			</td>
		</tr>
		<tr>
			<td>1.4.7.RELEASE</td>
			<td>Spring Framework 4.3.9.RELEASE</td>
			<td rowspan="8">Java 7</td>
			<td rowspan="8">3.2+</td>
			<td rowspan="8"><p>[1.12, 2.x]</p></td>
		</tr>
		<tr>
			<td>1.4.6.RELEASE</td>
			<td>Spring Framework 4.3.8.RELEASE</td>
		</tr>
		<tr>
			<td>1.4.5.RELEASE</td>
			<td>Spring Framework 4.3.7.RELEASE</td>
		</tr>
		<tr>
			<td>1.4.4.RELEASE</td>
			<td>Spring Framework 4.3.6.RELEASE</td>
		</tr>
		<tr>
			<td>1.4.3.RELEASE</td>
			<td>Spring Framework 4.3.5.RELEASE</td>
		</tr>
		<tr>
			<td>1.4.2.RELEASE</td>
			<td>Spring Framework 4.3.4.RELEASE</td>
		</tr>
		<tr>
			<td>1.4.1.RELEASE</td>
			<td>Spring Framework 4.3.3.RELEASE</td>
		</tr>
		<tr>
			<td>1.4.0.RELEASE</td>
			<td>Spring Framework 4.3.2.RELEASE</td>
		</tr>
		<tr>
			<td colspan="5"><strong>Spring Boot 1.3.x</strong></td>
		</tr>
		<tr>
			<td>1.3.8.RELEASE</td>
			<td>Spring Framework 4.2.8.RELEASE</td>
			<td rowspan="9"><p>Java 7</p></td>
			<td rowspan="9"><p>3.2+</p></td>
			<td>[1.12, 2.x]</td>
		</tr>
		<tr>
			<td>1.3.7.RELEASE</td>
			<td>Spring Framework 4.2.7.RELEASE</td>
			<td rowspan="8">1.12+</td>
		</tr>
		<tr>
			<td>1.3.6.RELEASE</td>
			<td>Spring Framework 4.2.7.RELEASE</td>
		</tr>
		<tr>
			<td>1.3.5.RELEASE</td>
			<td>Spring Framework 4.2.6.RELEASE</td>
		</tr>
		<tr>
			<td>1.3.4.RELEASE</td>
			<td>Spring Framework 4.2.6.RELEASE</td>
		</tr>
		<tr>
			<td>1.3.3.RELEASE</td>
			<td rowspan="4">Spring Framework 4.1.5+</td>
		</tr>
		<tr>
			<td>1.3.2.RELEASE</td>
		</tr>
		<tr>
			<td>1.3.1.RELEASE</td>
		</tr>
		<tr>
			<td>1.3.0.RELEASE</td>
		</tr>
		<tr>
			<td colspan="5"><strong>Spring Boot 1.2.x</strong></td>
		</tr>
		<tr>
			<td>1.2.8.RELEASE</td>
			<td rowspan="7">Spring Framework 4.1.5+</td>
			<td rowspan="7">Java 7</td>
			<td rowspan="9">3.2+</td>
			<td rowspan="9">1.12+</td>
		</tr>
		<tr>
			<td>1.2.7.RELEASE</td>
		</tr>
		<tr>
			<td>1.2.6.RELEASE</td>
		</tr>
		<tr>
			<td>1.2.5.RELEASE</td>
		</tr>
		<tr>
			<td>1.2.4.RELEASE</td>
		</tr>
		<tr>
			<td>1.2.3.RELEASE</td>
		</tr>
		<tr>
			<td>1.2.2.RELEASE</td>
		</tr>
		<tr>
			<td>1.2.1.RELEASE</td>
			<td rowspan="2">Spring Framework 4.1.3+</td>
			<td rowspan="2">Java 6</td>
		</tr>
		<tr>
			<td>1.2.0.RELEASE</td>
		</tr>
		<tr>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
		</tr>
	</tbody>
</table>
 
![](http://cdn.gydblog.com/images/sucai/sc-2.jpg)


Springboot版本迭代也非常块，但是管他迭代多少版本，我只用2.x 哈哈哈。 和java一样，你更新再多我也只用java8，就是不用新版本！
 