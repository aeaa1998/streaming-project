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


Route::group(['middleware' => ['guest']], function () {
    Route::view('/login', 'login');
    Route::view('/', 'login');
    Route::get('/register', 'ViewsController@register');
    Route::post('/register/user', 'AuthController@register');
    Route::get('/auth/user/{username}/{password}', 'AuthController@login');
});

Route::get('deezer/{title}/{artist}', 'ViewsController@search');

Route::group(['middleware' => ['authenticated']], function () {
    Route::get('/fetch/sales/by/weeks', 'ReportsController@weekSalesInDates');
    Route::get('/fetch/artists/by/dates', 'ReportsController@artistBySalesInDates');
    Route::get('/fetch/genres/by/dates', 'ReportsController@genreSalesInDates');
    Route::get('/fetch/artist/by/plays', 'ReportsController@artistSongsByPlays');

    Route::post('/logout', 'AuthController@logout');
    Route::get('/tableu', 'ViewsController@tableu');
    Route::get('/fetch/playlist', 'PlaylistController@getPlaylists');
    Route::get('/fetch/playlists/by/name', 'PlaylistController@byName');
    Route::get('/playlists', 'PlaylistController@view');
    Route::get('/fetch/playlists/by/songs', 'PlaylistController@bySongs');
    Route::get('/fetch/playlists/by/albums', 'PlaylistController@byAlbums');
    Route::get('/fetch/playlists/by/artists', 'PlaylistController@byArtists');
    Route::post('/delete/songs/playlist', 'PlaylistController@deleteSongsFromPlaylist');
    Route::post('/create/playlist', 'PlaylistController@addPlaylist');
    Route::post('/add/songs/playlist', 'PlaylistController@addSongstoPlaylist');
    Route::post('/delete/playlist/{playlist_id}', 'PlaylistController@deletePlaylist');
    Route::put('/edit/playlist', 'PlaylistController@editPlaylist');
    Route::get('/cart', 'ViewsController@cart');
    Route::post('/cart/tracks/{id}', 'CartController@deleteTrack');
    Route::post('/cart/tracks', 'CartController@changeQuantity');
    Route::post('/cart/pay', 'CartController@payCart');
    Route::post('/play/track', 'PlayTrackRecordController@registerPlayRecord');
    Route::post('/cart/clean', 'CartController@cleanCart');
    Route::get('/genres', 'ViewsController@genres');
    Route::get('/albums', 'ViewsController@albums');
    Route::put('/deactivate/song/{id}', 'DatabaseController@deactivateSong');
    Route::put('/activate/song/{id}', 'DatabaseController@activateSong');
    Route::get('/songs', 'ViewsController@songs')->name('songs');
    Route::get('/reports', 'ReportsController@reports');


    Route::put('update/by/id', 'DatabaseController@updateById');
    Route::put('delete/id', 'DatabaseController@deleteById');
    Route::post('create', 'DatabaseController@store');
    Route::post('add/track/cart', 'CartController@addTrackToCart');
    Route::post('admin/create', 'DatabaseController@store');
    Route::put('admin/update/by/id', 'DatabaseController@updateById');
    Route::put('admin/delete/id', 'DatabaseController@deleteById');



    Route::group(['middleware' => ['isAdmin']], function () {
        Route::get('/admin/users', 'AuthViewsController@adminUsers');
        Route::put('edit/role', 'RolesController@edit');
        Route::post('delete/role/{id}', 'RolesController@delete');
        Route::post('create/role', 'RolesController@create');
        Route::get('fetch/roles', 'RolesController@getRoles');
        Route::get('fetch/audits', 'AuditsController@getAudits');
        Route::get('fetch/audits/by/table', 'AuditsController@byTable');
        Route::get('fetch/audits/by/type', 'AuditsController@byTypes');
        Route::get('fetch/audits/by/both', 'AuditsController@byBoth');
        Route::get('fetch/roles/by/name', 'RolesController@getRolesByName');
        Route::get('fetch/roles/by/permission', 'RolesController@getRolesByPermission');
        Route::get('fetch/roles/by/both', 'RolesController@getRolesByBoth');
        Route::get('/admin/roles', 'RolesController@roles');
        Route::get('/admin/audits', 'AuditsController@audits');
        Route::get('/admin/simulate', 'SimulationController@view');
        Route::post('/admin/simulate/sales', 'SimulationController@simulate');
    });

    Route::get('/artists', 'ViewsController@artists');
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
