


/**
 * Add the "wall state" for Mousoleum hunts.
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addMousoleumStage(message, user, user_post, hunt) {
    message.stage = (user.quests.QuestMousoleum.has_wall) ? "Has Wall" : "No Wall";
}

/**
 * Separate hunts with certain mice available from those without.
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addHarbourStage(message, user, user_post, hunt) {
    const quest = user.quests.QuestHarbour;
    // Hunting crew + can't yet claim booty = Pirate Crew mice are in the attraction pool
    if (quest.status === "searchStarted" && !quest.can_claim) {
        message.stage = "On Bounty";
    } else {
        message.stage = "No Bounty";
    }
}

/**
 * Separate hunts with certain mice available from those without.
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addClawShotCityStage(message, user, user_post, hunt) {
    const quest = user.quests.QuestClawShotCity;
    /**
 * !map_active && !has_wanted_poster => Bounty Hunter can be attracted
 * !map_active && has_wanted_poster => Bounty Hunter is not attracted
 * map_active && !has_wanted_poster => On a Wanted Poster
 */

    if (!quest.map_active && !quest.has_wanted_poster) {
        message.stage = "No poster";
    } else if (!quest.map_active && quest.has_wanted_poster) {
        message.stage = "Has poster";
    } else if (quest.map_active) {
        message.stage = "Using poster";
    } else {
        throw new Error("Unexpected Claw Shot City quest state");
    }
}

