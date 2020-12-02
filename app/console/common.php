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


/**
 * 生成查询条件
 *
 * @param array    $params   需要生成的数组
 * @param mixed    $create   需要搜索的时间字段|或闭包函数
 * @param string[] $haystack 不需要加入生成的字段|或闭包函数
 * @param Closure  $callback function(&$where,$key,$value):mixed  一些需要自定义的是一个闭包函数
 *
 *
 * @return array
 */
function getSearchWhere($params, $create = "create_time", $haystack = ['limit', 'page', 'keyword'], $callback = false)
{
    $where = [];
    // 判断是否是闭包
    if ($create instanceof Closure) {
        $callback = $create;
        $create = "create_time";
    } elseif ($haystack instanceof Closure) {
        $callback = $haystack;
        $haystack = ['limit', 'page', 'keyword'];
    }
    // 循环所有数据
    foreach ($params as $key => $value) {
        if (in_array($key, $haystack)) {
            continue;
        }

        if ($callback !== false) {
            $res = call_user_func_array($callback, [&$where, $key, $value]);
            // 闭包返回 true 跳过当前步骤
            if ($res === true) {
                continue;
            }
        }
        // 判断是否有值
        if ($value === "") {
            continue;
        }
        if (startsWith($key, 'id') || endsWith($key, '_id') || startsWith($key, 'is_')) {
            // 判断开头或结尾为id 或是状态类的字段
            $where[] = [$key, '=', $value];
        } elseif ($key == 'start_time' || $key == 'end_time') {
            // 判断时间
            if ($key == 'start_time') {
                $where[] = [$create, '>=', strtotime("$value")];
            } elseif ($key == 'end_time') {
                $where[] = [$create, '<=', strtotime("{$value} +1 day")];
            }
        } elseif (endsWith($key, '_time')) {
            // 判断时间
            $time = explode(' - ', $value);
            $start = $time[0];
            $end = isset($time[1]) ? $time[1] : false;
            if ($end) {
                $where[] = [$key, 'between', [strtotime("$start"), strtotime("{$end} +1 day")]];
            } else {
                $where[] = [$key, '=', strtotime("$start")];
            }
        } else {
            $where[] = [$key, 'like', "%{$value}%"];
        }
    }
    return $where;
}

/**
 * 判断是否在末尾位置
 *
 * @param $string    string
 * @param $subString string
 *
 * @return bool
 */
function endsWith($string, $subString)
{
    return substr($string, strpos($string, $subString)) === $subString;
}

/**
 * 判断是否在开头位置
 *
 * @param $string    string
 * @param $subString string
 *
 * @return bool
 */
function startsWith($string, $subString)
{
    return substr($string, 0, strlen($subString)) === $subString;
}
