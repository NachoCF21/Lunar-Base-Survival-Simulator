/* =========================================================================
   SAMPLE RARITY, SUBSYSTEM DRAWBACKS, BASE MISSIONS & SPACE ALERTS DATA
   ========================================================================= */
const SAMPLE_TYPES = {
  "rock": {
    "emoji": "🪨",
    "name": "Moon Rock",
    "scienceGain": 4
  },
  "water": {
    "emoji": "🧊",
    "name": "Water Ice",
    "scienceGain": 6
  },
  "helium": {
    "emoji": "💎",
    "name": "Helium-3 Crystal",
    "scienceGain": 9
  }
};

const DRAWBACK_DEFS = {
  "solarDamaged": {
    "id": "solarDamaged",
    "label": "☀️ DAMAGED SOLAR PANELS (0% Daytime Charge & -4% Battery/Day — Repair on a Solar/Power Mission!)"
  },
  "airlockLeak": {
    "id": "airlockLeak",
    "label": "🚪 BREACHED AIRLOCK SEAL (-6% Extra Air/Day — Repair Airlock, Doors, or Hull!)"
  },
  "shieldDegraded": {
    "id": "shieldDegraded",
    "label": "🧲 CRIPPLED MAGNETIC COILS (-6% Extra Shield/Day — Recalibrate Shields!)"
  },
  "coolantCracked": {
    "id": "coolantCracked",
    "label": "🌡️ RUPTURED COOLING LOOP (-6% Battery & -3% Hull/Day — Repair Cooling or 3D Print Pipes!)"
  },
  "hullMicrofracture": {
    "id": "hullMicrofracture",
    "label": "🧱 HULL MICRO-FRACTURES (-5% Hull & -3% Air/Day — Reinforce Hull or Rover/Armor!)"
  }
};

/* =========================================================================
   32 ARTEMIS IV BASE MISSIONS (LEFT PANEL)
   ========================================================================= */
