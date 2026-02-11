const dummyProgram = {
  title: "Beginner Strength Builder (5-Day Split)",
  level: "pro",
  description:
    "A 5-day workout program designed to introduce beginners to strength training using a variety of equipment.",
  days: [
    {
      dayIndex: 1,
      title: "Chest & Triceps",
      exercises: [
        {
          orderIndex: 1,
          title: "Dumbbell Bench Press",
          targetSets: 3,
          targetReps: 12,
          slug: "dumbbell-bench-press",
        },
        {
          orderIndex: 2,
          title: "Dumbbell Flyes",
          targetSets: 3,
          targetReps: 15,
          slug: "dumbbell-flyes",
        },
        {
          orderIndex: 3,
          title: "Dips (Assisted if needed)",
          targetSets: 3,
          targetReps: 10,
          slug: "dips",
        },
        {
          orderIndex: 4,
          title: "Dumbbell Triceps Extension",
          targetSets: 3,
          targetReps: 12,
          slug: "dumbbell-triceps-extension",
        },
      ],
    },
    {
      dayIndex: 2,
      title: "Back & Biceps",
      exercises: [
        {
          orderIndex: 1,
          title: "Pull-ups (Assisted if needed)",
          targetSets: 3,
          targetReps: 8,
          slug: "pull-ups",
        },
        {
          orderIndex: 2,
          title: "Barbell Rows",
          targetSets: 3,
          targetReps: 12,
          slug: "barbell-rows",
        },
        {
          orderIndex: 3,
          title: "Dumbbell Bicep Curl",
          targetSets: 3,
          targetReps: 12,
          slug: "dumbbell-bicep-curl",
        },
        {
          orderIndex: 4,
          title: "Hammer Curls",
          targetSets: 3,
          targetReps: 15,
          slug: "hammer-curls",
        },
      ],
    },
    {
      dayIndex: 3,
      title: "Legs",
      exercises: [
        {
          orderIndex: 1,
          title: "Barbell Squats",
          targetSets: 3,
          targetReps: 12,
          slug: "barbell-squats",
        },
        {
          orderIndex: 2,
          title: "Dumbbell Lunges",
          targetSets: 3,
          targetReps: 10,
          slug: "dumbbell-lunges",
        },
        {
          orderIndex: 3,
          title: "Romanian Deadlifts",
          targetSets: 3,
          targetReps: 15,
          slug: "romanian-deadlifts",
        },
        {
          orderIndex: 4,
          title: "Calf Raises",
          targetSets: 3,
          targetReps: 20,
          slug: "calf-raises",
        },
      ],
    },
    {
      dayIndex: 4,
      title: "Shoulders",
      exercises: [
        {
          orderIndex: 1,
          title: "Dumbbell Shoulder Press",
          targetSets: 3,
          targetReps: 12,
          slug: "dumbbell-shoulder-press",
        },
        {
          orderIndex: 2,
          title: "Dumbbell Lateral Raises",
          targetSets: 3,
          targetReps: 15,
          slug: "dumbbell-lateral-raises",
        },
        {
          orderIndex: 3,
          title: "Dumbbell Front Raises",
          targetSets: 3,
          targetReps: 12,
          slug: "dumbbell-front-raises",
        },
        {
          orderIndex: 4,
          title: "Face Pulls",
          targetSets: 3,
          targetReps: 15,
          slug: "face-pulls",
        },
      ],
    },
    {
      dayIndex: 5,
      title: "Full Body Conditioning",
      exercises: [
        {
          orderIndex: 1,
          title: "Kettlebell Swings",
          targetSets: 3,
          targetReps: 15,
          slug: "kettlebell-swings",
        },
        {
          orderIndex: 2,
          title: "Medicine Ball Slams",
          targetSets: 3,
          targetReps: 12,
          slug: "medicine-ball-slams",
        },
        {
          orderIndex: 3,
          title: "Rowing Machine",
          targetSets: 3,
          targetReps: 20,
          slug: "rowing-machine",
        },
        {
          orderIndex: 4,
          title: "Sled Pushes (Light Weight)",
          targetSets: 3,
          targetReps: 10,
          slug: "sled-pushes",
        },
      ],
    },
  ],
};

const dummyEquipments = [
  "dumbbell",
  "pull-up bar",
  "weight plate",
  "barbell",
  "sled",
  "dip station",
  "rack",
  "plate tree/plate storage rack",
  "kettlebell",
  "medicine ball",
  "yoga mat",
  "rowing machine",
];
module.exports = {
  dummyEquipments,
  dummyProgram,
};
