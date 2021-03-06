import React from 'react'
import ReactDOM from 'react-dom'

/* 
  state的基本使用
*/

class App extends React.Component {
  state = {
    count: 0,
    test: 'a'
  }

  render() {
    return (
      <div>
        <h1>计数器：{ this.state.count }</h1>
        <button onClick={() => {
          this.setState({
            count: this.state.count + 1
          })

          // 错误！！！
          // this.state.count += 1
        }}>+1</button>
      </div>
    )
  }
}

// 渲染组件
ReactDOM.render(<App />,  document.getElementById('root'))