const BASE_MISSIONS_BANK = [
  {
    "emoji": "☀️",
    "area": "Artemis Solar Panels",
    "desc": "Sticky moon dust (Regolith) is covering our solar panels and lowering our power.",
    "opt1": {
      "title": "Tilt the panels down and brush off the dust with a dry anti-static brush",
      "effects": {
        "battery": 10,
        "hull": 4
      },
      "sample": null,
      "clearDrawback": "solarDamaged",
      "failed": false,
      "resultText": "✅ Solar panels cleaned and repaired! Battery +10%, Hull +4%."
    },
    "opt2": {
      "title": "Spray the panels with water to wash the moon dust off quickly",
      "effects": {
        "battery": -30,
        "hull": -20
      },
      "sample": null,
      "addDrawback": "solarDamaged",
      "failed": true,
      "resultText": "❌ CRITICAL FAILURE! Water froze instantly in vacuum and shattered the solar cells! Battery -30%, Hull -20%."
    }
  },
  {
    "emoji": "🫁",
    "area": "Habitat Air Filters",
    "desc": "Sharp gray Regolith dust is clogging the main oxygen air filter.",
    "opt1": {
      "title": "Ignore the CO2 alarm and go outside to dig up a Water Ice core",
      "effects": {
        "air": -28,
        "hull": -10
      },
      "sample": null,
      "addDrawback": "airlockLeak",
      "failed": true,
      "resultText": "❌ CRITICAL FAILURE! CO2 spiked and dust jammed the Airlock seal! Air -28%, Hull -10%."
    },
    "opt2": {
      "title": "Put in a fresh air filter and seal the dusty canister safely",
      "effects": {
        "air": 11,
        "shield": 4
      },
      "sample": null,
      "failed": false,
      "resultText": "✅ Clean cabin air restored! Air +11%, Shield +4%."
    }
  },
  {
    "emoji": "🧊",
    "area": "South Pole Dark Crater",
    "desc": "Our scanners spot ancient Water Ice inside a steep, pitch-black crater.",
    "opt1": {
      "title": "Lower a robotic drill on a cable into the crater while monitoring cabin air",
      "effects": {
        "air": 5,
        "battery": -4
      },
      "sample": "water",
      "failed": false,
      "resultText": "✅ Safe robot drill! +1 Water Ice (+6% Science), Air +5%, Battery -4%."
    },
    "opt2": {
      "title": "Drive the astronaut rover straight down the steep, icy crater wall",
      "effects": {
        "hull": -32,
        "battery": -22
      },
      "sample": null,
      "addDrawback": "hullMicrofracture",
      "failed": true,
      "resultText": "❌ CRASH! The rover slid on hidden ice and cracked the habitat dock! Hull -32%, Battery -22%."
    }
  },
  {
    "emoji": "🌱",
    "area": "Hydroponic Space Garden",
    "desc": "Our Hydroponic plants make fresh oxygen for the crew, and one tray is ready to harvest.",
    "opt1": {
      "title": "Feed the plants nutrients and log a lunar soil mineral sample",
      "effects": {
        "air": 9
      },
      "sample": "rock",
      "failed": false,
      "resultText": "✅ Plants thriving & sample logged! Air +9%, +1 Moon Rock (+4% Science)."
    },
    "opt2": {
      "title": "Vent greenhouse humidity straight outside to harvest faster",
      "effects": {
        "air": -26,
        "battery": -14
      },
      "sample": null,
      "addDrawback": "airlockLeak",
      "failed": true,
      "resultText": "❌ FAILED! Venting froze the greenhouse valve open and froze the crops! Air -26%, Battery -14%."
    }
  },
  {
    "emoji": "🛡️",
    "area": "Water Wall Radiation Shield",
    "desc": "Water bags inside the base walls block dangerous space radiation from reaching the crew.",
    "opt1": {
      "title": "Drain the radiation wall tanks to cool an overclocked Helium-3 drill",
      "effects": {
        "shield": -30,
        "hull": -16
      },
      "sample": null,
      "addDrawback": "shieldDegraded",
      "failed": true,
      "resultText": "❌ CRITICAL FAILURE! Radiation flooded the habitat and boiled the drill! Shield -30%, Hull -16%."
    },
    "opt2": {
      "title": "Refill the water wall bags and recalibrate the magnetic shield coils",
      "effects": {
        "shield": 11,
        "air": 4
      },
      "sample": null,
      "clearDrawback": "shieldDegraded",
      "failed": false,
      "resultText": "✅ Radiation wall reinforced! Shield +11%, Air +4%."
    }
  },
  {
    "emoji": "🚗",
    "area": "Artemis Moon Rover",
    "desc": "The electric Moon rover is parked outside and ready for a South Pole trip.",
    "opt1": {
      "title": "Drive carefully along the sunny ridge to collect Moon Rocks and inspect hull plates",
      "effects": {
        "hull": 6,
        "battery": -4
      },
      "sample": "rock",
      "clearDrawback": "hullMicrofracture",
      "failed": false,
      "resultText": "✅ Smooth rover trip! +1 Moon Rock (+4% Science), Hull +6%, Battery -4%."
    },
    "opt2": {
      "title": "Push the rover to max speed across sharp boulder fields without radar",
      "effects": {
        "hull": -28,
        "battery": -20
      },
      "sample": null,
      "addDrawback": "hullMicrofracture",
      "failed": true,
      "resultText": "❌ WRECKED! Razor-sharp boulders tore the rover and habitat airlock bay! Hull -28%, Battery -20%."
    }
  },
  {
    "emoji": "👩‍🚀",
    "area": "Artemis Spacesuits",
    "desc": "Our spacesuit helmet seals and oxygen tanks need a check before walking outside.",
    "opt1": {
      "title": "Skip the seal check and run outside quickly to grab a Helium-3 crystal",
      "effects": {
        "air": -32,
        "hull": -18
      },
      "sample": null,
      "addDrawback": "airlockLeak",
      "failed": true,
      "resultText": "❌ EMERGENCY! Dust jammed the Airlock door open and ruptured suit seals! Air -32%, Hull -18%."
    },
    "opt2": {
      "title": "Wipe dust off the suit seals and top off the oxygen tanks",
      "effects": {
        "air": 10,
        "shield": 4
      },
      "sample": null,
      "failed": false,
      "resultText": "✅ Spacesuits certified safe! Air +10%, Shield +4%."
    }
  },
  {
    "emoji": "🔋",
    "area": "Main Battery Bank",
    "desc": "Keeping our main batteries balanced stores power for the freezing 14-day Lunar Night.",
    "opt1": {
      "title": "Balance the battery cells and repair damaged solar power lines",
      "effects": {
        "battery": 12,
        "hull": 3
      },
      "sample": null,
      "clearDrawback": "solarDamaged",
      "failed": false,
      "resultText": "✅ Power grid balanced & repaired! Battery +12%, Hull +3%."
    },
    "opt2": {
      "title": "Heat a small batch of moon dust to collect Helium-3 gas while saving air",
      "effects": {
        "air": 4,
        "battery": -5
      },
      "sample": "helium",
      "failed": false,
      "resultText": "✅ Extracted 1 Helium-3 Crystal (+9% Science), Air +4%, Battery -5%."
    }
  },
  {
    "emoji": "🛠️",
    "area": "Base Hull & Airlock Door",
    "desc": "The outer walls and the Airlock pressure door need a safety inspection.",
    "opt1": {
      "title": "Prop the outer Airlock door open while gathering rocks right outside",
      "effects": {
        "air": -30,
        "shield": -16
      },
      "sample": null,
      "addDrawback": "airlockLeak",
      "failed": true,
      "resultText": "❌ DECOMPRESSION! Cabin air vented into space and warped the hatch! Air -30%, Shield -16%."
    },
    "opt2": {
      "title": "Reseal the Airlock rubber rings and weld hull micro-fractures",
      "effects": {
        "hull": 11,
        "air": 5
      },
      "sample": null,
      "clearDrawback": "airlockLeak",
      "failed": false,
      "resultText": "✅ Airlock and hull sealed tight! Hull +11%, Air +5%."
    }
  },
  {
    "emoji": "🤖",
    "area": "Lunar Gateway Robot Arm",
    "desc": "The outside robot arm needs space-grade oil on its joints before lifting heavy gear.",
    "opt1": {
      "title": "Use the lubricated robot arm to extract a Helium-3 crystal and inspect the hull",
      "effects": {
        "hull": 4,
        "battery": -5
      },
      "sample": "helium",
      "failed": false,
      "resultText": "✅ Precision grab! +1 Helium-3 Crystal (+9% Science), Hull +4%, Battery -5%."
    },
    "opt2": {
      "title": "Force the unlubricated arm to lift a 4-ton reactor module at full torque",
      "effects": {
        "hull": -28,
        "battery": -18
      },
      "sample": null,
      "addDrawback": "coolantCracked",
      "failed": true,
      "resultText": "❌ FAILED! The seized arm slammed the module into the cooling manifold! Hull -28%, Battery -18%."
    }
  },
  {
    "emoji": "📡",
    "area": "Orion & Gateway Radio Dish",
    "desc": "Pointing our dish at Lunar Gateway keeps our NASA connection strong.",
    "opt1": {
      "title": "Run ground radar to map buried Water Ice while recharging shield sensors",
      "effects": {
        "shield": 4,
        "battery": -4
      },
      "sample": "water",
      "failed": false,
      "resultText": "✅ Mapped 1 Water Ice deposit (+6% Science), Shield +4%, Battery -4%."
    },
    "opt2": {
      "title": "Switch the radio dish to eco-mode to save power and boost shielding",
      "effects": {
        "battery": 10,
        "shield": 4
      },
      "sample": null,
      "failed": false,
      "resultText": "✅ Strong Gateway signal! Battery +10%, Shield +4%."
    }
  },
  {
    "emoji": "💧",
    "area": "Water Recycling System",
    "desc": "NASA recycles 98% of base water! Today the water purifier filter needs a clean.",
    "opt1": {
      "title": "Clean the water filters and save a pure lunar ice sample for Orion",
      "effects": {
        "air": 7
      },
      "sample": "water",
      "failed": false,
      "resultText": "✅ Clean water & oxygen! Air +7%, +1 Water Ice (+6% Science)."
    },
    "opt2": {
      "title": "Bypass the chemical purifier to pump raw graywater straight into electrolyzers",
      "effects": {
        "air": -26,
        "battery": -22
      },
      "sample": null,
      "addDrawback": "coolantCracked",
      "failed": true,
      "resultText": "❌ SYSTEM FOULED! Mineral buildup shorted the oxygen and cooling pumps! Air -26%, Battery -22%."
    }
  },
  {
    "emoji": "🧲",
    "area": "Magnetic Dust Sweeper",
    "desc": "Moon dust (Regolith) has tiny bits of iron that our magnets can pick up.",
    "opt1": {
      "title": "Sweep iron dust to patch hull micro-fractures and log a Moon Rock sample",
      "effects": {
        "hull": 8
      },
      "sample": "rock",
      "clearDrawback": "hullMicrofracture",
      "failed": false,
      "resultText": "✅ Hull patched & rock logged! Hull +8%, +1 Moon Rock (+4% Science)."
    },
    "opt2": {
      "title": "Melt collected iron dust into thick armor plates for the base roof",
      "effects": {
        "hull": 10,
        "shield": 4
      },
      "sample": null,
      "clearDrawback": "hullMicrofracture",
      "failed": false,
      "resultText": "✅ Roof armor strengthened! Hull +10%, Shield +4%."
    }
  },
  {
    "emoji": "🚲",
    "area": "Astronaut Exercise Bike",
    "desc": "Daily exercise keeps astronauts strong in low Moon gravity and charges backup cells.",
    "opt1": {
      "title": "Skip exercise today to catalog Moon Rocks in the lab (uses extra air)",
      "effects": {
        "hull": 5,
        "air": -4
      },
      "sample": "rock",
      "failed": false,
      "resultText": "✅ Cataloged 1 Moon Rock (+4% Science), Hull +5%, Air -4%."
    },
    "opt2": {
      "title": "Complete a steady crew workout and store pedal power in the batteries",
      "effects": {
        "battery": 10,
        "air": 4
      },
      "sample": null,
      "failed": false,
      "resultText": "✅ Crew fit & batteries charged! Battery +10%, Air +4%."
    }
  },
  {
    "emoji": "🔭",
    "area": "Cupola Observation Dome",
    "desc": "From the Cupola dome window, we can watch space weather and nearby craters.",
    "opt1": {
      "title": "Tune our magnetic radiation shields using sky data and log a Moon Rock",
      "effects": {
        "shield": 8
      },
      "sample": "rock",
      "clearDrawback": "shieldDegraded",
      "failed": false,
      "resultText": "✅ Shields tuned & rock logged! Shield +8%, +1 Moon Rock (+4% Science)."
    },
    "opt2": {
      "title": "Use the robot scoop to grab a Helium-3 crystal while checking air seals",
      "effects": {
        "air": 4,
        "battery": -5
      },
      "sample": "helium",
      "failed": false,
      "resultText": "✅ Found 1 Helium-3 Crystal (+9% Science), Air +4%, Battery -5%."
    }
  },
  {
    "emoji": "🧱",
    "area": "3D Moon-Dust Printer",
    "desc": "Our 3D printer melts moon dust with focused sunlight to make spare parts.",
    "opt1": {
      "title": "Print a sealed sample box and fill it with Moon Rocks while saving air",
      "effects": {
        "air": 4,
        "battery": -3
      },
      "sample": "rock",
      "failed": false,
      "resultText": "✅ Stored 1 Moon Rock (+4% Science), Air +4%, Battery -3%."
    },
    "opt2": {
      "title": "Print strong roof tiles and patch cracked cooling pipes",
      "effects": {
        "hull": 10,
        "battery": 4
      },
      "sample": null,
      "clearDrawback": "coolantCracked",
      "failed": false,
      "resultText": "✅ Roof tiles & pipes repaired! Hull +10%, Battery +4%."
    }
  },
  {
    "emoji": "🕯️",
    "area": "Lunar Oxygen Maker",
    "desc": "Electrolysis uses electricity to split lunar ice into breathable oxygen.",
    "opt1": {
      "title": "Turn off safety pressure valves to make oxygen twice as fast",
      "effects": {
        "hull": -30,
        "air": -26
      },
      "sample": null,
      "addDrawback": "hullMicrofracture",
      "failed": true,
      "resultText": "❌ EXPLOSION! Overpressure ruptured the oxygen tank and cracked the hull! Hull -30%, Air -26%."
    },
    "opt2": {
      "title": "Run the oxygen maker at safe, steady speed",
      "effects": {
        "air": 12,
        "battery": -3
      },
      "sample": null,
      "failed": false,
      "resultText": "✅ Oxygen tanks refilled safely! Air +12%, Battery -3%."
    }
  },
  {
    "emoji": "🛸",
    "area": "Hopping Recon Drone",
    "desc": "Our small thruster drone can hop over steep craters to explore.",
    "opt1": {
      "title": "Fly the drone low into a shaded cave to scoop up Water Ice and check shields",
      "effects": {
        "shield": 4,
        "battery": -4
      },
      "sample": "water",
      "failed": false,
      "resultText": "✅ Drone returned safely! +1 Water Ice (+6% Science), Shield +4%, Battery -4%."
    },
    "opt2": {
      "title": "Fly the drone at full thrust right over the habitat roof and solar array",
      "effects": {
        "hull": -26,
        "battery": -22
      },
      "sample": null,
      "addDrawback": "solarDamaged",
      "failed": true,
      "resultText": "❌ CRASH! Exhaust blast sandblasted the solar panels and dented the roof! Hull -26%, Battery -22%."
    }
  },
  {
    "emoji": "🌡️",
    "area": "Base Cooling Pipes",
    "desc": "Liquid cooling pipes keep the base from getting too hot or too cold.",
    "opt1": {
      "title": "Use warm pipe heat to melt a frozen Water Ice core while saving cabin air",
      "effects": {
        "air": 4,
        "battery": -3
      },
      "sample": "water",
      "failed": false,
      "resultText": "✅ Collected 1 Water Ice (+6% Science), Air +4%, Battery -3%."
    },
    "opt2": {
      "title": "Fix pipe pressure and seal any cracked cooling lines",
      "effects": {
        "battery": 10,
        "hull": 4
      },
      "sample": null,
      "clearDrawback": "coolantCracked",
      "failed": false,
      "resultText": "✅ Cooling pipes fixed! Battery +10%, Hull +4%."
    }
  },
  {
    "emoji": "🧹",
    "area": "Airlock Dust Cleaner",
    "desc": "Moon dust sticking inside the Airlock wears out the rubber door seals.",
    "opt1": {
      "title": "Run the static dust cleaner and wipe the Airlock door seals",
      "effects": {
        "air": 8,
        "hull": 6
      },
      "sample": null,
      "clearDrawback": "airlockLeak",
      "failed": false,
      "resultText": "✅ Airlock clean and sealed! Air +8%, Hull +6%."
    },
    "opt2": {
      "title": "Sift the collected dust for rare Moon Rock grains while checking shields",
      "effects": {
        "shield": 4,
        "air": -3
      },
      "sample": "rock",
      "failed": false,
      "resultText": "✅ Collected 1 Moon Rock (+4% Science), Shield +4%, Air -3%."
    }
  },
  {
    "emoji": "🧭",
    "area": "Magnetic Shield Coils",
    "desc": "Our magnetic coils push harmful solar particles away from the base.",
    "opt1": {
      "title": "Divert all shield coil power into a deep subsurface drill",
      "effects": {
        "shield": -32,
        "battery": -18
      },
      "sample": null,
      "addDrawback": "shieldDegraded",
      "failed": true,
      "resultText": "❌ COIL BURNOUT! The magnetic field collapsed and overloaded the power bus! Shield -32%, Battery -18%."
    },
    "opt2": {
      "title": "Tune and recharge the magnetic shield coils",
      "effects": {
        "shield": 12,
        "battery": -3
      },
      "sample": null,
      "clearDrawback": "shieldDegraded",
      "failed": false,
      "resultText": "✅ Shield coils at full power! Shield +12%, Battery -3%."
    }
  },
  {
    "emoji": "🧪",
    "area": "Orion Sample Lab",
    "desc": "Warming moon dust in our lab oven releases both oxygen and Helium-3 gas!",
    "opt1": {
      "title": "Trap a pure Helium-3 crystal for Orion and reinforce the lab wall",
      "effects": {
        "hull": 4,
        "battery": -5
      },
      "sample": "helium",
      "failed": false,
      "resultText": "✅ Stored 1 Helium-3 Crystal (+9% Science), Hull +4%, Battery -5%."
    },
    "opt2": {
      "title": "Bake moon dust to release fresh breathable oxygen for the crew",
      "effects": {
        "air": 11,
        "battery": 3
      },
      "sample": null,
      "failed": false,
      "resultText": "✅ Fresh oxygen extracted! Air +11%, Battery +3%."
    }
  },
  {
    "emoji": "🚪",
    "area": "Habitat Safety Doors",
    "desc": "Checking our inner pressure doors stops slow air leaks into space.",
    "opt1": {
      "title": "Override the double-door interlock to haul Moon Rocks faster",
      "effects": {
        "air": -28,
        "hull": -16
      },
      "sample": null,
      "addDrawback": "airlockLeak",
      "failed": true,
      "resultText": "❌ BLOWOUT! Both airlock doors opened together and blew out cabin atmosphere! Air -28%, Hull -16%."
    },
    "opt2": {
      "title": "Oil the door hinges and seal all Airlock pressure valves",
      "effects": {
        "air": 8,
        "hull": 6
      },
      "sample": null,
      "clearDrawback": "airlockLeak",
      "failed": false,
      "resultText": "✅ Zero air leaks! Air +8%, Hull +6%."
    }
  },
  {
    "emoji": "💎",
    "area": "Helium-3 Boulder Field",
    "desc": "Scanners found a rich pocket of Helium-3 crystals near a field of sharp rocks.",
    "opt1": {
      "title": "Use mining explosives to blast the big boulder open fast",
      "effects": {
        "hull": -34,
        "shield": -20
      },
      "sample": null,
      "addDrawback": "hullMicrofracture",
      "failed": true,
      "resultText": "❌ CATASTROPHE! Shrapnel tore through the habitat walls in the airless vacuum! Hull -34%, Shield -20%."
    },
    "opt2": {
      "title": "Use the slow, careful robot drill to pull out a Helium-3 crystal",
      "effects": {
        "shield": 3,
        "battery": -5
      },
      "sample": "helium",
      "failed": false,
      "resultText": "✅ Careful drill worked! +1 Helium-3 Crystal (+9% Science), Shield +3%, Battery -5%."
    }
  },
  {
    "emoji": "🪴",
    "area": "Artemis Botany Dome",
    "desc": "Dwarf wheat and radish leaves make clean water drops and fresh oxygen.",
    "opt1": {
      "title": "Collect clean lunar water drops for science while freshening cabin air",
      "effects": {
        "air": 6
      },
      "sample": "water",
      "failed": false,
      "resultText": "✅ Fresh air & sample! Air +6%, +1 Water Ice (+6% Science)."
    },
    "opt2": {
      "title": "Send extra plant oxygen into the crew sleeping quarters",
      "effects": {
        "air": 10,
        "battery": 3
      },
      "sample": null,
      "failed": false,
      "resultText": "✅ Fresh oxygen circulating! Air +10%, Battery +3%."
    }
  },
  {
    "emoji": "⚡",
    "area": "South Pole Sunlight Mirrors",
    "desc": "Lightweight mirrors bounce low polar sunlight onto our solar panels.",
    "opt1": {
      "title": "Focus all mirrors onto the fuel depot to melt Water Ice faster",
      "effects": {
        "battery": -28,
        "hull": -22
      },
      "sample": null,
      "addDrawback": "solarDamaged",
      "failed": true,
      "resultText": "❌ MELTDOWN! Concentrated solar heat melted power cables and scorched the hull! Battery -28%, Hull -22%."
    },
    "opt2": {
      "title": "Aim all mirrors straight at the solar panels to charge batteries",
      "effects": {
        "battery": 12,
        "shield": 3
      },
      "sample": null,
      "clearDrawback": "solarDamaged",
      "failed": false,
      "resultText": "✅ Solar power boosted! Battery +12%, Shield +3%."
    }
  },
  {
    "emoji": "🏥",
    "area": "Crew Radiation Checkup",
    "desc": "The crew checks their NASA radiation badges and rests behind thick water walls.",
    "opt1": {
      "title": "Rest in the shielded bunks and reinforce the water wall",
      "effects": {
        "air": 6,
        "shield": 8
      },
      "sample": null,
      "failed": false,
      "resultText": "✅ Crew rested & shielded! Air +6%, Shield +8%."
    },
    "opt2": {
      "title": "Work in the unshielded lab to sort Moon Rocks and check hull sensors",
      "effects": {
        "hull": 5,
        "shield": -5
      },
      "sample": "rock",
      "failed": false,
      "resultText": "✅ Sorted 1 Moon Rock (+4% Science), Hull +5%, Shield -5%."
    }
  },
  {
    "emoji": "🔦",
    "area": "Crater Rim Winch",
    "desc": "Bright spotlights show shiny crystals inside a narrow crack in the lunar ground.",
    "opt1": {
      "title": "Lower the robot winch to grab a Helium-3 crystal and check air valves",
      "effects": {
        "air": 3,
        "battery": -5
      },
      "sample": "helium",
      "failed": false,
      "resultText": "✅ Winch grabbed 1 Helium-3 Crystal (+9% Science), Air +3%, Battery -5%."
    },
    "opt2": {
      "title": "Use the bright spotlights to inspect and tighten outer hull bolts",
      "effects": {
        "hull": 10,
        "battery": 4
      },
      "sample": null,
      "clearDrawback": "hullMicrofracture",
      "failed": false,
      "resultText": "✅ Outer hull tightened! Hull +10%, Battery +4%."
    }
  },
  {
    "emoji": "📦",
    "area": "Orion Cargo Storage",
    "desc": "Stacking water and food boxes along the walls helps block space radiation.",
    "opt1": {
      "title": "Pack the sample vault and log a Moon Rock core with zero power loss",
      "effects": {
        "hull": 5
      },
      "sample": "rock",
      "failed": false,
      "resultText": "✅ Vault organized! Hull +5%, +1 Moon Rock (+4% Science)."
    },
    "opt2": {
      "title": "Stack heavy water packs against the crew sleeping walls",
      "effects": {
        "shield": 10,
        "air": 4
      },
      "sample": null,
      "failed": false,
      "resultText": "✅ Extra radiation shielding stacked! Shield +10%, Air +4%."
    }
  },
  {
    "emoji": "🛰️",
    "area": "Lunar Gateway Software Update",
    "desc": "NASA Mission Control beams up a new energy-saving computer update.",
    "opt1": {
      "title": "Install the verified power and air saver update on the base computers",
      "effects": {
        "air": 6,
        "battery": 8
      },
      "sample": null,
      "failed": false,
      "resultText": "✅ Software updated! Air +6%, Battery +8%."
    },
    "opt2": {
      "title": "Force-install an unverified beta patch while thermal controls are running",
      "effects": {
        "battery": -28,
        "air": -18
      },
      "sample": null,
      "addDrawback": "coolantCracked",
      "failed": true,
      "resultText": "❌ SYSTEM CRASH! Thermal loops rebooted mid-cycle and ruptured a pipe! Battery -28%, Air -18%."
    }
  },
  {
    "emoji": "🔧",
    "area": "Artemis IV Systems Checkup",
    "desc": "A full base checkup keeps all four survival systems balanced and healthy.",
    "opt1": {
      "title": "Top up Air and Hull strength across all habitat rooms",
      "effects": {
        "air": 9,
        "hull": 8
      },
      "sample": null,
      "failed": false,
      "resultText": "✅ Air and hull balanced! Air +9%, Hull +8%."
    },
    "opt2": {
      "title": "Top up Battery power and Radiation Shield strength",
      "effects": {
        "battery": 9,
        "shield": 8
      },
      "sample": null,
      "failed": false,
      "resultText": "✅ Power and shields balanced! Battery +9%, Shield +8%."
    }
  },
  {
    "emoji": "🏁",
    "area": "Orion Return Capsule Check",
    "desc": "Preparing our Orion return lockers keeps the crew ready to fly back to Lunar Gateway.",
    "opt1": {
      "title": "Lock a rare Helium-3 crystal into Orion's return box and check the hull",
      "effects": {
        "hull": 4,
        "battery": -5
      },
      "sample": "helium",
      "failed": false,
      "resultText": "✅ Secured 1 Helium-3 Crystal (+9% Science), Hull +4%, Battery -5%."
    },
    "opt2": {
      "title": "Run a full pre-flight check on Orion's batteries and hull",
      "effects": {
        "battery": 9,
        "hull": 8
      },
      "sample": null,
      "failed": false,
      "resultText": "✅ Return systems ready! Battery +9%, Hull +8%."
    }
  }
];

