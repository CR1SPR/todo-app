// React resources
import React, { Component }   from 'react'
import ReactDOM               from 'react-dom'
import { EventEmitter }       from 'events'
import registerServiceWorker  from './registerServiceWorker'

// style resources
import './styles/index.css'

// components
import TodoItem from './components/TodoItem.js'


// main class
class TodoApp extends Component {

  constructor(props) {
    super(props)
    this.state = {
      items :
        [
          { text : "hey there 1", done : false, editable : false },
          { text : "hey there 2", done : false, editable : false  },
          { text : "hey there 3", done : false, editable : false  }
        ]
    }
  }

  componentWillMount() {
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.addListener("addTodo", (item) => {
      this.addItem(item)
    })
    this.eventEmitter.addListener("removeTodo", (item) => {
      this.removeItem(item)
    })
    this.eventEmitter.addListener("changeStatus", (item) => {
      this.changeStatus(item)
    })
    this.eventEmitter.addListener("editItem", (item) => {
      this.editItem(item)
    })
    this.eventEmitter.addListener("saveItem", ({ oldText, newText }) => {
      // wrap parameters in object
      this.saveItem({ _oldText: oldText, _newText: newText })
    })
  }

  // render function
  render() {
    return (
      <div>
        { this.showItems() }
        <form onSubmit={ this.addItem.bind(this) }>
          <input type="text" ref="newItemInput"></input>
          <button>Add item</button>
        </form>
      </div>
    )
  }

  // list all
  showItems() {
    var todoList = this.state.items
    todoList = todoList.map((item, index) => {
      return (
        <TodoItem
          eventEmitter={this.eventEmitter}
          item={item.text}
          done={item.done}
          editable={item.editable}
          key={index}
        />
      )
    })
    return todoList
  }

  // add
  addItem(event) {
    // prevent default browser behaviour --> page reload after form submission
    event.preventDefault()

    var newItemInput = this.refs.newItemInput
    var task = newItemInput.value
      this.refs.newItemInput.value = ''

    var currentTodos = this.state.items
    currentTodos.push({ text : task, done : false, editable : false  })
    this.setState({items:currentTodos})
  }

  // remove
  removeItem(item) {
    var currentTodos = this.state.items
    currentTodos = currentTodos.filter((value, index) => {
      return item !== value.text
    })
    this.setState({items:currentTodos})
  }

  // change status
  changeStatus(item) {
    const todos         = this.state.items
    const itemToChange  = todos.filter((value, index) => {
      return value.text === item
    })
    itemToChange[0].done   = !itemToChange[0].done
    this.setState({ items : this.state.items})
  }

  // edit item
  editItem(item) {
    const todos = this.state.items
    const itemToEdit = todos.filter((value, index) => {
      return value.text === item
    })
    itemToEdit[0].editable = !itemToEdit[0].editable
    this.setState({ items : this.state.items })
  }

  // save item
  saveItem({_oldText, _newText}) {
    const todos = this.state.items
    const itemToUpdate = todos.filter((value, index) => {
      return value.text === _oldText
    })
    itemToUpdate[0].text      = _newText
    itemToUpdate[0].editable  = false
    this.setState({ items : this.state.items })
  }
}


// render React components to DOM
ReactDOM.render(
  <TodoApp />,
  document.getElementById('root')
)
