/*
  Warnings:

  - The primary key for the `msg` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "msg" DROP CONSTRAINT "msg_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "msg_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "msg_id_seq";
