---
# icon: lock
date: 2025-03-25
category:
  - AI
---

# deepseek

在这里记录一下deepseek多轮对话模型的初级接入代码片段，支持一问一答，采用流式输出模式。效果如下：

<img src="http://cdn.gydblog.com/mv/deepseek-vido.gif"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
 

使用VUE编写的代码片段记录如下：  

```
<template>
    <div class="chat-container">
      <div class="input-area">
        <input
          v-model="inputContent"
          type="text"
          placeholder="输入您的问题..."
        />
        <button @click="callDeepSeekApi">发送</button>
      </div>
      <div class="chat-output" v-html="formattedContent"></div>
    </div>
</template>
<script>
  import MarkdownIt from "markdown-it"; // 引入 MarkdownIt 库
  export default {
    data() {
      return {
        inputContent: "", // 存储用户输入的问题
        outputContent: "", // 存储提取的 content 字段值
        md: new MarkdownIt(),//初始化markdown-it
      };
    },
    computed: {
      // 将 Markdown 转换为 HTML
      formattedContent() {
        return this.md.render(this.outputContent);//使用markdown-it解析
      },
    },
    methods: {
      async callDeepSeekApi() {
        this.outputContent = "";
        const apiUrl = "https://api.deepseek.com/chat/completions";
        const apiKey = process.env.VUE_APP_DEEPSEEK_API_KEY
  
        const requestBody = {
          model: "deepseek-chat",
          messages: [
            { role: "system", content: this.inputContent },
            { role: "user", content: "Hello!" },
          ],
          stream: true, // 启用流式输出
        };
  
        try {
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestBody),
          });
  
          if (!response.ok) {
            throw new Error(`请求失败: ${response.status} ${response.statusText}`);
          }
  
          // 读取流式响应
          const reader = response.body.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
  
            // 将流式数据块转换为字符串
            const chunk = new TextDecoder().decode(value);
            // 处理每行数据
            chunk
              .split("\n") // 按换行符分割
              .filter((line) => line.trim() !== "") // 过滤空行
              .forEach((line) => {
                // 提取 data: 后的 JSON 数据
                if (line.startsWith("data:")) {
                  const jsonStr = line.slice(5).trim(); // 去掉 "data:" 前缀
                  try {
                    // 检查是否为结束标志 [DONE]
                    if (jsonStr === "[DONE]") {
                      this.isStreaming = false; // 停止流式输出
                      return;
                    }
                    const jsonData = JSON.parse(jsonStr); // 解析 JSON
                    // 提取 content 字段
                    if (jsonData.choices && jsonData.choices[0].delta.content){
                      this.outputContent += jsonData.choices[0].delta.content; // 更新输出内容
                    }
                  } catch (error) {
                    console.error("JSON 解析失败:", error);
                  }
                }
              });
          }
        } catch (error) {
          console.error("请求出错:", error);
        }
      },
  
    },
  };
  </script>
  
  <style>
  /* 样式部分保持不变 */
  .chat-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .input-area {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
  }
  
  .input-area input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .input-area button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .input-area button:hover {
    background-color: #0056b3;
  }
  
  .chat-output {
    border: 1px solid #ccc;
    padding: 15px;
    border-radius: 8px;
    min-height: 400px;
    overflow-y: auto;
    background-color: #f9f9f9;
    margin-bottom: 20px;
  }
  
  .chat-output p {
    margin: 5px 0;
    line-height: 1.6;
  }
  
  .loading-indicator {
    text-align: center;
    color: #666;
    padding: 10px;
  }
</style>
  
```
 


接下来有时间的话会研究如何实现上下文多轮对话。