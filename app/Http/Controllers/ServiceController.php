<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;
use App\Models\Doctors;
use App\Models\User;
use App\Models\Appointments;

class ServiceController extends Controller
{
    public function all_doc_list(Request $request)
    {
        /**  Pagination for records  */
        $pageNo = 0;
        if (!empty($request->page) && is_numeric($request->page) && ($request->page > 1)) {
            $pageNo = (ceil($request->page) - 1);
        }

        $perPage = 10;
        if (!empty($request->perPage) && is_numeric($request->perPage) && ($request->perPage > 0)) {
            $perPage = ceil($request->perPage);
        }

        $skipCount = ($pageNo * $perPage);

        /**  Sort By Column Name  */
        $sortColumn = "id";
        if (!empty($request->sortColumn)) {
            $sortColumn = $request->sortColumn;
        }

        /**  Sort Order of the Column  */
        $sortOrder = "DESC";
        if (!empty($request->sortOrder)) {
            $sortOrder = $request->sortOrder;
        }

        $doctorsQuery = Doctors::query();

        /**  Search records in DB  */
        if (!empty($request->searchBy)) {

            /**  Filter records from specific column  */
            if (!empty($request->filterBy)) {

                $doctorsQuery->where($request->filterBy, $request->searchBy);
            } else {
                $doctorsQuery->where(function ($query) use ($request) {
                    $query->where('name', 'like', "%{$request->searchBy}%")
                        ->orWhere('specialty', 'like', "%{$request->searchBy}%")
                        ->orWhere('department', 'like', "%{$request->searchBy}%");
                });
            }
        }

        $doctorsCount = $doctorsQuery->count();
        $doctorsDataArr = $doctorsQuery->orderBy($sortColumn, $sortOrder)
            ->skip($skipCount)
            ->take($perPage)
            ->get()
            ->toArray();
        if (!empty($doctorsDataArr)) {

            $this->apiValid = true;
            $this->apiMessage = "Doctors List returned successfully.";
            $this->apiData = [
                'currentPage' => ($pageNo + 1),
                'totalPages' => ceil($doctorsCount / $perPage),
                'perPage' => $perPage,
                'totalRecords' => $doctorsCount,
                'dataArr' => $doctorsDataArr,
            ];
        } else {
            $this->apiMessage = "No doctors list present yet.";
        }

        return response()->json([
            'valid' => $this->apiValid,
            'message' => $this->apiMessage,
            'data' => $this->apiData,
        ]);
    }

    public function all_patients_list(Request $request)
    {
        /**  Pagination for records  */
        $pageNo = 0;
        if (!empty($request->page) && is_numeric($request->page) && ($request->page > 1)) {
            $pageNo = (ceil($request->page) - 1);
        }

        $perPage = 10;
        if (!empty($request->perPage) && is_numeric($request->perPage) && ($request->perPage > 0)) {
            $perPage = ceil($request->perPage);
        }

        $skipCount = ($pageNo * $perPage);

        /**  Sort By Column Name  */
        $sortColumn = "id";
        if (!empty($request->sortColumn)) {
            $sortColumn = $request->sortColumn;
        }

        /**  Sort Order of the Column  */
        $sortOrder = "DESC";
        if (!empty($request->sortOrder)) {
            $sortOrder = $request->sortOrder;
        }

        $patientsQuery = User::where('role', 'patient');

        /**  Search records in DB  */
        if (!empty($request->searchBy)) {
            $patientsQuery->where(function ($query) use ($request) {
                $query->where('name', 'like', "%{$request->searchBy}%")
                    ->orWhere('email', 'like', "%{$request->searchBy}%");
            });
        }

        $patientsCount = $patientsQuery->count();
        $patientsDataArr = $patientsQuery->orderBy($sortColumn, $sortOrder)
            ->skip($skipCount)
            ->take($perPage)
            ->get()
            ->toArray();
        if (!empty($patientsDataArr)) {

            $this->apiValid = true;
            $this->apiMessage = "Patients List returned successfully.";
            $this->apiData = [
                'currentPage' => ($pageNo + 1),
                'totalPages' => ceil($patientsCount / $perPage),
                'perPage' => $perPage,
                'totalRecords' => $patientsCount,
                'dataArr' => $patientsDataArr,
            ];
        } else {
            $this->apiMessage = "No Patients list present yet.";
        }

        return response()->json([
            'valid' => $this->apiValid,
            'message' => $this->apiMessage,
            'data' => $this->apiData,
        ]);
    }

