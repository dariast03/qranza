CREATE TABLE "organization_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"organizationId" text NOT NULL,
	"industryCode" text NOT NULL,
	"countryCode" text NOT NULL,
	"currencyCode" text NOT NULL,
	"timezone" text NOT NULL,
	"city" text,
	"address" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "organization_profile_organizationId_unique" UNIQUE("organizationId")
);
--> statement-breakpoint
ALTER TABLE "organization" DROP CONSTRAINT "organization_industryCode_industry_code_fk";
--> statement-breakpoint
ALTER TABLE "organization" DROP CONSTRAINT "organization_countryCode_country_code_fk";
--> statement-breakpoint
ALTER TABLE "organization" DROP CONSTRAINT "organization_currencyCode_currency_code_fk";
--> statement-breakpoint
ALTER TABLE "organization_profile" ADD CONSTRAINT "organization_profile_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_profile" ADD CONSTRAINT "organization_profile_industryCode_industry_code_fk" FOREIGN KEY ("industryCode") REFERENCES "public"."industry"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_profile" ADD CONSTRAINT "organization_profile_countryCode_country_code_fk" FOREIGN KEY ("countryCode") REFERENCES "public"."country"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_profile" ADD CONSTRAINT "organization_profile_currencyCode_currency_code_fk" FOREIGN KEY ("currencyCode") REFERENCES "public"."currency"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "organization_profile_organizationId_idx" ON "organization_profile" USING btree ("organizationId");--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "industryCode";--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "countryCode";--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "currencyCode";--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "timezone";--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "address";