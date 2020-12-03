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
                "field" => [
                    ["name" => "添加", "type" => "btn", "url" => 'add'],
                    ["name" => "编辑", "text" => "1"]
                ]
            ]
        ];
        $this->assign('tableConfig', $tableConfig);
        return $this->fetch('public:index');
    }

    public function add()
    {
        $formConfig = [
            "field" => [
                ["type" => "checkbox", "value" => [
                    [1, "学习"],
                    [2, "工作"],
                    [3, "游戏"],
                ], "default" => '1,2', 'field' => 'name', "label" => "多选"],
                ["type" => "select", "value" => [
                    ["name" => "学习", "value" => "1"],
                    ["name" => "工作", "value" => "2"],
                ],  'field' => 'name', "label" => "下拉"],
                ["type" => "selects", "value" => [
                    ["name" => "学习", "value" => "1"],
                    ["name" => "工作", "value" => "2"],
                ], "child" => [],  'field' => 'name', "label" => "多级下拉"],
                ["type" => "radio", "value" => "1|男,2|女", "default" => 1, 'field' => 'name', "label" => "单选"],
                ["type" => "switch", "value" => "1", "text" => "男|女", "default" => 1, 'field' => 'name', "label" => "开关"],
                ["type" => "text", 'field' => 'name', "label" => "文本"],
                ["type" => "edit", 'field' => 'name', "label" => "富文本编辑器"],
                ["type" => "password", 'field' => 'name', "label" => "密码"],
                ["type" => "textarea", 'field' => 'name', "label" => "文本域"],
            ],
            "method" => "post",
            "data" => [],
            "action" => ""
        ];
        $this->assign('formConfig', $formConfig);
        return $this->fetch("public:form");
    }
}
