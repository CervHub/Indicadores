<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ZoneController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'message' => null,
            'data' => [
                'zones' => [
                    ['id' => 'Mina', 'name' => 'Mina'],
                    ['id' => 'Campamento', 'name' => 'Campamento'],
                    ['id' => 'Concentradora', 'name' => 'Concentradora'],
                ]
            ],
        ], 200);
    }
}
