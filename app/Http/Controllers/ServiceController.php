<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
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
            $doctorsQuery->where(function ($query) use ($request) {
                $query->where('name', 'like', "%{$request->searchBy}%")
                    ->orWhere('specialty', 'like', "%{$request->searchBy}%");
            });
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
            'schedule' => 'required|date_format:Y-m-d H:i:00',
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
}
