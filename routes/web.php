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

Route::get('/genres', 'ViewsController@genres');
Route::get('/albums', 'ViewsController@albums');
Route::get('/songs', 'ViewsController@songs');
Route::get('/admin/users', 'AuthViewsController@adminUsers');
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
