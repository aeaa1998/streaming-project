<?php

namespace App\Http\Controllers;

use App\Http\Utils\AuthUtils;
use App\Http\Utils\QueryBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use  App\Http\Utils\Constants;
use Carbon\Carbon;

class ReportsController extends Controller
{
    public function weekSalesInDates (Request $request) {

        $startDate = json_decode($request->parameters)->startDate;
        $endDate = json_decode($request->parameters)->endDate;

        $startDate = Carbon::parse($startDate)->format('Y-m-d');
        $endDate = Carbon::parse($endDate)->format('Y-m-d');

        $sales = collect(DB::select("
            SELECT * FROM sales_by_dates('$startDate'::DATE, '$endDate'::DATE);
        "));

        $minWeek = $sales->min('weekly');
        $maxWeek = $sales->max('weekly');

        for ($i=$minWeek; $i<$maxWeek; $i++) { 
            if (!$sales->contains('weekly', $i)) {
                $sales->push(
                    (object)[
                        "description" => Carbon::parse($startDate)->addWeeks($i)->format('Y-m-d'),
                        "weekly" => $i,
                        "count" => 0
                        ]
                    );
                }
            }
            
            $sales->transform(function ($item, $key) {
                $item->description = Carbon::parse($item->description)->format('Y-m-d');
                $item->weekly = intval($item->weekly);
                return $item;
            });
        
        return $sales;
    }

    public function artistBySalesInDates (Request $request) {

        $startDate = json_decode($request->parameters)->startDate;
        $endDate = json_decode($request->parameters)->endDate;
        $quantity = json_decode($request->parameters)->quantity;

        $artists = collect(DB::select("
        SELECT * FROM artists_by_sales_in_dates('$startDate'::DATE, '$endDate'::DATE, $quantity);"
        ));
        
        return $artists;
    }

    public function genreSalesInDates (Request $request) {

        $startDate = json_decode($request->parameters)->startDate;
        $endDate = json_decode($request->parameters)->endDate;

        $genres = collect(DB::select("
        SELECT * FROM genre_sales_in_dates('$startDate'::DATE, '$endDate'::DATE);
        "));
        
        return $genres;
    }

    public function artistSongsByPlays (Request $request) {
        $input = json_decode($request->parameters)->input;

        $songs = collect(DB::select("
        SELECT * FROM artist_song_by_plays('$input');
        "));
        
        return $songs;
    }
    
    public function reports(){

        return view('reports')->with(
            'permissions',
            json_encode(AuthUtils::getPermissions())
        )->with(
            'albumsByArtist',
            json_encode(DB::select(Constants::ALBUMS_BY_ARTIST))
        )->with(
            'songsByGenre',
            json_encode(DB::select(Constants::SONGS_BY_GENRE))
        )->with(
            'durationByPlaylist',
            json_encode(DB::select(Constants::DURATION_BY_PLAYLIST))
        )->with(
            'durationBySong',
            json_encode(DB::select(Constants::DURATION_BY_SONG))
        )->with(
            'songsByArtist',
            json_encode(DB::select(Constants::SONGS_BY_ARTIST))
        )->with(
            'durationByGenre',
            json_encode(DB::select(Constants::DURATION_BY_GENRE))
        )->with(
            'artistByPlaylist',
            json_encode(DB::select(Constants::ARTIST_BY_PLAYLIST))
        )->with(
            'genresByArtist',
            json_encode(DB::select(Constants::GENRES_BY_ARTIST)));
    }

}
