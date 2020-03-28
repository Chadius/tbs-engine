import {expect} from 'chai'
import {Squaddie} from "../src/squaddie";

describe('Squaddie has a turn', () => {
  it('can tell Squaddie can still move.', () => {
    const soldierWithMovement = new Squaddie(5, {}, {movement:1})
    expect(soldierWithMovement.canMoveThisTurn()).to.be.true;
  })

  it('cannot move after moving this turn', () => {
    const soldierWithMovement = new Squaddie(5, {}, {movement:1})
    soldierWithMovement.consumeMoveActionForThisTurn();
    expect(soldierWithMovement.canMoveThisTurn()).to.be.false;
  })

  it('can move again at the start of the turn', () => {
    const soldierWithMovement = new Squaddie(5, {}, {movement:1})
    soldierWithMovement.consumeMoveActionForThisTurn();
    soldierWithMovement.renewActionsAtStartOfTurn();
    expect(soldierWithMovement.canMoveThisTurn()).to.be.true;
  })
})