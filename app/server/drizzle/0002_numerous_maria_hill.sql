CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"postId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"parentCommentId" uuid,
	"replyingTo" text,
	"content" text NOT NULL,
	"score" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentCommentId_comments_id_fk" FOREIGN KEY ("parentCommentId") REFERENCES "public"."comments"("id") ON DELETE set null ON UPDATE no action;