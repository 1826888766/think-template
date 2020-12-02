<?php
namespace app\api\controller;

use app\api\facade\Response;

/**
 * Undocumented class
 * @author 马良 <1826888766@qq.com>
 * @date 2020-12-01
 */
class Error 
{
    public function __call($method, $args)
    {
        return Response::success("1");
    }
}
