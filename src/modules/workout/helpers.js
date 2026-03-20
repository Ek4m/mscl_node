const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: { responseMimeType: "application/json" },
});

const sendToAI = async (prompt, files = []) => {
  const imageParts = files.map((file) =>
    fileToGenerativePart(file.buffer, file.mimetype),
  );
  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const resultText = response.text();
    return JSON.parse(resultText);
  } catch (error) {
    throw error;
  }
};

function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(buffer).toString("base64"),
      mimeType,
    },
  };
}

const generateWorkoutProgram = async (
  level,
  days,
  gender,
  weeks,
  exerciseList,
  metrics,
) => {
  const prompt = `You are a science-based gym trainer. Create a structured workout program based on:
Level: ${level}, Num of weeks: ${weeks}, Frequency: ${days}/week, Gender: ${gender}, Exercises: ${exerciseList.join(",")}, Metrics:${metrics.map((m) => m.name).join(", ")}
Return ONLY raw JSON:
{
  "title": "...(20-30 chars)","description": "...(40-50 chars)","weeks":[{"orderIndex":1,"days":[{"orderIndex":1,"exercises":[{"orderIndex":1,"title":"exactly same that was provided","targetSets":12(only number),"targetReps":12(only single number, no string no amrap, no "8-12" just number),"metric":"exactly same name with metrics list for targetValue","targetValue":"number(number type) type representing what amount  for 1 rep(ex: for running it  can be 500 (meters), for plank it is 60-120 (seconds), for bench press it is 50 (kilos))"}]}]}]}
Ensure recovery and proper volume and num of exercises for ${level} with ${days}-day split.`;
  return sendToAI(prompt);
};

const transformToWorkoutPlan = (body, userId) => {
  const date = new Date();
  const activeDays = (body.plan || []).filter(
    (day) => day.exercises && day.exercises.length > 0,
  );

  return {
    title: body.title || `Plan-${userId}-${date.getTime()}`,
    description: `${activeDays.length}-day training split`,
    createdBy: userId,
    days: activeDays.map((day, index) => ({
      orderIndex: index + 1,
      title: `Day ${day.dayNumber}`,
      // Creates a unique list of muscles targeted that day
      description: Array.from(
        new Set(day.exercises.flatMap((ex) => ex.muscle || [])),
      ).join(", "),

      // Map exercises and include the variation relation
      exercises: day.exercises.map((ex, exIndex) => {
        const result = {
          orderIndex: exIndex + 1,
          targetSets: parseInt(ex.sets, 10) || 0,
          targetReps: parseInt(ex.reps, 10) || 0,
          variation: { id: ex.variationId },
          exercise: {
            id: ex.id,
          },
        };
        if (!ex.variationId) {
          delete result.variation;
        }
        return result;
      }),
    })),
  };
};
const flattenExercises = (exercises) => {
  return exercises.flatMap((exercise) => {
    const { variations, ...parentData } = exercise;
    const parentEntry = {
      ...parentData,
      variationId: null,
    };

    const variationEntries = variations.map((variation) => ({
      ...parentData,
      id: exercise.id,
      title: variation.title,
      description: variation.description,
      variationId: variation.id,
    }));
    if (variations.length === 0) return [parentEntry];
    return [...variationEntries];
  });
};

const normalize = (str) => {
  if (!str) return "";
  return str.toLowerCase().trim();
};

function normalizeAIPlan(plan, variations, metrics) {
  const variationLookup = new Map();
  variations.forEach((v) => {
    variationLookup.set(normalize(v.title), {
      variationId: v.id,
    });
  });
  return {
    ...plan,
    weeks: plan.weeks.map((week) => ({
      ...week,
      days: week.days.map((day, dayInd) => ({
        ...day,
        exercises: day.exercises.map((aiEx) => {
          const match = variationLookup.get(normalize(aiEx.title));
          const metric = metrics.find((m) => m.name === aiEx.metric);
          return {
            orderIndex: aiEx.orderIndex,
            targetSets: aiEx.targetSets,
            targetReps: aiEx.targetReps,
            variation: match ? { id: match.variationId } : null,
            metric: { id: metric.id },
            targetValue: aiEx.targetValue,
          };
        }),
      })),
    })),
  };
}

module.exports = {
  generateWorkoutProgram,
  transformToWorkoutPlan,
  flattenExercises,
  normalizeAIPlan,
};
