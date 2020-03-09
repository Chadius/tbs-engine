import {expect} from 'chai'
import {Squaddie} from "../src/squaddie";

describe('Squaddie creation', () => {
  it('Has health', () => {
    const soldier = new Squaddie(5)

    expect(soldier.getMaxHealth()).to.equal(5)

    function getHealth() {
      expect(soldier.getHealth()).to.equal(5)
    }
  })
})