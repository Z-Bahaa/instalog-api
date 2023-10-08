/*
  Warnings:

  - Changed the type of `actor_id` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `target_id` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `x_request_id` on the `Metadata` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "actor_id",
ADD COLUMN     "actor_id" INTEGER NOT NULL,
DROP COLUMN "target_id",
ADD COLUMN     "target_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Metadata" DROP COLUMN "x_request_id",
ADD COLUMN     "x_request_id" INTEGER NOT NULL;
