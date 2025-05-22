import { prisma } from '../generated/prismaClient';
import { DateTime } from 'luxon';

import { AddPatientVitalsInput, VitalType } from '../types/doctor.type';
import CustomError from '../utils/customError.utils';

const patientList = async (doctorId: number) => {
  return await prisma.user.findMany({
    where: {
      role: 'patient',
      AND: {
        PatientDoctor: {
          none: {
            doctorId: doctorId,
          },
        },
      },
    },
  });
};

const addPatient = async (doctorID: number, patientID: string) => {
  const patient = await prisma.user.findUnique({
    where: { id: Number(patientID), role: 'patient' },
  });
  if (!patient) throw new CustomError('Invalid patient ID provided', 400);
  await prisma.doctorPatient.create({
    data: {
      doctorId: doctorID,
      patientId: Number(patientID),
    },
  });
};
const dashboardPatientList = async (doctorId: number) => {
  const userList = await prisma.doctorPatient.findMany({
    where: {
      doctorId,
    },
    include: {
      patient: true,
    },
  });

  const formattedData = userList.map((data) => {
    return data.patient;
  });

  return formattedData;
};

const addPatientData = async (validatedData: AddPatientVitalsInput, patientId: string) => {
  const patientExist = await prisma.user.findUnique({
    where: {
      id: Number(patientId),
      role: 'patient',
    },
    select: { id: true },
  });

  if (!patientExist) throw new CustomError('Invalid patient id provided', 400);

  const { readingDate, readingTime, ...rest } = validatedData;

  const localReadingTime = DateTime.fromFormat(
    `${readingDate} ${readingTime}`,
    'yyyy-MM-dd HH:mm',
    { zone: 'local' },
  );

  const readingTimeUTC = localReadingTime.toJSDate();

  const addedVitals = await prisma.patientVitals.create({
    data: {
      ...rest,
      readingTime: readingTimeUTC,
      userId: patientExist.id,
    },
  });

  return addedVitals;
};

const fetchPatientTypeData = async (type: VitalType, patientId: string) => {
  return await prisma.patientVitals.findMany({
    where: { userId: Number(patientId), type },
    orderBy: {
      readingTime: 'desc',
    },
  });
};

const fetchPatientData = async (patientId: string) => {
  return await prisma.$queryRaw`
  SELECT DISTINCT ON (type) *
  FROM "PatientVitals"
  WHERE "userId" = ${Number(patientId)}
  ORDER BY type, "readingTime" DESC
`;
};

export default {
  patientList,
  addPatient,
  dashboardPatientList,
  addPatientData,
  fetchPatientTypeData,
  fetchPatientData,
};
