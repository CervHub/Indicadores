<?php

namespace App\Helpers;

use Illuminate\Http\Request;
use App\Models\Log as LogModel;

class LogHelper
{
    public static function putLog(Request $request = null, $action, $model, $id, $status, $error_message)
    {
        $log = new LogModel();
        $log->action = $action;
        $log->model = $model;
        $log->user_id = $id;
        $log->ip_address = $request ? $request->ip() : null;
        $log->user_agent = $request ? $request->userAgent() : null;
        $log->status = $status;
        $log->details = $request ? json_encode($request->all()) : null;
        $log->error_message = $error_message;
        $log->save();
    }
}
