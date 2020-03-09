export class Squaddie {
  maxHealth: number
  strength: number

  constructor(maxHealth, strength = 0) {
    this.maxHealth = maxHealth
    this.strength = strength
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
}