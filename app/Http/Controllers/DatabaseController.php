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


		DB::statement("update  {$table} set {$column} = {$value} where {$columnId} = {$id}");
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
