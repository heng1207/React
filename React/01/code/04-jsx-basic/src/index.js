import React from 'react'
import ReactDOM from 'react-dom'

// 引入css
import './css/index.css'

/* 
  JSX的样式处理
*/

const list = (
  <h1 className="title" style={{ color: 'red', backgroundColor: 'skyblue' }}>
    JSX的样式处理
  </h1>
)

// 渲染react元素
ReactDOM.render(list, document.getElementById('root'))