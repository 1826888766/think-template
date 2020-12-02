<?php

use app\api\facade\Response;
use think\facade\Request;

/**
 * 正确返回
 */
function success($data,$code=0,$msg=""){
    return Response::success($data,$code,$msg);
}

/**
 * 错误返回
 */
function error($code,$msg="",$data=[]){
    return Response::error($code,$msg,$data);
}

function createToken()
{
    $token = md5(Request::server('REQUEST_TIME_FLOAT'));
    return $token;
}