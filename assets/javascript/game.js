$(document).ready(function() {
    // Characters
    var playable = [
        {
            name: "porg",
            called: "Porg",
            healthPoints: 100,
            attackPower: 24,
            counterAttackPower: 10,
            victory: "The Jedi is off of Ahch-To and your nest on the Millenium Falcon is coming along nicely.",
            wins: 0
        },

        {
            name: "r2-d2",
            called: "R2-D2",
            healthPoints: 200,
            attackPower: 8,
            counterAttackPower: 10,
            victory: "Beep boop beep boop boop [Mission successful. Gloat to C3-PO about it.]",
            wins: 0
        },

        {
            name: "luke-skywalker",
            called: "Luke Skywalker",
            healthPoints: 400,
            attackPower: 1,
            counterAttackPower: 20,
            victory: "Congratulations on driving off your friends (and the Porg).",
            wins: 0
        },

        {
            name: "chewbacca",
            called: "Chewbacca",
            healthPoints: 300,
            attackPower: 3,
            counterAttackPower: 18,
            victory: "Thanks to you the Resistance might just survive the battle on Crait.",
            wins: 0
        }
    ];

    var bonusBoss = {
            name: "darth-porgius",
            called: "Darth Porgius",
            healthPoints: 1000,
            counterAttackPower: 2
    };

    var bonusWin = false;

    // Player and enemy placeholders
    var player = {
        name: "",
        healthPoints: 0,
        attackPower: 0,
        attacks: 0,
        victory: ""
    };

    var enemy = {
        name: "",
        healthPoints: 0,
        counterAttackPower: 0
    };

    var enemyPrefix = "enemy-";

    // Hides the Restart button
    $("#restart").hide();

    // Player picks their player character
    $("#cast .character").on("click", function() {
        // If the player hasn't already selected their character...
        if(player.name == "") {
            // Gets the player's character's information on the click.
            let choice = $(this).attr("id");

            $(playable).each(function(index, value) {
                if(value.name == choice) {
                    player.name = value.called;
                    player.healthPoints = value.healthPoints;
                    player.attackPower = value.attackPower;
                    player.victory = value.victory;
                    return false;
                }
            });

            // Copies the player character into the "Your Character" section
            $("#player").html($(this).html());

            // Copies the enemies into the "Enemies Available to Attack" section
            $("#cast .character").each(function(key, npc) {
                if($(npc).attr("id") !== choice) {
                    var foe = $("<div>");
                    
                    $(foe).addClass("col-12 col-md-3 character").html($(npc).html()).attr("id", enemyPrefix + $(npc).attr("id"));

                    $("#enemies").append(foe);
                }
            });

            // Hides the character selection
            $("#cast .character, #pc-choice").hide();

            // Shows the enemies and arena
            $("#enemy-pen, #arena").show();
        }
    });

    // When an enemy is selected, they are taken to the defender area.
    $(document).on("click", "#enemies .character", function() {
        // If there is currently no enemy, this enemy is selected
        if(enemy.name == "") {
            var foe = this;

            // An available and valid enemy is selected and moved to the defender area.
            if($(foe).attr("id").indexOf(enemyPrefix) === 0) {
                $("#defender-area").html($(foe).html());

                // Enemy is selected from the playable character array.
                $(playable).each(function(index, value) {
                    if(value.name == $(foe).attr("id").slice(enemyPrefix.length)) {
                        enemy.name = value.called;
                        enemy.healthPoints = value.healthPoints;
                        enemy.counterAttackPower = value.counterAttackPower;
                        return false;
                    }
                });
            }

            // Removes the enemy from the enemies available to attack.
            $(foe).remove();

            // Cleans up the dialog
            $("#dialog").html("");
        }
    });

    // When the player attacks, the enemy counterattacks, and the player's attack power increaases.
    $("#attack").on("click", function() {
        // If there is an enemy in the defender area, then the enemy is attacked
        if((enemy.name !== "") && (player.healthPoints > 0)) {
            // Bonus battle trigger
            let bonusTrigger = false;

            // Player attacks enemy
            var damage = player.attackPower * (player.attacks + 1);
            enemy.healthPoints -= damage;

            $("#dialog").html("You attacked " + enemy.name + " for " + damage + " damage.<br>");
            $("#defender-area .hp").text(enemy.healthPoints);
            player.attacks++;

            // If the enemy runs out of health points, then the card is removed and the player is free to choose a new enemy.
            if(enemy.healthPoints <= 0) {
                $("#dialog").html("You have defeated " + enemy.name + ", you can choose to fight another enemy.");
                
                $("#defender-area").html("");

                enemy.name = "";

                // The player wins if there are no more opponents left to fight.
                if(($("#enemies .character").length < 1)) {
                    bonusTrigger = true;

                    // A win is added for the player character.
                    $(playable).each(function(key, value) {
                        if(value.called == player.name) {
                            value.wins++;
                        }

                        // Checks if bonus boss battle condition has been met.
                        if(value.wins < 1) {
                            bonusTrigger = false;
                        }
                    });
                    
                    // The bonus boss is automatically set up.
                    if(bonusTrigger && !bonusWin) {
                        enemy.name = bonusBoss.called;
                        enemy.healthPoints = bonusBoss.healthPoints;
                        enemy.counterAttackPower = bonusBoss.counterAttackPower;

                        bonusWin = true;
                        
                        $("#defender-area").html($("#" + bonusBoss.name).html());

                        $("body").css("background-image", "url('assets/images/crait.jpg')");
                        $("#dialog").html(enemy.name + " has arrived on Crait.");
                    } else {
                        $("#dialog").html("You Won!!!!<br>(" + player.victory + ".)");

                        if(bonusWin) {
                            $("#dialog").html("You have won the bonus battle against " + enemy.name + " on Crait!");
                        }
                    }
                }
            }

            if((enemy.healthPoints > 0) && !bonusTrigger) {
                // Enemy counterattacks player
                player.healthPoints -= enemy.counterAttackPower;
                $("#dialog").html($("#dialog").html() + enemy.name + " attacked you back for " + enemy.counterAttackPower + " damage.");
                $("#player .hp").text(player.healthPoints);

                // If the player has 0 or lower health points, then it's game over for the player.
                if(player.healthPoints <= 0) {
                    $("#dialog").html("You have been defeated... GAME OVER");
                    $("#restart").show();

                    // Resets the wins for all characters
                    $(playable).each(function(key, value) {
                        value.wins = 0;
                    });
                }
            }

            bonusTrigger = false;

            // If the player finishes the game (win or lose), then the restart button appears.
            if((player.healthPoints <= 0) || (($("#enemies .character").length < 1) && enemy.healthPoints <= 0)) {
                bonusWin = false;
                $("#restart").show();
            }
        }
    });

    // Restarts the game by resetting the conditions
    $("#restart").on("click", function() {
        // Shows all of the playable characters
        $("#cast .character, #pc-choice").show();

        // Removes the player and enemy character cards
        $("#player, #defender-area, #dialog").html("");
        $("#enemies .character").remove();

        // Resets the player stats
        player.name = "";
        player.attackPower = 0;
        player.healthPoints = 0;
        player.attacks = 0;
        player.victory = "";

        // Resets the enemy stats
        enemy.name = "";
        enemy.healthPoints = 0;
        enemy.counterAttackPower = 0;

        // Resets the CSS and HTML
        $("body").removeAttr("style");
        $("#restart, #enemy-pen, #arena").hide();
    });
});