/**
 * Set the stage based on decoration and boss status.
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addFestiveCometStage(message, user, user_post, hunt) {
    const quest = user.quests.QuestWinterHunt2021;
    if (!quest) {
        return;
    }

    if (quest.comet.current_phase === 11) {
        message.stage = "Boss";
    }
    else if (/Pecan Pecorino/.test(user.bait_name)) {
        let theme = quest.decorations.current_decoration || "none";
        if (theme == "none") {
            theme = "No Decor";
        } else {
            theme = theme.replace(/^([a-z_]+)_yule_log_stat_item/i, "$1").replace(/_/g, " ");
            theme = theme.charAt(0).toUpperCase() + theme.slice(1);
        }
        message.stage = theme;
    } else {
        message.stage = 'N/A';
    }
}

/**
 * MP stage reflects the weather categories
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addMoussuPicchuStage(message, user, user_post, hunt) {
    const elements = user.quests.QuestMoussuPicchu.elements;
    message.stage = {
        rain: `Rain ${elements.rain.level}`,
        wind: `Wind ${elements.wind.level}`,
    };
}

/**
 * WWR stage reflects the zones' rage categories
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addWhiskerWoodsRiftStage(message, user, user_post, hunt) {
    const zones = user.quests.QuestRiftWhiskerWoods.zones;
    const clearing = zones.clearing.level;
    const tree = zones.tree.level;
    const lagoon = zones.lagoon.level;

    const rage = {};
    if (0 <= clearing && clearing <= 24) {
        rage.clearing = 'CC 0-24';
    } else if (clearing <= 49) {
        rage.clearing = 'CC 25-49';
    } else if (clearing === 50) {
        rage.clearing = 'CC 50';
    }

    if (0 <= tree && tree <= 24) {
        rage.tree = 'GGT 0-24';
    } else if (tree <= 49) {
        rage.tree = 'GGT 25-49';
    } else if (tree === 50) {
        rage.tree = 'GGT 50';
    }

    if (0 <= lagoon && lagoon <= 24) {
        rage.lagoon = 'DL 0-24';
    } else if (lagoon <= 49) {
        rage.lagoon = 'DL 25-49';
    } else if (lagoon === 50) {
        rage.lagoon = 'DL 50';
    }
    if (!rage.clearing || !rage.tree || !rage.lagoon) {
        message.location = null;
    } else {
        message.stage = rage;
    }
}

/**
 * Labyrinth stage reflects the type of hallway.
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addLabyrinthStage(message, user, user_post, hunt) {
    if (user.quests.QuestLabyrinth.status === "hallway") {
        const hallway = user.quests.QuestLabyrinth.hallway_name;
        // Remove first word (like Short)
        message.stage = hallway.substr(hallway.indexOf(" ") + 1).replace(/ hallway/i, '');
    } else {
    // Not recording intersections at this time.
        message.location = null;
    }
}

/**
 * Stage in the FW reflects the current wave only.
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addFieryWarpathStage(message, user, user_post, hunt) {
    const wave = user.viewing_atts.desert_warpath.wave;
    message.stage = (wave === "portal") ? "Portal" : `Wave ${wave}`;
}

/**
 * Set the stage based on the tide. Reject hunts near tide intensity changes.
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addBalacksCoveStage(message, user, user_post, hunt) {
    const tide = user.quests.QuestBalacksCove.tide.level;
    const direction = user.quests.QuestBalacksCove.tide.direction;
    const progress = user.quests.QuestBalacksCove.tide.percent;
    const imminent_state_change = (progress >= 99
        // Certain transitions do not change the tide intensity, and are OK to track.
        && !(tide === "low" && direction === "in")
        && !(tide === "high" && direction === "out"));
    if (!imminent_state_change && tide) {
        message.stage = tide.charAt(0).toUpperCase() + tide.substr(1);
        if (message.stage === "Med") {
            message.stage = "Medium";
        }
        message.stage += " Tide";
    } else {
        message.location = null;
    }
}

/**
 * Read the viewing attributes to determine the season. Reject hunts where the season changed.
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addSeasonalGardenStage(message, user, user_post, hunt) {
    const season = user.viewing_atts.season;
    const final_season = user_post.viewing_atts.season;
    if (season && final_season && season === final_season) {
        switch (season) {
            case "sr":
                message.stage = "Summer";
                break;
            case "fl":
                message.stage = "Fall";
                break;
            case "wr":
                message.stage = "Winter";
                break;
            default:
                message.stage = "Spring";
                break;
        }
    } else {
        message.location = null;
    }
}

/**
 * Read the bucket / vial state to determine the stage for Living & Twisted garden.
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addGardenStage(message, user, user_post, hunt) {
    const quest = user.quests.QuestLivingGarden;
    const container_status = (quest.is_normal) ? quest.minigame.bucket_state : quest.minigame.vials_state;
    message.stage = (container_status === "dumped") ? "Pouring" : "Not Pouring";
}

/**
 * Determine if there is a stampede active
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addSandDunesStage(message, user, user_post, hunt) {
    message.stage = (user.quests.QuestSandDunes.minigame.has_stampede) ? "Stampede" : "No Stampede";
}

/**
 * Indicate whether or not the Cursed / Corrupt mouse is present
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addLostCityStage(message, user, user_post, hunt) {
// TODO: Partially cursed, for Cursed City?
    message.stage = (user.quests.QuestLostCity.minigame.is_cursed) ? "Cursed" : "Not Cursed";
}

/**
 * Report the current distance / obstacle.
 * TODO: Stage / hunt details for first & second icewing hunting?
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addIcebergStage(message, user, user_post, hunt) {
    const quest = user.quests.QuestIceberg;
    message.stage = (({
        "Treacherous Tunnels": "0-300ft",
        "Brutal Bulwark":    "301-600ft",
        "Bombing Run":      "601-1600ft",
        "The Mad Depths":  "1601-1800ft",
        "Icewing's Lair":       "1800ft",
        "Hidden Depths":   "1801-2000ft",
        "The Deep Lair":        "2000ft",
        "General":            "Generals",
    })[quest.current_phase]);

    if (!message.stage) {
        message.location = null;
    }
}

/**
 * Report the Softserve Charm status.
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addSlushyShorelineStage(message, user, user_post, hunt) {
    message.stage = "Not Softserve";
    if (user.trinket_name === "Softserve Charm") {
        message.stage = "Softserve";
    }
}

/**
 * Report the Artisan Charm status.
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addMuridaeMarketStage(message, user, user_post, hunt) {
    message.stage = "Not Artisan";
    if (user.trinket_name === "Artisan Charm") {
        message.stage = "Artisan";
    }
}

/**
 * Report the zone and depth, if any.
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addSunkenCityStage(message, user, user_post, hunt) {
    const quest = user.quests.QuestSunkenCity;
    if (!quest.is_diving) {
        message.stage = "Docked";
        return;
    }

    const depth = quest.distance;
    message.stage = quest.zone_name;
    if (depth < 2000) {
        message.stage += " 0-2km";
    } else if (depth < 10000) {
        message.stage += " 2-10km";
    } else if (depth < 15000) {
        message.stage += " 10-15km";
    } else if (depth < 25000) {
        message.stage += " 15-25km";
    } else if (depth >= 25000) {
        message.stage += " 25km+";
    }
}

/**
 * Report the stage as the type and quantity of clues required.
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addZokorStage(message, user, user_post, hunt) {
    const zokor_district = user.quests.QuestAncientCity.district_name;
    if (zokor_district) {
        const zokor_stages = {
            "Garden":     "Farming 0+",
            "Study":      "Scholar 15+",
            "Shrine":     "Fealty 15+",
            "Outskirts":  "Tech 15+",
            "Room":       "Treasure 15+",
            "Minotaur":   "Lair - Each 30+",
            "Temple":     "Fealty 50+",
            "Auditorium": "Scholar 50+",
            "Farmhouse":  "Farming 50+",
            "Center":     "Tech 50+",
            "Vault":      "Treasure 50+",
            "Library":    "Scholar 80+",
            "Manaforge":  "Tech 80+",
            "Sanctum":    "Fealty 80+",
        };
        for (const [key, value] of Object.entries(zokor_stages)) {
            const pattern = new RegExp(key, "i");
            if (zokor_district.search(pattern) !== -1) {
                message.stage = value;
                break;
            }
        }
    }

    if (!message.stage) {
        message.location = null;
    }
}

/**
 * Report the pagoda / battery charge information.
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addFuromaRiftStage(message, user, user_post, hunt) {
    const quest = user.quests.QuestRiftFuroma;
    if (quest.view_state.includes("trainingGrounds")) {
        message.stage = "Outside";
    } else if (quest.view_state.includes("pagoda")) {
        message.stage = (({
            "charge_level_one":   "Battery 1",
            "charge_level_two":   "Battery 2",
            "charge_level_three": "Battery 3",
            "charge_level_four":  "Battery 4",
            "charge_level_five":  "Battery 5",
            "charge_level_six":   "Battery 6",
            "charge_level_seven": "Battery 7",
            "charge_level_eight": "Battery 8",
            "charge_level_nine":  "Battery 9",
            "charge_level_ten":   "Battery 10",
        })[quest.droid.charge_level]);
    }

    if (!message.stage) {
        message.location = null;
    }
}

/**
 * Set the Table of Contents Stage
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addTableOfContentsStage(message, user, user_post, hunt) {
    const quest = user.quests.QuestTableOfContents;
    if (quest) {
        if (quest.is_writing) {
            if (quest.current_book.volume > 0) {
                message.stage = 'Encyclopedia';
            } else {
                message.stage = 'Pre-Encyclopedia';
            }
        } else {
            message.stage = 'Not Writing';
        }
    }
}

/**
 *
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addToxicSpillStage(message, user, user_post, hunt) {
    const titles = user.quests.QuestPollutionOutbreak.titles;
    const final_titles = user_post.quests.QuestPollutionOutbreak.titles;
    const formatted_titles = {
        hero:                 'Hero',
        knight:               'Knight',
        lord_lady:            'Lord/Lady',
        baron_baroness:       'Baron/Baroness',
        count_countess:       'Count/Countess',
        duke_dutchess:        'Duke/Duchess',
        grand_duke:           'Grand Duke/Duchess',
        archduke_archduchess: 'Archduke/Archduchess',
    };
    for (const [title, level] of Object.entries(titles)) {
        if (level.active) {
            if (final_titles[title].active === level.active) {
                message.stage = formatted_titles[title];
            }
            break;
        }
    }
    if (!message.stage) {
        message.location = null;
    }
}

/**
 * Report the misting state
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addBurroughsRiftStage(message, user, user_post, hunt) {
    const quest = user.quests.QuestRiftBurroughs;
    message.stage = (({
        "tier_0": "Mist 0",
        "tier_1": "Mist 1-5",
        "tier_2": "Mist 6-18",
        "tier_3": "Mist 19-20",
    })[quest.mist_tier]);
    if (!message.stage) {
        message.location = null;
    }
}

/**
 * Report on the unique minigames in each sub-location. Reject hunts for which the train
 * moved / updated / departed, as the hunt stage is ambiguous.
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addTrainStage(message, user, user_post, hunt) {
    const quest = user.quests.QuestTrainStation;
    const final_quest = user_post.quests.QuestTrainStation;
    // First check that the user is still in the same stage.
    const changed_state = (quest.on_train !== final_quest.on_train
        || quest.current_phase !== final_quest.current_phase);
    if (changed_state) {
        message.location = null;
    } else {
    // Pre- & post-hunt user object agree on train & phase statuses.
        if (!quest.on_train || quest.on_train === "false") {
            message.stage = "Station";
        } else if (quest.current_phase === "supplies") {
            let stage = "1. Supply Depot";
            if (quest.minigame && quest.minigame.supply_hoarder_turns > 0) {
            // More than 0 (aka 1-5) Hoarder turns means a Supply Rush is active
                stage += " - Rush";
            } else {
                stage += " - No Rush";
                if (user.trinket_name === "Supply Schedule Charm") {
                    stage += " + SS Charm";
                }
            }
            message.stage = stage;
        } else if (quest.current_phase === "boarding") {
            let stage = "2. Raider River";
            if (quest.minigame && quest.minigame.trouble_area) {
            // Raider River has an additional server-side state change.
                const area = quest.minigame.trouble_area;
                const final_area = final_quest.minigame.trouble_area;
                if (area !== final_area) {
                    message.location = null;
                } else {
                    const charm_id = message.charm.id;
                    const has_correct_charm = (({
                        "door": 1210,
                        "rails": 1211,
                        "roof": 1212,
                    })[area] === charm_id);
                    if (has_correct_charm) {
                        stage += " - Defending Target";
                    } else if ([1210, 1211, 1212].includes(charm_id)) {
                        stage += " - Defending Other";
                    } else {
                        stage += " - Not Defending";
                    }
                }
            }
            message.stage = stage;
        } else if (quest.current_phase === "bridge_jump") {
            let stage = "3. Daredevil Canyon";
            if (user.trinket_name === "Magmatic Crystal Charm") {
                message.stage += " - Magmatic Crystal";
            } else if (user.trinket_name === "Black Powder Charm") {
                stage += " - Black Powder";
            } else if (user.trinket_name === "Dusty Coal Charm") {
                stage += "  - Dusty Coal";
            } else {
                stage += " - No Fuelers";
            }
            message.stage = stage;
        }
    }
}

/**
 * Add the pest indication
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addForewordFarmStage(message, user, user_post, hunt) {
    const quest = user.quests.QuestForewordFarm;
    if (quest && quest.mice_state && typeof quest.mice_state === "string") {
        message.stage = quest.mice_state.split('_').map(word => word[0].toUpperCase() + word.substring(1)).join(' ');
    }
}

/**
 * Report the progress through the night
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addFortRoxStage(message, user, user_post, hunt) {
    const quest = user.quests.QuestFortRox;
    if (quest.is_lair) {
        message.stage = "Heart of the Meteor";
    } else if (quest.is_dawn) {
        message.stage = "Dawn";
    } else if (quest.is_day) {
        message.stage = "Day";
    } else if (quest.is_night) {
        message.stage = (({
            "stage_one":   "Twilight",
            "stage_two":   "Midnight",
            "stage_three": "Pitch",
            "stage_four":  "Utter Darkness",
            "stage_five":  "First Light",
        })[quest.current_stage]);
    }

    if (!message.stage) {
        message.location = null;
    }
}

/**
 * Report the current chamber name.
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addBristleWoodsRiftStage(message, user, user_post, hunt) {
    message.stage = user.quests.QuestRiftBristleWoods.chamber_name;
    if (message.stage === "Rift Acolyte Tower") {
        message.stage = "Entrance";
    }
}


/**
 * Report the state of corks and eruptions
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addQuesoGeyserStage(message, user, user_post, hunt) {
    const state = user.quests.QuestQuesoGeyser.state;
    if (state === "collecting" || state === "claim") {
        message.stage = "Cork Collecting";
    } else if (state === "corked") {
        message.stage = "Pressure Building";
    } else if (state === "eruption") {
    // Tiny/Small/Medium/Large/Epic Eruption
        message.stage = user.quests.QuestQuesoGeyser.state_name;
    }
}

/**
 * Report tower stage: Outside, Eclipse, Floors 1-7, 9-15, 17-23, 25-31+, Umbra
 * @param {Object <string, any>} message The message to be sent.
 * @param {Object <string, any>} user The user state object, when the hunt was invoked (pre-hunt).
 * @param {Object <string, any>} user_post The user state object, after the hunt.
 * @param {Object <string, any>} hunt The journal entry corresponding to the active hunt.
 */
