import React, { Component } from 'react'

class TodoItem extends Component {

  // component constructor
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentWillMount() {
    // Stuff
  }

  // render component
  render() {
    return (
      // @dev important to bind context to function call
      <div>
          { this.props.editable ? (

            <span>
              <form onSubmit={ this.saveItemHandler.bind(this) }>
                <input type="text" ref="updatedItem" defaultValue={this.props.item}></input>
                <button>Save</button>
              </form>
            </span>

            ) : (

              <span onClick={this.editItemHandler.bind(this)} style={this.props.done ? { color : 'green' } : { color : 'red' }}>
                { this.props.item }
              </span>

            )
          }
        <span onClick={ this.removeItemHandler.bind(this) } >
          X
        </span>
        <span onClick={ this.changeStatusHandler.bind(this)}>
          {this.props.done ? "Not done" : "Done"}
        </span>
      </div>
    )
  }

  removeItemHandler() {
    this.props.eventEmitter.emit("removeTodo", this.props.item)
  }

  changeStatusHandler() {
    this.props.eventEmitter.emit("changeStatus", this.props.item)
  }

  editItemHandler() {
    this.props.eventEmitter.emit("editItem", this.props.item)
  }

  saveItemHandler(event) {
    event.preventDefault()

    const updatedItem = this.refs.updatedItem
    const updatedText = updatedItem.value
    // wrap parameters in object
    this.props.eventEmitter.emit("saveItem", ({ oldText: this.props.item, newText: updatedText }))
  }

}

export default TodoItem
