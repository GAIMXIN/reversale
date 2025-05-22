/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `first` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('doctor', 'patient');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "first" TEXT NOT NULL,
ADD COLUMN     "last" TEXT NOT NULL,
ADD COLUMN     "role" "Roles" NOT NULL;

-- CreateTable
CREATE TABLE "PatientData" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "PatientData_pkey" PRIMARY KEY ("id")
);
