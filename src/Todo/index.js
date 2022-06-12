import './index.css'
import { useStore } from '../store/index'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import uuid from 'react-uuid'



// 思路：
// eslint-disable-next-line no-lone-blocks
{/*  1.从 useStore() 中解构赋值出列表实例
     2.从解构出来的实例中取数据，来渲染 todo 列表
        2-1.在 store 内定义判断条件跟计算方法（数据层）
        2-2.在 html 内定义点击事件跟点击事件的方法然后给 store 去传参（视图层）
     3.实现选中 checkbox 功能(单选/全选)
        3-1.在 store 内定义判断条件跟计算方法（数据层）
        3-2.在 html 内定义点击事件跟点击事件的方法然后给 store 去传参（视图层）
     4.实现删除功能
        4-1.在 store 内定义判断条件跟计算方法（数据层）
        4-2.在 html 内定义点击事件跟点击事件的方法然后给 store 去传参（视图层）
     5.实现回车新增功能
     6.统计数量功能
*/}



function Task() {

  //🔥🔥从 useStore 跟实例中【解构赋值】取出 taskStore 这个子实例！
  const { taskStore } = useStore()
  

  //👇👇👇视图层方法(传参数给 store，在 store 那里去处理数据)
  //🔥🔥定义checkbox 的方法，注意，不是在这里直接改数据，而是传给 mobx =>  思路：mobx Store 去维护状态，input checkbox 只需要把 e.target.value 赋值给 store 内的方法即可！
  //🔥🔥注意，因为要传两个参数，传不了所以下面的 input 那里换成 ()=>XX() 箭头函数的写法，先传一个参数，这里再传多一个！！！
  function onChange (id,e) {
    taskStore.changeCheckbox(id, e.target.checked)//🔥🔥🔥🔥🔥把点击到的 list 的 id 跟 checked 状态都传进去！！
    //讨巧了！！🔥🔥因为原生系统定义的 checked = true 是未打勾状态🔥🔥，而我们的 isDone:false 是未打勾，所以直接相等就可以了，不用特地取返！！
    console.log(e.target.checked)
  }


  //🔥🔥定义全选方法！（视图层）
  function allChangeFn (e) {
    taskStore.allCheck(e.target.checked)
  }



  //🔥🔥定义删除方法（视图层）
  function delTask(id) {
    taskStore.deleteTask(id) //把 item 内的 id 传进去, 给 store 内处理
  }



  //🔥🔥定义【存储输入框内容的数组】（利用 hook 方法） + 【新增】的方法 （视图层）
  const [inputValue,setInputValue] = useState() //⚡️React 受控组件的常规写法（定义、绑数据、更新数据）

  function addTask (e) {
      if(e.keyCode === 13){ //🔥🔥加个事件对象 e 来判断是否有内容！！keyCode = 13 是回车的意思
            taskStore.addTask( //⚡️⚡️⚡️传入同样数据格式的参数给到 store!!!
              {
                id:uuid(),//自动生成总数
                name: inputValue,
                isDone: false
              }
            )
            //回车后清除输入框的操作，传入空字符串
            setInputValue('')
      }
  }


  //——————————————————————————————————————————————————



  return (
    <section className="todoapp">
        <header className="header">
          <h1>Todos</h1>

          {/* 🌟新增 todo 的输入框, 因为输入的状态是临时的，所以要通过受控组件拿到这个输入的数据 */}
          <input 
            className="new-todo" 
            autoFocus autoComplete="off" 
            placeholder="What needs to be done?"
            value={ inputValue } //⚡️受控组件绑数据
            onChange={  (e)=>setInputValue(e.target.value)  }//把最新的数据放回到 inputValue 内进行保存  //⚡️受控组件更新数据
            onKeyUp={ addTask }
            />

        </header>


        <section className="main">

          {/* 🌟全选框 */}
          <input id="toggle-all" className="toggle-all" type="checkbox" checked={taskStore.isAll}  onChange={allChangeFn}/>
          
          <label htmlFor="toggle-all"></label>


          <ul className="todo-list">
            {/*  2.从解构出来的实例中取数据，来渲染 todo 列表，completed 为选中态 */}
            {taskStore.list.map(item=>(
                  <li className={item.isDone ? 'todo completed' : 'todo'}  key={item.id} >
                      <div className="view">

                        {/* 👇受控表单,在 onChange 事件内把数据的更改交回给 taskStore, 🔥🔥🔥🔥注意，因为只有 e 一个参数不够了，所以👇需要改造成箭头函数！！👇false 没打勾，true 打勾*/}
                        <input className="toggle"  type="checkbox"    onChange={(e)=>onChange(item.id, e)}   checked={item.isDone}  />
                        
                        <label > {item.name} </label>

                        <button className="destroy"  onClick={()=>delTask(item.id)}> </button>
                      </div>
                  </li>
            ))}


            {/* 🔥🔥🔥思路：先写出 html 模板解构！  然后放进 map(XXX) 方法内👆，然后再加🔥【 key、id、name 内容、isDone 】🔥等数据！             
                    <li  className="todo completed"> //👈渲染后换成三元运算符来判断是不是选中态！
                      <div className="view">
                        <input className="toggle" type="checkbox" defaultChecked={true}/>
                        <label >learn react</label>
                        <button className="destroy"></button>
                      </div>
                  </li> 
            */}
          </ul>
        </section>

        <footer className='footer'>
            <span className="todo-count"> 任务总数:{taskStore.list.length}  已完成：{taskStore.isFinishLength}</span>
        </footer>

    </section>
  )
}


//🔥🔥很关键，数据变化后要影响视图变化的话，得包裹一下, 才是响应式数据
export default observer(Task)