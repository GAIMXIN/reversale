# AI 交互式文档生成与确认系统

## 系统概述

本系统是一个参考 OpenAI ChatGPT 文档编辑交互流程的 AI 文档生成与确认系统，支持用户通过 prompt 输入生成文档，并提供完整的编辑、确认、发送流程。

## 核心功能

### 1. 用户输入界面
- **输入方式**: 支持文本输入和语音输入（麦克风）
- **智能提示**: "What's the pinpoint in your business operations today?"
- **文件上传**: 支持文件、照片、摄像头等多种输入方式
- **实时处理**: 输入后自动调用 OpenAI API 生成文档

### 2. AI 文档生成
- **OpenAI 集成**: 使用 GPT-4 模型进行智能文档生成
- **多种文档类型**: 
  - `review_summary`: 业务运营审查总结
  - `complaint_response`: 投诉回复文档
  - `business_proposal`: 商业提案
  - `general`: 通用商业分析
- **结构化输出**: 自动生成标题、问题陈述、影响分析、期望结果、价格估算、时间估算

### 3. 文档展示与编辑页面

#### 四列布局设计
```
| 主侧边栏 | 文档历史 | 富文本编辑器 | AI 助手聊天 |
| 260px   | 300px   | 1fr        | 350px     |
```

#### 功能特点
- **富文本编辑器**: 基于 TipTap 的专业文档编辑器
- **实时状态追踪**: 草稿 → 已确认 → 已发送 → 处理中 → 已完成
- **标题编辑**: 支持内联编辑文档标题
- **状态指示器**: 彩色芯片显示当前文档状态

### 4. 操作按钮系统

#### 状态驱动的按钮流程
1. **草稿状态**: 显示 "Confirm" 按钮
2. **已确认状态**: 显示 "Send Out" 按钮
3. **已发送/处理中**: 显示 "Request Sent"（禁用状态）

#### Uber 式工作流程
```
用户发出请求 → 系统匹配服务方 → 服务完成 → 用户付款
```

### 5. 文档历史管理

#### 历史侧边栏功能
- **文档列表**: 显示所有历史文档
- **状态标识**: 每个文档显示当前状态
- **时间戳**: 显示创建和修改时间
- **快速预览**: 显示价格和预估时间
- **文档切换**: 点击可快速切换到其他文档

#### 状态管理
- **实时同步**: 状态变更在所有组件间同步
- **持久化**: 使用 React Context 管理状态
- **状态追踪**: 完整的文档生命周期管理

### 6. AI 助手聊天

#### 智能对话功能
- **上下文感知**: 了解当前文档内容
- **专业建议**: 针对价格、时间、内容提供建议
- **实时协助**: 帮助用户优化文档内容
- **状态通知**: 自动通知操作结果

## 技术架构

### 前端技术栈
- **React + TypeScript**: 主要开发框架
- **Material-UI**: UI 组件库
- **TipTap**: 富文本编辑器
- **React Router**: 路由管理
- **Context API**: 状态管理

### AI 服务集成
- **OpenAI API**: GPT-4 文档生成
- **降级处理**: API 失败时使用本地 mock 数据
- **错误处理**: 完善的错误处理和用户反馈

### 文件结构
```
src/
├── contexts/
│   └── RequestContext.tsx      # 请求状态管理
├── services/
│   └── openaiService.ts        # OpenAI API 服务
├── screens/
│   ├── chat/
│   │   └── ChatScreen.tsx      # 输入界面
│   └── requestReview/
│       ├── RequestReview.tsx   # 主要文档编辑页面
│       ├── DocumentHistory.tsx # 文档历史组件
│       └── RequestReview.css   # 编辑器样式
└── App.tsx                     # 路由配置
```

## 配置说明

### 环境变量配置
创建 `.env` 文件并添加以下配置：
```bash
# OpenAI API 配置
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here

# API 基础 URL
REACT_APP_API_BASE_URL=http://localhost:3001/api

# 开发模式
REACT_APP_DEBUG=true
```

### 安装依赖
```bash
npm install openai @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
```

## 使用流程

### 用户操作流程
1. **输入需求**: 在聊天界面输入业务需求或问题
2. **AI 生成**: 系统自动调用 OpenAI API 生成结构化文档
3. **文档编辑**: 在富文本编辑器中查看和修改文档
4. **确认文档**: 点击 "Confirm" 按钮确认文档内容
5. **发送请求**: 点击 "Send Out" 发送给服务提供商
6. **跟踪状态**: 在文档历史中查看处理状态

### 开发者接口
```typescript
// 创建新文档
const createRequestFromText = async (text: string): Promise<RequestSummary>

// 更新文档状态
const updateRequestStatus = (id: string, status: RequestStatus): void

// 获取文档历史
const { requestHistory } = useRequest()
```

## 状态管理

### 文档状态定义
```typescript
type DocumentStatus = 'draft' | 'confirmed' | 'sent' | 'processing' | 'completed'
```

### 状态转换流程
```
draft → confirmed → sent → processing → completed
  ↑         ↑         ↑         ↑          ↑
创建文档   用户确认   发送请求   匹配服务商   任务完成
```

## 扩展功能

### 已实现的扩展
- **多文档类型支持**: 不同类型的文档模板
- **实时协作**: AI 助手实时交互
- **状态持久化**: 文档状态跨会话保持
- **响应式设计**: 适配不同屏幕尺寸

### 未来计划
- **文档导出**: PDF、Word 格式导出
- **模板系统**: 自定义文档模板
- **协作功能**: 多人编辑支持
- **通知系统**: 实时状态通知
- **支付集成**: 完整的支付流程

## 故障排除

### 常见问题
1. **OpenAI API 错误**: 检查 API 密钥配置
2. **文档加载失败**: 检查网络连接和 API 状态
3. **状态同步问题**: 刷新页面或重新登录

### 调试模式
设置 `REACT_APP_DEBUG=true` 启用详细日志输出。

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 许可证

本项目采用 MIT 许可证。 