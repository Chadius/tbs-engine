export class Squaddie {
  maxHealth: number
  strength: number
  armor: number
  health: number
  aim: number
  dodge: number

  constructor(maxHealth, attributes = {}  ) {
    this.maxHealth = maxHealth
    this.health = this.getMaxHealth()

    this.constructAttributes(attributes)
  }

  constructAttributes(attributes) {
    const defaultAttributes = {
      strength: 0,
      armor: 0,
      aim: 0,
      dodge: 0,
    }

    this.strength = attributes.strength || defaultAttributes.strength
    this.armor = attributes.armor || defaultAttributes.armor
    this.aim = attributes.aim || defaultAttributes.aim
    this.dodge = attributes.dodge || defaultAttributes.dodge
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