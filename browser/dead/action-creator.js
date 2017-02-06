export const KILL_PLAYER = 'KILL_PLAYER';  // Then this single action type could go in said main `constants` file for example

export const killPlayer = () => {
  return {
    type: KILL_PLAYER
  }
}
