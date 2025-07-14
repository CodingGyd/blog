---
title: 数据加解密知识入门
shortTitle: 数据加解密知识入门
date: 2024-06-25
category:
  - 安全
description: 数据加解密知识入门
head:
  - - meta
    - name: keywords
      content: 数据加解密知识入门,AES,RSA,对称加密,非对称加密,数字证书
---


# 数据加解密知识入门

> 小郭最近遇到一个需求，要求对接口传输数据进行加密，因此小郭了解了一些加解密的基础知识，按自己的理解总结于此。
>
> 若有描述错误的地方，欢迎小伙伴们批评指正。




## 一、加解密基础知识
### 1、算法分类

小郭目前了解到常用的加密算法主要分为三种思路：对称加密、非对称加密、单向加密。

#### 1）非对称加密

非对称加密算法是一种密钥的保密方法。 运用它需要准备两个密钥：公开密钥（publickey: 简称公钥）和私有密钥（privatekey: 简称私钥）。 公钥与私钥是一对，如果用公钥对数据进行加密，只有用对应的私钥才能解密，反之如果用私钥对数据加密（不推荐），则只有对应的公钥才能解密。

因为加密和解密使用的是两个不同的密钥，所以这种算法被称为`非对称加密算法`。常用非对称加密算法有DSA、RSA等，其中**RSA 是主流的非对称加密算法** 。

