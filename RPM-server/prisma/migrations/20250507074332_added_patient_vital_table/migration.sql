/*
  Warnings:

  - You are about to drop the column `bloodPressure` on the `PatientVitals` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `PatientVitals` table. All the data in the column will be lost.
  - You are about to drop the column `heartRate` on the `PatientVitals` table. All the data in the column will be lost.
  - You are about to drop the column `oxygenLevel` on the `PatientVitals` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `PatientVitals` table. All the data in the column will be lost.
  - You are about to drop the column `temperature` on the `PatientVitals` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `PatientVitals` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `PatientVitals` table. All the data in the column will be lost.
  - Added the required column `meals` to the `PatientVitals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `readingTime` to the `PatientVitals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `PatientVitals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PatientVitals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `PatientVitals` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Vitals" AS ENUM ('bloodPressure', 'heartRate', 'oxygenLevel', 'temperature', 'weight');

-- DropForeignKey
ALTER TABLE "PatientVitals" DROP CONSTRAINT "PatientVitals_patientId_fkey";

-- DropIndex
DROP INDEX "PatientVitals_patientId_key";

-- AlterTable
ALTER TABLE "PatientVitals" DROP COLUMN "bloodPressure",
DROP COLUMN "createdAt",
DROP COLUMN "heartRate",
DROP COLUMN "oxygenLevel",
DROP COLUMN "patientId",
DROP COLUMN "temperature",
DROP COLUMN "updatedAt",
DROP COLUMN "weight",
ADD COLUMN     "meals" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "readingTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "type" "Vitals" NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD COLUMN     "value" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PatientVitals" ADD CONSTRAINT "PatientVitals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
