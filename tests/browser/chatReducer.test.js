const { expect } = require('chai')
const { START_CHAT, STOP_CHAT } = require('../../browser/chat/constants')
const { isChatting } = require('../../browser/chat/reducer')
const { createStore } = require('redux')
