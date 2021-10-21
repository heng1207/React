import React from 'react'
import ReactDOM from 'react-dom'

// 使用JSX创建react元素
const title = <h1>Hello JSX <span>这是span</span></h1>

// 渲染react元素
ReactDOM.render(title, document.getElementById('root'))