const { getRepo } = require("../auth/helpers");
const { SuccessResponse } = require("../common/helpers");

const UserWorkoutPlan = require("../../entities/UserWorkoutPlan");

const Variation = require("../../entities/Variation");
const Exercise = require("../../entities/Exercise");
const Equipment = require("../../entities/Equipment");
const { In } = require("typeorm");
const { MuscleGroups } = require("../workout/vault");
const Plan = require("../../entities/Plan");

const loadToExercises = async (req, res) => {
  const mk = {
    title: "4-Week Strength & Growth",
    isWeeklyStatic: false,
    isActive: true,
    weeks: [
      {
        weekNumber: 1,
        title: "Week 1: Foundations",
        days: [
          {
            orderIndex: 1,
            title: "Upper Body Push",
            exercises: [
              {
                targetSets: 3,
                targetReps: "10",
                exerciseId: 101,
                orderIndex: 1,
              },
              {
                targetSets: 3,
                targetReps: "12",
                exerciseId: 12,
                orderIndex: 2,
              },
            ],
          },
          {
            orderIndex: 2,
            title: "Lower Body Pull",
            exercises: [
              { targetSets: 4, targetReps: "8", exerciseId: 20, orderIndex: 1 },
            ],
          },
        ],
      },
      {
        weekNumber: 2,
        title: "Week 2: Heavy Load",
        days: [
          {
            orderIndex: 1,
            title: "Upper Body Push (Heavy)",
            exercises: [
              { targetSets: 5, targetReps: "5", exerciseId: 11, orderIndex: 1 },
            ],
          },
          {
            orderIndex: 2,
            title: "Lower Body Pull (Heavy)",
            exercises: [
              { targetSets: 5, targetReps: "5", exerciseId: 21, orderIndex: 2 },
            ],
          },
        ],
      },
    ],
  };
  const planRepo = getRepo(Plan);
  const planResult = await planRepo.save(mk);
  SuccessResponse(res, planResult);
};

const getPlan = async (req, res) => {
  const usersProgram = await getRepo(UserWorkoutPlan).findOne({
    where: { id: 22 },
    relations: {
      days: {
        exercises: {
          exercise: true,
        },
      },
    },
  });
  SuccessResponse(res, usersProgram);
};

