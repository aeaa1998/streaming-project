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
        return redirect('/login');
    }
}
