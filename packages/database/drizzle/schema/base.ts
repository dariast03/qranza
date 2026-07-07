import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const language = pgTable(
	"language",
	{
		code: text("code").primaryKey(),
		name: text("name").notNull(),
		nativeName: text("nativeName").notNull(),
		direction: text("direction").notNull().default("ltr"),
		createdAt: timestamp("createdAt").defaultNow().notNull(),
		updatedAt: timestamp("updatedAt")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("language_name_idx").on(table.name)],
);

export const currency = pgTable(
	"currency",
	{
		code: text("code").primaryKey(),
		name: text("name").notNull(),
		symbol: text("symbol").notNull(),
		symbolNative: text("symbolNative"),
		decimals: integer("decimals").notNull().default(2),
		createdAt: timestamp("createdAt").defaultNow().notNull(),
		updatedAt: timestamp("updatedAt")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("currency_name_idx").on(table.name)],
);

export const country = pgTable(
	"country",
	{
		code: text("code").primaryKey(),
		name: text("name").notNull(),
		nativeName: text("nativeName"),
		phoneCode: text("phoneCode"),
		continent: text("continent"),
		capital: text("capital"),
		currencyCode: text("currencyCode")
			.notNull()
			.references(() => currency.code),
		languageCode: text("languageCode")
			.notNull()
			.references(() => language.code),
		createdAt: timestamp("createdAt").defaultNow().notNull(),
		updatedAt: timestamp("updatedAt")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [
		index("country_name_idx").on(table.name),
		index("country_currencyCode_idx").on(table.currencyCode),
		index("country_languageCode_idx").on(table.languageCode),
	],
);

export const languageRelations = relations(language, ({ many }) => ({
	countries: many(country),
}));

export const currencyRelations = relations(currency, ({ many }) => ({
	countries: many(country),
}));

export const countryRelations = relations(country, ({ one }) => ({
	currency: one(currency, {
		fields: [country.currencyCode],
		references: [currency.code],
	}),
	language: one(language, {
		fields: [country.languageCode],
		references: [language.code],
	}),
}));