RSA是1977年由[罗纳德·李维斯特](https://baike.baidu.com/item/罗纳德·李维斯特/700199?fromModule=lemma_inlink)（Ron Rivest）、[阿迪·萨莫尔](https://baike.baidu.com/item/阿迪·萨莫尔?fromModule=lemma_inlink)（Adi Shamir）和[伦纳德·阿德曼](https://baike.baidu.com/item/伦纳德·阿德曼/12575612?fromModule=lemma_inlink)（Leonard Adleman）一起提出的。当时他们三人都在[麻省理工学院](https://baike.baidu.com/item/麻省理工学院/117999?fromModule=lemma_inlink)工作。RSA就是他们三人姓氏开头字母拼在一起组成的。

RSA的两个密钥都可以用来加密，解密时需要使用另一个密钥。但是，通常我们只用公钥加密私钥解密这种方式，因为公钥是公开的，如果用私钥加密数据，大家就都可以使用公开的公钥解密，也就没有保密可言了。理论上如果A和B之间要完全通过RSA实现保密相互通信，需要A和B各自生成一组密钥，同时各自保管好自己的私钥，然后用对方给的公钥加密要发送的数据，用自己的私钥解密对方发送的消息。

RSA的优点是：安全 ；它的缺点是：加密速度慢。`RSA` 是第一个能同时用于 **加密** 和 **数字签名** 的算法，它能够 **抵抗** 到目前为止已知的 **所有密码攻击**，已被 `ISO` 推荐为公钥数据加密标准。

RSA的流程大致是如下这样：

```
客户端准备公钥A、私钥A，服务端也准备一套公钥B、私钥B。首先互相告知对方准备的公钥。
客户端向服务器发送消息： 客户端用服务端给的公钥B加密信息，发送给服务端，服务端再用自己的私钥B解密
服务器向客户端发送消息：服务端用客户端给的公钥A加密信息，发送给客户端，客户端再用自己的私钥A解密
```

简单来说：**「公钥加密、私钥解密、私钥签名、公钥验签」**

看到这里有些小伙伴肯定会和我一样提出质疑：公钥和私钥泄露了怎么办？ 要保障密钥的安全，有很多方式，比如数字证书，证书签名等等，这些在后续的学习中都会涉及到。



#### 2）对称加密

**使用相同的密钥进行加密和解密的过程就是对称加密。**加密秘钥和解密秘钥是一样，当密钥被别人知道后，就相当于没有加密了。

常用的对称加密算法有DES、AES等，其中**AES 是主流的对称加密算法**。

AES是一种可逆的对称加密算法，这类算法在加密和解密时使用相同的密钥，或是使用两个可以简单地相互推算的密钥，一般用于服务端对服务端之间对数据进行加密解密。它是一种为了替代原先DES、3DES而建立的高级加密标准（Advanced Encryption Standard）。作为可逆且对称的块加密，AES加密算法的速度比RSA加密等非对称加密算法快很多，在很多场合都需要AES对称加密，但是要求加密端和解密端双方都使用相同的密钥是AES算法的主要缺点之一。它的优点：加密速度快；它的缺点：如果密钥丢失，就容易解密密文，安全性相对比较差。

虽然非对称加密更加安全，但是对称加密算法比非对称加密算法快大约1500倍。所有拥有更大的性能优势。**在实际过程中，一般是将对称加密和非对称加密相结合进行使用。** 比如将前面提到的RSA和AES结合使用，先用AES密钥对数据进行加密，然后用RSA的公钥对AES密钥进行加密或者签名。



#### 3）单向加密

单向加密指只能加密数据，而不能解密数据。常用的有MD5，SHA系列算法。

> 小结一下，上面三种加密理论分别都有多种不同的算法实现，他们主要的用途在于：
>
> 非对称加密：身份验证
>
> 对称加密：数据的机密性
>
> 单向加密：数据的完整性


 ### 2、常用加解密算法实现

加密解密的操作最终都是为了提升数据安全性，安全性的差别在于使用什么加密解密方式，制定什么样的加密策略。

1）常用对称加密算法有：

- AES
- DES
- 3DES
- PBE

2）常用非对称加密算法有：

- RSA
- DSA
- ECC

3）常用单向加密（不可逆加密、生成消息摘要）算法有：

- MD5
- SHA
- HMAC



## 二、数字证书

 对于非对称加密算法和数字签名来说，很重要的步骤就是公钥的分发。理论上任何人都可以获取到公开的公钥，然而这个公钥文件有可能是伪造的，传输过程中也有可能被篡改，所以一旦公钥自身出了问题，则整个建立在其上的的安全性将不复成立。

**数字证书机制** 用于解决公钥分发安全性问题，确保所记录信息的合法性。比如证明某个公钥是某个实体（个人或组织）拥有，并且确保任何篡改都能被检测出来，从而实现对用户公钥的安全分发。

服务器拥有公开密钥，它把公钥交给认证机构，机构给他的公钥上打上数字签名并发一个证书，表示这个公钥是正规的。当服务器把公钥给客户端之后，客户端还要通过签名验证公钥的真实性。

根据所保护公钥的用途，数字证书可以分为 **加密数字证书（Encryption Certificate）** 和 **签名验证数字证书（Signature Certificate）**。

- **加密数字证书** 用来保护加密用途的公钥
- **签名验证数字证书** 用来保护签名用途的公钥

上面这两种类型的公钥可以同时放在同一证书中存储。

一般情况下，证书需要由 **证书认证机构（Certification Authority，CA）** 来进行签发和背书。

- 权威的商业证书认证机构包括 DigiCert、GlobalSign、VeriSign 等
- 用户也可以自行搭建本地 CA 系统，在私有网络中进行自有证书的签发和背书

一个数字证书内容可能包括证书域（证书的版本、序列号、签名算法类型、签发者信息、有效期、被签发主体、签发的公开密钥）、CA 对证书的签名算法和签名值等，他们一般采用 `X.509` 规范编写。那么`X.509`规范又是什么呢？

**X.509 证书规范**

X.509 是密码学里公钥证书的格式标准。

证书格式有如下几种分类：

- 证书文件的文件名后缀一般为 `.crt` 或 `.cer`
- 对应私钥文件的文件名后缀一般为 `.key`
- 证书请求文件的文件名后缀为 `.csr`
- 有时候也统一用 `.pem` 作为文件名后缀

`X.509` 规范中一般推荐使用 PEM（Privacy Enhanced Mail）格式来存储证书相关的文件。

**PEM 格式** 采用文本方式进行存储，一般包括首尾标记和内容块，内容块采用 Base64 格式编码，示例如下：

```
-----BEGIN CERTIFICATE-----
BASE64 CONTENT
-----END CERTIFICATE-----
```

按照 `X.509` 规范，公钥可以通过证书机制来进行保护，但证书的生成、分发、撤销等步骤并未涉及，接下来要讲的PKI体系中定义了这些步骤需要遵循标准。

## 三、PKI 体系

**PKI（Public Key Infrastructure）体系** 解决了证书生命周期相关的认证和管理问题，定义了安全地管理、分发证书需要遵循的标准。

PKI 是建立在公私钥基础上实现安全可靠传递消息和身份确认的一个通用框架，并不代表某个特定的密码学技术和流程，实现了 PKI 规范的平台可以安全可靠地管理网络中用户的密钥和证书。

一个完备 PKI 体系应该包括如下组件：

- **数字证书**：包含了用于签名和加密数据的公钥的电子凭证，是 PKI 的核心元素
- **认证中心（CA）**：数字证书的申请及签发机关，CA 必须具备权威性
- **证书资料库**：存储已签发的数字证书和公钥，以及相关证书目录，用户可由此获得所需的其他用户的证书及公钥
- **证书吊销列表（CRL）/OCSP**：在有效期内吊销的证书列表，OCSP（在线证书状态协议）是获得证书状态的国际协议
- **密钥备份及恢复**：为避免因用户丢失解密密钥而无法解密合法数据的情况，PKI 应提供备份与恢复密钥的机制
- **PKI 应用接口（API）**：为应用提供安全、一致、 可信的方式与 PKI 交互

## 四、常见技术方案

### 1、AES对称加解密

应用开发中一般使用AES 密钥对接口请求和响应内容进行加密，密文无法被第三方识别，从而防止接口传输数据泄露。

### 2、RSA非对称加解密

RSA 密钥的场景一般是对接口请求和响应内容进行签名，以确认接口传输的内容没有被篡改。不论接口内容是明文还是密文，RSA 均可正常签名。

### 3、AES+RSA混合加解密

小郭熟悉的一种常见的混合方式是：

> 1）第一步：客户端使用随机生成的AES密钥对业务数据进行加密
>
> 2）第二步：客户端将AES密钥使用RSA公钥进行加密
>
> 3）第三步：客户端将加密后的AES密钥和业务数据一并提交给服务端
>
> 4）服务端使用RSA私钥解密AES密钥，然后使用解密的AES密钥对业务数据进行解密
>
> 5）业务处理完成后，服务端动态生成一个新的AES密钥
>
> 6）服务端使用新的AES密钥对业务处理结果数据进行加密，同时使用RSA私钥对该AES密钥进行签名。
>
> 7）客户端收到返回数据后， 先用RSA公钥对AES密钥签名进行验证，验证通过后使用AES密钥对业务数据进行解密。



目前支付宝开放平台采用的也是AES+RSA混合方式，和我在上面举的例子有一点不同的是：开发者对请求参数先做 AES对称加密，然后对加密后的密文进行 RSA 签名（防止数据在传输过程被篡改）。  



## 五、代码示例

> 声明，部分代码借鉴于网络，加解密的代码基本都是相似的。

### 1、接口出入参的加解密

小郭在这里以常用的springboot应用程序接口来示例如何做数据加解密，这里分别演示AES加密、AES+RSA混合加密方式（加强版）。

#### 1）方式一：AES加密

> 整体思路：
>
> 请求：  
>        1.客户端提交base64编码的aeskey
>        2.服务端从请求头获取aeskey进行base64解码，
>        3.服务端使用base64解码后的aeskey对入参进行解密，并进行后续业务处理
>
> 响应：
>        1.服务端随机生成新的aeskey，
>        2.服务端使用aeskey进行业务结果加密，对业务加密结果再进行base64编码。
>        3.服务端将aeskey进行base64加密，
>        4.服务端返回加密的aeskey和业务结果数据。
>        5.客户端使用base64对aeskey和业务结果数据进行解码
>        6.客户端使用aeskey对业务结果数据进行解密

a. 定义两个代表开启加密解密功能的注解：

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD,ElementType.TYPE,ElementType.PARAMETER})
public @interface Decrypt {
}
```

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
public @interface Encrypt {
}
```

b. AES加解密算法核心工具类：

