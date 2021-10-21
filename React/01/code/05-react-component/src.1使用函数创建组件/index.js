import React from 'react'
import ReactDOM from 'react-dom'

/* 
  函数组件：
*/

// 渲染结构：
// function Hello() {
//   return (
//     <div>这是我的第一个函数组件</div>
//   )
// }

// 不渲染结构：
// function Hello() {
//   return null
// }

// 使用箭头函数创建组件：
const Hello = () => <div>这是我的第一个函数组件</div>

// 渲染组件
ReactDOM.render(<Hello />, document.getElementById('root'))