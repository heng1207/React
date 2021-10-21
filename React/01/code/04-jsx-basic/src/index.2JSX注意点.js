import React from 'react'
import ReactDOM from 'react-dom'

/* 
  JSX注意点：
*/

const title = (
  <h1 className="title">
    Hello JSX 
    <span />
  </h1>
)

// 渲染react元素
ReactDOM.render(title, document.getElementById('root'))