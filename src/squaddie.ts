export class Squaddie {
  maxHealth: number

  strength: number
  armor: number
  health: number
  aim: number
  dodge: number

  movePerTurn: number

  moveAvailableThisTurn: boolean
  private readonly id: string;

  constructor(id, maxHealth, attributes = {}, movement = {} ) {
    this.id = id
    this.maxHealth = maxHealth
    this.health = this.getMaxHealth()

    this.constructAttributes(attributes)
    this.constructMovement(movement)
    this.defaultTurnActions()
  }

  constructAttributes(attributes: object) {
    const defaultAttributes = {
      strength: 0,
      armor: 0,
      aim: 0,
      dodge: 0,
    }

    this.strength = attributes['strength'] || defaultAttributes.strength
    this.armor = attributes['armor'] || defaultAttributes.armor
    this.aim = attributes['aim'] || defaultAttributes.aim
    this.dodge = attributes['dodge'] || defaultAttributes.dodge
  }

  constructMovement(movement: object) {
    const defaultMovement = {
      movePerTurn: 0,
    }

    this.movePerTurn = movement['movePerTurn'] || movement['movement'] || defaultMovement.movePerTurn
  }

  defaultTurnActions(): void {
    this.moveAvailableThisTurn = true
  }

  getBaseMaxHealth(): number {
    return this.maxHealth
  }

  getMaxHealth(): number {
    return this.getBaseMaxHealth()
  }

  getCurrentHealth(): number {
    return this.getHealth()
  }

  getHealth(): number {
    return this.health
  }

  getBaseStrength(): number {
    return this.strength
  }

  getCurrentStrength(): number {
    return this.getBaseStrength()
  }

  getBaseArmor(): number {
    return this.armor
  }

  getCurrentArmor(): number {
    return this.getBaseArmor()
  }

  isAlive(): boolean {
    return this.getCurrentHealth() > 0
  }

  takeDamage(damageTaken): void {
    this.health -= damageTaken
  }

  getBaseAim(): number {
    return this.aim
  }

  getCurrentAim(): number {
    return this.getBaseAim()
  }

  getBaseDodge(): number {
    return this.dodge
  }

  getCurrentDodge(): number {
    return this.getBaseDodge()
  }

  getBaseMovePerTurn(): number {
    return this.movePerTurn
  }

  getCurrentMovePerTurn(): number {
    return this.getBaseMovePerTurn()
  }

  getId(): string {
    return this.id
  }

  canMoveThisTurn(): boolean {
    return this.moveAvailableThisTurn
  }

  consumeMoveActionForThisTurn(): void {
    this.moveAvailableThisTurn = false
  }

  renewActionsAtStartOfTurn(): void {
    this.moveAvailableThisTurn = true
  }
}