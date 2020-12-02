<?php
// 这是系统自动生成的公共文件

function createMenuHtml($menus, $iframe = false,$is_child = false)
{
    $html = [];
    foreach ($menus as $key => $value) {
        $sub = "";
        $right = "";
        if (!empty($value['child'])) {
            $right = '<i class="iconfont nav_right">&#xe697;</i>';
            $sub = createMenuHtml($value['child'],$iframe , 1);
            $a = "<a href='javascript:;'><i class='{$value['icon']}' lay-tips='{$value['name']}'></i><cite>{$value['name']}</cite>{$right}</a>{$sub}";
        } else {
            if($iframe){
                $url = url($value['url'],['is_iframe'=>1]);
            }else{
                $url = url($value['url']);
            }
            $a = "<a href='javascript:;' onclick=add_tab('{$value['name']}','{$url}')><i class='{$value['icon']}' lay-tips='{$value['name']}'></i><cite>{$value['name']}</cite>{$right}</a>{$sub}";
        }

        $i = "<li>{$a}</li>";
        $html[] = $i;
    }
    if ($is_child) {
        return "<ul class='sub-menu'>" . join('', $html) . "</ul>";
    }
    return join('', $html);
}
