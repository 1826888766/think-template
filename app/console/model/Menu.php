<?php

declare(strict_types=1);

namespace app\console\model;

use think\Model;

/**
 * 系统菜单模型
 * @mixin \think\Model
 */
class Menu extends Model
{
    /**
     * 生成主菜单 
     * @author 马良 <1826888766@qq.com>
     * @date 2020-12-01
     * @param int $parent_id 父节点
     * @param int $level 深度
     * @return array
     */
    public static function createMainMenu($parent_id = 0, $level = 1): array
    {
        $data = self::where('parent_id', $parent_id)->where([
            'status' => 1,
            'is_show' => 1,
        ])->select();
        $menus = [];
        foreach ($data as $key => $value) {
            $child = [];
            if ($level <= 2) {
                $child = self::createMainMenu($value->id, $level + 1);
            }
            $value->setAttr('child', $child);
            $menus[] = $value->toArray();
        }
        return $menus;
    }
    /**
     * 获取当前页面显示的节点
     * @author 马良 <1826888766@qq.com>
     * @date 2020-12-01
     * @return void
     */
    public static function getCurrent()
    {
        $data = self::where('status', 1)->select()->toArray();
        if (!$data) {
            return false;
        }
        $url = url('', [], false)->build();
        foreach ($data as $value) {
            $_url = url($value['url'], [], false)->build();
            if (strtolower($url) === strtolower($_url)) {
                return $value;
            }
        }
        return false;
    }
    /**
     * 获取面包屑导航
     * @author 马良 <1826888766@qq.com>
     * @date 2020-12-01
     * @param [type] $id
     * @return void
     */
    public static function getCrumb($id)
    {
        $crumb = [];
        $menu = self::where('id', $id)->where('status', 1)->find();
        if ($menu['parent_id'] > 0) {
            $crumb = array_merge_recursive($crumb, self::getCrumb($menu['parent_id']));
        }
        $crumb[] = $menu->toArray();
        return $crumb;
    }

    /**
     * 生成主菜单目录html
     * @author 马良 <1826888766@qq.com>
     * @date 2020-12-01
     * @return string
     */
    public function createMainMenuString(): string
    {
        return createMenuHtml($this->createMainMenu());
    }
}
