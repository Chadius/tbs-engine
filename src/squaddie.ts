export class Squaddie {
  maxHealth: number
  strength: number
  armor: number
  health: number
  aim: number
  dodge: number

  constructor(maxHealth, strength = 0, armor = 0, aim = 0, dodge = 0) {
    this.maxHealth = maxHealth
    this.health = this.getMaxHealth()
    this.strength = strength
    this.armor = armor
    this.aim = aim
    this.dodge = dodge
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
    return this.health
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

  isAlive() {
    return this.getCurrentHealth() > 0
  }

  takeDamage(damageTaken) {
    this.health -= damageTaken
  }

  getBaseAim() {
    return this.aim
  }

  getCurrentAim() {
    return this.getBaseAim()
  }

  getBaseDodge() {
    return this.dodge
  }

  getCurrentDodge() {
    return this.getBaseDodge()
  }
}