const seedExercises = async (req, res) => {
  const exerciseData = [
    {
      title: "Lat Pulldown",
      description:
        "A compound pulling exercise that primarily targets the latissimus dorsi. Performed by pulling a weighted bar down toward the upper chest while seated.",
      equipmentIds: [37],
      primaryMuscles: [MuscleGroups.Lats],
      secondaryMuscles: [
        MuscleGroups.Biceps,
        MuscleGroups.UpperBack,
        MuscleGroups.RearDelts,
      ],
      variations: [
        {
          title: "Wide Grip Lat Pulldown",
          description:
            "Uses a long bar with a wide grip to maximize lat width and upper back engagement.",
          equipmentIds: [37],
        },
        {
          title: "Close Grip (V-Bar) Pulldown",
          description:
            "Uses a V-taper handle to bring the elbows closer to the body, emphasizing the lower lats and mid-back thickness.",
          equipmentIds: [37, 16],
        },
      ],
    },
    {
      title: "Leg Extension",
      description:
        "An isolation exercise for the quadriceps. It involves sitting on a machine and extending the legs against resistance to strengthen the front of the thighs.",
      equipmentIds: [42],
      primaryMuscles: [MuscleGroups.Quads],
      secondaryMuscles: [],
      variations: [
        {
          title: "Machine Leg Extension",
          description:
            "The standard machine-based extension. Ensure the pad is just above the ankles and the back is flat against the seat.",
          equipmentIds: [42],
        },
      ],
    },
    {
      title: "Seated Leg Curl",
      description:
        "An isolation movement focusing on the hamstrings. The user sits and curls their legs downward against a weighted lever, providing a deep stretch and contraction.",
      equipmentIds: [43],
      primaryMuscles: [MuscleGroups.Hamstrings],
      secondaryMuscles: [MuscleGroups.Calves],
      variations: [
        {
          title: "Machine Seated Leg Curl",
          description:
            "Focus on keeping the thighs pressed against the upper pad to prevent the hips from rising during the curl.",
          equipmentIds: [43],
        },
      ],
    },
    {
      title: "Cable Crossover",
      description:
        "A chest exercise using two cable pulleys. By bringing the handles together in front of the body, it maintains constant tension on the pectoral muscles.",
      equipmentIds: [18],
      primaryMuscles: [MuscleGroups.Chest],
      secondaryMuscles: [MuscleGroups.FrontDelts, MuscleGroups.Serratus],
      variations: [
        {
          title: "High-to-Low Cable Fly",
          description:
            "Pulleys are set above head height. Pulling downward targets the lower fibers of the chest.",
          equipmentIds: [18],
        },
        {
          title: "Low-to-High Cable Fly",
          description:
            "Pulleys are set at the bottom. Pulling upward emphasizes the upper chest and front deltoids.",
          equipmentIds: [18],
        },
      ],
    },
    {
      title: "Smith Machine Squat",
      description:
        "A squat variation performed within a fixed track. This allows for increased stability and different foot placements to shift focus between the quads and glutes.",
      equipmentIds: [15],
      primaryMuscles: [MuscleGroups.Quads],
      secondaryMuscles: [MuscleGroups.Glutes, MuscleGroups.Adductors],
      variations: [
        {
          title: "Standard Smith Squat",
          description:
            "Feet placed slightly forward to allow for a more upright torso, placing heavy emphasis on the quadriceps.",
          equipmentIds: [15],
        },
      ],
    },
    {
      title: "Lateral Raise",
      description:
        "An isolation exercise for the lateral head of the deltoids. The arms are raised out to the sides to build shoulder width and the 'capped' shoulder look.",
      equipmentIds: [58, 36],
      primaryMuscles: [MuscleGroups.SideDelts],
      secondaryMuscles: [MuscleGroups.Traps],
      variations: [
        {
          title: "Dumbbell Lateral Raise",
          description:
            "Performed standing with dumbbells. Keep a slight bend in the elbows and lead with the side delts.",
          equipmentIds: [58],
        },
        {
          title: "Machine Lateral Raise",
          description:
            "A seated version that provides constant resistance throughout the entire range of motion.",
          equipmentIds: [36],
        },
      ],
    },
    {
      title: "Face Pull",
      description:
        "A corrective and developmental exercise for the rear delts and upper back. It involves pulling a rope attachment towards the forehead while flaring the elbows.",
      equipmentIds: [16, 17],
      primaryMuscles: [MuscleGroups.RearDelts],
      secondaryMuscles: [MuscleGroups.Traps, MuscleGroups.UpperBack],
      variations: [
        {
          title: "Rope Face Pull",
          description:
            "Pull the rope towards your eyes while pulling the ends apart to maximize external rotation in the shoulders.",
          equipmentIds: [16],
        },
      ],
    },
    {
      title: "Romanian Deadlift",
      description:
        "A posterior chain movement that emphasizes the hamstrings and glutes. Unlike a standard deadlift, the weight is lowered from a standing position with a slight knee bend.",
      equipmentIds: [55, 58],
      primaryMuscles: [MuscleGroups.Hamstrings],
      secondaryMuscles: [
        MuscleGroups.Glutes,
        MuscleGroups.LowerBack,
        MuscleGroups.Forearms,
      ],
      variations: [
        {
          title: "Barbell RDL",
          description:
            "Using a barbell allows for heavier loading. Focus on pushing the hips back until a deep stretch is felt in the hamstrings.",
          equipmentIds: [55],
        },
        {
          title: "Dumbbell RDL",
          description:
            "Dumbbells allow for a more natural hand position and can be easier on the lower back for some users.",
          equipmentIds: [58],
        },
      ],
    },
    {
      title: "Hammer Strength Chest Press",
      description:
        "A plate-loaded machine press that mimics the bench press but provides a safer, fixed path of motion for maximum chest isolation.",
      equipmentIds: [33],
      primaryMuscles: [MuscleGroups.Chest],
      secondaryMuscles: [MuscleGroups.Triceps, MuscleGroups.FrontDelts],
      variations: [
        {
          title: "Flat Machine Press",
          description:
            "Adjust the seat so the handles are at mid-chest level. Drive the weight forward without locking out the elbows completely.",
          equipmentIds: [33, 64],
        },
      ],
    },
    {
      title: "Ab Wheel Rollout",
      description:
        "A challenging core stability exercise where you roll a wheel forward from a kneeling position, engaging the entire abdominal wall to maintain a neutral spine.",
      equipmentIds: [73],
      primaryMuscles: [MuscleGroups.Abs],
      secondaryMuscles: [MuscleGroups.Serratus, MuscleGroups.Lats],
      variations: [
        {
          title: "Kneeling Ab Rollout",
          description:
            "Keep your glutes tight and back slightly rounded (hollow body position) to protect the lower back.",
          equipmentIds: [73, 76],
        },
      ],
    },
    {
      title: "Kettlebell Swing",
      description:
        "An explosive hip-hinge movement that builds power in the posterior chain. It uses momentum to swing a kettlebell from between the legs to chest height.",
      equipmentIds: [59],
      primaryMuscles: [MuscleGroups.Glutes, MuscleGroups.Hamstrings],
      secondaryMuscles: [MuscleGroups.LowerBack, MuscleGroups.Shoulders],
      variations: [
        {
          title: "Russian Kettlebell Swing",
          description:
            "The kettlebell is swung only to eye level. Focus on the 'snap' of the hips to drive the weight up.",
          equipmentIds: [59],
        },
      ],
    },
    {
      title: "Lunge",
      description:
        "A unilateral leg exercise where one leg is positioned forward with the knee bent while the other leg is positioned behind. Excellent for balance and glute development.",
      equipmentIds: [58, 76],
      primaryMuscles: [MuscleGroups.Quads, MuscleGroups.Glutes],
      secondaryMuscles: [MuscleGroups.Hamstrings, MuscleGroups.Calves],
      variations: [
        {
          title: "Dumbbell Walking Lunge",
          description:
            "Hold dumbbells at your sides and take controlled steps forward, dropping the back knee toward the floor.",
          equipmentIds: [58],
        },
        {
          title: "Static Bodyweight Lunge",
          description:
            "Performed in place. Good for beginners focusing on form and balance.",
          equipmentIds: [76],
        },
      ],
    },
    {
      title: "Preacher Curl",
      description:
        "A bicep isolation curl performed on an angled bench. The bench prevents the use of momentum, ensuring the biceps do all the work throughout the range of motion.",
      equipmentIds: [31, 56, 58],
      primaryMuscles: [MuscleGroups.Biceps],
      secondaryMuscles: [MuscleGroups.Forearms],
      variations: [
        {
          title: "EZ-Bar Preacher Curl",
          description:
            "The cambered bar reduces strain on the wrists compared to a straight bar.",
          equipmentIds: [31, 56],
        },
        {
          title: "Dumbbell Preacher Curl",
          description:
            "Allows for unilateral training to fix strength imbalances between the left and right arm.",
          equipmentIds: [31, 58],
        },
      ],
    },
    {
      title: "Tricep Overhead Extension",
      description:
        "A triceps exercise performed by extending the arms overhead. This places the long head of the triceps in a stretched position for better hypertrophy.",
      equipmentIds: [58, 16],
      primaryMuscles: [MuscleGroups.Triceps],
      secondaryMuscles: [],
      variations: [
        {
          title: "Seated Dumbbell Extension",
          description:
            "Use an adjustable bench with a short back for support. Lower the dumbbell behind the head and extend upward.",
          equipmentIds: [58, 27],
        },
        {
          title: "Cable Overhead Extension",
          description:
            "Use a rope attachment. Facing away from the cable machine provides constant tension at the bottom of the movement.",
          equipmentIds: [16],
        },
      ],
    },
    {
      title: "Shrug",
      description:
        "A simple isolation movement for the upper trapezius muscles. It involves lifting the shoulders toward the ears while holding weights at the sides.",
      equipmentIds: [55, 58, 15],
      primaryMuscles: [MuscleGroups.Traps],
      secondaryMuscles: [MuscleGroups.Forearms],
      variations: [
        {
          title: "Dumbbell Shrug",
          description:
            "Hold dumbbells at your sides. Elevate the shoulders straight up; avoid rolling them.",
          equipmentIds: [58],
        },
        {
          title: "Barbell Shrug",
          description:
            "Allows for much heavier weight. Hold the bar in front of your thighs with an overhand grip.",
          equipmentIds: [55],
        },
      ],
    },
    {
      title: "Horizontal Leg Press",
      description:
        "A variation of the leg press where the user pushes the platform away from them horizontally while seated, focusing on overall leg development.",
      equipmentIds: [40],
      primaryMuscles: [MuscleGroups.Quads],
      secondaryMuscles: [MuscleGroups.Glutes, MuscleGroups.Calves],
      variations: [
        {
          title: "Seated Leg Press Machine",
          description:
            "Great for isolation as it requires less stabilization than the 45-degree leg press.",
          equipmentIds: [40],
        },
      ],
    },
    {
      title: "T-Bar Row",
      description:
        "A heavy pulling movement for back thickness. It uses a bar anchored at one end, which is pulled toward the abdomen using a V-grip handle.",
      equipmentIds: [50, 51],
      primaryMuscles: [MuscleGroups.Back, MuscleGroups.Lats],
      secondaryMuscles: [MuscleGroups.Biceps, MuscleGroups.RearDelts],
      variations: [
        {
          title: "Chest-Supported T-Bar Row",
          description:
            "The pad supports your torso, removing the lower back from the equation and allowing pure back isolation.",
          equipmentIds: [50],
        },
      ],
    },
    {
      title: "Box Jump",
      description:
        "A plyometric exercise for explosive lower body power. It involves jumping from the floor onto a raised box and landing softly with controlled knees.",
      equipmentIds: [70],
      primaryMuscles: [MuscleGroups.Quads, MuscleGroups.Glutes],
      secondaryMuscles: [MuscleGroups.Calves, MuscleGroups.Cardio],
      variations: [
        {
          title: "Standard Box Jump",
          description:
            "Start with a comfortable height. Land in a partial squat and stand up fully before stepping down.",
          equipmentIds: [70],
        },
      ],
    },
    {
      title: "Farmer's Walk",
      description:
        "A functional strength exercise where heavy weights are carried over a set distance. It builds grip strength, core stability, and upper trap endurance.",
      equipmentIds: [84, 58],
      primaryMuscles: [MuscleGroups.Forearms, MuscleGroups.FullBody],
      secondaryMuscles: [MuscleGroups.Traps, MuscleGroups.Abs],
      variations: [
        {
          title: "Heavy Dumbbell Carry",
          description:
            "A simple version using the heaviest dumbbells available. Keep your chest up and take short, quick steps.",
          equipmentIds: [58],
        },
        {
          title: "Farmer's Handle Carry",
          description:
            "Using specialized handles allows for much heavier loading and a neutral grip that is easier on the wrists.",
          equipmentIds: [84, 64],
        },
      ],
    },
  ];
  const exerciseRepo = getRepo(Exercise);
  const variationRepo = getRepo(Variation);
  const equipmentRepo = getRepo(Equipment);

  console.log("Starting seed process...");

  for (const data of exerciseData) {
    // 1. Fetch the actual Equipment entities for the Exercise
    const baseEquipment = await equipmentRepo.findBy({
      id: In(data.equipmentIds),
    });

    // 2. Create and Save the Exercise
    const exercise = exerciseRepo.create({
      title: data.title,
      primaryMuscles: data.primaryMuscles,
      secondaryMuscles: data.secondaryMuscles || [],
      equipment: baseEquipment,
      description: data.description, // TypeORM handles the exercise_equipment table
    });

    const savedExercise = await exerciseRepo.save(exercise);

    // 3. Handle Variations
    if (data.variations && data.variations.length > 0) {
      for (const varData of data.variations) {
        // Fetch specific equipment for this variation
        const variationEquipment = await equipmentRepo.findBy({
          id: In(varData.equipmentIds),
        });

        const variation = variationRepo.create({
          title: varData.title,
          exercise: savedExercise,
          description: varData.description,
          equipment: variationEquipment, // TypeORM handles the variation_equipment table
        });

        await variationRepo.save(variation);
      }
    }
  }
  SuccessResponse(res, true);
  console.log("Seeding complete!");
};

module.exports = {
  loadToExercises,
  getPlan,
  seedExercises,
};
