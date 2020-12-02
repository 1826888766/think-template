<?php

declare(strict_types=1);

namespace app\console\controller;

use app\console\ConsoleBase;
use app\console\facade\Response;
use ml\ColsItem;

class User extends ConsoleBase
{
    protected $model = "User";
    protected $validate = "User";

    protected $validateScene = [];

    public function index()
    {
        if ($this->request->isAjax()) {
            $data = $this->model()->getList();
            return Response::layui($data->items(), $data->total());
        }
        $cols = [
            ['type' => "checkbox"],
            ['field' => "id", 'title' => "ID", "search" => true, "sort" => true],
            ['field' => "username", 'title' => "登录名", "search" => true],
            ['field' => "realname", 'title' => "真实姓名", "search" => true],
            ['field' => "nickname", 'title' => "昵称", "search" => true],
            ['field' => "create_time", "range" => true, "type" => "date", 'title' => "创建时间", "search" => true],
            ['field' => "update_time",  'title' => "更新时间"],
        ];
        $tableConfig = [
            "cols" => [$cols],
        ];
        $this->assign('tableConfig', $tableConfig);
        return $this->fetch();
    }
}
