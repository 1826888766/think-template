<?php

declare(strict_types=1);

namespace app\console\controller;

use app\console\ConsoleBase;

/**
 * 
 * @author 马良 <1826888766@qq.com>
 * @date 2020-12-01
 */
class Index extends ConsoleBase
{
    public function index()
    {
        if(!input('is_iframe','')){
            $this->layout();
        }else{
            // 防止后台首页是在iframe中打开时多级嵌套
            $this->layout('iframe');
        }
        return $this->fetch();
    }
    public function welcome()
    {
        return $this->fetch();
    }
    public function welcome2()
    {
        return $this->fetch();
    }
}