export function addValourRiftStage(message, user, user_post, hunt) {
    const attrs = user.environment_atts || user.enviroment_atts;
    switch (attrs.state) {
        case "tower": {
            const {floor} = attrs;
            let stageName;

            if (floor >= 1 && floor % 8 === 0) {
                stageName = "Eclipse";
            } else if (floor >= 1 && floor <= 7) {
                stageName = "Floors 1-7";
            } else if (floor >= 9 && floor <= 15) {
                stageName = "Floors 9-15";
            } else if (floor >= 17 && floor <= 23) {
                stageName = "Floors 17-23";
            } else if (floor >= 25) {
                stageName = "Floors 25-31+";
            }

            if (attrs.active_augmentations.tu) {
                stageName = "UU " + stageName;
            }

            message.stage = stageName;
            break;
        }
        case "farming":
            message.stage = "Outside";
            break;
        default:
            message.location = null;
            break;
    }
}

export function addFloatingIslandsStage(message, user, user_post, hunt) {
    const envAttributes = user.environment_atts || user.enviroment_atts;
    const pirates = ["No Pirates", "Pirates x1", "Pirates x2", "Pirates x3", "Pirates x4"];
    const hsa = envAttributes.hunting_site_atts;
    message.stage = hsa.island_name;

    if (hsa.is_enemy_encounter) {
        if (hsa.is_low_tier_island)
            message.stage = "Warden";
        else if (hsa.is_high_tier_island)
            message.stage += " Paragon";
        else if (hsa.is_vault_island)
            message.stage = "Empress";
        else
            message.stage += " Enemy Encounter";
    }
    else if (user.bait_name === "Sky Pirate Swiss Cheese") {
        message.stage = hsa.is_vault_island ? "Vault " : "Island ";
        message.stage += pirates[hsa.activated_island_mod_types.filter(item => item === "sky_pirates").length];
    }
    else if (((user.bait_name === "Extra Rich Cloud Cheesecake") || (user.bait_name === "Cloud Cheesecake")) &&
            (hsa.activated_island_mod_types.filter(item => item === "loot_cache").length >= 2)) {
        message.stage += ` - Loot x${hsa.activated_island_mod_types.filter(item => item === "loot_cache").length}`;
    }
    // This is a new if situation to account for the above scenarios. It adds to them.
    else if (hsa.is_vault_island
    && 'activated_island_mod_types' in hsa
    && Array.isArray(hsa.activated_island_mod_types)) {
    //NOTE: There is a paperdoll attribute that may be quicker to use
        const panels = {};
        hsa.activated_island_mod_types.forEach(t => t in panels ? panels[t]++ : panels[t] = 1);
        let counter = 0;
        let mod_type = '';
        for (const [type, num] of Object.entries(panels)) {
            if (num >= 3) {
                counter = num;
                mod_type = hsa.island_mod_panels.filter(p => p.type === type)[0].name;
            }
        }
        if (counter && mod_type)
            message.stage += ` ${counter}x ${mod_type}`;
    }
}
