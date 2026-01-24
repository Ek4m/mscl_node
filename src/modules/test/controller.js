const storage = require("../../config/storage");
const { getRepo } = require("../auth/helpers");
const Exercise = require("../../entities/Exercise");
const { SuccessResponse } = require("../common/helpers");
const exercisesToInsert = require("../../vault/exerciseSeeds");
const Plan = require("../../entities/Plan");

const loadToExercises = async (req, res) => {
  const plans = [
    {
      title: "Push / Pull / Legs - Beginner",
      description: "A beginner-friendly 3-day split plan",
      days: [
        {
          title: "Push",
          description: "Chest, Shoulders, Triceps",
          exercises: [
            {
              orderIndex: 1,
              exercise: { id: 78 }, // Barbell Bench Press
              targetSets: 3,
              targetReps: 10,
            },
            {
              orderIndex: 2,
              exercise: { id: 80 }, // Dumbbell Flyes
              targetSets: 3,
              targetReps: 12,
            },
            {
              orderIndex: 3,
              exercise: { id: 105 }, // Overhead Press
              targetSets: 3,
              targetReps: 10,
            },
          ],
        },
        {
          title: "Pull",
          description: "Back, Biceps",
          exercises: [
            {
              orderIndex: 1,
              exercise: { id: 91 }, // Bent-Over Barbell Row
              targetSets: 3,
              targetReps: 10,
            },
            {
              orderIndex: 2,
              exercise: { id: 92 }, // Pullups
              targetSets: 3,
              targetReps: 8,
            },
            {
              orderIndex: 3,
              exercise: { id: 99 }, // Face Pulls
              targetSets: 3,
              targetReps: 12,
            },
          ],
        },
        {
          title: "Legs",
          description: "Quads, Hamstrings, Glutes",
          exercises: [
            {
              orderIndex: 1,
              exercise: { id: 117 }, // Back Squat
              targetSets: 4,
              targetReps: 10,
            },
            {
              orderIndex: 2,
              exercise: { id: 124 }, // Goblet Squat
              targetSets: 3,
              targetReps: 12,
            },
            {
              orderIndex: 3,
              exercise: { id: 132 }, // Calf Raises
              targetSets: 4,
              targetReps: 15,
            },
          ],
        },
      ],
    },
    {
      title: "Full Body - Intermediate",
      description: "An intermediate full-body plan with compound lifts",
      days: [
        {
          title: "Full Body Day 1",
          description: "Heavy compound lifts",
          exercises: [
            {
              orderIndex: 1,
              exercise: { id: 78 }, // Barbell Bench Press
              targetSets: 4,
              targetReps: 6,
            },
            {
              orderIndex: 2,
              exercise: { id: 90 }, // Deadlift
              targetSets: 3,
              targetReps: 5,
            },
            {
              orderIndex: 3,
              exercise: { id: 117 }, // Back Squat
              targetSets: 4,
              targetReps: 6,
            },
          ],
        },
        {
          title: "Full Body Day 2",
          description: "Accessory and isolation work",
          exercises: [
            {
              orderIndex: 1,
              exercise: { id: 137 }, // Barbell Curls
              targetSets: 3,
              targetReps: 12,
            },
            {
              orderIndex: 2,
              exercise: { id: 142 }, // Tricep Pushdowns
              targetSets: 3,
              targetReps: 12,
            },
            {
              orderIndex: 3,
              exercise: { id: 107 }, // Lateral Raises
              targetSets: 3,
              targetReps: 15,
            },
          ],
        },
      ],
    },
  ];
  const arr = [];
  for (const plan of plans) {
    let pl = await getRepo(Plan).findOne({ where: { title: plan.title } });
    if (!pl) {
      pl = await getRepo(Plan).save(plan);
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

module.exports = {
  uploadGet,
  uploadPost,
  loadToExercises,
};
