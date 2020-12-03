<?php

declare(strict_types=1);

namespace app\console\controller;

use app\console\ConsoleBase;
use app\console\facade\Response;

class Menu extends ConsoleBase
{

    protected $model = "Menu";
    protected $validate = "Menu";

    protected $validateScene = [];

    public function index()
    {
        if ($this->request->isAjax()) {
            $data = $this->model()->searchWhere()->getList();
            return Response::layui($data->items(), $data->total());
        }
        $tableConfig = [
            "cols" => [[
                ['type' => "checkbox"],
                ['field' => "id", 'title' => "ID", "search" => true, "sort" => true],
                ['field' => "name", 'title' => "菜单名称", "search" => true],
                ['field' => "url", 'title' => "菜单链接"],
                ['field' => "status", 'title' => "状态", "type" => "switch", "switch" => []],
                ['field' => "is_show", 'title' => "是否显示", "type" => "switch", "switch" => ["url" => "is_show"]],
                ['field' => "is_auth", 'title' => "是否验证权限", "type" => "switch", "switch" => ["url" => "is_auth"]],
                ['title' => "操作", "type" => "tools", "width" => 200, "btns" => [
                    "edit" => ["name" => "编辑", "refersh" => true],
                    "del" => ["name" => "删除", "confirm" => true, "class" => "layui-btn-danger"],
                ]]
            ]],
            "toolbar" => [
                ["name" => "编辑", "url" => url('add')]
            ]
        ];
        $this->assign('tableConfig', $tableConfig);
        return $this->fetch('public:index');
    }
}
