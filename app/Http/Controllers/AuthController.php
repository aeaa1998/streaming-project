<?php

namespace App\Http\Controllers;

use App\Http\Utils\QueryBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function login($username, $password)
    {
        $user = DB::select("select userid as id from users where email = '{$username}' and password = '{$password}'")[0];
        session(['user_id' => $user->id]);
        return redirect('/songs');
    }

    public function logout(Request $request)
    {
        $request->session()->forget('user_id');
        return redirect('/login');
    }


    public function register(Request $request)
    {

        DB::statement("insert into users (name, email, password, roleid, subscriptiontypeid) values ('{$request->name}', '{$request->email}',  '{$request->password}', 2, {$request->subscription})");
        $last = DB::select("select customerid as id from customer order by customerid DESC")[0];
        $lastUserId = DB::select("select userid as id from users order by userid DESC")[0];
        $newId = $lastUserId->id;
        DB::statement("insert into customer  (CustomerId, FirstName, LastName, Company, Address, City, State, Country, PostalCode, Phone, Fax, Email, UserId) 
        VALUES
        ({$newId}, '{$request->name}', ' ', 'UVG', 'Vista hermosa 3', 'Guatemala', 'Guatemala', 'Guatemala', '560001', '', '', '{$request->email}', {$newId})
        ");
        return redirect('/login');
    }
}
