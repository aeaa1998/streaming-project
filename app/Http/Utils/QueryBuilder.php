<?php

namespace App\Http\Utils;

/**
 *
 */
class QueryBuilder
{


	public static function build($parameter, $column, $operator, $query): String
	{

		$query .= " where " . " {$column} {$operator} {$parameter}";

		return $query;
	}
	public static function buildQuery($parameters, $query): String
	{
		$count  = 0;
		foreach ($parameters as $parameterBuilder) {
			$column = $parameterBuilder["column"];
			$operator = $parameterBuilder["operator"];
			$parameter = $parameterBuilder["parameter"];
			$builder = $count > 0 ? 'and' : 'where';
			$query .= " {$builder} " . " {$column} {$operator} {$parameter}";
			$count++;
		}


		return $query;
	}
}
