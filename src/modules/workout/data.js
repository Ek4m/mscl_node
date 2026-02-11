const dummyProgram = {
  title: "Savage Strength 3-Day Split",
  level: "intermediate",
  description:
    "A 3-day split program focusing on compound movements and hypertrophy with dumbbells, barbell, and bodyweight.",
  days: [
    {
      dayIndex: 1,
      title: "Upper Body Push",
      exercises: [
        {
          orderIndex: 1,
          title: "Barbell Bench Press",
          targetSets: 4,
          targetReps: 8,
          slug: "barbell-bench-press",
        },
        {
          orderIndex: 2,
          title: "Dumbbell Incline Press",
          targetSets: 3,
          targetReps: 10,
          slug: "dumbbell-incline-press",
        },
        {
          orderIndex: 3,
          title: "Dumbbell Shoulder Press",
          targetSets: 3,
          targetReps: 12,
          slug: "dumbbell-shoulder-press",
        },
        {
          orderIndex: 4,
          title: "Dips",
          targetSets: 3,
          targetReps: 10,
          slug: "dips",
        },
        {
          orderIndex: 5,
          title: "Dumbbell Lateral Raise",
          targetSets: 3,
          targetReps: 15,
          slug: "dumbbell-lateral-raise",
        },
      ],
    },
    {
      dayIndex: 2,
      title: "Lower Body & Core",
      exercises: [
        {
          orderIndex: 1,
          title: "Barbell Squat",
          targetSets: 4,
          targetReps: 8,
          slug: "barbell-squat",
        },
        {
          orderIndex: 2,
          title: "Romanian Deadlift",
          targetSets: 3,
          targetReps: 10,
          slug: "romanian-deadlift",
        },
        {
          orderIndex: 3,
          title: "Dumbbell Walking Lunge",
          targetSets: 3,
          targetReps: 12,
          slug: "dumbbell-walking-lunge",
        },
        {
          orderIndex: 4,
          title: "Sled Push",
          targetSets: 3,
          targetReps: 15,
          slug: "sled-push",
        },
        {
          orderIndex: 5,
          title: "Kettlebell Russian Twist",
          targetSets: 3,
          targetReps: 20,
          slug: "kettlebell-russian-twist",
        },
      ],
    },
    {
      dayIndex: 3,
      title: "Upper Body Pull",
      exercises: [
        {
          orderIndex: 1,
          title: "Pull-ups",
          targetSets: 3,
          targetReps: 8,
          slug: "pull-ups",
        },
        {
          orderIndex: 2,
          title: "Barbell Rows",
          targetSets: 4,
          targetReps: 10,
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
          title: "Dumbbell Reverse Flyes",
          targetSets: 3,
          targetReps: 15,
          slug: "dumbbell-reverse-flyes",
        },
        {
          orderIndex: 5,
          title: "Dumbbell Hammer Curl",
          targetSets: 3,
          targetReps: 12,
          slug: "dumbbell-hammer-curl",
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
