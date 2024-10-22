# 智能文本对比工具

这是一个基于 Next.js 和 AI 技术的智能文本对比工具。它允许用户比较两段文本，高亮显示相似部分，并提供智能匹配功能。

## 功能特点

1. **双栏文本编辑**：左右两个文本框，可同时编辑和查看两段文本。

2. **智能高亮**：
   - 在一侧选中文本后，自动在另一侧查找并高亮相似内容。
   - 使用 AI 技术进行语义匹配，而不仅仅是字面匹配。

3. **多色高亮**：提供多种颜色选择，可以使用不同颜色标记不同的文本部分。

4. **高亮清除**：可以清除特定的高亮或所有高亮。

5. **自动滚动**：当在一侧高亮文本后，另一侧会自动滚动到匹配的高亮位置。

6. **控制台日志**：显示所有的选中和高亮操作记录。

7. **加载指示器**：使用可爱的猫咪图标显示 AI 处理状态。

8. **响应式设计**：适配不同屏幕尺寸。

## 使用方法

1. **文本输入**：
   - 在左右两个文本框中分别输入或粘贴要比较的文本。

2. **高亮操作**：
   - 选择一个高亮颜色（默认提供多种颜色选择）。
   - 在任一文本框中选中一段文字。
   - 系统会自动在另一侧查找并高亮相似的文本。

3. **清除高亮**：
   - 点击颜色选择器中的橡皮擦图标，进入清除模式。
   - 在高亮的文本上重新选中，即可清除该高亮。

4. **全局操作**：
   - 使用"清空所有高亮"按钮清除所有高亮标记。
   - 使用"清空文本"按钮清除两侧的所有文本和高亮。

5. **查看操作记录**：
   - 在页面底部的控制台区域查看所有的选中和高亮操作记录。

6. **AI 处理状态**：
   - 观察页面顶部中央的猫咪图标，旋转表示 AI 正在处理请求。

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS
- OpenAI API (用于智能文本匹配)

## 安装和运行

1. 克隆仓库：
   ```
   git clone [仓库URL]
   ```

2. 安装依赖：
   ```
   npm install
   ```

3. 设置环境变量：
   创建 `.env.local` 文件并添加必要的 API 密钥：
   ```
   DEEPSEEK_API_KEY=your_api_key_here
   ```

4. 运行开发服务器：
   ```
   npm run dev
   ```

5. 在浏览器中打开 `http://localhost:3000` 查看应用。

## 注意事项

- 确保您有足够的 API 调用额度，因为每次智能匹配都会调用 AI API。
- 大型文本的处理可能需要一些时间，请耐心等待。

## 贡献

欢迎提交 issues 和 pull requests 来帮助改进这个项目。

## 许可证

[在此添加您的许可证信息]
