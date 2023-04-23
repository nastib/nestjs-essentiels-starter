-- AlterTable
ALTER TABLE "user" ADD COLUMN     "currentBalance" INTEGER NOT NULL DEFAULT 2000,
ADD COLUMN     "initialBalance" INTEGER NOT NULL DEFAULT 2000;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "expense" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "amount" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "expense_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
