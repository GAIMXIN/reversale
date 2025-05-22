import express, { Router } from 'express';
import authRouter from './auth.router';
import doctorController from '../controllers/doctor.controller';
import authorization from '../middlewares/authorization.middleware';
import authGuard from '../middlewares/authGuard.middleware';

const apiRouter: Router = express.Router();

apiRouter.use('/auth', authRouter);

apiRouter.use(authGuard);
apiRouter.route('/doctor/patient-list').get(authorization('doctor'), doctorController.patientList);
apiRouter
  .route('/doctor/add-patient/:patientId')
  .get(authorization('doctor'), doctorController.addPatient);
apiRouter
  .route('/doctor/dashboard/patient-list')
  .get(authorization('doctor'), doctorController.dashboardPatientList);

apiRouter
  .route('/doctor/patient-data/:patientId')
  .post(doctorController.addPatientData)
  .get(doctorController.fetchPatientData);
apiRouter.route('/doctor/patient-data/:type/:patientId').get(doctorController.fetchPatientTypeData);

export default apiRouter;
