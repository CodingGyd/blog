---
# icon: lock
date: 2019-02-10
category:
  - 葵花宝典
tag:
  - excel操作
---

# 导入导出


## 一、前言
工作中经常会遇到对excel这类文件进行导入导出的业务需求, 这些需求其实从根本上看都是对excel的解析处理,因此我花了两天时间基于POI封装了一套通用的导入导出工具组件，为以后实现这类需求提高效率。当前版本V1.0，源码地址:https://github.com/CodingGyd/excel-utils

## 二、组件简介
V1.0版实现了结合JAVA注解和反射思想进行excel的解析规则配置,两行代码即可完成对2007版和2003版excel文件的导入导出功能。<br/>
希望能将该组件迭代成一款通用的数据导入导出工具组件,追求在不改代码的前提下，进行极少的规则配置即可完成对excel、txt、dbf、pdf等各种格式数据文件的高效读取或生成。

## 三、运行环境&版本信息
JDK版本：1.7及以上<br/>
编译器：Eclipse<br/>
SpringBoot版本：1.3.3.RELEASE<br/>
POI版本：3.15<br/>
组件版本：V1.0<br/>

## 四、使用示例
 定义excel记录行实体结构,并用注解进行配置说明。配置描述请参考源码地址的注释说明<a href="https://github.com/CodingGyd/excel-utils" text="戳这里！" target="_blank"></a>

 ```java
 package com.codinggyd.excel.example;

import java.io.Serializable;
import java.util.Date;

import com.codinggyd.excel.annotation.ExcelFieldConfig;
import com.codinggyd.excel.annotation.ExcelSheetConfig;
import com.codinggyd.excel.annotation.ExcelFieldRule;
import com.codinggyd.excel.constant.ExcelConst;
import com.codinggyd.excel.constant.JavaFieldType;

@ExcelSheetConfig(titleRowStartIndex=1,contentRowStartIndex=2,excelSuffix=ExcelConst.EXCEL_FORMAT_XLSX)
public class TestUser implements Serializable{

    /**
     * 
     */
    private static final long serialVersionUID = -6106965608103174812L;

    @ExcelFieldConfig(isPrimaryKey=true,name="姓名",index=0,javaType=JavaFieldType.TYPE_STRING, replaces = { @ExcelFieldRule(content = "上证", replace = "83"),@ExcelFieldRule(content = "深圳", replace = "90") })
    private String name;

    @ExcelFieldConfig(name="年龄",index=1,javaType=JavaFieldType.TYPE_INTEGER)
    private Integer age;

    @ExcelFieldConfig(name="工资",index=2,javaType=JavaFieldType.TYPE_DOUBLE)
    private Double money;

    @ExcelFieldConfig(name="创建时间",index=3,javaType=JavaFieldType.TYPE_DATE)
    private Date createTime;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Double getMoney() {
        return money;
    }

    public void setMoney(Double money) {
        this.money = money;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    @Override
    public String toString() {
        return "TestUser [name=" + name + ", age=" + age + ", money=" + money + ", createTime=" + createTime + "]";
    }

}
```

读取2007版xlsxExcel示例，编写并运行测试单元。
```java
package com.codinggyd.excel.example;

import java.io.File;
import java.io.FileInputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.codinggyd.excel.constant.ExcelConst;
import com.codinggyd.excel.core.ExcelParserUtils;
import com.codinggyd.excel.core.parsexcel.bean.ResultList;
import com.codinggyd.excel.core.parsexcel.inter.IExcelRowHandler;

import junit.framework.TestCase;

/**
 * 
 * <pre>
 * 类名:  TestExcelParser.java
 * 包名:  com.codinggyd.excel.example
 * 描述:  Excel解析方法测试
 * 
 * 作者:  guoyd
 * 日期:  2017年12月3日
 *
 * Copyright @ 2017 Corpration Name
 * </pre>
 */
public class TestExcelParser extends TestCase  {

//    测试ExcelParserUtils#parse(InputStream is,Class<T> clazz,String format)
    public void testParse1() throws Exception {
        long start = System.currentTimeMillis();

        String file = "G:/test.xlsx";
        String format = ExcelConst.EXCEL_FORMAT_XLSX;
        FileInputStream fis = new FileInputStream(new File(file));
        ResultList<User> result = ExcelParserUtils.parse(fis, User.class, format);
        System.out.println("错误报告:"+result.getMsg());
        for (User user:result) {
            System.out.println(user.toString());
        }
        System.out.println("解析数据量"+result.size()+"条,耗时"+(System.currentTimeMillis()-start)+"ms");

    }
}
```

导出2007版xlsxExcel示例，编写并运行测试单元。
```java
package com.codinggyd.excel.example;

import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.codinggyd.excel.constant.ExcelConst;
import com.codinggyd.excel.core.ExcelExporterUtils;

import junit.framework.TestCase;
/**
 * 
 * <pre>
 * 类名:  TestExcelExporter.java
 * 包名:  com.codinggyd.excel.example
 * 描述:  Excel生成方法测试
 * 
 * 作者:  guoyd
 * 日期:  2017年12月3日
 *
 * Copyright @ 2017 Corpration Name
 * </pre>
 */
public class TestExcelExporter extends TestCase  {

//    测试ExcelExporterUtils#export(String format,Class<?> clazz,List<T> data,OutputStream outputStream) 
    public void testExporter2() throws Exception {
        long start = System.currentTimeMillis();

        String file = "G:/new2.xlsx";
        FileOutputStream fos = new FileOutputStream(new File(file));
        String format = ExcelConst.EXCEL_FORMAT_XLSX;
        List<User> data = new ArrayList<User>();
        for (int i=0;i<100000;i++) {
            User t = new User();
            t.setAge(i);
            t.setName("测试"+i);
            t.setMoney(1d*i);
            t.setCreateTime(new Date());
            data.add(t);
        }
        //一行代码调用生成
        ExcelExporterUtils.export(format, User.class, data,fos); 

        System.out.println("导出数据量"+data.size()+"条,耗时"+(System.currentTimeMillis()-start)+"ms");

    }

}
```

是不是很方便！ 简写到一行代码就搞定，读取时支持返回错误报告, 接口中还定义了其它方法,支持回调自定义解析格式。自行看源码注释吧。


## 五、性能测试
测试环境： 4GB内存、i5-3210M双核处理器、100万行的2007版excel。<br/>
第1次,解析数据量1003472条,耗时30285ms<br/>
第2次,解析数据量1003472条,耗时30750ms<br/>
第3次,解析数据量1003472条,耗时25192ms<br/>
第4次,解析数据量1003472条,耗时21411ms<br/>
第5次,解析数据量1003472条,耗时25531ms<br/>
第6次,解析数据量1003472条,耗时20963ms<br/>
第7次,解析数据量1003472条,耗时20388ms<br/>
第8次,解析数据量1003472条,耗时20026ms<br/>
第9次,解析数据量1003472条,耗时19644ms<br/>
第10次,解析数据量1003472条,耗时21206ms<br/>