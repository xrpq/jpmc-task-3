import React, {Component} from 'react';
import DataStreamer, {ServerRespond} from './DataStreamer';
import Graph from './Graph';
import './App.css';

interface IState {
    data: ServerRespond[],
    showGraph: boolean,

    // The state of the updating data
    pause: boolean,

    //The state of the steam button
    streamBtnActive: boolean,
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            // data saves the server responds.
            // We use this state to parse data down to the child element (Graph) as element property
            data: [],
            // Initialize the graph as false because we dont want it to be shown until user clicks button.
            showGraph: false,
            // Initialize pause as false because we want stream to start automatically.
            pause: false,
            // Initialized as true because we want stream button showing on website load.
            streamBtnActive: true,
        };
    }

    /**
     *  Render Graph react component with state.data parse as property data
     */
    renderGraph() {
        if (this.state.showGraph) {
            return (<Graph data={this.state.data}/>)
        }
    }

    /**
     * Get new data from server and update the state with the new data
     */
    getDataFromServer() {
        // using interval to continuously update data.
        const interval = setInterval(() => {
            //if pause=true, stops updating data by clearing interval.
            if (this.state.pause) {
                clearInterval(interval);
            }
            DataStreamer.getData((serverResponds: ServerRespond[]) => {
                // Update the state by creating a new array of data that consists of
                // Previous data in the state and the new data from server
                this.setState({
                    data: serverResponds,
                    showGraph: true,
                })
            });

        }, 100);
    }

render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 3
        </header>
        <div className="App-content">
          {this.state.streamBtnActive && <button className="btn btn-primary Stream-button"
            // updates the getDataFromServer() function
            // to keep requesting the data every 100ms until either the app is closed, the server does not return
            // anymore data, or the toggle button is pressed. Hides stream button after it is pressed.
                                                 onClick={() => {
              this.getDataFromServer();
              // on click, sets streamBtnActive to false in order to hide button
              this.setState({
                streamBtnActive: false,
              })
            }}>
            Start Streaming Data

          </button>}


          { // toggle button's visibility is opposite of stream button, so when stream is hidden, toggle is shown.
            !this.state.streamBtnActive && <button className={`btn btn-secondary Toggle-button ${this.state.pause ? "paused" : "active"}`} onClick={() => {
            // toggles the app's pause value: if paused -> resumes, if not paused -> pauses
              this.setState({
                pause: !this.state.pause,
              })
            // calls get data from server in again to continue stream when "unpausing". Will stay static if pause=true.
            this.getDataFromServer();
          } }>
            {this.state.pause ? "Stream Paused" : "Stream Active"}
          </button>}
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
