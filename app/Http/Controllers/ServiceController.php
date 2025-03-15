<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;
use App\Models\Doctors;
use App\Models\User;
use App\Models\Appointments;
use App\Models\Payments;
use Stripe\Stripe;
use Stripe\PaymentIntent;

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
        if (isset($request->userId)) {
            $doctorsQuery->where('user_id', $request->userId);
        }
        /**  Search records in DB  */
        if (!empty($request->searchBy)) {

            /**  Filter records from specific column  */
            if (!empty($request->filterBy)) {

                $doctorsQuery->where($request->filterBy, 'like', "%{$request->searchBy}%");
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
            'appointment_type' => 'required|in:Emergency,Regular',
        ]);

        if ($validator->fails()) {
            $this->apiData = $validator->errors();
            $this->apiMessage = $validator->errors()->first();
        } else {

            $userData = Auth::user();
            $selectedDateTime = Carbon::parse($request->schedule);

            $existingAppointment = Appointments::where('doctor_id', $request->doctor_id)
                ->where('schedule', $selectedDateTime)
                ->first();

            if ($existingAppointment) {
                return response()->json([
                    'valid' => false,
                    'message' => 'This time slot is already booked. Please select a different time.',
                ]);
            }

            $appointment = new Appointments;
            $appointment->user_id = $userData['id'];
            $appointment->name = $userData['name'];
            $appointment->doctor_id = $request->doctor_id;
            $appointment->doctor_name = $request->doctor_name;
            $appointment->status = "pending";
            $appointment->appointment_type = $request->appointment_type;
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
        $userData = Auth::user();
        if ($userData['role'] == 'patient') {
            $request['status'] = 'canceled';
        }

        $validator = Validator::make($request->all(), [
            'appointment_id' => 'required|integer|gt:0',
            'status' => 'required|in:scheduled,canceled,completed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'valid' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 400);
        }

        $appointment = Appointments::where('id', $request->appointment_id)
            ->where('status', 'pending')
            ->first();

        if (!$appointment) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid appointment data or appointment is not pending.',
            ], 404);
        }

        if ($user->role === 'patient') {
            $request->merge(['status' => 'canceled']);
        }

        $updateData = ['status' => $request->status];

        if ($request->status === 'completed' && $request->has('description')) {
            $updateData['description'] = $request->description;
        }

        $updated = $appointment->update($updateData);

        if ($updated) {
            return response()->json([
                'valid' => true,
                'message' => "Appointment {$request->status} successfully.",
            ], 200);
        }

        return response()->json([
            'valid' => false,
            'message' => 'Something went wrong.Please try again later.',
        ], 500);
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
                $doctor = Doctors::where('user_id', $userData['id'])->first();
                $appointmentsQuery->where('doctor_id', @$doctor['id']);
                break;
            case 'patient':
                $appointmentsQuery->where('user_id', $userData['id'])->with('doctor');
                break;
        }

        /**  Search records in DB  */
        if (!empty($request->searchBy)) {
            $appointmentsQuery->where(function ($query) use ($request) {
                $query->where('id', 'like', "%{$request->searchBy}%")
                    ->orWhere('status', 'like', "%{$request->searchBy}%")
                    ->orWhere('doctor_name', 'like', "%{$request->searchBy}%")
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
            'department' => 'required|string|max:255',
            'specialty'  => 'nullable|string|max:255',
            'fees' => 'nullable|numeric|min:0',
            'schedule'  => 'nullable',
            'emergency_available' => 'nullable|boolean',
            'emergency_schedule'  => 'nullable|string',
            'emergency_fee' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            $this->apiData = $validator->errors();
            $this->apiMessage = $validator->errors()->first();
        } else {

            $doctor = Doctors::where('id', $request->doctor_id)
                ->first();
            if (!empty($doctor)) {

                $schedule = $doctor->schedule;
                $emergency_schedule = $doctor->emergency_schedule;

                $updateArr = [];
                if (!empty($request->specialty)) {
                    $updateArr['specialty'] = $request->specialty;
                }
                if (!empty($request->department)) {
                    $updateArr['department'] = $request->department;
                }
                if (!empty($request->emergency_available)) {
                    $updateArr['emergency_available'] = $request->emergency_available;
                }
                if (!empty($schedule) && !empty($request->emergency_schedule)) {

                    if ($schedule === $request->emergency_schedule) {
                        return response()->json([
                            'valid'   => false,
                            'message' => "Emergency Schedule and Availability cannot be the same.choose another",
                        ]);
                    }
                }
                if (!empty($emergency_schedule) && !empty($request->schedule)) {

                    if ($emergency_schedule === $request->schedule) {
                        return response()->json([
                            'valid'   => false,
                            'message' => "Emergency Schedule and Availability cannot be the same choose another",
                        ]);
                    }
                }
                if (!empty($request->emergency_schedule) && !empty($request->schedule)) {

                    if ($request->emergency_schedule === $request->schedule) {
                        return response()->json([
                            'valid'   => false,
                            'message' => "Emergency schedule and Availability cannot be the same",
                        ]);
                    }

                    $updateArr['emergency_schedule'] = $request->emergency_schedule;
                    $updateArr['availability'] = $request->schedule;
                } elseif (!empty($request->emergency_schedule)) {

                    $updateArr['emergency_schedule'] = $request->emergency_schedule;
                } elseif (!empty($request->schedule)) {

                    $updateArr['availability'] = $request->schedule;
                }

                if (!is_null($request->fees)) {
                    $updateArr['fee'] = $request->fees;
                }
                if (!is_null($request->emergency_fee)) {
                    $updateArr['emergency_fee'] = $request->emergency_fee;
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

    public function appointment_history(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|int',
        ]);

        if ($validator->fails()) {
            $this->apiData = $validator->errors();
            $this->apiMessage = $validator->errors()->first();
        } else {

            $pageNo = 0;
            if (!empty($request->page) && is_numeric($request->page) && ($request->page > 1)) {
                $pageNo = (ceil($request->page) - 1);
            }

            $perPage = 10;
            if (!empty($request->perPage) && is_numeric($request->perPage) && ($request->perPage > 0)) {
                $perPage = ceil($request->perPage);
            }

            $skipCount = ($pageNo * $perPage);

            $sortColumn = "id";
            if (!empty($request->sortColumn)) {
                $sortColumn = $request->sortColumn;
            }

            $sortOrder = "DESC";
            if (!empty($request->sortOrder)) {
                $sortOrder = $request->sortOrder;
            }

            $historyQuery = Appointments::where('user_id', $request->user_id);

            if (!empty($request->filter_doctor)) {
                $historyQuery->where('doctor_id', $request->filter_doctor);
            }

            $historyCount = $historyQuery->count();

            $historyDataArr = $historyQuery->orderBy($sortColumn, $sortOrder)
                ->skip($skipCount)
                ->take($perPage)
                ->get()
                ->toArray();

            $distinctDoctors = Appointments::select('doctor_id', 'doctor_name')
                ->groupBy('doctor_id', 'doctor_name')
                ->get();

            if (!empty($historyDataArr)) {

                $this->apiValid = true;
                $this->apiMessage = "Patient Appointments History returned successfully.";
                $this->apiData = [
                    'currentPage' => ($pageNo + 1),
                    'totalPages' => ceil($historyCount / $perPage),
                    'perPage' => $perPage,
                    'totalRecords' => $historyCount,
                    'dataArr' => $historyDataArr,
                    'doctors' => $distinctDoctors


                ];
            } else {
                $this->apiMessage = "No Patient History present yet.";
            }

            return response()->json([
                'valid' => $this->apiValid,
                'message' => $this->apiMessage,
                'data' => $this->apiData,
            ]);
        }
    }
}
