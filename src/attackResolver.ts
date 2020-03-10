import {Squaddie} from "./squaddie";

export class AttackResolution {
  rawDamage : number
  damageDealt: number

  constructor(rawDamage, damageDealt) {
    this.rawDamage = rawDamage
    this.damageDealt = damageDealt
  }

  getDamage() {
    return this.damageDealt
  }
}

export class AttackResolver {
  target: Squaddie
  attacker: Squaddie

  damageDealt: number
  counterDamageDealt: number

  constructor(target, attacker) {
    this.target = target
    this.attacker = attacker
  }

  resolveAttack() {
    const rawDamage = this.attacker.getCurrentStrength()
    this.damageDealt = Math.max(
      rawDamage - this.target.getCurrentArmor(),
      0
    )

    this.target.takeDamage(this.damageDealt)

    return new AttackResolution(
      rawDamage,
      this.damageDealt
    )
  }

  resolveCounter() {
    const rawDamage = this.target.getCurrentStrength()
    this.counterDamageDealt = Math.max(
      rawDamage - this.attacker.getCurrentArmor(),
      0
    )

    this.attacker.takeDamage(this.counterDamageDealt)

    return new AttackResolution(
      rawDamage,
      this.counterDamageDealt
    )
  }
}