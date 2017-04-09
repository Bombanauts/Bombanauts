import React, { Component } from 'react';

import store from '../redux/store';
import { delay } from '../game/utils';

export default class Scores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: {},
      ownInfo: {}
    }
  }

  componentDidMount() {
    delay(100)
    .then(() => {
      const storeState = store.getState();
      this.setState({
        players: storeState.players,
        ownInfo: storeState.ownInfo
      })
    })
  }

  render() {
    const ownInfo = this.state.ownInfo;
    const players = this.state.players;
    const playersIds = Object.keys(players);
    const playersRows = playersIds.map(playerId => players[playerId]);
    playersRows.push(ownInfo);
    playersRows.sort((playerA, playerB) => playerB.score - playerA.score);

    return (
        <div id="scores">
          <ul id="scoreslist">
          <li key="score"><h3>Score:</h3></li>
          <hr />
            {
              playersRows.length && playersRows.map( (playersRow, index) => {
                return <li key={`${index}`}>{`${playersRow.nickname}:   ${playersRow.score}`}</li>
              })
            }
          </ul>
        </div>
    )
  }
}
