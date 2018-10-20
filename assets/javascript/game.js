$(document).ready(function() {
    // Characters
    var playable = [
        {
            name: "porg",
            called: "Porg",
            healthPoints: 100,
            attackPower: 5,
            counterAttackPower: 10
        },

        {
            name: "r2-d2",
            called: "R2-D2",
            healthPoints: 200,
            attackPower: 10,
            counterAttackPower: 15
        },

        {
            name: "luke-skywalker",
            called: "Luke Skywalker",
            healthPoints: 400,
            attackPower: 20,
            counterAttackPower: 20
        },

        {
            name: "chewbacca",
            called: "Chewbacca",
            healthPoints: 300,
            attackPower: 15,
            counterAttackPower: 30
        }
    ];

    // Player and enemy placeholders
    var player = {
        name: "",
        healthPoints: 0,
        attackPower: 0,
        attacks: 0
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
            $("#cast .character").hide();
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

                if($("#enemies .character").length < 1) {
                    $("#dialog").html("You Won!!!! GAME OVER!!! (Go home you're drunk " + player.name + ".)");
                }
            }

            if(enemy.healthPoints > 0) {
                // Enemy counterattacks player
                player.healthPoints -= enemy.counterAttackPower;
                $("#dialog").html($("#dialog").html() + enemy.name + " attacked you back for " + enemy.counterAttackPower + " damage.");
                $("#player .hp").text(player.healthPoints);

                // If the player has 0 or lower health points, then it's game over for the player.
                if(player.healthPoints <= 0) {
                    $("#dialog").html("You have been defeated... GAME OVER");
                    $("#restart").show();
                }
            }

            // If the player finishes the game (win or lose), then the restart button appears.
            if((player.healthPoints <= 0) || ($("#enemies .character").length < 1)) {
                $("#restart").show();
            }
        }
    });

    // Restarts the game by resetting the conditions
    $("#restart").on("click", function() {
        // Shows all of the playable characters
        $("#cast .character").show();

        // Removes the player and enemy character cards
        $("#player, #defender-area, #dialog").html("");
        $("#enemies .character").remove();

        // Resets the player stats
        player.name = "";
        player.attackPower = 0;
        player.healthPoints = 0;
        player.attacks = 0;

        // Resets the enemy stats
        enemy.name = "";
        enemy.healthPoints = 0;
        enemy.counterAttackPower = 0;
    });
});