/* =========================================================================
   NASA SPACE WEATHER CARDS (RIGHT PANEL)
   ========================================================================= */
const SPACE_ALERTS_BANK = [
  {
    "category": "SOLAR_X",
    "emoji": "🌞",
    "sourceLabel": "X-CLASS SOLAR FLARE",
    "title": "Huge X-Class Solar Flare Heading Toward the Moon!",
    "desc": "A powerful X-Class Solar Flare sends intense X-rays and heat across the South Pole.",
    "opt1": {
      "label": "Open the Cupola window shutters to take close-up photos of the flare",
      "effects": {
        "shield": -34,
        "air": -20
      },
      "sample": null,
      "addDrawback": "shieldDegraded",
      "failed": true,
      "resultText": "❌ CRITICAL FAILURE! Extreme X-rays fried the shield sensors and boiled cabin air! Shield -34%, Air -20%."
    },
    "opt2": {
      "label": "Close the armored window shutters and turn on storm shields",
      "effects": {
        "shield": 7,
        "hull": 4
      },
      "sample": null,
      "failed": false,
      "resultText": "✅ Shutters and shields held strong! Shield +7%, Hull +4%."
    }
  },
  {
    "category": "SOLAR_X",
    "emoji": "⚡",
    "sourceLabel": "X-CLASS POWER SURGE",
    "title": "X-Class Solar Flare Causes a Power Spike!",
    "desc": "Extra energy from an X-Class Solar Flare overloads the solar panel wires.",
    "opt1": {
      "label": "Fold the solar panels back and switch on the safety breaker",
      "effects": {
        "hull": 6,
        "battery": -3
      },
      "sample": null,
      "failed": false,
      "resultText": "✅ Solar panels saved from the surge! Hull +6%, Battery -3%."
    },
    "opt2": {
      "label": "Turn off the safety breaker to force extra power into the batteries",
      "effects": {
        "battery": -36,
        "hull": -20
      },
      "sample": null,
      "addDrawback": "solarDamaged",
      "failed": true,
      "resultText": "❌ GRID MELTDOWN! The surge blew the main battery bank and melted the solar array! Battery -36%, Hull -20%."
    }
  },
  {
    "category": "SOLAR_X",
    "emoji": "🔥",
    "sourceLabel": "X-CLASS HEAT WAVE",
    "title": "Outside Walls Heating Up From X-Class Flare!",
    "desc": "Strong radiation from an X-Class Solar Flare warms the outside of our habitat.",
    "opt1": {
      "label": "Turn off the cooling pumps to save battery power",
      "effects": {
        "battery": -28,
        "hull": -26
      },
      "sample": null,
      "addDrawback": "coolantCracked",
      "failed": true,
      "resultText": "❌ THERMAL RUPTURE! Superheated fluid burst the cooling pipes and warped the hull! Battery -28%, Hull -26%."
    },
    "opt2": {
      "label": "Open the heat vents and circulate cooling fluid through the walls",
      "effects": {
        "air": 6,
        "hull": 5
      },
      "sample": null,
      "failed": false,
      "resultText": "✅ Base cooled safely! Air +6%, Hull +5%."
    }
  },
  {
    "category": "SOLAR_M",
    "emoji": "☀️",
    "sourceLabel": "M-CLASS SOLAR FLARE",
    "title": "Medium M-Class Solar Flare & Static Moon Dust!",
    "desc": "An M-Class Solar Flare adds static electricity to the dust around our panels.",
    "opt1": {
      "label": "Scan the solar wave with our lab sensor and collect a Moon Rock",
      "effects": {
        "shield": 4,
        "battery": -3
      },
      "sample": "rock",
      "failed": false,
      "resultText": "✅ Solar data saved! +1 Moon Rock (+4% Science), Shield +4%, Battery -3%."
    },
    "opt2": {
      "label": "Send an astronaut out in a dry suit to wipe charged static dust by hand",
      "effects": {
        "battery": -26,
        "shield": -22
      },
      "sample": null,
      "addDrawback": "solarDamaged",
      "failed": true,
      "resultText": "❌ ARC DISCHARGE! Static lightning shorted the suit and burned out the solar bus! Battery -26%, Shield -22%."
    }
  },
  {
    "category": "SOLAR_M",
    "emoji": "📡",
    "sourceLabel": "M-CLASS RADIO STATIC",
    "title": "M-Class Solar Flare Adds Radio Static!",
    "desc": "Hot Solar Plasma from an M-Class flare makes our Lunar Gateway radio crackle.",
    "opt1": {
      "label": "Switch to our low-power backup antenna to keep the signal clear",
      "effects": {
        "battery": 6,
        "hull": 3
      },
      "sample": null,
      "failed": false,
      "resultText": "✅ Gateway link clear! Battery +6%, Hull +3%."
    },
    "opt2": {
      "label": "Save incoming radar maps and log a Moon Rock sample",
      "effects": {
        "air": 3,
        "battery": -3
      },
      "sample": "rock",
      "failed": false,
      "resultText": "✅ Radar maps saved! +1 Moon Rock (+4% Science), Air +3%, Battery -3%."
    }
  },
  {
    "category": "SOLAR_M",
    "emoji": "🔆",
    "sourceLabel": "M-CLASS SUN GLARE",
    "title": "Bright Glare From an M-Class Solar Flare!",
    "desc": "X-rays from an M-Class flare briefly dazzle our sun-tracking sensors.",
    "opt1": {
      "label": "Check magnetic shield calibration during the flare",
      "effects": {
        "shield": 7,
        "hull": 3
      },
      "sample": null,
      "clearDrawback": "shieldDegraded",
      "failed": false,
      "resultText": "✅ Shields verified! Shield +7%, Hull +3%."
    },
    "opt2": {
      "label": "Disable tracker limits and point the panels directly into the flare core",
      "effects": {
        "battery": -28,
        "shield": -18
      },
      "sample": null,
      "addDrawback": "solarDamaged",
      "failed": true,
      "resultText": "❌ SENSOR BURNOUT! Direct X-ray glare fried the sun trackers and solar cells! Battery -28%, Shield -18%."
    }
  },
  {
    "category": "SOLAR_M",
    "emoji": "🔋",
    "sourceLabel": "M-CLASS WARM PULSE",
    "title": "Battery Room Warming Up Under M-Class Flare!",
    "desc": "Sensors show a mild temperature rise in the battery room.",
    "opt1": {
      "label": "Use the warm afternoon to haul a Moon Rock with the robot sled",
      "effects": {
        "hull": 3,
        "battery": -3
      },
      "sample": "rock",
      "failed": false,
      "resultText": "✅ Robot haul complete! +1 Moon Rock (+4% Science), Hull +3%, Battery -3%."
    },
    "opt2": {
      "label": "Run the cooling fans at steady eco-speed",
      "effects": {
        "battery": 6,
        "hull": 4
      },
      "sample": null,
      "failed": false,
      "resultText": "✅ Batteries cooled safely! Battery +6%, Hull +4%."
    }
  },
  {
    "category": "RADIATION",
    "emoji": "☢️",
    "sourceLabel": "SEP RADIATION STORM",
    "title": "Fast Solar Protons Racing Toward the Base!",
    "desc": "NASA RadLab measures a high radiation storm hitting the Moon.",
    "opt1": {
      "label": "Turn off the magnetic shields to save battery during the storm",
      "effects": {
        "shield": -36,
        "air": -20
      },
      "sample": null,
      "addDrawback": "shieldDegraded",
      "failed": true,
      "resultText": "❌ CATASTROPHIC EXPOSURE! Solar protons battered the unshielded base! Shield -36%, Air -20%."
    },
    "opt2": {
      "label": "Boost the magnetic shield and move the crew behind the water wall",
      "effects": {
        "shield": 10,
        "battery": -4
      },
      "sample": null,
      "failed": false,
      "resultText": "✅ Crew and base protected! Shield +10%, Battery -4%."
    }
  },
  {
    "category": "RADIATION",
    "emoji": "🚨",
    "sourceLabel": "RADLAB SHELTER ALERT",
    "title": "NASA RadLab Advises Staying Indoors!",
    "desc": "Radiation climbs rapidly; Mission Control says no spacewalks today.",
    "opt1": {
      "label": "Follow NASA advice and shelter inside the water-lined crew room",
      "effects": {
        "shield": 9,
        "air": 4
      },
      "sample": null,
      "failed": false,
      "resultText": "✅ Crew safe indoors! Shield +9%, Air +4%."
    },
    "opt2": {
      "label": "Ignore the warning and send astronauts outside to dig crystals",
      "effects": {
        "shield": -34,
        "air": -22
      },
      "sample": null,
      "addDrawback": "airlockLeak",
      "failed": true,
      "resultText": "❌ ABORTED EVA! Lethal radiation forced a panicked rush that damaged the Airlock! Shield -34%, Air -22%."
    }
  },
  {
    "category": "RADIATION",
    "emoji": "🛡️",
    "sourceLabel": "SOLAR PROTON WAVE",
    "title": "High-Energy Protons Sweeping the South Pole!",
    "desc": "Both our crew rooms and Hydroponic plants need extra protection today.",
    "opt1": {
      "label": "Send the shielded robot arm out to grab a crater Water Ice core",
      "effects": {
        "hull": 3,
        "shield": -3
      },
      "sample": "water",
      "failed": false,
      "resultText": "✅ Ice core retrieved! +1 Water Ice (+6% Science), Hull +3%, Shield -3%."
    },
    "opt2": {
      "label": "Close the storm doors and cover the greenhouse with foil blankets",
      "effects": {
        "air": 6,
        "shield": 7
      },
      "sample": null,
      "failed": false,
      "resultText": "✅ Storm shelter sealed! Air +6%, Shield +7%."
    }
  },
  {
    "category": "METEORITE",
    "emoji": "☄️",
    "sourceLabel": "CLOSE ASTEROID FLYBY",
    "title": "Near-Earth Object (NEO) Passing Close By!",
    "desc": "NASA tracks an asteroid passing near the Moon, kicking up tiny Micrometeorite dust.",
    "opt1": {
      "label": "Send an astronaut outside during the flyby to catch space dust",
      "effects": {
        "hull": -34,
        "shield": -22
      },
      "sample": null,
      "addDrawback": "hullMicrofracture",
      "failed": true,
      "resultText": "❌ IMPACT BREACH! Hypervelocity micrometeorites punctured the hull and suit! Hull -34%, Shield -22%."
    },
    "opt2": {
      "label": "Close the heavy outer armor covers and check the Airlock seals",
      "effects": {
        "hull": 8,
        "shield": 5
      },
      "sample": null,
      "clearDrawback": "airlockLeak",
      "failed": false,
      "resultText": "✅ Armor covers held strong! Hull +8%, Shield +5%."
    }
  },
  {
    "category": "METEORITE",
    "emoji": "🔭",
    "sourceLabel": "NEO RADAR TRACKING",
    "title": "Close Asteroid Tracked by Our Moon Radar!",
    "desc": "Our Cupola telescopes and Seismometer watch the asteroid pass safely by.",
    "opt1": {
      "label": "Use radar data to locate a Helium-3 crystal nearby while checking air",
      "effects": {
        "air": 3,
        "battery": -4
      },
      "sample": "helium",
      "failed": false,
      "resultText": "✅ Found 1 Helium-3 Crystal (+9% Science), Air +3%, Battery -4%."
    },
    "opt2": {
      "label": "Seal outer hatches and reinforce the roof armor plates",
      "effects": {
        "hull": 8,
        "shield": 4
      },
      "sample": null,
      "clearDrawback": "hullMicrofracture",
      "failed": false,
      "resultText": "✅ Outpost armored! Hull +8%, Shield +4%."
    }
  },
  {
    "category": "NOMINAL",
    "emoji": "🛰️",
    "sourceLabel": "CALM SPACE WEATHER",
    "title": "Quiet Sun Today — Routine Sensor Checkup",
    "desc": "NASA logs show calm solar weather, low radiation, and no close asteroids.",
    "opt1": {
      "label": "Use the calm day to run a surface Moon Rock survey and charge cells",
      "effects": {
        "battery": 4
      },
      "sample": "rock",
      "failed": false,
      "resultText": "✅ Quiet-day survey complete! +1 Moon Rock (+4% Science), Battery +4%."
    },
    "opt2": {
      "label": "Tune the RadLab sensors and recharge the magnetic shield coils",
      "effects": {
        "shield": 8,
        "battery": 3
      },
      "sample": null,
      "clearDrawback": "shieldDegraded",
      "failed": false,
      "resultText": "✅ Shields tuned in calm weather! Shield +8%, Battery +3%."
    }
  },
  {
    "category": "NOMINAL",
    "emoji": "🌌",
    "sourceLabel": "CALM SPACE WEATHER",
    "title": "Clear Space Weather — Maintenance Window",
    "desc": "Zero space storms in today's NASA log! Great time for base care or ice sampling.",
    "opt1": {
      "label": "Check Airlock seals and balance cabin oxygen levels",
      "effects": {
        "air": 7,
        "hull": 4
      },
      "sample": null,
      "clearDrawback": "airlockLeak",
      "failed": false,
      "resultText": "✅ Seals verified! Air +7%, Hull +4%."
    },
    "opt2": {
      "label": "Purge all airlock pressure sensors without closing the inner bulkhead",
      "effects": {
        "air": -28,
        "hull": -16
      },
      "sample": null,
      "addDrawback": "airlockLeak",
      "failed": true,
      "resultText": "❌ MAINTENANCE ERROR! Open bulkhead caused rapid cabin depressurization! Air -28%, Hull -16%."
    }
  },
  {
    "category": "NOMINAL",
    "emoji": "📡",
    "sourceLabel": "CALM SPACE WEATHER",
    "title": "Clear Signal to Lunar Gateway",
    "desc": "With no solar flares active, our connection to Lunar Gateway is crystal clear.",
    "opt1": {
      "label": "Send our science files to Gateway and gather a Moon Rock sample",
      "effects": {
        "hull": 4
      },
      "sample": "rock",
      "failed": false,
      "resultText": "✅ Data sent & +1 Moon Rock (+4% Science), Hull +4%."
    },
    "opt2": {
      "label": "Tune the power grid and repair any cracked cooling pipes",
      "effects": {
        "battery": 8,
        "hull": 4
      },
      "sample": null,
      "clearDrawback": "coolantCracked",
      "failed": false,
      "resultText": "✅ Power and cooling tuned! Battery +8%, Hull +4%."
    }
  }
];
