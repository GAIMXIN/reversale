/*
  Warnings:

  - You are about to drop the `PatientData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "PatientData";

-- CreateTable
CREATE TABLE "PatientVitals" (
    "id" SERIAL NOT NULL,
    "bloodPressure" TEXT,
    "heartRate" TEXT,
    "oxygenLevel" TEXT,
    "temperature" TEXT,
    "weight" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "patientId" INTEGER NOT NULL,

    CONSTRAINT "PatientVitals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PatientVitals_patientId_key" ON "PatientVitals"("patientId");

-- AddForeignKey
ALTER TABLE "PatientVitals" ADD CONSTRAINT "PatientVitals_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
