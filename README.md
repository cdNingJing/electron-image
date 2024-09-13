# Electron 应用项目

这是一个使用 Electron 和 Yarn 创建的基本应用程序。

## 项目结构

project-root/
│
├── src/
│ ├── index.html
│ ├── styles/
│ │ └── main.css
│ ├── scripts/
│ │ └── renderer.js
│ └── assets/
│ └── images/
│ ├── app-icon.png
│ ├── app-icon.icns
│ └── app-icon.ico
│
├── main.js
├── package.json
└── yarn.lock

## 安装

确保您已安装 Node.js 和 Yarn。然后运行:
yarn install

## 开发

启动开发模式(带热重载):
yarn dev

## 运行

正常运行应用:
yarn start

## 打包

创建未打包的应用目录:
yarn pack

创建分发包(安装程序):
yarn dist

## 多平台构建

为特定平台构建:
yarn dist --mac
yarn dist --win
yarn dist --linux

## 注意事项

- 确保在 `src/assets/images/` 目录中有适当格式的应用图标。
- 对主进程文件 (`main.js`) 的修改需要手动重启应用。
- 在生产环境中禁用了热重载功能。

## 依赖

- electron
- electron-builder (开发依赖)
- electron-reloader (开发依赖)
