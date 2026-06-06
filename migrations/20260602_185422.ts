import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'fr', 'nl');
  CREATE TYPE "public"."enum_users_role" AS ENUM('superAdmin', 'admin', 'editor', 'user');
  CREATE TYPE "public"."enum_venues_information_serves" AS ENUM('breakfast', 'brunch', 'lunch', 'dinner', 'snack', 'drinks', 'coffee');
  CREATE TYPE "public"."enum_venues_information_hours_day_of_week" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum_venues_club" AS ENUM('brussels', 'gent', 'antwerp');
  CREATE TYPE "public"."enum_venues_damage" AS ENUM('*', '**', '***', '****', '*****');
  CREATE TYPE "public"."enum_venues_information_type" AS ENUM('market', 'food-truck', 'shop', 'restaurant', 'bar', 'bakery', 'butcher');
  CREATE TYPE "public"."enum_venues_information_orientation" AS ENUM('NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N');
  CREATE TYPE "public"."enum_venues_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__venues_v_version_information_serves" AS ENUM('breakfast', 'brunch', 'lunch', 'dinner', 'snack', 'drinks', 'coffee');
  CREATE TYPE "public"."enum__venues_v_version_information_hours_day_of_week" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum__venues_v_version_club" AS ENUM('brussels', 'gent', 'antwerp');
  CREATE TYPE "public"."enum__venues_v_version_damage" AS ENUM('*', '**', '***', '****', '*****');
  CREATE TYPE "public"."enum__venues_v_version_information_type" AS ENUM('market', 'food-truck', 'shop', 'restaurant', 'bar', 'bakery', 'butcher');
  CREATE TYPE "public"."enum__venues_v_version_information_orientation" AS ENUM('NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N');
  CREATE TYPE "public"."enum__venues_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__venues_v_published_locale" AS ENUM('en', 'fr', 'nl');
  CREATE TYPE "public"."enum_cuisines_type" AS ENUM('drinks', 'cuisine', 'dish', 'shop', 'style');
  CREATE TYPE "public"."enum_events_information_tags" AS ENUM('Festival', 'International Day', 'Pop-up', 'Opening', 'Special Menu', 'Market', 'Workshop');
  CREATE TYPE "public"."enum_events_information_every" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
  CREATE TYPE "public"."enum_events_information_frequency" AS ENUM('yearly', 'monthly', 'weekly');
  CREATE TYPE "public"."enum_events_information_month" AS ENUM('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_information_tags" AS ENUM('Festival', 'International Day', 'Pop-up', 'Opening', 'Special Menu', 'Market', 'Workshop');
  CREATE TYPE "public"."enum__events_v_version_information_every" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
  CREATE TYPE "public"."enum__events_v_version_information_frequency" AS ENUM('yearly', 'monthly', 'weekly');
  CREATE TYPE "public"."enum__events_v_version_information_month" AS ENUM('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_published_locale" AS ENUM('en', 'fr', 'nl');
  CREATE TYPE "public"."weather_cond" AS ENUM('sunny', 'rainy', 'cloudy');
  CREATE TYPE "public"."enum_page_blocks_content_with_media_text_position" AS ENUM('left', 'right');
  CREATE TABLE "users_role" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_role",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"first_name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "cats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"description" varchar NOT NULL,
  	"media_hero_id" integer,
  	"url" varchar,
  	"meta_keywords" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cats_locales" (
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cats_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"venues_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"alt" varchar,
  	"dish" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_mobile_thumbnail_url" varchar,
  	"sizes_mobile_thumbnail_width" numeric,
  	"sizes_mobile_thumbnail_height" numeric,
  	"sizes_mobile_thumbnail_mime_type" varchar,
  	"sizes_mobile_thumbnail_filesize" numeric,
  	"sizes_mobile_thumbnail_filename" varchar,
  	"sizes_mobile_friendly_url" varchar,
  	"sizes_mobile_friendly_width" numeric,
  	"sizes_mobile_friendly_height" numeric,
  	"sizes_mobile_friendly_mime_type" varchar,
  	"sizes_mobile_friendly_filesize" numeric,
  	"sizes_mobile_friendly_filename" varchar,
  	"sizes_tablet_url" varchar,
  	"sizes_tablet_width" numeric,
  	"sizes_tablet_height" numeric,
  	"sizes_tablet_mime_type" varchar,
  	"sizes_tablet_filesize" numeric,
  	"sizes_tablet_filename" varchar,
  	"sizes_original_url" varchar,
  	"sizes_original_width" numeric,
  	"sizes_original_height" numeric,
  	"sizes_original_mime_type" varchar,
  	"sizes_original_filesize" numeric,
  	"sizes_original_filename" varchar
  );
  
  CREATE TABLE "venues_information_serves" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_venues_information_serves",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "venues_information_hours_periods" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"open_time" varchar,
  	"close_time" varchar,
  	"close_time_special" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "venues_information_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day_of_week" "enum_venues_information_hours_day_of_week",
  	"is_closed" boolean DEFAULT false
  );
  
  CREATE TABLE "venues" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"venue_name" varchar,
  	"url" varchar,
  	"club" "enum_venues_club",
  	"damage" "enum_venues_damage",
  	"new" boolean DEFAULT true,
  	"media_hero_id" integer,
  	"information_type" "enum_venues_information_type",
  	"information_has_terrace" boolean,
  	"information_orientation" "enum_venues_information_orientation",
  	"information_take_away" boolean,
  	"information_address_street" varchar,
  	"information_address_house_number" varchar,
  	"information_address_city" varchar,
  	"information_address_postal_code" varchar,
  	"information_address_longitude" numeric,
  	"information_address_latitude" numeric,
  	"information_sun_kissed" boolean,
  	"information_remarks" varchar,
  	"information_reservations" varchar,
  	"review_review" jsonb,
  	"meta_keywords" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_venues_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "venues_locales" (
  	"review_food_club_order" jsonb,
  	"review_backstory" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "venues_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"cuisines_id" integer
  );
  
  CREATE TABLE "_venues_v_version_information_serves" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__venues_v_version_information_serves",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_venues_v_version_information_hours_periods" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"open_time" varchar,
  	"close_time" varchar,
  	"close_time_special" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_venues_v_version_information_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day_of_week" "enum__venues_v_version_information_hours_day_of_week",
  	"is_closed" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_venues_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_venue_name" varchar,
  	"version_url" varchar,
  	"version_club" "enum__venues_v_version_club",
  	"version_damage" "enum__venues_v_version_damage",
  	"version_new" boolean DEFAULT true,
  	"version_media_hero_id" integer,
  	"version_information_type" "enum__venues_v_version_information_type",
  	"version_information_has_terrace" boolean,
  	"version_information_orientation" "enum__venues_v_version_information_orientation",
  	"version_information_take_away" boolean,
  	"version_information_address_street" varchar,
  	"version_information_address_house_number" varchar,
  	"version_information_address_city" varchar,
  	"version_information_address_postal_code" varchar,
  	"version_information_address_longitude" numeric,
  	"version_information_address_latitude" numeric,
  	"version_information_sun_kissed" boolean,
  	"version_information_remarks" varchar,
  	"version_information_reservations" varchar,
  	"version_review_review" jsonb,
  	"version_meta_keywords" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__venues_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__venues_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_venues_v_locales" (
  	"version_review_food_club_order" jsonb,
  	"version_review_backstory" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_venues_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"cuisines_id" integer
  );
  
  CREATE TABLE "cuisines" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_cuisines_type" NOT NULL,
  	"active" boolean,
  	"meta_keywords" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cuisines_locales" (
  	"name" varchar NOT NULL,
  	"description" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "events_information_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_events_information_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "events_information_every" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_events_information_every",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"cta_id" integer,
  	"information_description" jsonb,
  	"information_external_link" varchar,
  	"information_location" varchar,
  	"information_repeats" boolean DEFAULT false,
  	"information_start_date" timestamp(3) with time zone,
  	"information_end_date" timestamp(3) with time zone,
  	"information_start_time" varchar,
  	"information_end_time" varchar,
  	"information_frequency" "enum_events_information_frequency",
  	"information_month" "enum_events_information_month",
  	"information_day" numeric,
  	"media_hero_image_id" integer,
  	"meta_keywords" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "events_locales" (
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"cuisines_id" integer,
  	"venues_id" integer
  );
  
  CREATE TABLE "_events_v_version_information_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__events_v_version_information_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_events_v_version_information_every" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__events_v_version_information_every",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_cta_id" integer,
  	"version_information_description" jsonb,
  	"version_information_external_link" varchar,
  	"version_information_location" varchar,
  	"version_information_repeats" boolean DEFAULT false,
  	"version_information_start_date" timestamp(3) with time zone,
  	"version_information_end_date" timestamp(3) with time zone,
  	"version_information_start_time" varchar,
  	"version_information_end_time" varchar,
  	"version_information_frequency" "enum__events_v_version_information_frequency",
  	"version_information_month" "enum__events_v_version_information_month",
  	"version_information_day" numeric,
  	"version_media_hero_image_id" integer,
  	"version_meta_keywords" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__events_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_events_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_events_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"cuisines_id" integer,
  	"venues_id" integer
  );
  
  CREATE TABLE "recommendations_weather_matrix" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"weather_condition" "weather_cond",
  	"min" numeric,
  	"max" numeric,
  	"time_slots_morning" varchar,
  	"time_slots_afternoon" varchar,
  	"time_slots_evening" varchar
  );
  
  CREATE TABLE "recommendations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"cta" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "recommendations_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"cuisines_id" integer,
  	"venues_id" integer
  );
  
  CREATE TABLE "_recommendations_v_version_weather_matrix" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"weather_condition" "weather_cond",
  	"min" numeric,
  	"max" numeric,
  	"time_slots_morning" varchar,
  	"time_slots_afternoon" varchar,
  	"time_slots_evening" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_recommendations_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar NOT NULL,
  	"version_cta" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_recommendations_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"cuisines_id" integer,
  	"venues_id" integer
  );
  
  CREATE TABLE "page_blocks_content_with_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"image_id" integer,
  	"text_position" "enum_page_blocks_content_with_media_text_position",
  	"block_name" varchar
  );
  
  CREATE TABLE "page_blocks_food_club_rule" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rule_number" varchar NOT NULL,
  	"rule" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_blocks_hero_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"meta_keywords" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "page_locales" (
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"cats_id" integer,
  	"media_id" integer,
  	"venues_id" integer,
  	"cuisines_id" integer,
  	"events_id" integer,
  	"recommendations_id" integer,
  	"page_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_role" ADD CONSTRAINT "users_role_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cats" ADD CONSTRAINT "cats_media_hero_id_media_id_fk" FOREIGN KEY ("media_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cats_locales" ADD CONSTRAINT "cats_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cats_locales" ADD CONSTRAINT "cats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cats_rels" ADD CONSTRAINT "cats_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cats_rels" ADD CONSTRAINT "cats_rels_venues_fk" FOREIGN KEY ("venues_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "venues_information_serves" ADD CONSTRAINT "venues_information_serves_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "venues_information_hours_periods" ADD CONSTRAINT "venues_information_hours_periods_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."venues_information_hours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "venues_information_hours" ADD CONSTRAINT "venues_information_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "venues" ADD CONSTRAINT "venues_media_hero_id_media_id_fk" FOREIGN KEY ("media_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "venues_locales" ADD CONSTRAINT "venues_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "venues_locales" ADD CONSTRAINT "venues_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "venues_rels" ADD CONSTRAINT "venues_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "venues_rels" ADD CONSTRAINT "venues_rels_cuisines_fk" FOREIGN KEY ("cuisines_id") REFERENCES "public"."cuisines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_venues_v_version_information_serves" ADD CONSTRAINT "_venues_v_version_information_serves_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_venues_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_venues_v_version_information_hours_periods" ADD CONSTRAINT "_venues_v_version_information_hours_periods_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_venues_v_version_information_hours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_venues_v_version_information_hours" ADD CONSTRAINT "_venues_v_version_information_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_venues_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_venues_v" ADD CONSTRAINT "_venues_v_parent_id_venues_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."venues"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_venues_v" ADD CONSTRAINT "_venues_v_version_media_hero_id_media_id_fk" FOREIGN KEY ("version_media_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_venues_v_locales" ADD CONSTRAINT "_venues_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_venues_v_locales" ADD CONSTRAINT "_venues_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_venues_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_venues_v_rels" ADD CONSTRAINT "_venues_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_venues_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_venues_v_rels" ADD CONSTRAINT "_venues_v_rels_cuisines_fk" FOREIGN KEY ("cuisines_id") REFERENCES "public"."cuisines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cuisines_locales" ADD CONSTRAINT "cuisines_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cuisines_locales" ADD CONSTRAINT "cuisines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cuisines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_information_tags" ADD CONSTRAINT "events_information_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_information_every" ADD CONSTRAINT "events_information_every_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_cta_id_recommendations_id_fk" FOREIGN KEY ("cta_id") REFERENCES "public"."recommendations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_media_hero_image_id_media_id_fk" FOREIGN KEY ("media_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_locales" ADD CONSTRAINT "events_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_locales" ADD CONSTRAINT "events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_cuisines_fk" FOREIGN KEY ("cuisines_id") REFERENCES "public"."cuisines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_venues_fk" FOREIGN KEY ("venues_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_information_tags" ADD CONSTRAINT "_events_v_version_information_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_information_every" ADD CONSTRAINT "_events_v_version_information_every_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_cta_id_recommendations_id_fk" FOREIGN KEY ("version_cta_id") REFERENCES "public"."recommendations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_media_hero_image_id_media_id_fk" FOREIGN KEY ("version_media_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_locales" ADD CONSTRAINT "_events_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_locales" ADD CONSTRAINT "_events_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_cuisines_fk" FOREIGN KEY ("cuisines_id") REFERENCES "public"."cuisines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_venues_fk" FOREIGN KEY ("venues_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "recommendations_weather_matrix" ADD CONSTRAINT "recommendations_weather_matrix_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."recommendations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "recommendations_rels" ADD CONSTRAINT "recommendations_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."recommendations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "recommendations_rels" ADD CONSTRAINT "recommendations_rels_cuisines_fk" FOREIGN KEY ("cuisines_id") REFERENCES "public"."cuisines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "recommendations_rels" ADD CONSTRAINT "recommendations_rels_venues_fk" FOREIGN KEY ("venues_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_recommendations_v_version_weather_matrix" ADD CONSTRAINT "_recommendations_v_version_weather_matrix_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_recommendations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_recommendations_v" ADD CONSTRAINT "_recommendations_v_parent_id_recommendations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."recommendations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_recommendations_v_rels" ADD CONSTRAINT "_recommendations_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_recommendations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_recommendations_v_rels" ADD CONSTRAINT "_recommendations_v_rels_cuisines_fk" FOREIGN KEY ("cuisines_id") REFERENCES "public"."cuisines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_recommendations_v_rels" ADD CONSTRAINT "_recommendations_v_rels_venues_fk" FOREIGN KEY ("venues_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_blocks_content_with_media" ADD CONSTRAINT "page_blocks_content_with_media_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_blocks_content_with_media" ADD CONSTRAINT "page_blocks_content_with_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_blocks_food_club_rule" ADD CONSTRAINT "page_blocks_food_club_rule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_blocks_hero_image" ADD CONSTRAINT "page_blocks_hero_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_blocks_hero_image" ADD CONSTRAINT "page_blocks_hero_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_blocks_text_block" ADD CONSTRAINT "page_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_locales" ADD CONSTRAINT "page_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_locales" ADD CONSTRAINT "page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cats_fk" FOREIGN KEY ("cats_id") REFERENCES "public"."cats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_venues_fk" FOREIGN KEY ("venues_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cuisines_fk" FOREIGN KEY ("cuisines_id") REFERENCES "public"."cuisines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_recommendations_fk" FOREIGN KEY ("recommendations_id") REFERENCES "public"."recommendations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_fk" FOREIGN KEY ("page_id") REFERENCES "public"."page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_role_order_idx" ON "users_role" USING btree ("order");
  CREATE INDEX "users_role_parent_idx" ON "users_role" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "cats_media_media_hero_idx" ON "cats" USING btree ("media_hero_id");
  CREATE INDEX "cats_updated_at_idx" ON "cats" USING btree ("updated_at");
  CREATE INDEX "cats_created_at_idx" ON "cats" USING btree ("created_at");
  CREATE INDEX "cats_meta_meta_image_idx" ON "cats_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "cats_locales_locale_parent_id_unique" ON "cats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cats_rels_order_idx" ON "cats_rels" USING btree ("order");
  CREATE INDEX "cats_rels_parent_idx" ON "cats_rels" USING btree ("parent_id");
  CREATE INDEX "cats_rels_path_idx" ON "cats_rels" USING btree ("path");
  CREATE INDEX "cats_rels_venues_id_idx" ON "cats_rels" USING btree ("venues_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_mobile_thumbnail_sizes_mobile_thumbnail_file_idx" ON "media" USING btree ("sizes_mobile_thumbnail_filename");
  CREATE INDEX "media_sizes_mobile_friendly_sizes_mobile_friendly_filena_idx" ON "media" USING btree ("sizes_mobile_friendly_filename");
  CREATE INDEX "media_sizes_tablet_sizes_tablet_filename_idx" ON "media" USING btree ("sizes_tablet_filename");
  CREATE INDEX "media_sizes_original_sizes_original_filename_idx" ON "media" USING btree ("sizes_original_filename");
  CREATE INDEX "venues_information_serves_order_idx" ON "venues_information_serves" USING btree ("order");
  CREATE INDEX "venues_information_serves_parent_idx" ON "venues_information_serves" USING btree ("parent_id");
  CREATE INDEX "venues_information_hours_periods_order_idx" ON "venues_information_hours_periods" USING btree ("_order");
  CREATE INDEX "venues_information_hours_periods_parent_id_idx" ON "venues_information_hours_periods" USING btree ("_parent_id");
  CREATE INDEX "venues_information_hours_order_idx" ON "venues_information_hours" USING btree ("_order");
  CREATE INDEX "venues_information_hours_parent_id_idx" ON "venues_information_hours" USING btree ("_parent_id");
  CREATE INDEX "venues_media_media_hero_idx" ON "venues" USING btree ("media_hero_id");
  CREATE INDEX "venues_updated_at_idx" ON "venues" USING btree ("updated_at");
  CREATE INDEX "venues_created_at_idx" ON "venues" USING btree ("created_at");
  CREATE INDEX "venues__status_idx" ON "venues" USING btree ("_status");
  CREATE INDEX "venues_meta_meta_image_idx" ON "venues_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "venues_locales_locale_parent_id_unique" ON "venues_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "venues_rels_order_idx" ON "venues_rels" USING btree ("order");
  CREATE INDEX "venues_rels_parent_idx" ON "venues_rels" USING btree ("parent_id");
  CREATE INDEX "venues_rels_path_idx" ON "venues_rels" USING btree ("path");
  CREATE INDEX "venues_rels_cuisines_id_idx" ON "venues_rels" USING btree ("cuisines_id");
  CREATE INDEX "_venues_v_version_information_serves_order_idx" ON "_venues_v_version_information_serves" USING btree ("order");
  CREATE INDEX "_venues_v_version_information_serves_parent_idx" ON "_venues_v_version_information_serves" USING btree ("parent_id");
  CREATE INDEX "_venues_v_version_information_hours_periods_order_idx" ON "_venues_v_version_information_hours_periods" USING btree ("_order");
  CREATE INDEX "_venues_v_version_information_hours_periods_parent_id_idx" ON "_venues_v_version_information_hours_periods" USING btree ("_parent_id");
  CREATE INDEX "_venues_v_version_information_hours_order_idx" ON "_venues_v_version_information_hours" USING btree ("_order");
  CREATE INDEX "_venues_v_version_information_hours_parent_id_idx" ON "_venues_v_version_information_hours" USING btree ("_parent_id");
  CREATE INDEX "_venues_v_parent_idx" ON "_venues_v" USING btree ("parent_id");
  CREATE INDEX "_venues_v_version_media_version_media_hero_idx" ON "_venues_v" USING btree ("version_media_hero_id");
  CREATE INDEX "_venues_v_version_version_updated_at_idx" ON "_venues_v" USING btree ("version_updated_at");
  CREATE INDEX "_venues_v_version_version_created_at_idx" ON "_venues_v" USING btree ("version_created_at");
  CREATE INDEX "_venues_v_version_version__status_idx" ON "_venues_v" USING btree ("version__status");
  CREATE INDEX "_venues_v_created_at_idx" ON "_venues_v" USING btree ("created_at");
  CREATE INDEX "_venues_v_updated_at_idx" ON "_venues_v" USING btree ("updated_at");
  CREATE INDEX "_venues_v_snapshot_idx" ON "_venues_v" USING btree ("snapshot");
  CREATE INDEX "_venues_v_published_locale_idx" ON "_venues_v" USING btree ("published_locale");
  CREATE INDEX "_venues_v_latest_idx" ON "_venues_v" USING btree ("latest");
  CREATE INDEX "_venues_v_version_meta_version_meta_image_idx" ON "_venues_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_venues_v_locales_locale_parent_id_unique" ON "_venues_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_venues_v_rels_order_idx" ON "_venues_v_rels" USING btree ("order");
  CREATE INDEX "_venues_v_rels_parent_idx" ON "_venues_v_rels" USING btree ("parent_id");
  CREATE INDEX "_venues_v_rels_path_idx" ON "_venues_v_rels" USING btree ("path");
  CREATE INDEX "_venues_v_rels_cuisines_id_idx" ON "_venues_v_rels" USING btree ("cuisines_id");
  CREATE INDEX "cuisines_updated_at_idx" ON "cuisines" USING btree ("updated_at");
  CREATE INDEX "cuisines_created_at_idx" ON "cuisines" USING btree ("created_at");
  CREATE INDEX "cuisines_meta_meta_image_idx" ON "cuisines_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "cuisines_locales_locale_parent_id_unique" ON "cuisines_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_information_tags_order_idx" ON "events_information_tags" USING btree ("order");
  CREATE INDEX "events_information_tags_parent_idx" ON "events_information_tags" USING btree ("parent_id");
  CREATE INDEX "events_information_every_order_idx" ON "events_information_every" USING btree ("order");
  CREATE INDEX "events_information_every_parent_idx" ON "events_information_every" USING btree ("parent_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_cta_idx" ON "events" USING btree ("cta_id");
  CREATE INDEX "events_media_media_hero_image_idx" ON "events" USING btree ("media_hero_image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "events_meta_meta_image_idx" ON "events_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "events_locales_locale_parent_id_unique" ON "events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX "events_rels_cuisines_id_idx" ON "events_rels" USING btree ("cuisines_id");
  CREATE INDEX "events_rels_venues_id_idx" ON "events_rels" USING btree ("venues_id");
  CREATE INDEX "_events_v_version_information_tags_order_idx" ON "_events_v_version_information_tags" USING btree ("order");
  CREATE INDEX "_events_v_version_information_tags_parent_idx" ON "_events_v_version_information_tags" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_information_every_order_idx" ON "_events_v_version_information_every" USING btree ("order");
  CREATE INDEX "_events_v_version_information_every_parent_idx" ON "_events_v_version_information_every" USING btree ("parent_id");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_cta_idx" ON "_events_v" USING btree ("version_cta_id");
  CREATE INDEX "_events_v_version_media_version_media_hero_image_idx" ON "_events_v" USING btree ("version_media_hero_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_snapshot_idx" ON "_events_v" USING btree ("snapshot");
  CREATE INDEX "_events_v_published_locale_idx" ON "_events_v" USING btree ("published_locale");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_version_meta_version_meta_image_idx" ON "_events_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_events_v_locales_locale_parent_id_unique" ON "_events_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_events_v_rels_order_idx" ON "_events_v_rels" USING btree ("order");
  CREATE INDEX "_events_v_rels_parent_idx" ON "_events_v_rels" USING btree ("parent_id");
  CREATE INDEX "_events_v_rels_path_idx" ON "_events_v_rels" USING btree ("path");
  CREATE INDEX "_events_v_rels_cuisines_id_idx" ON "_events_v_rels" USING btree ("cuisines_id");
  CREATE INDEX "_events_v_rels_venues_id_idx" ON "_events_v_rels" USING btree ("venues_id");
  CREATE INDEX "recommendations_weather_matrix_order_idx" ON "recommendations_weather_matrix" USING btree ("_order");
  CREATE INDEX "recommendations_weather_matrix_parent_id_idx" ON "recommendations_weather_matrix" USING btree ("_parent_id");
  CREATE INDEX "recommendations_updated_at_idx" ON "recommendations" USING btree ("updated_at");
  CREATE INDEX "recommendations_created_at_idx" ON "recommendations" USING btree ("created_at");
  CREATE INDEX "recommendations_rels_order_idx" ON "recommendations_rels" USING btree ("order");
  CREATE INDEX "recommendations_rels_parent_idx" ON "recommendations_rels" USING btree ("parent_id");
  CREATE INDEX "recommendations_rels_path_idx" ON "recommendations_rels" USING btree ("path");
  CREATE INDEX "recommendations_rels_cuisines_id_idx" ON "recommendations_rels" USING btree ("cuisines_id");
  CREATE INDEX "recommendations_rels_venues_id_idx" ON "recommendations_rels" USING btree ("venues_id");
  CREATE INDEX "_recommendations_v_version_weather_matrix_order_idx" ON "_recommendations_v_version_weather_matrix" USING btree ("_order");
  CREATE INDEX "_recommendations_v_version_weather_matrix_parent_id_idx" ON "_recommendations_v_version_weather_matrix" USING btree ("_parent_id");
  CREATE INDEX "_recommendations_v_parent_idx" ON "_recommendations_v" USING btree ("parent_id");
  CREATE INDEX "_recommendations_v_version_version_updated_at_idx" ON "_recommendations_v" USING btree ("version_updated_at");
  CREATE INDEX "_recommendations_v_version_version_created_at_idx" ON "_recommendations_v" USING btree ("version_created_at");
  CREATE INDEX "_recommendations_v_created_at_idx" ON "_recommendations_v" USING btree ("created_at");
  CREATE INDEX "_recommendations_v_updated_at_idx" ON "_recommendations_v" USING btree ("updated_at");
  CREATE INDEX "_recommendations_v_rels_order_idx" ON "_recommendations_v_rels" USING btree ("order");
  CREATE INDEX "_recommendations_v_rels_parent_idx" ON "_recommendations_v_rels" USING btree ("parent_id");
  CREATE INDEX "_recommendations_v_rels_path_idx" ON "_recommendations_v_rels" USING btree ("path");
  CREATE INDEX "_recommendations_v_rels_cuisines_id_idx" ON "_recommendations_v_rels" USING btree ("cuisines_id");
  CREATE INDEX "_recommendations_v_rels_venues_id_idx" ON "_recommendations_v_rels" USING btree ("venues_id");
  CREATE INDEX "page_blocks_content_with_media_order_idx" ON "page_blocks_content_with_media" USING btree ("_order");
  CREATE INDEX "page_blocks_content_with_media_parent_id_idx" ON "page_blocks_content_with_media" USING btree ("_parent_id");
  CREATE INDEX "page_blocks_content_with_media_path_idx" ON "page_blocks_content_with_media" USING btree ("_path");
  CREATE INDEX "page_blocks_content_with_media_image_idx" ON "page_blocks_content_with_media" USING btree ("image_id");
  CREATE INDEX "page_blocks_food_club_rule_order_idx" ON "page_blocks_food_club_rule" USING btree ("_order");
  CREATE INDEX "page_blocks_food_club_rule_parent_id_idx" ON "page_blocks_food_club_rule" USING btree ("_parent_id");
  CREATE INDEX "page_blocks_food_club_rule_path_idx" ON "page_blocks_food_club_rule" USING btree ("_path");
  CREATE INDEX "page_blocks_hero_image_order_idx" ON "page_blocks_hero_image" USING btree ("_order");
  CREATE INDEX "page_blocks_hero_image_parent_id_idx" ON "page_blocks_hero_image" USING btree ("_parent_id");
  CREATE INDEX "page_blocks_hero_image_path_idx" ON "page_blocks_hero_image" USING btree ("_path");
  CREATE INDEX "page_blocks_hero_image_image_idx" ON "page_blocks_hero_image" USING btree ("image_id");
  CREATE INDEX "page_blocks_text_block_order_idx" ON "page_blocks_text_block" USING btree ("_order");
  CREATE INDEX "page_blocks_text_block_parent_id_idx" ON "page_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "page_blocks_text_block_path_idx" ON "page_blocks_text_block" USING btree ("_path");
  CREATE INDEX "page_updated_at_idx" ON "page" USING btree ("updated_at");
  CREATE INDEX "page_created_at_idx" ON "page" USING btree ("created_at");
  CREATE INDEX "page_meta_meta_image_idx" ON "page_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "page_locales_locale_parent_id_unique" ON "page_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_cats_id_idx" ON "payload_locked_documents_rels" USING btree ("cats_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_venues_id_idx" ON "payload_locked_documents_rels" USING btree ("venues_id");
  CREATE INDEX "payload_locked_documents_rels_cuisines_id_idx" ON "payload_locked_documents_rels" USING btree ("cuisines_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_recommendations_id_idx" ON "payload_locked_documents_rels" USING btree ("recommendations_id");
  CREATE INDEX "payload_locked_documents_rels_page_id_idx" ON "payload_locked_documents_rels" USING btree ("page_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_role" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "cats" CASCADE;
  DROP TABLE "cats_locales" CASCADE;
  DROP TABLE "cats_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "venues_information_serves" CASCADE;
  DROP TABLE "venues_information_hours_periods" CASCADE;
  DROP TABLE "venues_information_hours" CASCADE;
  DROP TABLE "venues" CASCADE;
  DROP TABLE "venues_locales" CASCADE;
  DROP TABLE "venues_rels" CASCADE;
  DROP TABLE "_venues_v_version_information_serves" CASCADE;
  DROP TABLE "_venues_v_version_information_hours_periods" CASCADE;
  DROP TABLE "_venues_v_version_information_hours" CASCADE;
  DROP TABLE "_venues_v" CASCADE;
  DROP TABLE "_venues_v_locales" CASCADE;
  DROP TABLE "_venues_v_rels" CASCADE;
  DROP TABLE "cuisines" CASCADE;
  DROP TABLE "cuisines_locales" CASCADE;
  DROP TABLE "events_information_tags" CASCADE;
  DROP TABLE "events_information_every" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_locales" CASCADE;
  DROP TABLE "events_rels" CASCADE;
  DROP TABLE "_events_v_version_information_tags" CASCADE;
  DROP TABLE "_events_v_version_information_every" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "_events_v_locales" CASCADE;
  DROP TABLE "_events_v_rels" CASCADE;
  DROP TABLE "recommendations_weather_matrix" CASCADE;
  DROP TABLE "recommendations" CASCADE;
  DROP TABLE "recommendations_rels" CASCADE;
  DROP TABLE "_recommendations_v_version_weather_matrix" CASCADE;
  DROP TABLE "_recommendations_v" CASCADE;
  DROP TABLE "_recommendations_v_rels" CASCADE;
  DROP TABLE "page_blocks_content_with_media" CASCADE;
  DROP TABLE "page_blocks_food_club_rule" CASCADE;
  DROP TABLE "page_blocks_hero_image" CASCADE;
  DROP TABLE "page_blocks_text_block" CASCADE;
  DROP TABLE "page" CASCADE;
  DROP TABLE "page_locales" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_venues_information_serves";
  DROP TYPE "public"."enum_venues_information_hours_day_of_week";
  DROP TYPE "public"."enum_venues_club";
  DROP TYPE "public"."enum_venues_damage";
  DROP TYPE "public"."enum_venues_information_type";
  DROP TYPE "public"."enum_venues_information_orientation";
  DROP TYPE "public"."enum_venues_status";
  DROP TYPE "public"."enum__venues_v_version_information_serves";
  DROP TYPE "public"."enum__venues_v_version_information_hours_day_of_week";
  DROP TYPE "public"."enum__venues_v_version_club";
  DROP TYPE "public"."enum__venues_v_version_damage";
  DROP TYPE "public"."enum__venues_v_version_information_type";
  DROP TYPE "public"."enum__venues_v_version_information_orientation";
  DROP TYPE "public"."enum__venues_v_version_status";
  DROP TYPE "public"."enum__venues_v_published_locale";
  DROP TYPE "public"."enum_cuisines_type";
  DROP TYPE "public"."enum_events_information_tags";
  DROP TYPE "public"."enum_events_information_every";
  DROP TYPE "public"."enum_events_information_frequency";
  DROP TYPE "public"."enum_events_information_month";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_information_tags";
  DROP TYPE "public"."enum__events_v_version_information_every";
  DROP TYPE "public"."enum__events_v_version_information_frequency";
  DROP TYPE "public"."enum__events_v_version_information_month";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum__events_v_published_locale";
  DROP TYPE "public"."weather_cond";
  DROP TYPE "public"."enum_page_blocks_content_with_media_text_position";`)
}
