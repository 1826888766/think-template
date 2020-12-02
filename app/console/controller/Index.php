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
        $this->layout('layout');
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