```java
package com.gyd.encrypt.v1;

import org.bouncycastle.jce.provider.BouncyCastleProvider;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Random;

public class AESUtils {

    /**
     * 加密算法AES
     */
    private static final String KEY_ALGORITHM = "AES";

    /**
     * key的长度，Wrong key size: must be equal to 128, 192 or 256
     * 传入时需要16、24、36
     */
    private static final Integer KEY_LENGTH = 16 * 8;

    /**
     * 算法名称/加密模式/数据填充方式
     * 默认：AES/ECB/PKCS5Padding
     */
    private static final String AES_ALGORITHM = "AES/ECB/PKCS5Padding";

     /**
      * 后端AES的key，由静态代码块赋值
      */
     public static String key;

    /**
     * 不能在代码中创建
     * JceSecurity.getVerificationResult 会将其put进 private static final Map<Provider,Object>中，导致内存缓便被耗尽
     */
    private static final BouncyCastleProvider PROVIDER = new BouncyCastleProvider();
 
     static {
         key = getKey();
     }

    /**
     * 获取key
     */
    public static String getKey() {
        StringBuilder uid = new StringBuilder();
        //产生16位的强随机数
        Random rd = new SecureRandom();
        for (int i = 0; i < KEY_LENGTH / 8; i++) {
            //产生0-2的3位随机数
            int type = rd.nextInt(3);
            switch (type) {
                case 0:
                    //0-9的随机数
                    uid.append(rd.nextInt(10));
                    break;
                case 1:
                    //ASCII在65-90之间为大写,获取大写随机
                    uid.append((char) (rd.nextInt(25) + 65));
                    break;
                case 2:
                    //ASCII在97-122之间为小写，获取小写随机
                    uid.append((char) (rd.nextInt(25) + 97));
                    break;
                default:
                    break;
            }
        }
        return uid.toString();
    }
    // 获取 cipher
    private static Cipher getCipher(byte[] key, int model) throws Exception {
        SecretKeySpec secretKeySpec = new SecretKeySpec(key, KEY_ALGORITHM);
        Cipher cipher = Cipher.getInstance(AES_ALGORITHM,PROVIDER);
        cipher.init(model, secretKeySpec);
        return cipher;
    }

    // AES加密
    public static String encrypt(byte[] data, byte[] key) throws Exception {
        Cipher cipher = getCipher(key, Cipher.ENCRYPT_MODE);
        return Base64.getMimeEncoder().encodeToString(cipher.doFinal(data));
    }

    // AES解密
    public static byte[] decrypt(byte[] data, byte[] key) throws Exception {
        Cipher cipher = getCipher(key, Cipher.DECRYPT_MODE);
        return cipher.doFinal(Base64.getMimeDecoder().decode(data));
    }
}
```



c. springboot接口出参统一拦截处理（实现出参加密）：

```java
package com.gyd.encrypt.v1;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gyd.encrypt.ResultWrapper;
import com.gyd.encrypt.annotation.Encrypt;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.util.Base64;

/**
 * @ClassName EncryptResponse
 * @Description 请求响应加密(AES)
 * @Author guoyading
 * @Version 1.0
 */
@ControllerAdvice
public class EncryptResponse implements ResponseBodyAdvice<ResultWrapper> {
    private ObjectMapper om = new ObjectMapper();

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return returnType.hasMethodAnnotation(Encrypt.class);
    }

    @Override
    public ResultWrapper beforeBodyWrite(ResultWrapper body, MethodParameter returnType, MediaType selectedContentType, Class<? extends HttpMessageConverter<?>> selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        String aesKey = AESUtils.getKey();

        byte[] keyBytes = aesKey.getBytes();
        try {
            body.setAesKey(Base64.getMimeEncoder().encodeToString(aesKey.getBytes()));
            if (body.getData() != null) {
                body.setData(AESUtils.encrypt(om.writeValueAsBytes(body.getData()), keyBytes));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return body;
    }
}
```



d. springboot接口入参统一拦截处理（入参解密）：

```java
package com.gyd.encrypt.v1;

import com.gyd.encrypt.annotation.Decrypt;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.RequestBodyAdviceAdapter;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Type;
import java.util.Base64;

/**
 * @ClassName DecryptRequest
 * @Description 请求入参解密(AES)
 * @Author guoyading
 * @Version 1.0
 */
@ControllerAdvice
public class DecryptRequest extends RequestBodyAdviceAdapter {

    @Override
    public boolean supports(MethodParameter methodParameter, Type targetType, Class<? extends HttpMessageConverter<?>> converterType) {
        return methodParameter.hasMethodAnnotation(Decrypt.class) || methodParameter.hasParameterAnnotation(Decrypt.class);
    }

    @Override
    public HttpInputMessage beforeBodyRead(final HttpInputMessage inputMessage, MethodParameter parameter, Type targetType, Class<? extends HttpMessageConverter<?>> converterType) throws IOException {
        byte[] body = new byte[inputMessage.getBody().available()];
        //获取约定的AES密钥
        String aesKey = inputMessage.getHeaders().get("aesKey").get(0);
        if (StringUtils.isEmpty(aesKey)) {
            throw new RuntimeException("鉴权失败");
        }

        inputMessage.getBody().read(body);
        try {
            byte[] decrypt = AESUtils.decrypt(body, Base64.getMimeDecoder().decode(aesKey));
            final ByteArrayInputStream bais = new ByteArrayInputStream(decrypt);
            return new HttpInputMessage() {
                @Override
                public InputStream getBody() {
                    return bais;
                }

                @Override
                public HttpHeaders getHeaders() {
                    return inputMessage.getHeaders();
                }
            };
        } catch (Exception e) {
            e.printStackTrace();
        }
        return super.beforeBodyRead(inputMessage, parameter, targetType, converterType);
    }
}
```



e. 接口出参统一包装对象：

```java
package com.gyd.encrypt;


import java.io.Serializable;

public class ResultWrapper<T> implements Serializable {
    private static final long serialVersionUID = 1L;

    private int status;

    private String aesKey;

    private String sign;

    private T data;

    private String message;

    public ResultWrapper() {
        this.status = StatusCode.OK.value();
        this.message = null;
    }

    public ResultWrapper(String message) {
        this.status = StatusCode.FAILURE.value();
        this.message = message;
    }

    public String getAesKey() {
        return aesKey;
    }

    public void setAesKey(String aesKey) {
        this.aesKey = aesKey;
    }

    public static ResultWrapper<?> SUCCESS() {
        return new ResultWrapper();
    }

    public static <R> ResultWrapper<R> SUCCESS(R value) {
        return (new ResultWrapper()).setData(value);
    }

    public static ResultWrapper<?> FAILURE(String message) {
        return new ResultWrapper(message);
    }

    public static ResultWrapper<?> FORBIDDEN() {
        ResultWrapper<?> result = new ResultWrapper();
        result.setStatus(StatusCode.NOAUTHORITY.value());
        result.setMessage("forbidden");
        return result;
    }

    public int getStatus() {
        return this.status;
    }

    public ResultWrapper<T> setStatus(int status) {
        this.status = status;
        return this;
    }


    public T getData() {
        return this.data;
    }

    public ResultWrapper<T> setData(T data) {
        this.data = data;
        return this;
    }

    public String getMessage() {
        return this.message;
    }

    public ResultWrapper<T> setMessage(String message) {
        this.message = message;
        return this;
    }

    public String getSign() {
        return sign;
    }

    public void setSign(String sign) {
        this.sign = sign;
    }
}
```



