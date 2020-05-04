<?php

namespace App\Http\Controllers;

use App\Http\Utils\QueryBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Atomescrochus\Deezer\Deezer;

class PlayTrackRecordController extends Controller
{
    public function registerPlayRecord(Request $request)
    {
        $userId = $request->session()->get('user_id');


        $trackId = $request->trackid;
        DB::statement("insert into TrackPlayRecord (userid, trackid) VALUES ({$userId}, {$trackId})");


        $deezer = new Deezer();
        $results = $deezer->artist($request->artist) // string
            ->track($request->title) // string
            ->search();
        $data = $results->raw->data;
        // dd($results->raw->data[0]->preview);
        return ["link" => $data[0]->preview];
    }
}
