-- AlterTable
ALTER TABLE "Action" ALTER COLUMN "object" SET DEFAULT 'event_action';

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "object" SET DEFAULT 'event';