```java
public enum StatusCode {
    OK(200),
    FAILURE(300),
    ERROR(500),
    UNLOGIN(401),
    BADREQUEST(400),
    NOAUTHORITY(403),
    AUTHREQUIRED(407),
    NOTFOUND(404);

    private final Integer code;

    private StatusCode(Integer code) {
        this.code = code;
    }

    public Integer value() {
        return this.code;
    }

    public static StatusCode value(int code) {
        StatusCode[] var1 = values();
        int var2 = var1.length;

        for(int var3 = 0; var3 < var2; ++var3) {
            StatusCode value = var1[var3];
            if (value.code == code) {
                return value;
            }
        }
        return null;
    }
}
```



f. 测试接口定义：

```java
package com.gyd.controller;

import com.gyd.dto.User;
import com.gyd.encrypt.ResultWrapper;
import com.gyd.encrypt.annotation.Decrypt;
import com.gyd.encrypt.annotation.Encrypt;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * @ClassName AES对称加密示例
 * @Author guoyading
 * @Version 1.0
 */
@RestController
@RequestMapping("/user2")
@Api(tags="用户数据操作相关接口(AES加解密测试)")
public class AESEncryptController {

    @ApiOperation("新增用户接口")
    @PostMapping("/save")
    @Decrypt
    public ResultWrapper<User> save(@ApiParam @RequestBody User data){
        return ResultWrapper.SUCCESS(data);
    }

    @ApiOperation("查询用户接口")
    @PostMapping("/query")
    @Encrypt
    public ResultWrapper<User> query(){
        User user = new User();
        user.setId(1);
        user.setUsername("张三");

        return ResultWrapper.SUCCESS(user);
    }
}
```



g. 接口入参加解密测试：

**请求接口**：`localhost:8082/user2/save`

**请求入参**：

先将接口入参用客户端随机生成的AES密钥进行加密：

> AES密钥明文是：  `xxxx.gydblog.com`
>
> 通过base64编码后是`eHh4eC5neWRibG9nLmNvbQ==`，需要在请求时放入请求头中，字段名是：aesKey

```
//原始入参
{
    "id": 1,
    "username": "张三"
}

//加密后入参
yZ3sYBQ6zdNUNBKIcjQ8bEqbC7voBKlbU0lJmkLhRcY=
```



**请求出参**：

```
{
    "status": 200,
    "aesKey": null,
    "sign": null,
    "data": {
        "id": 1,
        "username": "张三"
    },
    "message": null
}
```



h. 接口出参加密测试：

**请求接口**：`localhost:8082/user2/query`

**请求入参**：无

**请求出参**：

```
{
    "status": 200,
    "aesKey": "MUFER1M2RWpuTDVwYjh4NA==",
    "sign": null,
    "data": "Kxbvbkeslxm9YL/BgnaFkEJADZsObwjs8tjGbgOlIdw=",
    "message": null
}
```

对请求出参中的aesKey和data分别使用base64在线工具进行解码， 然后用解码后的aesKey对解码后的data数据进行解密即可得到最终业务数据。



#### 2）方式二：AES+RSA混合加密

a. 定义两个代表混合加解密的注解

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD,ElementType.TYPE,ElementType.PARAMETER})
public @interface MixedDecrypt {
}
```

```JAVA
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
public @interface MixedEncrypt {
}
```

b.RSA核心算法工具类：

```java
package com.gyd.encrypt.v2;

import java.util.Base64;
import javax.crypto.Cipher;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * @description: RSA加密、解密算法工具类
 * @param:
 * @return:
 */
public class RSAUtils {

    /**
     * 加密算法RSA
     */
    private static final String KEY_ALGORITHM = "RSA";

    /**
     * 算法名称/加密模式/数据填充方式
     * 默认：RSA/ECB/PKCS1Padding
     */
    private static final String ALGORITHMS = "RSA/ECB/PKCS1Padding";

    /**
     * Map获取公钥的key
     */
    private static final String PUBLIC_KEY = "publicKey";

    /**
     * Map获取私钥的key
     */
    private static final String PRIVATE_KEY = "privateKey";

    /**
     * RSA最大加密明文大小
     */
    private static final int MAX_ENCRYPT_BLOCK = 245;

    /**
     * RSA最大解密密文大小
     */
    private static final int MAX_DECRYPT_BLOCK = 256;

    /**
     * 1024 117 128
     * RSA 位数 如果采用2048 上面最大加密和最大解密则须填写:  245 256
     */
    private static final int INITIALIZE_LENGTH = 2048;

    /**
     * 后端RSA的密钥对(公钥和私钥)Map，由静态代码块赋值
     */
    private static Map<String, Object> genKeyPair = new LinkedHashMap<>();

    static {
        try {
            genKeyPair.putAll(genKeyPair());
        } catch (Exception e) {
            // 输出到日志文件中

             System.err.println(e.getMessage());
        }
    }

    /**
     * 生成密钥对(公钥和私钥)
     */
    private static Map<String, Object> genKeyPair() throws Exception {
        System.out.println("-------------------开始生成密钥对");
        KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance(KEY_ALGORITHM);
        keyPairGen.initialize(INITIALIZE_LENGTH);
        KeyPair keyPair = keyPairGen.generateKeyPair();
        RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
        RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();
        Map<String, Object> keyMap = new HashMap<>(2);
        //公钥
        keyMap.put(PUBLIC_KEY, publicKey);
        //私钥
        keyMap.put(PRIVATE_KEY, privateKey);
        return keyMap;
    }

    /**
     * 私钥解密
     * @param encryptedData 已加密数据
     * @param privateKey    私钥(BASE64编码)
     */
    public static byte[] decryptByPrivateKey(byte[] encryptedData, String privateKey) throws Exception {
        //base64格式的key字符串转Key对象
        Key privateK = KeyFactory.getInstance(KEY_ALGORITHM).generatePrivate(new PKCS8EncodedKeySpec(Base64.getMimeDecoder().decode(privateKey)));
        Cipher cipher = Cipher.getInstance(ALGORITHMS);
        cipher.init(Cipher.DECRYPT_MODE, privateK);
        //分段进行解密操作
        return encryptAndDecryptOfSubsection(encryptedData, cipher, MAX_DECRYPT_BLOCK);
    }

