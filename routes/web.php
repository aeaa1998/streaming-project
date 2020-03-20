<?php

use  App\Http\Utils\Constants;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
 */

Route::view('/login', 'login');
Route::get('/artists', 'ViewsController@artists');

Route::get('/genres', function () {
    return view('genres')->with('rows', json_encode(DB::select(Constants::GENRES_URL)))
        ->with('permissions', json_encode([1, 2, 3]))->with(
            'filteredJson',
            Constants::GENRE_FILTERS
        )->with('createForm', Constants::CREATE_GENRE);
});
Route::get('/albums', function () {
    return view('albums')->with('rows', json_encode(DB::select(Constants::ALBUM_URL)))
        ->with('permissions', json_encode([1, 2, 3]))->with(
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
});
Route::get('/songs', function () {
    return view('songs')->with('rows', json_encode(DB::select(Constants::SONGS_URL)))
        ->with('permissions', json_encode([1, 2, 3]))->with(
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
});
$router->get('fetch/{query}', 'DatabaseController@index');
$router->get('fetch/{query}/{column}/{value}', 'DatabaseController@byId');
$router->get('filtered/fetch/{query}/{column}/{value}/{operator}', 'DatabaseController@filtered');
$router->get('filtered/all/fetch/{query}', 'DatabaseController@filteredAll');

// $router->get('filtered/all/fetch/{table}/{json}', 'DatabaseController@filteredAll');
// $router->get('artists', 'DatabaseController@index');
// $router->get('csfr', function () {
// 	return csrf_token();
// }
// );
// $router->post('artists/filtered', 'DatabaseController@filtered');
