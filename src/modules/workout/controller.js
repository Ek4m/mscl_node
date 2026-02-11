const { dummyProgram, dummyEquipments } = require("./data");

const { SuccessResponse, ErrorResponse } = require("../common/helpers");
const { getRepo } = require("../auth/helpers");
const { isDev } = require("../../helpers");
const {
  detectObjects,
  generateWorkoutProgram,
  transformToWorkoutPlan,
} = require("./helpers");

const Plan = require("../../entities/Plan");
const UserWorkoutPlan = require("../../entities/UserWorkoutPlan");
const { Document } = require("flexsearch");
const Exercise = require("../../entities/Exercise");

const getEquipments = async (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    ErrorResponse(res, "No images provided", 400);
  } else {
    try {
      const response = isDev ? dummyEquipments : await detectObjects(files);
      SuccessResponse(res, response);
    } catch (error) {
      console.error("Error during image classification:", error);
      ErrorResponse(res, "Internal Server Error");
    }
  }
};
const generateProgram = async (req, res) => {
  const { equipments, numOfDays, level } = req.body;
  const userId = req.user.id;
  const response = await generateWorkoutProgram(equipments, level, numOfDays);
  const exercises = await getRepo(Exercise).find({
    select: {
      id: true,
      title: true,
      slug: true,
    },
  });
  const docIndex = new Document({
    document: {
      id: "id",
      index: ["title", "slug"],
      store: true,
    },
    tokenize: "forward",
    resolution: 9,
    threshold: 0,
    depth: 3,
  });
  exercises.forEach((ex) => docIndex.add(ex));

  response.days.forEach((day) => {
    console.log(`\nDay: ${day.title}`);
    day.exercises.forEach((aiEx) => {
      let searchResults = docIndex.search(aiEx.title, {
        limit: 1,
        enrich: true,
      });
      if (searchResults.length === 0 || searchResults[0].result.length === 0) {
        searchResults = docIndex.search(aiEx.slug, { limit: 1, enrich: true });
      }
      if (searchResults.length > 0 && searchResults[0].result.length > 0) {
        const match = searchResults[0].result[0];
        console.log(
          `✅ MATCHED: "${aiEx.title}" -> DB: "${match.doc.title}" (ID: ${match.id})`,
        );
        aiEx.exercise = { id: match.doc.id };
      } else {
        console.warn(`❌ NO MATCH FOUND: "${aiEx.title}"`);
      }
    });
  });
  console.log(JSON.stringify(response));
  const newPlan = await getRepo(Plan).save({
    ...response,
    createdBy: { id: userId },
  });
  const newPlanRecord = {
    title: newPlan.title,
    user: {
      id: userId,
    },
    template: {
      id: newPlan.id,
    },
    days: newPlan.days.map((day, index) => ({
      dayIndex: index + 1,
      exercises: day.exercises.map((ex, exIndex) => ({
        targetReps: ex.targetReps,
        orderIndex: exIndex + 1,
        targetSets: ex.targetSets,
        exercise: {
          id: ex.exercise.id,
        },
      })),
    })),
  };
  const customPlan = await getRepo(UserWorkoutPlan).save(newPlanRecord);
  SuccessResponse(res, customPlan);
};

const getUsersPlans = async (req, res) => {
  const plans = await getRepo(UserWorkoutPlan).find({
    relations: {
      days: true,
    },
  });
  SuccessResponse(res, plans);
};

const getPlanById = async (req, res) => {
  const { id } = req.params;
  const clientId = req.user.id;
  if (!id) {
    ErrorResponse(res, "No parameter provided");
  } else {
    const usersProgram = await getRepo(UserWorkoutPlan).findOne({
      where: {
        id,
        user: {
          id: clientId,
        },
      },
      relations: {
        days: {
          exercises: {
            exercise: true,
            variation: true,
          },
        },
      },
    });
    console.log(JSON.stringify(usersProgram))
    SuccessResponse(res, usersProgram);
  }
};

const createPlan = async (req, res) => {
  const { plan, title } = req.body;
  const userId = req.user.id;
  if (!plan || !Array.isArray(plan) || !plan.length)
    ErrorResponse(res, "Provided plan credentials are not valid. Check again");
  const planRepo = getRepo(Plan);
  const mappedBody = transformToWorkoutPlan({ plan, title }, userId);

  let newPlan = await planRepo.save(mappedBody);
  console.log(JSON.stringify(newPlan));
  const newPlanRecord = {
    title: newPlan.title,
    user: {
      id: userId,
    },
    template: {
      id: newPlan.id,
    },
    days: newPlan.days.map((day, index) => ({
      dayIndex: index + 1,
      exercises: day.exercises.map((ex, exIndex) => {
        const result = {
          targetReps: ex.targetReps,
          orderIndex: exIndex + 1,
          targetSets: ex.targetSets,
          exercise: {
            id: ex.exercise.id,
          },
        };
        if (ex.variation && ex.variation.id) {
          result.variation = { id: ex.variation.id };
        }
        return result;
      }),
    })),
  };
  const customPlan = await getRepo(UserWorkoutPlan).save(newPlanRecord);
  SuccessResponse(res, customPlan);
};

module.exports = {
  getEquipments,
  generateProgram,
  getUsersPlans,
  getPlanById,
  createPlan,
};