    /**
     * 公钥加密
     * @param data      源数据
     * @param publicKey 公钥(BASE64编码)
     */
    public static byte[] encryptByPublicKey(byte[] data, String publicKey) throws Exception {
        //base64格式的key字符串转Key对象
        Key publicK = KeyFactory.getInstance(KEY_ALGORITHM).generatePublic(new X509EncodedKeySpec(Base64.getMimeDecoder().decode(publicKey)));
        Cipher cipher = Cipher.getInstance(ALGORITHMS);
        cipher.init(Cipher.ENCRYPT_MODE, publicK);
        //分段进行加密操作
        return encryptAndDecryptOfSubsection(data, cipher, MAX_ENCRYPT_BLOCK);
    }

    /**
     * 私钥加密
     * @param data       源数据
     * @param privateKey 私钥(BASE64编码)
     */
    public static String encryptByPrivateKey(byte[] data, String privateKey) throws Exception {
        Key privateK = KeyFactory.getInstance(KEY_ALGORITHM).generatePrivate(new PKCS8EncodedKeySpec(Base64.getMimeDecoder().decode(privateKey)));
        Cipher cipher = Cipher.getInstance(ALGORITHMS);
        cipher.init(Cipher.ENCRYPT_MODE, privateK);
        return Base64.getMimeEncoder().encodeToString(encryptAndDecryptOfSubsection(data, cipher, MAX_ENCRYPT_BLOCK));
    }

    /**
     * 公钥解密
     * @param encryptedData 已加密数据
     * @param publicKey     公钥(BASE64编码)
     */
    public static byte[] decryptByPublicKey(byte[] encryptedData, String publicKey) throws Exception {
        Key publicK = KeyFactory.getInstance(KEY_ALGORITHM).generatePublic(new X509EncodedKeySpec(Base64.getMimeDecoder().decode(publicKey)));
        Cipher cipher = Cipher.getInstance(ALGORITHMS);
        cipher.init(Cipher.ENCRYPT_MODE, publicK);
        return encryptAndDecryptOfSubsection(encryptedData, cipher, MAX_ENCRYPT_BLOCK);

    }

    /**
     * 获取私钥
     */
    public static String getPrivateKey() {
        Key key = (Key) genKeyPair.get(PRIVATE_KEY);
        return Base64.getMimeEncoder().encodeToString(key.getEncoded());
    }

    /**
     * 获取公钥
     */
    public static String getPublicKey() {
        Key key = (Key) genKeyPair.get(PUBLIC_KEY);
        return Base64.getMimeEncoder().encodeToString(key.getEncoded());
    }

    /**
     * 分段进行加密、解密操作
     */
    private static byte[] encryptAndDecryptOfSubsection(byte[] data, Cipher cipher, int encryptBlock) throws Exception {
        int inputLen = data.length;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int offSet = 0;
        byte[] cache;
        int i = 0;
        // 对数据分段加密
        while (inputLen - offSet > 0) {
            if (inputLen - offSet > encryptBlock) {
                cache = cipher.doFinal(data, offSet, encryptBlock);
            } else {
                cache = cipher.doFinal(data, offSet, inputLen - offSet);
            }
            out.write(cache, 0, cache.length);
            i++;
            offSet = i * encryptBlock;
        }
        out.close();
        return out.toByteArray();
    }

    /**
     * 用私钥对信息生成数字签名
     * @param data       已加密数据
     * @param privateKey 私钥(BASE64编码)
     */
    public static String sign(byte[] data, String privateKey) throws Exception {
        byte[] keyBytes = Base64.getMimeDecoder().decode(privateKey);
        PrivateKey privateK = KeyFactory.getInstance(KEY_ALGORITHM).generatePrivate(new PKCS8EncodedKeySpec(keyBytes));
        Signature signature = Signature.getInstance("MD5withRSA");
        signature.initSign(privateK);
        signature.update(data);
        return Base64.getMimeEncoder().encodeToString(signature.sign());
    }

    /**
     * 校验数字签名
     * @param data      已加密数据
     * @param publicKey 公钥(BASE64编码)
     * @param sign      数字签名
     */
    public static boolean verify(byte[] data, String publicKey, String sign) throws Exception {
        byte[] keyBytes = Base64.getMimeDecoder().decode(publicKey);
        PublicKey publicK = KeyFactory.getInstance(KEY_ALGORITHM).generatePublic(new X509EncodedKeySpec(keyBytes));
        Signature signature = Signature.getInstance("MD5withRSA");
        signature.initVerify(publicK);
        signature.update(data);
        return signature.verify(Base64.getMimeDecoder().decode(sign));
    }
}
```



c. springboot接口入参统一拦截处理（入参解密）

```java
package com.gyd.encrypt.v2;

import com.gyd.encrypt.annotation.MixedDecrypt;
import com.gyd.encrypt.v1.AESUtils;

import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.RequestBodyAdviceAdapter;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Type;
import java.util.Base64;

/**
 * @ClassName DecryptRequest
 * @Description 请求解密(AES+RSA)
 * @Author guoyading
 * @Date 2023/11/22 15:24
 * @Version 1.0
 */
@ControllerAdvice
public class MixedDecryptRequest extends RequestBodyAdviceAdapter {

    @Override
    public boolean supports(MethodParameter methodParameter, Type targetType, Class<? extends HttpMessageConverter<?>> converterType) {
        return methodParameter.hasMethodAnnotation(MixedDecrypt.class) || methodParameter.hasParameterAnnotation(MixedDecrypt.class);
    }

