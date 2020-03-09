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

  it('Has Armor', () => {
    const soldier = new Squaddie(5, 3, 1)
    expect(soldier.getBaseArmor()).to.equal(1)
    expect(soldier.getCurrentArmor()).to.equal(1)
  })
})

describe('Squaddie is attacked', () => {
  it('Knows the squaddie is alive if it has positive health', () => {
    const target = new Squaddie(5)
    expect(target.isAlive()).to.equal(true)
  })

  it('Knows how to deal damage to Squaddie', () => {
    const target = new Squaddie(5)
    target.takeDamage(2)
    expect(target.getCurrentHealth()).to.equal(3)
  })
})