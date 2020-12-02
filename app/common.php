<?php
// 应用公共文件

use think\exception\HttpException;
use think\exception\HttpResponseException;
use think\Model;
use think\Response;

function model($name)
{
    if (is_string($name)) {
        $module = app('http')->getName();
        if (count(explode("\\", $name)) > 1) {
            $model = $name;
        } else {
            $model = "app\\{$module}\\model\\{$name}";
        }
        try {
            $model = new $model();
        } catch (\Error $e) {
            throw new HttpException(500, "Model {$name} not fund");
        }
    } else if ($name instanceof Model) {
        $model = $name;
    } else {
        return false;
    }
    return $model;
}
