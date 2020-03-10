<?php
namespace App\Http\Utils;

/**
 *
 */
class QueryBuilder {
	// public static function buildParameters($parameters, $values, $operators): array{
	// 	foreach ($parameters as $param) {
	// 		# code...
	// 	}
	// }
	public static function build($parameters, $query): String{
		$count      = 0;
		$parameters = array_filter($parameters, function ($parameter) {
			return $parameter['value'] != null;
		});

		foreach ($parameters as $column => $columnBuilder) {
			$operator = $columnBuilder["operator"];
			$value    = $columnBuilder["value"];

			$query .= (($count > 0) ? " and " : " where ") . " {$column} {$operator} {$value}";
			$count++;
		}

		return $query;
	}
}