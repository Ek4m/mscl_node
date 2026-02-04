const storage = require("../../config/storage");
const { getRepo } = require("../auth/helpers");
const Exercise = require("../../entities/Exercise");
const { SuccessResponse } = require("../common/helpers");
const exercisesToInsert = require("../../vault/exerciseSeeds");
const Plan = require("../../entities/Plan");
const UserWorkoutPlan = require("../../entities/UserWorkoutPlan");
const Equipment = require("../../entities/Equipment");
const { MuscleGroups } = require("../workout/vault");

const loadToExercises = async (req, res) => {
  const exercises = [
    {
      title: "Incline Dumbbell Press",
      slug: "incline-dumbbell-press",
      description: "Focuses on the upper portion of the chest.",
      steps: [
        "Set bench to 30-45 degree angle",
        "Press dumbbells upward until arms are straight",
        "Lower weights slowly to the upper chest level",
      ],
      primaryMuscles: [MuscleGroups.UpperChest],
      secondaryMuscles: [MuscleGroups.FrontDelts, MuscleGroups.Triceps],
      equipment: [{ id: 1 }, { id: 8 }], // Dumbbells, Adjustable Bench
    },
    {
      title: "Deadlift",
      slug: "deadlift",
      description: "A powerhouse move for the entire posterior chain.",
      steps: [
        "Stand with feet mid-foot under the bar",
        "Grip the bar, bend knees until shins touch bar",
        "Lift the bar by standing up with a flat back",
      ],
      primaryMuscles: [MuscleGroups.LowerBack, MuscleGroups.Glutes],
      secondaryMuscles: [
        MuscleGroups.Hamstrings,
        MuscleGroups.Forearms,
        MuscleGroups.Traps,
      ],
      equipment: [{ id: 2 }], // Barbell
    },
    {
      title: "Barbell Squat",
      slug: "barbell-squat",
      description: "The king of leg exercises.",
      steps: [
        "Rest bar on traps and step back from rack",
        "Squat down until thighs are parallel to floor",
        "Drive back up to the starting position",
      ],
      primaryMuscles: [MuscleGroups.Quads, MuscleGroups.Glutes],
      secondaryMuscles: [
        MuscleGroups.Hamstrings,
        MuscleGroups.LowerBack,
        MuscleGroups.Calves,
      ],
      equipment: [{ id: 2 }, { id: 6 }], // Barbell, Squat Rack
    },
    {
      title: "Pull-Ups",
      slug: "pull-ups",
      description: "The ultimate upper body pull exercise.",
      steps: [
        "Grip the bar slightly wider than shoulders",
        "Pull your body up until your chin is over the bar",
        "Lower yourself back down with control",
      ],
      primaryMuscles: [MuscleGroups.Lats, MuscleGroups.UpperBack],
      secondaryMuscles: [MuscleGroups.Biceps, MuscleGroups.RearDelts],
      equipment: [{ id: 17 }], // Dip Station (often includes pull-up bars)
    },
    {
      title: "Russian Twists",
      slug: "russian-twists",
      description: "Targets the obliques and core stability.",
      steps: [
        "Sit with knees bent and feet slightly off the ground",
        "Hold a weight and rotate your torso from side to side",
        "Touch the weight to the floor on each side",
      ],
      primaryMuscles: [MuscleGroups.Obliques],
      secondaryMuscles: [MuscleGroups.Abs],
      equipment: [{ id: 28 }], // Medicine Ball
    },
  ];
  const arr = [];
  for (const ex of exercises) {
    let pl = await getRepo(Exercise).findOne({ where: { title: ex.title } });
    if (!pl) {
      pl = await getRepo(Exercise).save(ex);
    }
    arr.push(pl);
  }
  SuccessResponse(res, arr);
};

const uploadGet = (_, res) => {
  res.render("upload");
};

const uploadPost = (req, res) => {
  const file = req.file;
  const stream = storage.uploader.upload_stream({
    public_id: req.body.slug,
    resource_type: "image",
    overwrite: true,
  });
  stream.end(file.buffer);
  res.redirect("/test/upload");
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

module.exports = {
  uploadGet,
  uploadPost,
  loadToExercises,
  getPlan,
};
