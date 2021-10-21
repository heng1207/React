import React from 'react'
import ReactDOM from 'react-dom'

/* 
  条件渲染：
*/
const isLoading = false

// if-else
// const loadData = () => {
//   if (isLoading) {
//     return <div>loading...</div>
//   }

//   return <div>数据加载完成，此处显示加载后的数据</div>
// }

// 三元表达式：
// const loadData = () => {
//   return isLoading ? (<div>loading...</div>) : (<div>数据加载完成，此处显示加载后的数据</div>)
// }

// 逻辑与运算符：
const loadData = () => {
  return isLoading && (<div>loading...</div>)
}

const title = (
  <h1>
    条件渲染：
    {loadData()}
  </h1>
)

// 渲染react元素
ReactDOM.render(title, document.getElementById('root'))