# Star Wars RPG: The Last Jedi Edition

Luke Skywalker has overstayed his welcome in Ahch-To. Both his friends (and the local Porgs) want him to assist the Resistance against the First Order.

**Luke Skywalker**

> Your friends (and that Porg you almost killed) want to drag you to Crait to help out the Resistance. Try to persuade them to leave you be.

**Chewbacca**

> It is vital that Luke Skywalker comes to Crait to save the remnants of the Resistance. Unfortunately R2-D2 wants to hang out with Luke and the Porgs keep getting into the Falcon.

**R2-D2**

> Beep boop beep beep beep boop beep beep boop (Get Luke to Crait by any means necessary. Even if you have to kick him while he's down. You know what to do... Also get Chewie to stop spit roasting the native fauna.)

**Porg**

> \*porg noises\* (Sneak on to ship, annoy pilots, get rid of the Jedi that would not leave.)

## Instructions

1. Choose your player character from the top row.
2. Choose your first enemy from the **Enemies Available to Attack** section.
3. The enemy will be moved to the **Defender** section and you can attack the enemy.
4. Each time you attack, your enemy will counterattack.
5. After each attack, your attack power will grow.
6. Once your enemy's health falls to 0, the enemy is defeated and you may choose another one to fight.
7. You *lose* if your health drops to 0 (or below).
8. You *win* if you beat all three of your enemies.\*
9. Win or lose, you can *restart* the game and play again.

**\* Bonus:** If you can beat the game with each character at least once with no losses, you can get a surprise at the end. :wink:

## Developer Diary

For this project, I needed to implement a combat system for a simple RPG. This combat system was invovled simple removal of hit points from the player character and the enemy character via attacks and counterattacks respectively. To keep the game balanced, the player's attack damage would increase each turn while the enemy's counterattack damage would remain constant.

Although the game is only on one web page, I used jQuery to show and hide different sections of the game depending on the phase that the game was in. Therefore the game could be roughly divided into the player character selection screen, enemy selection, and combat screen. Once each phase of the game was completed (as well as the game itself), the player would click on buttons which would trigger JavaScript events to move the game to its next phase.