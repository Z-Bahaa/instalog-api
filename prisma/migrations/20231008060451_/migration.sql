/*
  Warnings:

  - You are about to drop the column `Metadata_id` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `action_id` on the `Event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[event_id]` on the table `Action` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[event_id]` on the table `Metadata` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `event_id` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_id` to the `Metadata` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_Metadata_id_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_action_id_fkey";

-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "event_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "Metadata_id",
DROP COLUMN "action_id";

-- AlterTable
ALTER TABLE "Metadata" ADD COLUMN     "event_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Action_event_id_key" ON "Action"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "Metadata_event_id_key" ON "Metadata"("event_id");

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
