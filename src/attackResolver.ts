import {Squaddie} from "./squaddie";

export interface AttackerAimStrategy {
  didItHit(target, attacker): boolean;
}

export class AttackerAimStrategyAlwaysHit implements AttackerAimStrategy {
  didItHit(target, attacker) {
    return true
  }
}

export class AttackerAimStrategyAlwaysMiss implements AttackerAimStrategy {
  didItHit(target, attacker) {
    return false
  }
}

export class AttackerAimStrategyRollToHit implements AttackerAimStrategy {
  didItHit(target, attacker) {
    const attackerRoll = Math.floor(Math.random() * 7) - 1 + Math.floor(Math.random() * 7) - 1
    const attackerHitCheck = attackerRoll + attacker.getCurrentAim()
    return attackerHitCheck >= target.getCurrentDodge()
  }
}

export class AttackResolution {
  rawDamage: number
  damageDealt: number
  attackHit: boolean

  constructor(rawDamage, damageDealt, didItHit) {
    this.rawDamage = rawDamage
    this.damageDealt = damageDealt
    this.attackHit = didItHit
  }

  getDamage() {
    return this.damageDealt
  }

  didItHit() {
    return this.attackHit
  }
}

export const missedAttack = new AttackResolution(
  0,
  0,
  false
)

export class AttackResolver {
  target: Squaddie
  attacker: Squaddie
  aimStrategy: AttackerAimStrategy

  damageDealt: number
  counterDamageDealt: number

  constructor(target, attacker, aimStrategy: AttackerAimStrategy = undefined) {
    this.target = target
    this.attacker = attacker

    this.aimStrategy = aimStrategy || new AttackerAimStrategyAlwaysHit
  }

  resolveAttackerAttack() {
    if (this.didTheAttackHit(this.target, this.attacker) !== true) {
      return missedAttack
    }

    const rawDamage = this.attacker.getCurrentStrength()
    this.damageDealt = Math.max(
      rawDamage - this.target.getCurrentArmor(),
      0
    )

    this.target.takeDamage(this.damageDealt)

    return new AttackResolution(
      rawDamage,
      this.damageDealt,
      true
    )
  }

  resolveTargetCounterattack() {
    if (this.didTheAttackHit(this.attacker, this.target) !== true) {
      return missedAttack
    }

    const rawDamage = this.target.getCurrentStrength()
    this.counterDamageDealt = Math.max(
      rawDamage - this.attacker.getCurrentArmor(),
      0
    )

    this.attacker.takeDamage(this.counterDamageDealt)

    return new AttackResolution(
      rawDamage,
      this.counterDamageDealt,
      true
    )
  }

  didTheAttackHit(target, attacker) {
    return (this.aimStrategy.didItHit(target, attacker) === true)
  }

  resolveRoundOfAttacks() {
    const allResolutions = []
    if (this.attacker.isAlive()) {
      allResolutions.push(
        this.resolveAttackerAttack()
      )
    }

    if (this.target.isAlive()) {
      allResolutions.push(
        this.resolveTargetCounterattack()
      )
    }

    return allResolutions
  }
}