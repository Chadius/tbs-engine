# Prototypes and Simulations
It's really hard to track all of the variables I want to track by hand.
It's also hard to balance when you don't have a working game engine.

To speed up ideas we'll stick to simplified systems that get the general point across. No need to fine tune the engine until I have the right features.

## Linear Map (August 29, 2020)
Create a 1 Dimensional map that has several zones.

On the left side is zone 1, where the heroes start.
Usually their goal is to reach the rightmost zone.

Enemies lie in the other zones, itching for a fight.

### Attack Ranges
Any squaddies in the same zone can attack any enemy with a melee attack.

Ranged weapons can work against those in adjacent zones.

### Movement
Zones can vary in size and terrain costs. The size is the number of squares needed to cross it.

Small zones can represent areas with lots of cover, or dead ends potentially with treasure.

## Expected Damage (August 29, 2020)
Constantly rolling dice is fun, but slow. And requires special equipment.

Instead of rolling constantly, I can calculate the expected damage from the attack.

### Step 0: Multiply HP by 36
Attacker and Defender roll 1d6 and add their bonuses. So there are 36 potential roll combinations.
I don't want to divide by 36 all the time, so instead I'll multiply hitpoints by 36.

#### Step 1: Calculate Base Damage
Attacker's power - Defender's armor.

Add the Defender's terrain bonuses, if applicable.
If the base damage is 0 or less you can stop here. The expected damage is 0.

#### Step 2: Calculate Hit Rate
Attacker's aim - Defender's dodge.

Don't forget the many adjustments:
- +1 if the Attacker has advantage.
- -1 if the Attacker has disadvantage.
- -2 if the Attacker is counterattacking.
- -1 if the Attacker uses a bow at close range.

#### Step 3: Multiply base damage times chance to hit
Attacker rolls 1d6 + Hit Rate.
Defender roll 1d6.

If Attacker meets or beats the Defender, the Defender gets hit.

- If the Attacker has +5 or more, they cannot miss (in the worst case, Attacker's 1 + 5 is at least the Defender's 6). So the attacker has a 36/36 chance to hit.
- If the Attacker has -6 or less, they cannot hit (in the best possible cast, Attacker's 6 - 6 is less than the Defender's 1.) So the attacker has a 0/36 chance to hit.

Because the hitpoints were multiplied by 36, just multiply the damage by 36.

|Attacker Hit Rate|Chance out of 36|
|-----------------|-----------------|
|+5 or more|36 (cannot miss)|
|+4| 35|
|+3| 33|
|+2| 30|
|+1| 26|
|0| 21|
|-1| 15|
|-2| 10|
|-3| 6|
|-4| 3|
|-5| 1|
|-6 or less| 0 (cannot hit)|

Now you have the Base Expected Damage.

#### Step 4: Critical Hit Damage
Some attacks can crit. If your attack cannot, skip this step.

You crit by rolling 2d6 and trying to roll below the crit chance number. So if your crit chance is 2, you only have a 1/36 chance of critting.
Crits deal double damage.

To factor in crit damage, multiply the extra critical damage by the chance of critting.

|Roll this number or lower to crit|Chance out of 36|
|---------------------------------|----------------|
|12|36 (Always crit)|
|11|35|
|10|33|
|9|30|
|8|26|
|7|21 (Over half of your hits are crits)|
|6|15 (A little more than 1/3 of the time)|
|5|10 (A little less than 1/3 of the time)|
|4|6|
|3|3|
|2|1|

#### Examples
##### T'eros's magic against a lowly bandit
- T'eros's Blot spell deals 3 magic damage. The bandit has no magical resistance.
- T'eros attacks with a +2 bonus. The bandit has no magical barriers and can't escape it.
- The Blot spell cannot crit.

- Base Damage = 3 - 0
- Hit Rate = 2 - 0
- Chance to hit = 30/36
- Crit damage = 0

Expected Damage: 3 x 30 = 90

Because the bandit has a chance to dodge, we don't expect this spell to do full 3 damage. 90/36 is 2 + 18/36, or about 2.5 HP. So 2 Blot spells *should* deal about 5 damage.

##### Lini's counterattacks a bandit's axe with her sword
- Lini's sword deals 2 damage on hit. The bandit has 1 armor against physical strikes.
- Lini attacks with a +2 bonus, and the bandit has 0 dodge.
- Because she wields a sword against an axe user, Lini has the advantage.
- Lini is countering an attack, so she takes a -2 attack penalty.
- She has a 2/36 chance of critting and dealing an extra 2 damage.

- Base Damage = 2 - 1 = 1
- Hit Rate = 2 - 0 + 1 - 2 = 1
- Chance to hit = 26/36
- Crit damage = 1 * 2 = 2 

Expected Damage: 1 x 26 + 2 = 28  

Counterattacks should not be overwhelming, to punish overly defensive strategies. And the bandit's armor doesn't help, either. Still, Lini has a chance to do some damage on the counter.

##### A cornered archer tries to shoot Ingénue in melee
- Bows are always in advantage as long as you aren't counterattacking.
- But the bow takes a -1 penalty if your target is up close, and Ingénue wants her close up!
- The archer can deal 2 damage, and Ingénue wears no armor.
- The archer has an aim of +1, but Ingénue is quite mobile - she has +2 dodge.
- No chance to crit with the bow.

- Base Damage = 2 - 0 = 2
- Hit Rate = 1 - 1 + 1 - 2 = -1
- Chance to hit = 15/36
- Crit damage = 0 

Expected Damage: 2 x 15 = 30

The bow's strengths lie at range, and in melee it doesn't do too much. Ingénue is taking full advantage of this to ruin the archer's day!  

#### Weaknesses
Expected results that rely on probability are just that: *expected*.

Attacks will miss instead of dealing reduced damage. A string of bad rolls means the overall damage will be much higher than expected, and will change the perception of attacks.

Critical hits are extremely prone to changing the results. A lucky crit can turn an ignorable attack to a squaddie's downfall.