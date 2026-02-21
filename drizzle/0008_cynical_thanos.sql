ALTER TABLE "rmp_auth_accounts" RENAME TO "account";--> statement-breakpoint
ALTER TABLE "rmp_comments" RENAME TO "comments";--> statement-breakpoint
ALTER TABLE "rmp_auth_passkeys" RENAME TO "passkeys";--> statement-breakpoint
ALTER TABLE "rmp_plates" RENAME TO "plates";--> statement-breakpoint
ALTER TABLE "rmp_roles" RENAME TO "roles";--> statement-breakpoint
ALTER TABLE "rmp_auth_sessions" RENAME TO "session";--> statement-breakpoint
ALTER TABLE "rmp_user_favorite_plates" RENAME TO "user_favorite_plates";--> statement-breakpoint
ALTER TABLE "rmp_user_roles" RENAME TO "user_roles";--> statement-breakpoint
ALTER TABLE "rmp_auth_users" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "rmp_auth_verifications" RENAME TO "verification";--> statement-breakpoint
ALTER TABLE "passkeys" DROP CONSTRAINT "rmp_authenticator_credentialID_unique";--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT "rmp_account_userId_rmp_user_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "rmp_session_userId_rmp_user_id_fk";
--> statement-breakpoint
ALTER TABLE "passkeys" DROP CONSTRAINT "rmp_authenticator_userId_rmp_user_id_fk";
--> statement-breakpoint
ALTER TABLE "plates" DROP CONSTRAINT "rmp_plates_userId_rmp_user_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "rmp_comments_userId_rmp_user_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "rmp_comments_plateId_rmp_plates_id_fk";
--> statement-breakpoint
ALTER TABLE "user_roles" DROP CONSTRAINT "rmp_user_roles_userId_rmp_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_roles" DROP CONSTRAINT "rmp_user_roles_roleId_rmp_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "user_favorite_plates" DROP CONSTRAINT "rmp_user_favorite_plates_userId_rmp_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_favorite_plates" DROP CONSTRAINT "rmp_user_favorite_plates_plateId_rmp_plates_id_fk";
--> statement-breakpoint
DROP INDEX "rmp_auth_accounts_providerId_accountId_idx";--> statement-breakpoint
DROP INDEX "rmp_auth_sessions_token_idx";--> statement-breakpoint
DROP INDEX "rmp_auth_verifications_identifier_value_idx";--> statement-breakpoint
ALTER TABLE "passkeys" DROP CONSTRAINT "rmp_auth_passkeys_userId_credentialId_pk";--> statement-breakpoint
ALTER TABLE "user_roles" DROP CONSTRAINT "rmp_user_roles_userId_roleId_pk";--> statement-breakpoint
ALTER TABLE "user_favorite_plates" DROP CONSTRAINT "rmp_user_favorite_plates_userId_plateId_pk";--> statement-breakpoint
ALTER TABLE "passkeys" ADD CONSTRAINT "passkeys_userId_credentialId_pk" PRIMARY KEY("userId","credentialId");--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_roleId_pk" PRIMARY KEY("userId","roleId");--> statement-breakpoint
ALTER TABLE "user_favorite_plates" ADD CONSTRAINT "user_favorite_plates_userId_plateId_pk" PRIMARY KEY("userId","plateId");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passkeys" ADD CONSTRAINT "passkeys_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plates" ADD CONSTRAINT "plates_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_plateId_plates_id_fk" FOREIGN KEY ("plateId") REFERENCES "public"."plates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favorite_plates" ADD CONSTRAINT "user_favorite_plates_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favorite_plates" ADD CONSTRAINT "user_favorite_plates_plateId_plates_id_fk" FOREIGN KEY ("plateId") REFERENCES "public"."plates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "account_providerId_accountId_idx" ON "account" USING btree ("providerId","accountId");--> statement-breakpoint
CREATE UNIQUE INDEX "verification_identifier_value_idx" ON "verification" USING btree ("identifier","value");--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_token_unique" UNIQUE("token");--> statement-breakpoint
ALTER TABLE "passkeys" ADD CONSTRAINT "passkeys_credentialId_unique" UNIQUE("credentialId");