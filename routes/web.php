<?php

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
Route::view('/artists', 'artists');
$router->get('fetch/artists', 'ArtistsController@index');
// $router->get('artists', 'ArtistsController@index');
// $router->get('csfr', function () {
// 	return csrf_token();
// }
// );
// $router->post('artists/filtered', 'ArtistsController@filtered');
