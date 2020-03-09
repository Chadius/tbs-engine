export class Squaddie {
  maxHealth: number
  strength: number
  armor: number

  constructor(maxHealth, strength = 0, armor = 0) {
    this.maxHealth = maxHealth
    this.strength = strength
    this.armor = armor
  }

  getBaseMaxHealth() {
    return this.maxHealth
  }

  getMaxHealth() {
    return this.getBaseMaxHealth()
  }

  getCurrentHealth() {
    return this.getHealth()
  }

  getHealth() {
    return this.maxHealth
  }

  getBaseStrength() {
    return this.strength
  }

  getCurrentStrength() {
    return this.getBaseStrength()
  }

  getBaseArmor() {
    return this.armor
  }

  getCurrentArmor() {
    return this.getBaseArmor()
  }
}