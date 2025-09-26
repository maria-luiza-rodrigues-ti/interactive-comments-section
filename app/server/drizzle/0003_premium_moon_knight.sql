ALTER TABLE "comments" DROP CONSTRAINT "comments_parentCommentId_comments_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN "replyingTo";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");