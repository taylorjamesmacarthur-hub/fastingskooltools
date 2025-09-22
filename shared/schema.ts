import { pgTable, text, integer, timestamp, boolean, serial, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dailyLogs = pgTable("daily_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  startTime: text("start_time"), // HH:MM format
  endTime: text("end_time"), // HH:MM format
  fastingHours: real("fasting_hours"),
  cleanFast: boolean("clean_fast").default(true),
  mood: integer("mood"), // 1-5 scale
  energyLevel: integer("energy_level"), // 1-5 scale
  weight: real("weight"),
  steps: integer("steps"),
  waterIntake: real("water_intake"), // in liters
  exerciseMinutes: integer("exercise_minutes"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  targetFrequency: text("target_frequency").notNull(), // daily, weekly, etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const habitLogs = pgTable("habit_logs", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id").references(() => habits.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  completed: boolean("completed").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  theme: text("theme").default("light"),
  notifications: boolean("notifications").default(true),
  defaultFastingHours: integer("default_fasting_hours").default(16),
  weightUnit: text("weight_unit").default("kg"), // kg or lbs
  heightUnit: text("height_unit").default("cm"), // cm or inches
  timezone: text("timezone").default("UTC"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const calorieCalculations = pgTable("calorie_calculations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  age: integer("age").notNull(),
  weight: real("weight").notNull(),
  height: real("height").notNull(),
  sex: text("sex").notNull(), // M or F
  activityLevel: text("activity_level").notNull(),
  bmr: real("bmr"),
  tdee: real("tdee"),
  proteinTarget: real("protein_target"),
  carbTarget: real("carb_target"),
  fatTarget: real("fat_target"),
  calorieTarget: real("calorie_target"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const windowPlans = pgTable("window_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  schedule: jsonb("schedule").notNull(), // JSON object with day-specific windows
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertDailyLogSchema = createInsertSchema(dailyLogs);
export const selectDailyLogSchema = createSelectSchema(dailyLogs);
export const insertHabitSchema = createInsertSchema(habits);
export const selectHabitSchema = createSelectSchema(habits);
export const insertHabitLogSchema = createInsertSchema(habitLogs);
export const selectHabitLogSchema = createSelectSchema(habitLogs);
export const insertUserSettingsSchema = createInsertSchema(userSettings);
export const selectUserSettingsSchema = createSelectSchema(userSettings);
export const insertCalorieCalculationSchema = createInsertSchema(calorieCalculations);
export const selectCalorieCalculationSchema = createSelectSchema(calorieCalculations);
export const insertWindowPlanSchema = createInsertSchema(windowPlans);
export const selectWindowPlanSchema = createSelectSchema(windowPlans);

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type DailyLog = typeof dailyLogs.$inferSelect;
export type NewDailyLog = typeof dailyLogs.$inferInsert;
export type Habit = typeof habits.$inferSelect;
export type NewHabit = typeof habits.$inferInsert;
export type HabitLog = typeof habitLogs.$inferSelect;
export type NewHabitLog = typeof habitLogs.$inferInsert;
export type UserSettings = typeof userSettings.$inferSelect;
export type NewUserSettings = typeof userSettings.$inferInsert;
export type CalorieCalculation = typeof calorieCalculations.$inferSelect;
export type NewCalorieCalculation = typeof calorieCalculations.$inferInsert;
export type WindowPlan = typeof windowPlans.$inferSelect;
export type NewWindowPlan = typeof windowPlans.$inferInsert;