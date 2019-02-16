import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {

  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
  };

  // Use state to incorporate polling logic that updates our UI as records are added to our database
  

  // Helper Functions for React Component Methods
  getDataFromDb = () => {
    fetch("http://localhost:3005/api/message")
    .then(response => response.json())
    .then(data => { 
      this.setState({ data: data.messages}) 
    } )
    // .then(data => console.log(JSON.stringify(data)))
  }

  putDataToDb = (message) => {
    let currentIds = this.state.data.map(data => data.id);
    let newId = 0;

    while (currentIds.includes(newId)) {
      newId++;
    }

    axios.post("http://localhost:3005/api/sendmessage", {
      id: newId,
      message: message
    });
  }

  // When the component comes up for the first time, do GET on our endpoint and get all
  // records from the database, and then afterwards, if this is the first time the component mounted
  // then continously run getDataFromDb every 1000ms
  componentDidMount() {
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: null });
    }
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  render() {
    const { data } = this.state;
    return (
      <div className="App">
        <ul>
          {
            data.length <= 0 ? "No Entries in DB" :
              data.map(entry => (
                <li style={{ padding: "10px" }} key={entry.message}>
                  <span style={{ color: "gray" }}>id: </span> {entry.id}
                  <br/>
                  <span style={{ color: "gray" }}>message: </span> {entry.message}
                </li>
              ))
          }
        </ul>

        <div style={{ padding: "10px" }}>
          <input type="text" placeholder="Type a message..." 
                 onChange={e => this.setState({ message: e.target.value })}
                 style={{ width: "200px" }}
          />
          <button onClick={() => this.putDataToDb(this.state.message)}>
            ADD
          </button>

        </div>

      </div>
    );
  }
}

export default App;
