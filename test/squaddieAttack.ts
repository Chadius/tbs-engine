import {expect} from 'chai'
import {Squaddie} from "../src/squaddie";

describe('Squaddie creation', () => {
  it('Has health', () => {
    const soldier = new Squaddie(5)

    expect(soldier.getBaseMaxHealth()).to.equal(5)
    expect(soldier.getMaxHealth()).to.equal(5)
    expect(soldier.getHealth()).to.equal(5)
    expect(soldier.getCurrentHealth()).to.equal(5)
  })

  it('Has Strength', () => {
    const soldier = new Squaddie(5, 3)
    expect(soldier.getBaseStrength()).to.equal(3)
    expect(soldier.getCurrentStrength()).to.equal(3)
  })
})