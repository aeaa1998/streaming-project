<?php

namespace App\Http\Controllers;

use App\Http\Utils\QueryBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use  App\Http\Utils\Constants;

class DatabaseController extends Controller
{
	public function index($query)
	{
		return DB::select($query);
	}

	public function filtered($query, $column, $value, $operator)
	{

		$value = str_replace("-----", "/", $value);
		$value = str_replace("+=+", "%", $value);

		return DB::select(QueryBuilder::build($value, $column, $operator, $query));
	}
	public function byId($query, $column, $value)
	{
		$value = str_replace("-----", "/", $value);
		$value = str_replace("+=+", "%", $value);

		return DB::select("{$query} where {$column} = {$value}");
	}

	public function deleteById(Request $request)
	{
		$query = substr($request["query"], 6);
		$table = $request["table"];
		$columnId = $request["columnId"];
		$id = $request["id"];
		DB::statement("delete from {$table}  where {$columnId} = {$id}");
		$userId = $request->session()->get('user_id');
		$table = strtolower($table);

		DB::statement("update audit set userid = {$userId} where auditabletype = '{$table}' and auditableid = {$id}");

		return DB::select("{$query}");
	}

	public function store(Request $request)
	{

		$query = substr($request["query"], 6);

		$table = $request["table"];
		$columns = $request["columns"];
		$columnId = $request["columnId"];
		$values = $request["values"];
		$last = DB::select("select {$columnId} as id from {$table} order by {$columnId} DESC")[0];
		$newId = $last->id + 1;

		DB::statement("insert into {$table}  ({$columnId}, {$columns}) VALUES ({$newId}, {$values})");

		$userId = $request->user_id;
		$table = strtolower($table);
		$userId = $request->session()->get('user_id');
		DB::statement("update audit set userid = {$userId} where auditabletype = '{$table}' and auditableid = {$newId}");

		if ($table == 'users') {
			$last = DB::select("select customerid as id from customer order by customerid DESC")[0];
			$lastUser = DB::select("select userid as id, name as name, email from users order by userid DESC")[0];
			$newId = $last->id + 1;
			DB::statement(
				"insert into customer  (CustomerId, FirstName, LastName, Company, Address, City, State, Country, PostalCode, Phone, Fax, Email, UserId) 
				VALUES
				({$newId}, '{$lastUser->name}', ' ', 'UVG', 'Vista hermosa 3', 'Guatemala', 'Guatemala', 'Guatemala', '560001', '', '', 
				'{$lastUser->email}', {$lastUser->id})
				"
			);
		}
		return DB::select("{$query}");
	}

	public function updateById(Request $request)
	{

		$query = $request["query"];
		$columnId = $request["columnId"];
		$id = $request["id"];
		$column = $request["column"];
		$table = $request["table"];
		$value = $request["value"];
		$value = str_replace("-----", "/", $value);
		$value = str_replace("+=+", "%", $value);
		$userId = $request->session()->get('user_id');
		DB::statement("update  {$table} set {$column} = {$value} where {$columnId} = {$id}");
		$table = strtolower($table);
		DB::statement("update audit set userid = {$userId} where auditabletype = '{$table}' and auditableid = {$id}");
		return DB::select("{$query} where {$columnId} = {$id}");
	}
	public function filteredAll(Request $request, $query)
	{

		if (!$request->has('parameters'))
			return DB::select($query);
		$parameters = [];
		foreach ($request->parameters as $param) {
			$parsedParam = eval("return " . $param . ";");
			$column = $parsedParam[0];
			$operator = $parsedParam[1];
			$value = $parsedParam[2];
			$value = str_replace("-----", "/", $value);
			$value = str_replace("+=+", "%", $value);
			array_push($parameters, ["column" => $column, "operator" => $operator, "parameter" => $value]);
		}

		return DB::select(QueryBuilder::buildQuery($parameters, $query));
		// return DB::select(QueryBuilder::build($value, $column, $operator, $query));
	}

	public function deactivateSong($id)
	{

		DB::statement("update Track set isactive = 0 where trackid = {$id}");
		return DB::select(Constants::SONGS_URL);
		// return DB::select(QueryBuilder::build($value, $column, $operator, $query));
	}


	public function activateSong($id)
	{

		DB::statement("update Track set isactive = 1 where trackid = {$id}");
		return DB::select(Constants::SONGS_URL);
		// return DB::select(QueryBuilder::build($value, $column, $operator, $query));
	}
}
