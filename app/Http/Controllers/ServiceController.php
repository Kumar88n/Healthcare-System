<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doctors;

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
}
