
//todo 的基础数据结构，用 mobx 管理
//数据驱动视图
//📖📖📖一般来说，计算属性就先 get XXX(){} ，再 return 出数据

import {  makeAutoObservable } from 'mobx'

//List 业务数据
class TaskStore {
  list = [
    {
      id:1,
      name: '学习react',
      isDone: false
    },
    {
      id:2,
      name: '搞定mobx',
      isDone: true
    },
    {
      id:3,
      name: '学习 ts',
      isDone: true
    }
  ]


  constructor() {
    makeAutoObservable(this)
  }

  

  //🔥🔥🔥定义 checkbox 单选操作的方法，点击后就更改上面的数据
  changeCheckbox (clickId,isCheck){

    //定义一个对象来匹配 list 中的 id， 查找 id (🔥🔥1在数组里边找到一个对象并进行修改就用 find，不会新增数组)
    const listObj = this.list.find( item => item.id === clickId )//🔥🔥🔥🔥🔥如果这个 id 跟点击 list 的对象的 id 匹配，那么就去修改它的数据！！
      
    //讨巧了！！🔥🔥因为原生系统定义的 checked = true 是未打勾状态🔥🔥，而我们的 isDone:false 是未打勾，所以直接相等就可以了，不用特地取返！！
    listObj.isDone = isCheck

  }



  //🔥🔥🔥定义顶部【全选 icon 】选中后 所有列表都选中的方法
  allCheck (checked) { //都是选中状态则为 true ,所哟就会走下一步s
    //把所有列表数组的 isDone 属性都改成相同的值（🔥🔥修改数组的每一项，就用 forEach 方法）
    this.list.forEach(item => {item.isDone = checked})
  }


  //🔥🔥🔥计算属性，用来判断顶部【全选 icon】是【选中态】还是【未选中态】，如果所有子项都是选中状态那么会返回 true，就变成【选中态】了 (基于现有数据，经过一定的筛选计算，得到一定的值)
  get isAll() {  //构造函数内通过 setXXX() 与 getXXX() 方法来：修改值，获取值。
    return this.list.every(item => item.isDone) //🔥🔥判断数组内所有元素是否都符合某一条件，就用 every
  }



  //🚮🚮定义删除操作 (这种写法是放到原型上，而不是放到实例上，因为实例上的方法是不能被继承的)
  deleteTask = (deleleId) => {
    
    //拿到要删除对象的 id, 单独把它过滤掉！！
    //🔥🔥🔥filter 得到一个新数组，所以要【重新赋值】 = 这个新数组！！
    this.list = this.list.filter(item => item.id !== deleleId) //过滤出不等于要被删除的这一条（相当于单独隐藏着一条！）
  }



  //💥💥定义回车新增的方法
  addTask = (task) => {
    this.list.push(task) //把新增的 task 给 push 到 list 数组里边
  }



  //🔥🔥🔥计算属性，用来计算完成的任务数 (基于现有数据，经过一定的筛选计算，得到一定的值)
  get isFinishLength () {
    return this.list.filter(item => item.isDone ).length //🔥⚡️⚡️🔥return 并过滤出所有 isDone 为 true 的数据，并且计算 isDone 数据的数量
  }


}


export default TaskStore
