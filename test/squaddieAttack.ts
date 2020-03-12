import {expect} from 'chai'
import {Squaddie} from "../src/squaddie";
import {
  AttackerAimStrategyAlwaysHit,
  AttackerAimStrategyAlwaysMiss,
  AttackerAimStrategyRollToHit,
  AttackResolver
} from "../src/attackResolver";

describe('Squaddie creation', () => {
  it('Has Health and MaxHealth', () => {
    const soldier = new Squaddie(5)

    expect(soldier.getBaseMaxHealth()).to.equal(5)
    expect(soldier.getMaxHealth()).to.equal(5)
    expect(soldier.getHealth()).to.equal(5)
    expect(soldier.getCurrentHealth()).to.equal(5)
  })

  it('Has Strength', () => {
    const soldier = new Squaddie(5, {strength:3})
    expect(soldier.getBaseStrength()).to.equal(3)
    expect(soldier.getCurrentStrength()).to.equal(3)
  })

  it('Has Armor', () => {
    const soldier = new Squaddie(5, {strength:3, armor:1})
    expect(soldier.getBaseArmor()).to.equal(1)
    expect(soldier.getCurrentArmor()).to.equal(1)
  })

  it('Has Aim', () => {
    const soldier = new Squaddie(5, {strength:3, armor:1, aim:2})
    expect(soldier.getBaseAim()).to.equal(2)
    expect(soldier.getCurrentAim()).to.equal(2)
  })

  it('Has Dodge', () => {
    const soldier = new Squaddie(5, {strength:3, armor:1, aim:2, dodge:4})
    expect(soldier.getBaseDodge()).to.equal(4)
    expect(soldier.getCurrentDodge()).to.equal(4)
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
    expect(target.isAlive()).to.be.false
  })
})

describe('Attacker can deal damage to Target Squaddie', () => {
  it('Allows attacker to strike target', () => {
    const attacker = new Squaddie(5, {strength:5, armor:0})
    const target = new Squaddie(5, {strength:1, armor:1})

    const resolver = new AttackResolver(target, attacker)

    const attackResults = resolver.resolveAttackerAttack()

    expect(attackResults.didItHit()).to.be.true
    expect(attackResults.getDamage()).to.equal(4)
    expect(target.isAlive()).to.be.true
  })

  it('Allows counterattacks', () => {
    const attacker = new Squaddie(5, {strength:5, armor:0})
    const target = new Squaddie(5, {strength:8, armor:1})

    const resolver = new AttackResolver(target, attacker)

    const counterResults = resolver.resolveTargetCounterattack()

    expect(counterResults.didItHit()).to.be.true
    expect(counterResults.getDamage()).to.equal(8)
    expect(attacker.isAlive()).to.be.false
  })

  it('Can resolve a round of attacks', () => {
    const attacker = new Squaddie(5, {strength:5, armor:0})
    const target = new Squaddie(5, {strength:8, armor:1})

    const resolver = new AttackResolver(target, attacker)
    const allResults = resolver.resolveRoundOfAttacks()

    expect(allResults.length).to.equal(2)

    const attackResults = allResults[0]
    expect(attackResults.getDamage()).to.equal(4)
    expect(target.isAlive()).to.be.true

    const counterResults = allResults[1]
    expect(counterResults.getDamage()).to.equal(8)
    expect(attacker.isAlive()).to.be.false
  })
})

describe('Attacks have a chance to miss', () => {
  it('Knows it hits if attacks always hit', () => {
    const attacker = new Squaddie(5, {strength:20, armor:0})
    const target = new Squaddie(5, {strength:1, armor:1})

    const resolver = new AttackResolver(target, attacker, new AttackerAimStrategyAlwaysHit)

    const attackResults = resolver.resolveAttackerAttack()

    expect(attackResults.didItHit()).to.be.true
    expect(target.isAlive()).to.be.false
  })

  it('Knows it missed if attacks never hits', () => {
    const attacker = new Squaddie(5, {strength:20, armor:0})
    const target = new Squaddie(5, {strength:1, armor:1})

    const resolver = new AttackResolver(target, attacker, new AttackerAimStrategyAlwaysMiss)

    const attackResults = resolver.resolveAttackerAttack()

    expect(attackResults.didItHit()).to.be.false
    expect(target.isAlive()).to.be.true
  })

  it('Knows it will hit if attacker aim is too high', () => {
    const attacker = new Squaddie(5, {strength:20, armor:0, aim: 20})
    const target = new Squaddie(5, {strength:1, armor:1})

    const resolver = new AttackResolver(target, attacker, new AttackerAimStrategyRollToHit)

    const attackResults = resolver.resolveAttackerAttack()

    expect(attackResults.didItHit()).to.be.true
    expect(target.isAlive()).to.be.false
  })

  it('Knows it will miss if target dodge is too high', () => {
    const attacker = new Squaddie(5, {strength:20, armor:0})
    const target = new Squaddie(5, {strength:1, armor:1, dodge: 20})

    const resolver = new AttackResolver(target, attacker, new AttackerAimStrategyRollToHit)

    const attackResults = resolver.resolveAttackerAttack()

    expect(attackResults.didItHit()).to.be.false
    expect(target.isAlive()).to.be.true
  })
})