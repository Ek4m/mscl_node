const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const { Index } = require("flexsearch");

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

async function detectObjects(files = []) {
  const prompt = `From input photos, identify ALL gym/fitness equipment that is clearly visible and return STRICT JSON only (nothing else). This includes machines, free weights, cardio equipment, attachments, and small training tools—literally everything that is gym-related equipment.
INCLUDE (anything that is gym equipment), for example:
- cardio: treadmill, elliptical trainer, stationary bike, spin bike, recumbent bike, rowing machine (erg), stair climber/stepmill, air bike/assault bike, ski erg
- racks/stations: power rack, squat rack, half rack, smith machine, bench press station, dip station, pull-up station, cable crossover, functional trainer, cable machine
- selectorized/plate-loaded machines: leg press machine, hack squat machine, leg extension machine, leg curl machine, chest press machine, shoulder press machine, pec deck (fly) machine, lat pulldown machine, seated row machine, calf raise machine, hip abductor machine, hip adductor machine, glute kickback machine, hip thrust machine, back extension machine, ab crunch machine, assisted pull-up/dip machine, preacher curl machine, multi-gym station
- free weights: dumbbell, adjustable dumbbell, barbell, ez curl bar, trap bar/hex bar, kettlebell, weight plate, bumper plate
- benches/supports: weight bench, adjustable bench, flat bench, incline bench, decline bench, plyo box, step platform
- bars/rigging: pull-up bar, landmine attachment, bar storage, plate tree/plate storage rack, dumbbell rack
- attachments & accessories: cable handle, rope attachment (triceps rope), straight bar attachment, v-handle (close-grip row), ankle strap, lat pulldown bar, dip belt, lifting belt, wrist wraps, knee sleeves, straps, barbell collar/spring collar, chalk bowl, resistance band, mini band, suspension trainer (trx), battle ropes, jump rope, medicine ball, slam ball, wall ball, stability ball, yoga mat, foam roller, ab wheel, push-up handles, agility ladder, cones, timer/interval clock (if clearly gym timer), stretching strap
EXCLUDE (do NOT output):
- people, body parts
- ordinary clothing (t-shirts, pants) and casual shoes (unless clearly weightlifting shoes)
- towels, water bottles, phones, headphones, mirrors, TVs
- yoga, meditation etc. related things
- generic furniture/decor (couches, office chairs, plants, lights, windows)
- brand names/model numbers (use common equipment names only)
Rules for correctness:
- Only list items that are clearly visible. Do not guess or hallucinate.
- Use gym-accurate, common names (e.g., "smith machine", "treadmill", "dumbbell").
- If the exact item type is unclear, use a correct generic label instead of guessing:
  - "rack", "bench"
- Use lowercase.
- Use singular nouns even if multiple are present.
- Deduplicate: output unique names only.
Output format rules (MANDATORY):
- Output MUST be valid JSON and NOTHING ELSE (no markdown, no explanations).
- Output MUST match EXACTLY this schema:
['dumbells', 'treadmill', 'power rack', ...etc]
- No extra keys. No trailing commas.
- If no gym equipment is visible: {"equipment": []}

Now analyze the provided photos and output the JSON.`;
  return sendToAI(prompt, files);
}

const generateWorkoutProgram = async (equipments, level, days) => {
  const prompt = `You are an experienced, science-based gym trainer. 
Your task is to create a structured workout program based on the following user constraints:
- Level: ${level}
- Frequency: ${days} days per week
- Available Equipment: ${equipments.join(", ")}
OUTPUT INSTRUCTIONS:
Return ONLY a raw JSON response. No prose, no markdown code blocks, no explanations, and no conversational filler. The response must be valid JSON and nothing else. Not inside array just raw json object
JSON STRUCTURE:
{
  "title": "A professional and catchy name for the program",
  "level": "${level}",
  "description": "Small text explaining workout",
  "days": [
    { 
  "dayIndex":1(representing order of day)
      "title": "Muscle group(s) focus (e.g., 'Chest & Triceps' or 'Full Body')",
      "exercises": [
        {
          "orderIndex":1(representing order of exercise)
          "title": "Exact exercise name(not equipment variation)",
          "targetSets": (12 ,...recommended value for selected level do not use string just number),
          "targetReps": "in number type (12,15,10,...recommended value for selected level do not use string just number) ",
          "slug":"exercise slug like (pec-deck-fly, dumbbell-flyes, machine-chest-press etc)"
        }
      ]
    }
  ]
}

SCIENCE-BASED REQUIREMENTS:
1. Ensure recovery time between muscle groups is optimized for a ${days}-day split.
2. Select movements that utilize only the available equipment listed.
3. For ${level} level, ensure appropriate volume (sets/reps) and exercise complexity.`;
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
      dayIndex: index + 1,
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

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}

function buildExerciseIndex(exercises) {
  const index = new Index({
    tokenize: "forward",
    resolution: 9,
    threshold: 2,
  });

  const store = new Map();
  let idCounter = 0;

  exercises.forEach((exercise) => {
    // index main exercise
    idCounter++;
    index.add(idCounter, normalize(exercise.title));

    store.set(idCounter, {
      type: "exercise",
      exerciseId: exercise.id,
      variationId: null,
      title: exercise.title,
      slug: exercise.slug,
    });

    // index variations
    exercise.variations?.forEach((variation) => {
      idCounter++;
      index.add(idCounter, normalize(variation.title));

      store.set(idCounter, {
        type: "variation",
        exerciseId: exercise.id,
        variationId: variation.id,
        title: variation.title,
      });
    });
  });

  return { index, store };
}

function findBestMatch(title, slug, exercises, index, store) {
  if (slug) {
    const normalizedSlug = normalize(slug);

    for (const ex of exercises) {
      if (ex.slug && normalize(ex.slug) === normalizedSlug) {
        return {
          exerciseId: ex.id,
          variationId: null,
        };
      }

      for (const variation of ex.variations ?? []) {
        if (normalize(variation.title) === normalizedSlug) {
          return {
            exerciseId: ex.id,
            variationId: variation.id,
          };
        }
      }
    }
  }

  const searchQuery = normalize(slug || title);
  const results = index.search(searchQuery, { limit: 3 });

  if (!results.length) return null;

  return store.get(results[0]) ?? null;
}

function normalizePlan(plan, exercises) {
  const { index, store } = buildExerciseIndex(exercises);

  return {
    ...plan,
    days: plan.days
      .map((day) => ({
        ...day,
        exercises: day.exercises.map((aiEx) => {
          const match = findBestMatch(
            aiEx.title,
            aiEx.slug,
            exercises,
            index,
            store,
          );

          return {
            orderIndex: aiEx.orderIndex,
            targetSets: aiEx.targetSets,
            targetReps: aiEx.targetReps,
            exercise: match ? { id: match.exerciseId } : null,
            variation:
              match?.variationId != null ? { id: match.variationId } : null,
          };
        }),
      }))
      .map((day) => ({
        ...day,
        exercises: day.exercises.filter((ex) => ex.exercise !== null),
      }))
      .filter((day) => day.exercises.length > 0),
  };
}

module.exports = {
  detectObjects,
  generateWorkoutProgram,
  transformToWorkoutPlan,
  flattenExercises,
  normalizePlan,
};
