-- CreateTable
CREATE TABLE "Action" (
    "id" SERIAL NOT NULL,
    "object" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Metadata" (
    "id" SERIAL NOT NULL,
    "redirect" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "x_request_id" TEXT NOT NULL,

    CONSTRAINT "Metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "object" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "actor_name" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "action_id" INTEGER NOT NULL,
    "target_id" TEXT NOT NULL,
    "target_name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "occurred_at" TEXT NOT NULL,
    "Metadata_id" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_Metadata_id_fkey" FOREIGN KEY ("Metadata_id") REFERENCES "Metadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
