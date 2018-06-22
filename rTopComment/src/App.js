import React, { Component } from 'react';
import './App.css';
import Post from './Components/Post';

class App extends Component {
  constructor() {
    super()
    this.state = {
      posts: [
      ]
    }
  }
  render() {
    return (
      <div className="App">
      
       <Post value='dankmemes' />
       <Post value='wholesomememes' />
       <Post value='memes' />
       <Post value='gaming' />
        <Post value='BlackPeopleTwitter' />
       
     </div>
    );
  }
}

export default App;
