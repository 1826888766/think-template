<?php
namespace app\api;

use think\response\Json;

/**
 * api数据响应处理
 * @author 马良 <1826888766@qq.com>
 * @date 2020-12-01
 */
class Response 
{
    const RETURN_SUCCESS = 0;

    protected $message = [
        "zh-cn"=>[
            0=>"请求成功"
        ],
        "en"=>[
            0=>"success"
        ]
    ];
    /**
     * 获取错误信息
     * @author 马良 <1826888766@qq.com>
     * @date 2020-12-01
     * @param int $code
     * @return string
     */
    public function getMessage(int $code) : string
    {
        $lang = config('system.lang');
        return $this->message[$lang][$code];
    }

   /**
    * 生成正确信息
    * @author 马良 <1826888766@qq.com>
    * @date 2020-12-01
    * @param mixed $data 返回数据
    * @param integer $code 返回状态
    * @return think\response\Json
    */
    public function success($data,int $code=self::RETURN_SUCCESS,$msg="") : Json
    {
        return json([
            "data"=>$data,
            "code"=>$code,
            "msg"=>$msg?:$this->getMessage($code)
        ]);
    }
    /**
     * 生成错误信息
     * @author 马良 <1826888766@qq.com>
     * @date 2020-12-01
     * @param int $code 返回错误码
     * @param string $msg 自定义返回错误信息
     * @param array $data 返回错误数据
     * @return think\response\Json
     */
    public function error(int $code,$msg = "",$data=[]):Json
    {
        return json([
            "data"=>$data,
            "code"=>$code,
            "msg"=>$msg?:$this->getMessage($code)
        ]);
    }
}
