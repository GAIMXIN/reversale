import asyncErrorHandler from '../middlewares/asyncErrorHandler.middleware';
import doctorService from '../services/doctor.service';
import { AddPatientVitalsInput, VitalType } from '../types/doctor.type';
import apiResponse from '../utils/apiResponse.utils';
import doctorValidation from '../validations/doctor.validation';

const patientList = asyncErrorHandler(async (req, res) => {
  const list = await doctorService.patientList(req.user!?.id);
  res.status(200).json(apiResponse('Patient list has been fetched', list));
});
const addPatient = asyncErrorHandler(async (req, res) => {
  await doctorService.addPatient(req.user!.id, req.params.patientId);
  res
    .status(201)
    .json(apiResponse('Patient has been added in monitoring list', { patientAdded: true }));
});

const dashboardPatientList = asyncErrorHandler(async (req, res) => {
  const list = await doctorService.dashboardPatientList(req.user!?.id);
  res.status(200).json(apiResponse('Dashboard patient list has been fetched', list));
});

const addPatientData = asyncErrorHandler(async (req, res) => {
  const validatedData = doctorValidation.addPatientData.validate(req.body) as AddPatientVitalsInput;
  const data = await doctorService.addPatientData(validatedData, req.params!.patientId);
  res.status(200).json(apiResponse('Patient vitals has been updated', data));
});

const fetchPatientTypeData = asyncErrorHandler(async (req, res) => {
  const patientData = await doctorService.fetchPatientTypeData(
    req.params.type as VitalType,
    req.params.patientId,
  );
  res
    .status(200)
    .json(apiResponse(`Patient ${req.params.type} vitals has been fetched`, patientData));
});

const fetchPatientData = asyncErrorHandler(async (req, res) => {
  const patientData = await doctorService.fetchPatientData(req.params.patientId);
  res.status(200).json(apiResponse('Patient vitals has been fetched', patientData));
});
export default {
  patientList,
  addPatient,
  dashboardPatientList,
  addPatientData,
  fetchPatientTypeData,
  fetchPatientData,
};
