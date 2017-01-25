import store from './store'
import socket from './socket'

const THREE = require('three')
const CANNON = require('cannon')

export class Player {
  constructor(id, data) {
    this.id = id;
    this.data = data;

    this.init = this.init.bind(this)
  }

  init() {
    let color = '#726591'
  }
}
