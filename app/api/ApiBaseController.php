<?php

namespace app\api;

use app\api\model\User;
use app\BaseController;
/**
 * 接口基础控制器
 * @author 马良 <1826888766@qq.com>
 * @date 2020-12-01
 */
class ApiBaseController extends BaseController{

    // 是否验证token
    protected $checkToken = false;

    public function initialize()
    {
        parent::initialize();
    }

    protected function checkToken($token)
    {
        $user = User::where('token',$token)->find();
        if(!$user){
            return false;
        }
        return true;
    }

    


}