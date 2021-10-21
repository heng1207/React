import React from 'react'
import ReactDOM from 'react-dom'

/* 
  JSX中使用JavaScript表达式的注意点：
*/

// 函数调用表达式
const sayHi = () => 'Hi~'
const dv = <div>我是一个div</div>

const title = (
  <h1>
    Hello JSX
    <p>{1}</p>
    <p>{'a'}</p>
    <p>{1 + 7}</p>
    <p>{3 > 5 ? '大于' : '小于等于'}</p>
    <p>{sayHi()}</p>
    {dv}

    {/* 错误演示 */}
    {/* <p>{ {a: '6'} }</p> */}
    {/* { if (true) {} } */}
    {/* { for (var i = 0; i < 10; i++) {} } */}
  </h1>
)

// 渲染react元素
ReactDOM.render(title, document.getElementById('root'))