    @Override
    public HttpInputMessage beforeBodyRead(final HttpInputMessage inputMessage, MethodParameter parameter, Type targetType, Class<? extends HttpMessageConverter<?>> converterType) throws IOException {
        byte[] body = new byte[inputMessage.getBody().available()];
        //获取客户端的AES密钥
        String aesKeyStr = inputMessage.getHeaders().get("aesKey").get(0);
        if (StringUtils.isEmpty(aesKeyStr)) {
            throw new RuntimeException("鉴权失败");
        }
        inputMessage.getBody().read(body);
        try {
            //使用RSA私钥对aesKey进行解密
            byte[] aesKey = RSAUtils.decryptByPrivateKey(Base64.getMimeDecoder().decode(aesKeyStr),RSAUtils.getPrivateKey());
            //使用解密后的aeskey对请求数据进行解密
            byte[] decrypt = AESUtils.decrypt(body,aesKey);
            final ByteArrayInputStream bais = new ByteArrayInputStream(decrypt);
            return new HttpInputMessage() {
                @Override
                public InputStream getBody() {
                    return bais;
                }

                @Override
                public HttpHeaders getHeaders() {
                    return inputMessage.getHeaders();
                }
            };
        } catch (Exception e) {
            e.printStackTrace();
        }
        return super.beforeBodyRead(inputMessage, parameter, targetType, converterType);
    }
}
```



d.springboot接口入参统一拦截处理（出参加密）：

```java
package com.gyd.encrypt.v2;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gyd.encrypt.ResultWrapper;
import com.gyd.encrypt.annotation.MixedEncrypt;
import com.gyd.encrypt.v1.AESUtils;

import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.util.Base64;

/**
 * @ClassName EncryptResponse
 * @Description 响应加密(AES+RSA)
 * @Author guoyading
 * @Version 1.0
 */