    public function schedule_appointment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'required|int|gt:0',
            'schedule' => 'required|date_format:Y-m-d H:i:00|after:' . Carbon::now()->format('Y-m-d H:i:00'),
        ]);

        if ($validator->fails()) {
            $this->apiData = $validator->errors();
            $this->apiMessage = $validator->errors()->first();
        } else {

            $userData = Auth::user();

            $appointment = new Appointments;
            $appointment->user_id = $userData['id'];
            $appointment->name = $userData['name'];
            $appointment->doctor_id = $request->doctor_id;
            $appointment->status = "pending";
            $appointment->schedule = $request->schedule;
            if ($appointment->save()) {
                $this->apiValid = true;
                $this->apiMessage = "Appointment scheduled successfully";
            } else {
                $this->apiMessage = "Something went wrong. Please try again later";
            }
        }

        return response()->json([
            'valid' => $this->apiValid,
            'message' => $this->apiMessage,
            'data' => $this->apiData,
        ]);
    }

    public function pending_appointments_list(Request $request)
    {
        $userData = Auth::user();

        /**  Pagination for records  */
        $pageNo = 0;
        if (!empty($request->page) && is_numeric($request->page) && ($request->page > 1)) {
            $pageNo = (ceil($request->page) - 1);
        }

        $perPage = 10;
        if (!empty($request->perPage) && is_numeric($request->perPage) && ($request->perPage > 0)) {
            $perPage = ceil($request->perPage);
        }

        $skipCount = ($pageNo * $perPage);

        /**  Sort By Column Name  */
        $sortColumn = "id";
        if (!empty($request->sortColumn)) {
            $sortColumn = $request->sortColumn;
        }

        /**  Sort Order of the Column  */
        $sortOrder = "DESC";
        if (!empty($request->sortOrder)) {
            $sortOrder = $request->sortOrder;
        }

        $appointmentsQuery = Appointments::where('status', "pending");

        /**  Check user role  */
        if ($userData['role'] == "doctor") {
            $appointmentsQuery->where('doctor_id', $userData['id']);
        }

        /**  Search records in DB  */
        if (!empty($request->searchBy)) {
            $appointmentsQuery->where('name', 'like', "%{$request->searchBy}%");
        }

        $appointmentsCount = $appointmentsQuery->count();
        $appointmentsDataArr = $appointmentsQuery->orderBy($sortColumn, $sortOrder)
            ->skip($skipCount)
            ->take($perPage)
            ->get()
            ->toArray();
        if (!empty($appointmentsDataArr)) {

            $this->apiValid = true;
            $this->apiMessage = "Pending Appointments List returned successfully.";
            $this->apiData = [
                'currentPage' => ($pageNo + 1),
                'totalPages' => ceil($appointmentsCount / $perPage),
                'perPage' => $perPage,
                'totalRecords' => $appointmentsCount,
                'dataArr' => $appointmentsDataArr,
            ];
        } else {
            $this->apiMessage = "No Pending Appointments list present yet.";
        }

        return response()->json([
            'valid' => $this->apiValid,
            'message' => $this->apiMessage,
            'data' => $this->apiData,
        ]);
    }

    public function update_appointment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'appointment_id' => 'required|int|gt:0',
            'status' => 'required|in:scheduled,canceled,completed',
        ]);

        if ($validator->fails()) {
            $this->apiData = $validator->errors();
            $this->apiMessage = $validator->errors()->first();
        } else {

            $appointment = Appointments::where('id', $request->appointment_id)
                ->where('status', "pending")
                ->first();
            if (!empty($appointment)) {

                $appointmentUpdate = Appointments::where('id', $request->appointment_id)->update(['status' => $request->status]);
                if ($appointmentUpdate) {

                    $this->apiValid = true;
                    $this->apiMessage = "Appointment {$request->status} successfully";
                } else {
                    $this->apiMessage = "Something went wrong. Please try again later";
                }
            } else {
                $this->apiMessage = "Invalid appointment data";
            }
        }

        return response()->json([
            'valid' => $this->apiValid,
            'message' => $this->apiMessage,
            'data' => $this->apiData,
        ]);
    }

    public function appointments_list(Request $request)
    {
        $userData = Auth::user();

        /**  Pagination for records  */
        $pageNo = 0;
        if (!empty($request->page) && is_numeric($request->page) && ($request->page > 1)) {
            $pageNo = (ceil($request->page) - 1);
        }

        $perPage = 10;
        if (!empty($request->perPage) && is_numeric($request->perPage) && ($request->perPage > 0)) {
            $perPage = ceil($request->perPage);
        }

        $skipCount = ($pageNo * $perPage);

        /**  Sort By Column Name  */
        $sortColumn = "id";
        if (!empty($request->sortColumn)) {
            $sortColumn = $request->sortColumn;
        }

        /**  Sort Order of the Column  */
        $sortOrder = "DESC";
        if (!empty($request->sortOrder)) {
            $sortOrder = $request->sortOrder;
        }

        $appointmentsQuery = Appointments::query();
        switch ($userData['role']) {
            case 'admin':
                // show all
                break;
            case 'doctor':
                $appointmentsQuery->where('doctor_id', $userData['id']);
                break;
            case 'patient':
                $appointmentsQuery->where('user_id', $userData['id']);
                break;
        }

        /**  Search records in DB  */
        if (!empty($request->searchBy)) {
            $appointmentsQuery->where(function ($query) use ($request) {
                $query->where('id', 'like', "%{$request->searchBy}%")
                    ->orWhere('status', 'like', "%{$request->searchBy}%")
                    ->orWhere('schedule', 'like', "%{$request->searchBy}%");
            });
        }

        $appointmentsCount = $appointmentsQuery->count();
        $appointmentsDataArr = $appointmentsQuery->orderBy($sortColumn, $sortOrder)
            ->skip($skipCount)
            ->take($perPage)
            ->get()
            ->toArray();
        if (!empty($appointmentsDataArr)) {

            $this->apiValid = true;
            $this->apiMessage = "Appointments List returned successfully.";
            $this->apiData = [
                'currentPage' => ($pageNo + 1),
                'totalPages' => ceil($appointmentsCount / $perPage),
                'perPage' => $perPage,
                'totalRecords' => $appointmentsCount,
                'dataArr' => $appointmentsDataArr,
            ];
        } else {
            $this->apiMessage = "No Appointment list present yet.";
        }

        return response()->json([
            'valid' => $this->apiValid,
            'message' => $this->apiMessage,
            'data' => $this->apiData,
        ]);
    }

    public function reschedule_appointment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'appointment_id' => 'required|int|gt:0',
            'schedule' => 'required|date_format:Y-m-d H:i:00|after:' . Carbon::now()->format('Y-m-d H:i:00'),
        ]);

        if ($validator->fails()) {
            $this->apiData = $validator->errors();
            $this->apiMessage = $validator->errors()->first();
        } else {
            $userData = Auth::user();

            $appointmentQuery = Appointments::where('id', $request->appointment_id)
                ->where('status', '!=', "completed");

            switch ($userData['role']) {
                case 'admin':
                    // show all
                    break;
                case 'doctor':
                    $appointmentQuery->where('doctor_id', $userData['id']);
                    break;
                case 'patient':
                    $appointmentQuery->where('user_id', $userData['id']);
                    break;
            }

            $appointment = $appointmentQuery->first();
            if (!empty($appointment)) {

                $appointmentUpdate = Appointments::where('id', $request->appointment_id)->update(['schedule' => $request->schedule]);
                if ($appointmentUpdate) {

                    $this->apiValid = true;
                    $this->apiMessage = "Appointment {$request->schedule} successfully";
                } else {
                    $this->apiMessage = "Something went wrong. Please try again later";
                }
            } else {
                $this->apiMessage = "Invalid appointment data";
            }
        }

        return response()->json([
            'valid' => $this->apiValid,
            'message' => $this->apiMessage,
            'data' => $this->apiData,
        ]);
    }

    public function update_doc_info(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'required|int|gt:0',
        ]);

        if ($validator->fails()) {
            $this->apiData = $validator->errors();
            $this->apiMessage = $validator->errors()->first();
        } else {

            $doctor = Doctors::where('id', $request->doctor_id)
                ->first();
            if (!empty($doctor)) {

                $updateArr = [];
                if (!empty($request->specialty)) {
                    $updateArr['specialty'] = $request->specialty;
                }
                if (!empty($request->department)) {
                    $updateArr['department'] = $request->department;
                }

                if (!empty($updateArr)) {

                    $doctorUpdate = Doctors::where('id', $request->doctor_id)->update($updateArr);
                    if ($doctorUpdate) {

                        $this->apiValid = true;
                        $this->apiMessage = "Doctor data updated successfully";
                    } else {
                        $this->apiMessage = "Something went wrong. Please try again later";
                    }
                } else {
                    $this->apiMessage = "Update Array cannot be empty";
                }
            } else {
                $this->apiMessage = "Invalid Doctor data";
            }
        }

        return response()->json([
            'valid' => $this->apiValid,
            'message' => $this->apiMessage,
            'data' => $this->apiData,
        ]);
    }
}
