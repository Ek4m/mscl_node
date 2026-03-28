const { Not } = require("typeorm");
const { dummyProgram } = require("./data");

const { SuccessResponse, ErrorResponse } = require("../common/helpers");
const { getRepo } = require("../auth/helpers");
const { isDev, handleTransaction } = require("../../helpers");
const { generateWorkoutProgram, normalizeAIPlan } = require("./helpers");

const Plan = require("../../entities/Plan");
const UserWorkoutPlan = require("../../entities/UserWorkoutPlan");
const Metric = require("../../entities/Metric");
const Exercise = require("../../entities/Exercise");
const Variation = require("../../entities/Variation");
const UserWorkoutSession = require("../../entities/UserWorkoutSession");
const UserWorkoutDay = require("../../entities/UserWorkoutDay");

const { GymLevel, CreationType, PlanStatus, Gender } = require("./vault");

const generateProgram = handleTransaction(async (req, res) => {
  const { numOfDays, level, weeks, gender, category } = req.body;
  const userId = req.user.id;
  const exRepo = getRepo(Exercise);
  const variationRepo = getRepo(Variation);
  const metricRepo = getRepo(Metric);
  const metrics = await metricRepo.find();
  const exercises = await exRepo.find({
    where: { trainingType: { id: category } },
    relations: { variations: true },
  });
  const variations = isDev
    ? await variationRepo.find()
    : exercises
        .flatMap((elem) => elem.variations)
        .filter((v) => v.level === (isDev ? GymLevel.INTERMEDIATE : level));
  const exerciseList = variations.map((ex) => ex.title);
  const response = isDev
    ? dummyProgram
    : await generateWorkoutProgram(
        level,
        numOfDays,
        gender,
        weeks,
        exerciseList,
        metrics,
      );

  const planDto = normalizeAIPlan(response, variations, metrics);
  const newPlan = await getRepo(Plan).save({
    ...planDto,
    level,
    creationType: CreationType.AI_GENERATED,
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
      orderIndex: w.orderIndex,
      days: w.days.map((day, index) => ({
        orderIndex: index + 1,
        exercises: day.exercises.map((ex, exIndex) => {
          return {
            targetReps: ex.targetReps,
            orderIndex: exIndex + 1,
            targetSets: ex.targetSets,
            variation: ex.variation ? { id: ex.variation.id } : null,
            metric: { id: ex.metric.id },
            targetValue: ex.targetValue,
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
            variation: true,
          },
        },
      },
    },
  });
  SuccessResponse(res, plan);
});

const getUsersPlans = async (req, res) => {
  const { status } = req.query;
  const plans = await getRepo(UserWorkoutPlan).find({
    relations: {
      template: true,
      weeks: true,
    },
    where: {
      status: status ?? Not(PlanStatus.ARCHIVED),
    },
  });
  SuccessResponse(res, plans);
};

const getPremadePlans = async (req, res) => {
  const params = req.query;
  const where = {};
  if ([Gender.FEMALE, Gender.MALE].includes(params.gender)) {
    where.gender = params.gender;
  }
  const plans = await getRepo(Plan).find({
    relations: {
      weeks: {
        days: {
          exercises: {
            variation: true,
          },
        },
      },
    },
    where: { creationType: CreationType.PROFESSIONAL, ...where },
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
        status: Not(PlanStatus.ARCHIVED),
      },
      relations: {
        template: true,
        weeks: {
          days: {
            exercises: {
              variation: { exercise: true },
              metric: true,
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
      where: {
        user: { id: clientId },
        template: { id },
        status: Not(PlanStatus.ARCHIVED),
      },
    });
    SuccessResponse(res, activePlan);
  }
};

const createPlan = handleTransaction(async (req, res) => {
  const { plan, title } = req.body;
  const userId = req.user.id;
  const mappedPlan = {
    title,
    createdBy: {
      id: userId,
    },
    creationType: CreationType.CUSTOM_CREATED,
    weeks: plan
      .map((week) => {
        return {
          ...week,
          days: week.days
            .map((day) => {
              return {
                orderIndex: day.orderIndex,
                exercises: day.exercises.map((ex, index) => {
                  return {
                    orderIndex: index,
                    targetReps: Number(ex.reps) || 12,
                    targetSets: Number(ex.sets) || 3,
                    variation: {
                      id: ex.id,
                    },
                    metric: {
                      id: ex.metricId,
                    },
                    targetValue: ex.targetValue,
                  };
                }),
              };
            })
            .filter((day) => Boolean(day.exercises.length)),
        };
      })
      .filter((day) => Boolean(day.days.length)),
  };
  const newPlan = await getRepo(Plan).save(mappedPlan);
  const newUserPlan = {
    title: newPlan.title,
    user: {
      id: userId,
    },
    template: {
      id: newPlan.id,
    },
    weeks: newPlan.weeks.map((week) => ({
      orderIndex: week.orderIndex,
      days: week.days.map((day, orderIndex) => ({
        orderIndex: orderIndex + 1,
        exercises: day.exercises.map((ex) => {
          const result = {
            targetReps: ex.targetReps,
            orderIndex: ex.orderIndex,
            targetSets: ex.targetSets,
            metric: {
              id: ex.metric.id,
            },
            targetValue: ex.targetValue,
          };
          if (ex.variation && ex.variation.id) {
            result.variation = { id: ex.variation.id };
          }
          return result;
        }),
      })),
    })),
  };
  const customPlan = await getRepo(UserWorkoutPlan).save(newUserPlan);
  SuccessResponse(res, customPlan);
});

const createPlanFromTemplate = handleTransaction(async (req, res) => {
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
              variation: true,
              metric: true,
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
          orderIndex: week.orderIndex,
          days: week.days.map((day, orderIndex) => ({
            orderIndex: orderIndex + 1,
            exercises: day.exercises.map((ex) => {
              const result = {
                targetReps: ex.targetReps,
                orderIndex: ex.orderIndex,
                targetSets: ex.targetSets,
                targetValue: ex.targetValue,
                metric: {
                  id: ex.metric.id,
                },
              };
              if (ex.variation && ex.variation.id) {
                result.variation = { id: ex.variation.id };
              }
              if (ex.metric) {
                result.metric = { id: ex.metric.id };
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
});

const updateUserPlanStatus = handleTransaction(async (req, res) => {
  const { userPlanId, status, sessionRecords } = req.body;
  if (
    !userPlanId ||
    !status ||
    (status === PlanStatus.ARCHIVED && !sessionRecords.length)
  ) {
    ErrorResponse(res, "Invalid parameters provided");
  } else {
    const planRepo = getRepo(UserWorkoutPlan);
    const plan = await planRepo.findOne({
      where: { id: userPlanId, status: Not(PlanStatus.ARCHIVED) },
      select: ["id"],
    });
    if (!plan) ErrorResponse(res, "Plan was not found");
    else {
      await planRepo.update({ id: plan.id }, { status });
      if (status === PlanStatus.ARCHIVED) {
        const sessionsMap = sessionRecords.reduce((acc, item) => {
          if (!acc[item.sessionId]) {
            acc[item.sessionId] = {
              seconds: item.seconds,
              startedAt: item.startedAt,
              finishedAt: item.finishedAt,
              completed: item.completed,
              userWorkoutPlan: { id: item.userPlanId },
              userWorkoutDay: { id: item.planDayId },
              exercises: [],
            };
          }
          acc[item.sessionId].exercises.push({
            reps: item.reps,
            doneValue: item.doneValue,
            extraWeight: item.extraWeight,
            orderIndex: item.orderIndex,
            variation: { id: item.exerciseId },
            userWorkoutExercise: { id: item.exerciseResultId },
          });

          return acc;
        }, {});
        const sessionRepo = getRepo(UserWorkoutSession);
        const sessions = Object.values(sessionsMap);
        for (const session of sessions) {
          await sessionRepo.save(session);
        }
      }
      SuccessResponse(res, true);
    }
  }
});

const editUserPlanDay = handleTransaction(async (req, res) => {
  const { dayId, exercises } = req.body;
  const dayRepo = getRepo(UserWorkoutDay);
  const day = await dayRepo.findOne({
    where: { id: dayId },
    relations: { exercises: true },
  });
  if (!day) ErrorResponse(res, ["Required data was not found"]);
  day.exercises = exercises.map((ex, index) => {
    const resultEx = {
      targetReps: ex.targetReps,
      targetSets: ex.targetSets,
      orderIndex: index + 1,
      variation: {
        id: ex.exerciseId,
      },
      targetValue: Number(ex.targetValue) || 0,
      metric: ex.metric,
    };
    return resultEx;
  });
  await dayRepo.save(day);
  SuccessResponse(res, day);
});

const reusePlan = handleTransaction(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.body;
  const planRepo = getRepo(UserWorkoutPlan);
  const plan = await planRepo.findOne({
    where: { id },
    relations: {
      template: true,
      weeks: {
        days: {
          exercises: {
            variation: true,
            metric: true,
          },
        },
      },
    },
  });
  const newPlan = {
    ...plan,
    user: {
      id: userId,
    },
    template: {
      id: plan.template.id,
    },
    weeks: plan.weeks.map((week) => {
      delete week.id;
      return {
        ...week,
        days: week.days.map((day) => {
          delete day.id;
          return {
            ...day,
            exercises: day.exercises.map((ex) => {
              delete ex.id;
              return ex;
            }),
          };
        }),
      };
    }),
  };
  delete newPlan.id;
  const newUserPlan = await planRepo.save(newPlan);
  SuccessResponse(res, newUserPlan);
});

module.exports = {
  generateProgram,
  getUsersPlans,
  getPremadePlans,
  getPlanRegistration,
  editUserPlanDay,
  createPlanFromTemplate,
  updateUserPlanStatus,
  getPlanById,
  createPlan,
  reusePlan,
};
