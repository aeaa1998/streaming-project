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



Route::group(['middleware' => ['authenticated']], function () {
    Route::post('/logout', 'AuthController@logout');
    Route::get('/reports', 'ViewsController@reports');
    Route::get('/genres', 'ViewsController@genres');
    Route::get('/albums', 'ViewsController@albums');
    Route::put('/deactivate/song/{id}', 'DatabaseController@deactivateSong');
    Route::put('/activate/song/{id}', 'DatabaseController@activateSong');
    Route::get('/songs', 'ViewsController@songs')->name('songs');
    Route::get('/reports', 'ViewsController@reports');
    Route::group(['middleware' => ['isAdmin']], function () {
        Route::get('/admin/users', 'AuthViewsController@adminUsers');
        Route::put('edit/role', 'RolesController@edit');
        Route::post('delete/role/{id}', 'RolesController@delete');
        Route::post('create/role', 'RolesController@create');
        Route::get('fetch/roles', 'RolesController@getRoles');
        Route::get('fetch/roles/by/name', 'RolesController@getRolesByName');
        Route::get('fetch/roles/by/permission', 'RolesController@getRolesByPermission');
        Route::get('fetch/roles/by/both', 'RolesController@getRolesByBoth');
        Route::get('/admin/roles', 'RolesController@roles');
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
