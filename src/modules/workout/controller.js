const { dummyProgram, dummyEquipments } = require("./data");

const { SuccessResponse, ErrorResponse } = require("../common/helpers");
const { getRepo } = require("../auth/helpers");
const { isDev } = require("../../helpers");
const {
  detectObjects,
  generateWorkoutProgram,
  transformToWorkoutPlan,
  normalizeAIPlan,
} = require("./helpers");

const Plan = require("../../entities/Plan");
const UserWorkoutPlan = require("../../entities/UserWorkoutPlan");
const Variation = require("../../entities/Variation");
const { GymLevel } = require("./vault");

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
  const { numOfDays, level, weeks, gender } = req.body;
  const userId = req.user.id;
  const variations = await getRepo(Variation).find({
    where: { level: isDev ? GymLevel.INTERMEDIATE : level },
    relations: { exercise: true },
  });

  const exerciseList = variations.map((ex) => ex.title);
  const response = isDev
    ? dummyProgram
    : await generateWorkoutProgram(
        level,
        numOfDays,
        gender,
        weeks,
        exerciseList,
      );

  const planDto = normalizeAIPlan(response, variations);
  const newPlan = await getRepo(Plan).save({
    ...planDto,
    level,
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
    weeks: newPlan.weeks.map((w) => ({
      ...w,
      weekIndex: w.weekNumber,
      days: w.days.map((day, index) => ({
        dayIndex: index + 1,
        title: `Day ${index + 1}`,
        exercises: day.exercises.map((ex, exIndex) => {
          return {
            targetReps: ex.targetReps,
            orderIndex: exIndex + 1,
            targetSets: ex.targetSets,
            exercise: {
              id: ex.exercise.id,
            },
            variation: ex.variation ? { id: ex.variation.id } : null,
          };
        }),
      })),
    })),
  };
  const customPlan = await getRepo(UserWorkoutPlan).save(newPlanRecord);
  const plan = await getRepo(UserWorkoutPlan).findOne({
    where: {
      id: customPlan.id,
    },
    template: newPlan,
    relations: {
      weeks: {
        days: {
          exercises: {
            exercise: true,
            variation: true,
          },
        },
      },
    },
  });
  SuccessResponse(res, plan);
};

const getUsersPlans = async (req, res) => {
  const plans = await getRepo(UserWorkoutPlan).find({
    relations: {
      template: true,
      weeks: true,
    },
  });
  SuccessResponse(res, plans);
};

const getPremadePlans = async (req, res) => {
  const plans = await getRepo(Plan).find({
    relations: {
      weeks: {
        days: {
          exercises: {
            exercise: true,
            variation: true,
          },
        },
      },
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
        template: true,
        weeks: {
          days: {
            exercises: {
              exercise: true,
              variation: true,
            },
          },
        },
      },
    });
    SuccessResponse(res, usersProgram);
  }
};

const getPlanRegistration = async (req, res) => {
  const { id } = req.params;
  const clientId = req.user.id;
  if (!id) {
    ErrorResponse(res, "No parameter provided");
  } else {
    const activePlan = await getRepo(UserWorkoutPlan).findOne({
      where: { user: { id: clientId }, template: { id } },
    });
    SuccessResponse(res, activePlan);
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

const createPlanFromTemplate = async (req, res) => {
  const { planId } = req.body;
  const userId = req.user.id;
  if (!planId) {
    ErrorResponse(res, "No parameter provided");
  } else {
    const template = await getRepo(Plan).findOne({
      where: { id: planId },
      relations: {
        weeks: {
          days: {
            exercises: {
              exercise: true,
              variation: true,
            },
          },
        },
      },
    });
    if (!template) {
      ErrorResponse(res, "Provided planId is not valid. Check again");
    } else {
      const newPlanRecord = {
        title: template.title,
        user: {
          id: userId,
        },
        template: {
          id: template.id,
        },
        weeks: template.weeks.map((week) => ({
          weekIndex: week.weekNumber,
          days: week.days.map((day, dayIndex) => ({
            dayIndex: dayIndex + 1,
            exercises: day.exercises.map((ex) => {
              const result = {
                targetReps: ex.targetReps,
                orderIndex: ex.orderIndex,
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
        })),
      };
      const customPlan = await getRepo(UserWorkoutPlan).save(newPlanRecord);
      SuccessResponse(res, customPlan);
    }
  }
};
module.exports = {
  getEquipments,
  generateProgram,
  getUsersPlans,
  getPremadePlans,
  getPlanRegistration,
  createPlanFromTemplate,
  getPlanById,
  createPlan,
};