@ControllerAdvice
public class MixedEncryptResponse implements ResponseBodyAdvice<ResultWrapper> {
    private ObjectMapper om = new ObjectMapper();
    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return returnType.hasMethodAnnotation(MixedEncrypt.class);
    }

    @Override
    public ResultWrapper beforeBodyWrite(ResultWrapper body, MethodParameter returnType, MediaType selectedContentType, Class<? extends HttpMessageConverter<?>> selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        //随机生成aeskey
        String aesKey = AESUtils.getKey();

        byte[] keyBytes = aesKey.getBytes();
        try {
            //对aesKey进行base64编码
            body.setAesKey(Base64.getMimeEncoder().encodeToString(aesKey.getBytes()));
            // 对key 用私钥加签
            body.setSign(RSAUtils.sign(aesKey.getBytes(), RSAUtils.getPrivateKey()));
            if (body.getData() != null) {
                body.setData(AESUtils.encrypt(om.writeValueAsBytes(body.getData()), keyBytes));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return body;
    }
}
```



e.测试接口定义

```java
package com.gyd.controller;

import com.gyd.dto.CheckInfo;
import com.gyd.dto.User;
import com.gyd.encrypt.ResultWrapper;
import com.gyd.encrypt.annotation.MixedDecrypt;
import com.gyd.encrypt.annotation.MixedEncrypt;
import com.gyd.encrypt.v2.RSAUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user3")
@Api(tags="用户数据操作相关接口(AES+RSA混合加解密测试)")
public class AESRSAEncryptController {

    @ApiOperation("新增用户接口")
    @PostMapping("/save")
    @MixedDecrypt
    public ResultWrapper<User> save(@RequestBody User user){
        return ResultWrapper.SUCCESS(user);
    }

    @ApiOperation("查询用户接口")
    @PostMapping("/query")
    @MixedEncrypt
    public ResultWrapper<User> query(){
        User user = new User();
        user.setId(1);
        user.setUsername("张三"+Math.random());

        return ResultWrapper.SUCCESS(user);
    }

    @ApiOperation("查询公钥")
    @PostMapping("/queryPublicKey")
    public ResultWrapper<String> getPublicKey(){
        return ResultWrapper.SUCCESS(RSAUtils.getPublicKey().replaceAll("[\\s*\t\n\r]", ""));
    }

    @ApiOperation("查询私钥")
    @PostMapping("/queryPrivateKey")
    public ResultWrapper<String> queryPrivateKey(){
        return ResultWrapper.SUCCESS(RSAUtils.getPrivateKey().replaceAll("[\\s*\t\n\r]", ""));
    }

    @ApiOperation("验签")
    @PostMapping("/check")
    public ResultWrapper<Boolean> check(@RequestBody CheckInfo checkInfo) throws Exception {
        boolean a = RSAUtils.verify(checkInfo.getData().getBytes(),RSAUtils.getPublicKey(), checkInfo.getSign());
        return ResultWrapper.SUCCESS(a);
    }

    @ApiOperation("公钥解密")
    @PostMapping("/depByPublicKey")
    public ResultWrapper<String> depByPublicKey(@RequestBody CheckInfo checkInfo) throws Exception {
        return ResultWrapper.SUCCESS(Base64.encodeBase64String(RSAUtils.decryptByPublicKey(Base64.decodeBase64(checkInfo.getSign()),RSAUtils.getPublicKey())));
    }
}
```



f. 接口入参加解密测试：

**请求接口**：`localhost:8082/user3/save`

**请求入参**：

先将接口入参用客户端随机生成的AES密钥进行加密：

> RSA公钥是：`MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArDDTNxnkM6gp7hhZm1d/hCcqMgeLvM2P7fuRWEHNsyl6dGL50hFlaMZnY8C4FVCR4XvgEgPguNDaKb8ID2C5+bgdnK0mMhJYX+fQmGbqzIycirQeHGXX5Hkgwvgp36GIn4vYNQSQMPks2WSUIkZIYtePXEd8zxoavM5f+HmmFH+y6/pMN5vikWa+mHbJLfA+wCA5hT37z0OyOQW5rTFCaTlZ5C3CCmTTB/IqkpmXybPR3HDBss77eHk/84EV1AkzfrtksYUIY0uGylpCuT1+GsXsvtaed876GNRT8PBAos1nSlQAcTEXDbZbdYMWrfkWvBlmD5sDzp4XDw5Uet9Q8QIDAQAB`
>
> AES密钥明文是：  `nl4tNpb0x11g58yx`
>
> AES密钥明文通过RSA公钥加密后是:`PGyZr37ZedQ2nFbX++dwX+9TW5+SJKy3uo4AdYZwItXTgFqtXgCW22cNwp4rLluMZ1Psw+pgjQgN7M+SQapFfyoUhH9BFl/KEuLE3QRq/kFFawPudlGPDb8m4Zvf5G6X9X3CG98n1bA5D9wZKfzpgbISUhkFjO547JORTje3nUp6USFI/y35AcxG5t0g40ewzYnX7+WzW8NZtHOeyAnhINHQaSbL9Mze+YHOurEN3FJZbbrR4TxlYFRVEnVXWC6WISBigeVEWDgj1wsIDGuct22IkZkg4IM6sDIGWzfHFfZDX9ALF1EWyTzkT04f7UHv/o1gaNtz1N3multwP1kdrQ==`
>
> 需要将上面的加密结果放入请求头中，字段名是：aesKey

```
//原始业务数据入参
{
        "id": 1,
        "username": "张三0.7966584801346173"
}
//AES加密后入参
88Rvw/q7Pvs6ZHacR9KdjhXUz2Ja8TuYMWZRbVgA5CxXJEQSnsOjYXlPi67aRxJS
```



**请求出参**：

```
{
    "status": 200,
    "aesKey": null,
    "sign": null,
    "data": {
        "id": 1,
        "username": "张三0.7966584801346173"
    },
    "message": null
}
```



h. 接口出参加密测试：

**请求接口**：`localhost:8082/user3/query`

**请求入参**：无

**请求出参**：

```
{
    "status": 200,
    "aesKey": "bmw0dE5wYjB4MTFnNTh5eA==",
    "sign": "Sim2+YRqPCKSjDAhqRRcmMQE2bREj90K9k52qq8NOS8XfCvEOBW/+pMgD4YPRwZPYYM8vmbSW+n3\r\ndv9gNI1PU7Xz1zxVeLvgMT9DO4CDPUTGkHP8z7hEUchJfKBaqBXvaX6zfe89oqtk37YJ6rjU9fZn\r\nGWl427GoJJ9ysEmcGTxtKSa+31O3VHdwtvUDi9dBsXNojrDXeJ76Pbj5bZb2JbzoRcfl38HVfLeQ\r\nQtUgoaxyQ5KtCzCA00FcrJUg0IP19v5QGCYnlapRhOeQ95eARRUXavbs1ddmmMGZbfRFyIg3mN77\r\nInUwKYQhterJREiNNuQXdVYh/DPOr9lThmdb2A==",
    "data": "88Rvw/q7Pvs6ZHacR9KdjhXUz2Ja8TuYMWZRbVgA5CxXJEQSnsOjYXlPi67aRxJS",
    "message": null
}
```

对请求出参中的aesKey在线工具进行解码，然后用解码后的aesKey、RSA公钥一起对签名sign进行合法性验证。 

签名验证通过后使用aesKey对data数据进行解密即可得到最终业务数据。





### 2、文件加解密

小郭的思路1：读取原始文件的字节数据，通过AES加密算法生成新的加密文件，然后可以通过AES密钥解密得到原始文件。

小郭的思路2：读取原始文件的字节数据，通过AES加密算法生成新的加密文件，通过RSA公钥对加密文件数据进行签名，通过RSA私钥对签名进行验证（防篡改），最后可以通过AES密钥解密得到原始文件。

小郭的思路3：读取原始文件的字节数据，通过RSA公钥生成新的加密文件，然后可以通过RSA私钥解密得到原始文件。



下面以思路1的实现来举例：

> 思路2、思路3的代码实现和前面提到的接口出入参加解密方式类似，网上也有很多类似的例子。有兴趣的小伙伴可以自行实现下。

```java
package com.gyd.encrypt.file;

import org.bouncycastle.jce.provider.BouncyCastleProvider;

import javax.crypto.Cipher;
import javax.crypto.CipherInputStream;
import javax.crypto.CipherOutputStream;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.security.SecureRandom;
import java.util.Random;

/**
 * @ClassName AesFileUtils
 * @Description 文件加解密AES算法实现
 * @Author guoyading
 * @Date 2023/11/27 17:04
 * @Version 1.0
 */
public class AesFileUtils {

    /**
     * key的长度，Wrong key size: must be equal to 128, 192 or 256
     * 传入时需要16、24、36
     */
    private static final Integer KEY_LENGTH = 16 * 8;
    /**
     * 不能在代码中创建
     * JceSecurity.getVerificationResult 会将其put进 private static final Map<Provider,Object>中，导致内存缓便被耗尽
     */
    private static final BouncyCastleProvider PROVIDER = new BouncyCastleProvider();
    /**
     * 加密算法AES
     */
    private static final String KEY_ALGORITHM = "AES";
    /**
     * 算法名称/加密模式/数据填充方式
     * 默认：AES/ECB/PKCS5Padding
     */
    private static final String AES_ALGORITHM = "AES/ECB/PKCS5Padding";
    /**
     * 后端AES的key，由静态代码块赋值
     */
    public static String key;

    static {
        key = getKey();
    }

    /**
     * 获取key
     */
    public static String getKey() {
        StringBuilder uid = new StringBuilder();
        //产生16位的强随机数
        Random rd = new SecureRandom();
        for (int i = 0; i < KEY_LENGTH / 8; i++) {
            //产生0-2的3位随机数
            int type = rd.nextInt(3);
            switch (type) {
                case 0:
                    //0-9的随机数
                    uid.append(rd.nextInt(10));
                    break;
                case 1:
                    //ASCII在65-90之间为大写,获取大写随机
                    uid.append((char) (rd.nextInt(25) + 65));
                    break;
                case 2:
                    //ASCII在97-122之间为小写，获取小写随机
                    uid.append((char) (rd.nextInt(25) + 97));
                    break;
                default:
                    break;
            }
        }
        return uid.toString();
    }


    public static void aesEncryptFileForOutput(String sourceFilePath, String destFilePath) throws Exception {
        aesFileForOutput(sourceFilePath, destFilePath, key, Cipher.ENCRYPT_MODE);
    }
    public static void aesDecryptFileForOutput(String sourceFilePath, String destFilePath) throws Exception {
        aesFileForOutput(sourceFilePath, destFilePath, key, Cipher.DECRYPT_MODE);
    }

    public static void aesEncryptFileForInput(String sourceFilePath, String destFilePath) throws Exception {
        aesFileForInput(sourceFilePath, destFilePath, key, Cipher.ENCRYPT_MODE);
    }
    public static void aesDecryptFileForInput(String sourceFilePath, String destFilePath) throws Exception {
        aesFileForInput(sourceFilePath, destFilePath, key, Cipher.DECRYPT_MODE);
    }

    /** 通过文件输出流加密文件并输出到指定路径  CipherOutputStream 进行加密数据
     * 将源文件加密生成加密的新文件
     * sourceFilePath 原始文件路径
     * destFilePath加密文件路径
     * key 加密密钥
     */
    public static void aesFileForOutput(String sourceFilePath, String destFilePath, String key, int mode) throws Exception {
        File sourceFile = new File(sourceFilePath);
        File destFile = new File(destFilePath);
        if (!(sourceFile.exists() && sourceFile.isFile())) {
            throw new IllegalArgumentException("加密源文件不存在");
        }
        if (!destFile.exists()) {
            destFile.createNewFile();
        }

        InputStream in = new FileInputStream(sourceFile);
        OutputStream out = new FileOutputStream(destFile);
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(), KEY_ALGORITHM);
        Cipher cipher = Cipher.getInstance(AES_ALGORITHM,PROVIDER);
        cipher.init(mode, secretKeySpec);
        // 对输出流包装
        CipherOutputStream cout = new CipherOutputStream(out, cipher);
        byte[] cache = new byte[1024];
        int nRead = 0;
        while ((nRead = in.read(cache)) != -1) {
            cout.write(cache, 0, nRead);
            cout.flush();
        }
        cout.close();
        out.close();
        in.close();
    }

    /** 通过文件输入流加密文件并输出到指定路径   CipherInputStream进行加密数据
     * 将源文件加密生成加密的新文件
     * sourceFilePath 原始文件路径
     * destFilePath加密文件路径
     * key 加密密钥
     */
    public static void aesFileForInput(String sourceFilePath, String destFilePath, String key, int mode) throws Exception {
        File sourceFile = new File(sourceFilePath);
        File destFile = new File(destFilePath);
        if (!(sourceFile.exists() && sourceFile.isFile())) {
            throw new IllegalArgumentException("加密源文件不存在");
        }
        if (!destFile.exists()) {
            destFile.createNewFile();
        }
        InputStream in = new FileInputStream(sourceFile);
        OutputStream out = new FileOutputStream(destFile);
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(), KEY_ALGORITHM);
        Cipher cipher = Cipher.getInstance(AES_ALGORITHM,PROVIDER);
        cipher.init(mode, secretKeySpec);
        // 对输入流包装
        CipherInputStream cin = new CipherInputStream(in, cipher);

        byte[] cache = new byte[1024];
        int nRead = 0;
        while ((nRead = cin.read(cache)) != -1) {
            out.write(cache, 0, nRead);
            out.flush();
        }
        out.close();
        cin.close();
        in.close();
    }

    /**
     * AES加密方法，此处使用AES-128-ECB加密模式，key需要为16位
     * @param sKey
     * @return
     */
    public static void encryptStream(ByteArrayOutputStream source, OutputStream out, String sKey) {
        long start = System.currentTimeMillis();
        try {
            // 判断Key是否正确
            if (sKey == null || sKey.length() != 16) {
                throw new RuntimeException("Key为空或长度不为16位");
            }
            byte[] raw = sKey.getBytes();
            SecretKeySpec skeySpec = new SecretKeySpec(raw, KEY_ALGORITHM);

            Cipher cipher = Cipher.getInstance(AES_ALGORITHM,PROVIDER);
            cipher.init(Cipher.ENCRYPT_MODE, skeySpec);

            CipherOutputStream cout = new CipherOutputStream(out, cipher);
            cout.write(source.toByteArray());
            cout.close();
            source.close();
        } catch (Exception e) {
            System.out.println("AES加密失败："+e);
        }
    }

    /**
     * AES解密方法，此处使用AES-128-ECB加密模式，key需要为16位
     * @param sKey
     * @return
     */
    public static void decryptStream(InputStream in, OutputStream out, String sKey) {

        long start = System.currentTimeMillis();
        try {
            // 判断Key是否正确
            if (sKey == null || sKey.length() != 16) {
                throw new RuntimeException("Key为空或长度不为16位");
            }
            byte[] raw = sKey.getBytes("utf-8");
            SecretKeySpec skeySpec = new SecretKeySpec(raw, KEY_ALGORITHM);
            Cipher cipher = Cipher.getInstance(AES_ALGORITHM,PROVIDER);
            cipher.init(Cipher.DECRYPT_MODE, skeySpec);
            // 先用base64解密
            long time =  (System.currentTimeMillis() - start);
            System.out.println("AES解密耗时："+time+" ms");

            CipherOutputStream cout = new CipherOutputStream(out, cipher);
            byte[] cache = new byte[1024];
            int nRead = 0;
            while ((nRead = in.read(cache)) != -1) {
                cout.write(cache, 0, nRead);
                cout.flush();
            }
            cout.close();
            in.close();
        } catch (Exception e) {
            System.out.println("AES解密失败："+e);
        }
    }
}
```

```
package com.gyd.encrypt.demo;

