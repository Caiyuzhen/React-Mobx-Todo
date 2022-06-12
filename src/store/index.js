//🌟核心 Mobx 组件（父级）

// 导入模块
import TaskStore from "./task.Store"
import React from "react"

class RootStore {
  // 组合模块
  constructor() {

    //🔥子 store 的实例，可以被解构
    this.taskStore = new TaskStore()
  }
}

// 实例化根 store 注入 React 的 context 方法
const StoresContext = React.createContext(new RootStore())

// 导出封装好的方法 供组件调用方法使用 store 根实例
export const useStore = () => React.useContext(StoresContext)
