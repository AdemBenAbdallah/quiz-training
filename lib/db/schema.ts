import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const quizzes = sqliteTable("quizzes", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().default("unamed"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  )
});

export const questions = sqliteTable("questions", {
  id: integer("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id),
  question: text("question").notNull(),
  answer: text("answer").notNull()
});

export const options = sqliteTable("options", {
  id: integer("id").primaryKey(),
  questionId: integer("question_id").references(() => questions.id),
  option: text("option").notNull()
});

export const quizzesRelations = relations(quizzes, ({ many }) => ({
  questions: many(questions)
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [questions.quizId],
    references: [quizzes.id]
  }),
  options: many(options)
}));

export const optionsRelations = relations(options, ({ one }) => ({
  question: one(questions, {
    fields: [options.questionId],
    references: [questions.id]
  })
}));
