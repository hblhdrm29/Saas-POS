ALTER TABLE "promotions" ADD COLUMN "name" varchar(255);--> statement-breakpoint
ALTER TABLE "promotions" ADD COLUMN "usage_limit" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "promotions" ADD COLUMN "is_customer_limited" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "promotions" ADD COLUMN "complimentary_product_id" integer;--> statement-breakpoint
ALTER TABLE "promotions" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "shift" varchar(50);--> statement-breakpoint
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_complimentary_product_id_products_id_fk" FOREIGN KEY ("complimentary_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "sku_tenant_unique_idx" ON "products" USING btree ("tenant_id","sku");