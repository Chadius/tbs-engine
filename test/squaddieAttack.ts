import {expect} from 'chai'
import {Squaddie} from "../src/squaddie";
import {AttackResolver} from "../src/attackResolver";

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

describe('Squaddie takes damage', () => {
  it('Knows the squaddie is alive if it has positive health', () => {
    const target = new Squaddie(5)
    expect(target.isAlive()).to.equal(true)
  })

  it('Knows how to deal damage to Squaddie', () => {
    const target = new Squaddie(5)
    target.takeDamage(2)
    expect(target.getCurrentHealth()).to.equal(3)
  })

  it('Knows when the squaddie is dead from taking more damage than health', () => {
    const target = new Squaddie(5)
    target.takeDamage(5)
    expect(target.isAlive()).to.equal(false)
  })
})

describe('Attacker can deal damage to Target Squaddie', () => {
  it('Can track attacks', () => {
    const attacker = new Squaddie(5, 5, 0)
    const target = new Squaddie(5, 1, 1)

    const resolver = new AttackResolver(target, attacker)

    const attackResults = resolver.resolveAttack()

    expect(attackResults.getDamage()).to.equal(4)
    expect(target.isAlive()).to.equal(true)
  })

  it('Allows counterattacks', () => {
    const attacker = new Squaddie(5, 5, 0)
    const target = new Squaddie(5, 8, 1)

    const resolver = new AttackResolver(target, attacker)

    const attackResults = resolver.resolveAttack()
    const counterResults = resolver.resolveCounter()

    expect(counterResults.getDamage()).to.equal(8)
    expect(attacker.isAlive()).to.equal(false)
  })
})