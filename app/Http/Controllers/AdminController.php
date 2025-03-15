<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Doctors;

class AdminController extends Controller
{
    public function pending_authorization_doctors_list(Request $request)
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

        $doctorsQuery = User::where('role', 'doctor')
            ->where('approved_by_admin', '0');

        $doctorsCount = $doctorsQuery->count();
        $doctorsDataArr = $doctorsQuery->orderBy($sortColumn, $sortOrder)
            ->skip($skipCount)
            ->take($perPage)
            ->get()
            ->toArray();
        if (!empty($doctorsDataArr)) {

            $this->apiValid = true;
            $this->apiMessage = "Pending authorization doctors list returned successfully.";
            $this->apiData = [
                'currentPage' => ($pageNo + 1),
                'totalPages' => ceil($doctorsCount / $perPage),
                'perPage' => $perPage,
                'totalRecords' => $doctorsCount,
                'dataArr' => $doctorsDataArr,
            ];
        } else {
            $this->apiMessage = "No pending authorization doctors list present yet.";
        }

        return response()->json([
            'valid' => $this->apiValid,
            'message' => $this->apiMessage,
            'data' => $this->apiData,
        ]);
    }

    public function authorize_doctor(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|int|gt:0',
        ]);

        if ($validator->fails()) {
            $this->apiData = $validator->errors();
            $this->apiMessage = $validator->errors()->first();
        } else {

            $doctorData = User::where('id', $request->user_id)
                ->where('role', 'doctor')
                ->where('approved_by_admin', '0')
                ->first();
            if (!empty($doctorData)) {

                $doctorUpdate = User::where('id', $request->user_id)->update(['approved_by_admin' => '1']);
                if ($doctorUpdate) {

                    $doctor = new Doctors;
                    $doctor->user_id = $doctorData['id'];
                    $doctor->name = $doctorData['name'];
                    $doctor->availability = doctors_availability;
                    if ($doctor->save()) {
                        $this->apiValid = true;
                        $this->apiMessage = "Doctor approved successfully";
                    } else {
                        $this->apiMessage = "Something went wrong. Please try again later";
                    }
                } else {
                    $this->apiMessage = "Something went wrong. Please try again later";
                }
            } else {
                $this->apiMessage = "Invalid user Data.";
            }
        }

        return response()->json([
            'valid' => $this->apiValid,
            'message' => $this->apiMessage,
            'data' => $this->apiData,
        ]);
    }
}
