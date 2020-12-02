<?php

namespace app\api\facade;

use think\Facade;

/**
 * @method static string getMessage(int $code) 根据错误码获取错误信息
 * @method static think\response\Json error($code,$msg="",$data=[]) 失败返回
 * @method static think\response\Json success($data,$code=0,$msg="") 成功返回
 * @author 马良 <1826888766@qq.com>
 * @date 2020-12-01
 */
class Response  extends  Facade
{
    /**
     * 获取当前Facade对应类名
     * @access protected
     * @return string
     */
    protected static function getFacadeClass()
    {
        return "app\\api\\Response";
    }
}
