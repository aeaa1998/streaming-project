<?php

namespace App\Http\Controllers;

use App\Http\Utils\AuthUtils;
use App\Http\Utils\QueryBuilder;
use Illuminate\Http\Request;
use Atomescrochus\Deezer\Deezer;
use Illuminate\Support\Facades\DB;
use  App\Http\Utils\Constants;

class ViewsController extends Controller
{
    public function reports()
    {
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
        )->with('genresByArtist', json_encode(DB::select(Constants::GENRES_BY_ARTIST)));
    }

    public function register()
    {

        return view('register')->with('selectTypes', json_encode(DB::select('select subscriptiontypeid as id, name from subsriptionType where subscriptiontypeid != 1 ')));
    }


    public function artists()
    {

        return view('artists')->with('rows', json_encode(DB::select(Constants::ARTIST_URL)))
            ->with('permissions', json_encode(AuthUtils::getPermissions()))
            ->with('userId', session('user_id'))
            ->with(
                'filteredJson',
                Constants::ARTIST_FILTERS
            )->with('createForm', Constants::CREATE_ARTIST);
    }


    public function genres()
    {
        return view('genres')->with('rows', json_encode(DB::select(Constants::GENRES_URL)))
            ->with('permissions', json_encode(AuthUtils::getPermissions()))
            ->with('userId', session('user_id'))
            ->with(
                'filteredJson',
                Constants::GENRE_FILTERS
            )->with('createForm', Constants::CREATE_GENRE);
    }

    public function cart()
    {
        $userId = session('user_id');
        $rows = "select CartTracks.id, CartTracks.quantity as quantity, Track.name as name, Track.unitprice as unitprice
        from CartTracks 
        inner join Cart on CartTracks.cartid = Cart.id
        inner join Track on CartTracks.trackid = Track.trackid
        where Cart.userid = {$userId}
        order by id DESC
        ";
        return view('cart')->with('rows', json_encode(DB::select($rows)))
            ->with('permissions', json_encode(AuthUtils::getPermissions()));
    }

    public function albums()
    {
        return view('albums')->with('rows', json_encode(DB::select(Constants::ALBUM_URL)))
            ->with('permissions', json_encode(AuthUtils::getPermissions()))
            ->with('userId', session('user_id'))
            ->with(
                'filteredJson',
                array_merge(
                    [
                        "Artista" => [
                            "operator" => "LIKE",
                            "column" => "Artist.name",
                            "columnEdit" => "artistid",
                            "type" => "text",
                            "tableName" => "artista",
                            "queryType" => "select",
                            "values" => DB::select("select artistid as id, name from Artist order by name asc"),
                        ]
                    ],
                    Constants::ALBUM_FILTERS
                )
            )->with(
                'createForm',
                array_merge(
                    [
                        [
                            "column" => "artistid",
                            "name" => "Artista",
                            "type" => "select",
                            "values" => DB::select("select artistid as id, name from Artist order by name asc"),
                            "value" => ""
                        ],
                    ],
                    Constants::CREATE_ALBUM
                )
            );
    }

    public function songs()
    {
        return view('songs')->with('rows', json_encode(DB::select(Constants::SONGS_URL)))
            ->with('ownedSongs', json_encode(AuthUtils::getOwnedSongs()))
            ->with('songsInCart', json_encode(AuthUtils::getSongsInCart()))
            ->with('permissions', json_encode(AuthUtils::getPermissions()))
            ->with('userId', session('user_id'))
            ->with(
                'filteredJson',
                array_merge([
                    "Album" => [
                        "operator" => "LIKE",
                        "column" => "Album.title",
                        "columnEdit" => "AlbumId",
                        "type" => "text",
                        "tableName" => "album",
                        "queryType" => "select",
                        "values" => DB::select("select albumid as id, title as name from Album order by name asc"),
                    ],
                    "Genero" => [
                        "operator" => "LIKE",
                        "column" => "Genre.name",
                        "columnEdit" => "GenreId",
                        "type" => "text",
                        "tableName" => "genero",
                        "queryType" => "select",
                        "values" => DB::select("select genreid as id, name from genre order by name asc"),
                    ]
                ], Constants::SONG_FILTERS)
            )->with('createForm', array_merge(Constants::CREATE_SONGS, [
                [
                    "column" => "albumid",
                    "name" => "Album",
                    "type" => "select",
                    "values" => DB::select("select albumid as id, title as name from Album order by name asc"),
                    "value" => ""
                ],
                [
                    "column" => "mediatypeid",
                    "name" => "Tipo de media",
                    "type" => "select",
                    "values" => DB::select("select mediatypeid as id, name from mediatype order by name asc"),
                    "value" => ""
                ],
                [
                    "column" => "genreid",
                    "name" => "Genero",
                    "type" => "select",
                    "values" =>  DB::select("select genreid as id, name from genre order by name asc"),
                    "value" => ""
                ],
            ]));
    }


    public function tableu()
    {
        return view('tableu')->with('permissions', json_encode(AuthUtils::getPermissions()))
            ->with('rows', json_encode(DB::select(Constants::PLAYLIST_URL)))
            ->with('userId', session('user_id'))
            ->with('filterJson', Constants::PLAYLIST_FILTERS);
    }

    public function playList()
    {
        return view('playlist')->with('permissions', json_encode(AuthUtils::getPermissions()));
    }

    public function search(Request $request, $title, $artist)
    {
        $title = str_replace("-----", "/", $title);
        $artist = str_replace("-----", "/", $artist);
        $deezer = new Deezer();
        $results = $deezer->artist($artist) // string
            ->track($title) // string
            ->search();
        $data = $results->raw->data;
        // dd($results->raw->data[0]->preview);
        return ["link" => $data[0]->preview];
    }
}
