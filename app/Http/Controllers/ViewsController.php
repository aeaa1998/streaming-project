<?php

namespace App\Http\Controllers;

use App\Http\Utils\QueryBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use  App\Http\Utils\Constants;

class ViewsController extends Controller
{
    public function artists()
    {
        return view('artists')->with('rows', json_encode(DB::select(Constants::ARTIST_URL)))
            ->with('permissions', json_encode([1, 2, 3, 4]))->with(
                'filteredJson',
                Constants::ARTIST_FILTERS
            )->with('createForm', Constants::CREATE_ARTIST);
    }

    public function genres()
    {
        return view('genres')->with('rows', json_encode(DB::select(Constants::GENRES_URL)))
            ->with('permissions', json_encode([1, 2, 3]))->with(
                'filteredJson',
                Constants::GENRE_FILTERS
            )->with('createForm', Constants::CREATE_GENRE);
    }
}
