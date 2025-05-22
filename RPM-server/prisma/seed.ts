import { PrismaClient, Vitals } from '@prisma/client';
import { DateTime } from 'luxon';
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';

async function main() {
  const hashedPassword = await bcrypt.hash('password', 8);
  await prisma.user.createMany({
    data: [
      {
        first: 'John',
        last: 'Doe',
        email: 'doctor@example.com',
        password: hashedPassword,
        role: 'doctor',
      },
      {
        first: 'Jane',
        last: 'Smith',
        email: 'patient1@example.com',
        password: hashedPassword,
        role: 'patient',
      },
      {
        first: 'Mark',
        last: 'Brown',
        email: 'patient2@example.com',
        password: hashedPassword,
        role: 'patient',
      },
    ],
    skipDuplicates: true,
  });

  await prisma.doctorPatient.create({
    data: {
      doctorId: 1,
      patientId: 2,
    },
  });

  await prisma.patientVitals.createMany({
    data: [
      {
        type: Vitals.bloodPressure,
        value: '120 bpm',
        readingTime: DateTime.now().setZone('utc').minus({ hours: 2 }).toJSDate(),
        meals: 'AFter meal',
        notes: 'Normal blood pressure.',
        userId: 2,
      },
      {
        type: Vitals.heartRate,
        value: '72 bpm',
        readingTime: DateTime.now().setZone('utc').minus({ minutes: 30 }).toJSDate(),
        meals: 'Before meal',
        notes: 'Normal heart rate.',
        userId: 2,
      },
      {
        type: Vitals.oxygenLevel,
        value: '98%',
        readingTime: DateTime.now().setZone('utc').minus({ day: 1 }).toJSDate(),
        meals: 'Not applicable',
        notes: 'Normal oxygen level.',
        userId: 2,
      },
    ],
  });

  console.log('Seeder has been completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
