-- CreateTable
CREATE TABLE "msg" (
    "id" SERIAL NOT NULL,
    "sender" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "msg_pkey" PRIMARY KEY ("id")
);