import com.gyd.encrypt.file.AesFileUtils;

/**
 * @ClassName FileDemO
 * @Description 文件加解密demo(AES实现)
 * @Author guoyading
 * @Date 2023/11/27 17:04
 * @Version 1.0
 */
public class FileDemo {
    public static void main(String[] args) throws Exception {

        //通过文件输出流加密方式，实现文件加密和解密
        AesFileUtils.aesEncryptFileForOutput("D:\\workspace\\source.xlsx","D:\\workspace\\111.xxxx");
        AesFileUtils.aesDecryptFileForOutput("D:\\workspace\\111.xxxx","D:\\workspace\\dest1.xlsx");

        //通过文件输入流加密方式，实现文件加密和解密
        AesFileUtils. aesEncryptFileForInput("D:\\workspace\\source.xlsx","D:\\workspace\\222.xxxx");
        AesFileUtils.aesDecryptFileForInput("D:\\workspace\\222.xxxx","D:\\workspace\\dest2.xlsx");
    }

}
```

网友的思路：[java实现文件加解密方案 - 福尔摩狼 - 博客园 (cnblogs.com)](https://www.cnblogs.com/unruly/p/15992273.html)

### 3、跨语言调用加解密

跨语言接口调用和语言内部接口调用的加解密流程其实是很相似的，唯不同语言的开发者之间只需要约定好加密算法和对应加解密的密钥交换方式即可。唯一不同的是不同语言对同一种加密算法的组件库（library库）不同。

## 附录、参考资料&在线工具

[AES在线加密解密工具 - MKLab在线工具](https://www.mklab.cn/utils/aes)

[AES加密、AES解密 - 在线工具 - OKTools](https://oktools.net/aes)

[python，java跨语言RSA+AES混合加密解密以及踩过的那些坑 - 简书 (jianshu.com)](https://www.jianshu.com/p/43fe5da02f1a)

[springboot＋vue接口加密：RSA+AES - 掘金 (juejin.cn)](https://juejin.cn/post/7181726644799963173)

[RSA+AES混合加密-JavaWeb-CSDN博客](https://blog.csdn.net/qq_34975710/article/details/116450371)
