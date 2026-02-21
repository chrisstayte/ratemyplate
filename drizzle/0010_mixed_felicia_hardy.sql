CREATE TABLE "plate_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"plateId" integer NOT NULL,
	"userId" text NOT NULL,
	"rating" smallint,
	"comment" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "plate_reviews_rating_check" CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5))
);
--> statement-breakpoint
CREATE TABLE "review_likes" (
	"userId" text NOT NULL,
	"reviewId" integer NOT NULL,
	CONSTRAINT "review_likes_userId_reviewId_pk" PRIMARY KEY("userId","reviewId")
);
--> statement-breakpoint
ALTER TABLE "plate_reviews" ADD CONSTRAINT "plate_reviews_plateId_plates_id_fk" FOREIGN KEY ("plateId") REFERENCES "public"."plates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plate_reviews" ADD CONSTRAINT "plate_reviews_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
INSERT INTO "plate_reviews" ("plateId", "userId", "comment", "createdAt", "updatedAt")
SELECT DISTINCT ON ("userId", "plateId") "plateId", "userId", "comment", "timestamp", "timestamp"
FROM "comments"
ORDER BY "userId", "plateId", "timestamp" DESC;--> statement-breakpoint
DROP TABLE "comments" CASCADE;--> statement-breakpoint
ALTER TABLE "review_likes" ADD CONSTRAINT "review_likes_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_likes" ADD CONSTRAINT "review_likes_reviewId_plate_reviews_id_fk" FOREIGN KEY ("reviewId") REFERENCES "public"."plate_reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "plate_reviews_userId_plateId_idx" ON "plate_reviews" USING btree ("userId","plateId");
