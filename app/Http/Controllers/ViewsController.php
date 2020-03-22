<?php

namespace App\Http\Controllers;

use App\Http\Utils\AuthUtils;
use App\Http\Utils\QueryBuilder;
use Illuminate\Http\Request;

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
            'songsByGenre',
            json_encode(
                DB::select(
                    "
            SELECT g.name as description, COUNT(*) as quantity
            FROM track t
            INNER JOIN genre g
            ON t.genreid = g.genreid
            GROUP BY g.name
            ORDER BY COUNT(*) DESC
            LIMIT 20;
            "
                )
            )
        )->with(
            'albumsByArtist',
            json_encode(
                DB::select(
                    "
            SELECT A.name as description, COUNT(*) as quantity
            FROM album ALB
            INNER JOIN artist A
            ON ALB.artistid = A.artistid
            GROUP BY A.name
            ORDER BY COUNT(*) DESC
            LIMIT 20;
            "
                )
            )
        )->with(
            'avgDurationByGenre',
            json_encode(
                DB::select(
                    "
            SELECT G.name as description, AVG(T.milliseconds) as quantity
            FROM genre G
            INNER JOIN track T
            ON G.genreid = T.genreid
            GROUP BY G.name
            ORDER BY AVG(T.milliseconds) DESC;
            "
                )
            )
        )->with(
            'songsByArtist',
            json_encode(
                DB::select(
                    "
            SELECT A.name as description, COUNT(*) as quantity
            FROM artist A
            INNER JOIN album ALB 
            ON ALB.artistid = A.artistid
            INNER JOIN track T 
            ON ALB.albumid = T.albumid
            GROUP BY A.name
            ORDER BY COUNT(*) DESC
            LIMIT 20;
            "
                )
            )
        );
    }

    public function register()
    {
        return view('register')->with('selectTypes', json_encode(DB::select('select subscriptiontypeid as id, name from subsriptionType where subscriptiontypeid != 1 ')));
    }

    public function artists()
    {

        return view('artists')->with('rows', json_encode(DB::select(Constants::ARTIST_URL)))
            ->with('permissions', json_encode(AuthUtils::getPermissions()))->with(
                'filteredJson',
                Constants::ARTIST_FILTERS
            )->with('createForm', Constants::CREATE_ARTIST);
    }


    public function genres()
    {
        return view('genres')->with('rows', json_encode(DB::select(Constants::GENRES_URL)))
            ->with('permissions', json_encode(AuthUtils::getPermissions()))->with(
                'filteredJson',
                Constants::GENRE_FILTERS
            )->with('createForm', Constants::CREATE_GENRE);
    }

    public function albums()
    {
        return view('albums')->with('rows', json_encode(DB::select(Constants::ALBUM_URL)))
            ->with('permissions', json_encode(AuthUtils::getPermissions()))->with(
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
            ->with('permissions', json_encode(AuthUtils::getPermissions()))->with(
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
}
