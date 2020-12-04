<?php
// 这是系统自动生成的公共文件

function createMenuHtml($menus, $iframe = false, $is_child = false)
{
    $html = [];
    foreach ($menus as $key => $value) {
        $sub = "";
        $right = "";
        if (!empty($value['child'])) {
            $right = '<i class="iconfont nav_right">&#xe697;</i>';
            $sub = createMenuHtml($value['child'], $iframe, 1);
            $a = "<a href='javascript:;'><i class='{$value['icon']}' lay-tips='{$value['name']}'></i><cite>{$value['name']}</cite>{$right}</a>{$sub}";
        } else {
            if ($iframe) {
                $url = url($value['url'], ['is_iframe' => 1]);
            } else {
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
 * 生成form表单
 * @author 马良 <1826888766@qq.com>
 * @date 2020-12-04
 * @param array $item
 * @param bool $is_child 是否为一行内的数据
 * @return string
 */
function createFormItemHtml($item, $is_child = false)
{
    $item['default'] = getField($item, 'default', '');
    $item['type'] = getField($item, 'type', 'text');
    $item['label'] = getField($item, 'label', '');
    $__ORIGIN_VALUE = getField($item, 'value');
    $item['value'] = decodeValueString(getField($item, 'value'));
    if ($is_child && !in_array($item['type'], ['select'])) {
        return "";
    }
    $html  = "";
    if (!$is_child) {
        $html = "<div class='layui-form-item'><label  class='layui-form-label'>{$item['label']}</label>";
    }
    switch ($item['type']) {
        case 'radio':

            $html .= '<div class="layui-input-block">';
            foreach ($item['value'] as $radio) {
                $html .=  "<input type='radio' lay-filter='mlFilterRadio' title={$radio[1]} " . ($item['default'] == $radio[0] ? 'checked' : '') . " value={$radio[0]} name={$item['field']}>";
            }
            $html .= '</div>';
            break;
        case 'switch':
            $html .= '<div class="layui-input-block">';
            $html .= "<input type=checkbox lay-filter='mlFilterSwitch' name={$item['field']} lay-text=" . getField($item, 'text') . "
                        value={$__ORIGIN_VALUE} lay-skin=switch>";
            $html .= '</div>';
            break;
        case 'checkbox':
            $html .= '<div class="layui-input-block">';
            $item['default'] = is_array($item['default']) ?: explode(',', $item['default']);
            foreach ($item['value'] as $checkbox) {
                $html .=  "<input lay-filter='mlFilterCheckbox' type='checkbox' " . (in_array($checkbox[0], $item['default']) ? 'checked' : '') . " class=layui-input
                value={$checkbox[0]} title={$checkbox[1]} name={$item['field']}
                lay-skin=" . getField($item, 'skin', 'primary') . ">";
            }
            $html .= '</div>';
            break;
        case 'select':
            if (!$is_child) {
                $html .= '<div class="layui-input-block">';
            }
            $html .= "<div class='layui-input-inline'><select data-ajax='" . getField($item, 'ajax', '') . "' data-to='" . getField($item, 'to', '') . "' lay-filter='mlFilterSelect' name={$item['field']}><option value=''>" . getField($item, 'placeholder', "请选择{$item['label']}") . "</option>";
            foreach ($item['value'] as $select) {
                $html .=  "<option " . (getField($item, 'default') == $select[0] ? 'selected' : '') . " value={$select[0]}>{$select[1]}
                        </option>";
            }
            $html .= "</select></div>";
            if (!$is_child) {
                if (!empty(getField($item, 'child', []))) {
                    $html .= createFormHtml($item['child'], true);
                }
                $html .= '</div>';
            }
            break;
        case 'password':
            $html .= '<div class="layui-input-inline">';
            $html .= " <input type=password autocomplete=off name={$item['field']} placeholder=" . getField($item, 'placeholder', "请输入{$item['label']}") . " class=layui-input>";
            $html .= '</div>';
            break;
        case 'edit':
            $html .= "<div class=layui-input-block><div id={$item['field']}></div>";
            $html .= editor([$item['field']], getField($item, 'editor_type', 'ueditor'));
            $html .= '</div>';
            break;
        case 'textarea':
            $html .= '<div class="layui-input-block">';
            $html .= "<textarea  autocomplete=off rows=" . getField($item, 'rows') . " cols=" . getField($item, 'cols') . " name={$item['field']} placeholder=" . getField($item, 'placeholder', "请输入{$item['label']}") . "
                class=layui-textarea></textarea>";
            $html .= '</div>';
            break;
        case 'upload':
            $html .= '<div class="layui-input-block">';
            $html .= "<input type='hidden' name={$item['field']} ><button class='mlUpload layui-btn layui-btn-normal' data-name={$item['field']} lay-data=" . getField($item, 'layData', '{}') . " data-preview=" . getField($item, 'preview', false) . "  data-type=" . getField($item, 'filetype', 'file') . " type='button'>选择文件</button>";
            if (getField($item, 'preview', false)) {
                $html .= "<div class='layui-upload-list'><table class='layui-table'><thead><tr><th>文件名</th><th>大小</th><th>状态</th><th>操作</th></tr></thead><tbody id='{$item['field']}List'></tbody></table></div>";
            }
            $html .= '</div>';
            break;
        default:
            $html .= '<div class="layui-input-inline">';
            $html .= " <input  autocomplete=off type={$item['type']} name={$item['field']} placeholder=" . getField($item, 'placeholder', "请输入{$item['label']}") . "
        class=layui-input>";
            $html .= '</div>';
            break;
    }
    if (!$is_child) {
        $html .= "</div>";
    }

    return $html;
}
/**
 * 富文本编辑器
 * @author 马良 <1826888766@qq.com>
 * @date 2020-12-04
 * @param array $obj
 * @param string $name
 * @param string $url
 * @return string
 */
function editor($obj = [], $name = 'ueditor', $url = '')
{
    $jsPath = '/static/js/editor/';

    if (empty($url)) {
        $url = url("console/upload/index?full_path=yes&thumb=no&from=" . $name);
    }

    switch (strtolower($name)) {
        case 'ueditor':
            $html = '<script src="' . $jsPath . 'ueditor/ueditor.config.js"></script>';
            $html .= '<script src="' . $jsPath . 'ueditor/ueditor.all.min.js"></script>';
            $html .= '<script src="' . $jsPath . 'ueditor/plugins/135editor.js"></script>';
            $html .= '<script>';
            foreach ($obj as $k => $v) {
                $html .= 'var ue' . $k . ' = UE.ui.Editor({serverUrl:"' . $url . '",initialFrameHeight:500,initialFrameWidth:"100%",autoHeightEnabled:false});ue' . $k . '.render("' . $v . '");';
            }
            $html .= '</script>';
            break;
        case 'kindeditor':
            if (is_array($obj)) {
                $obj = implode(',#', $obj);
            }
            $html = '<script src="' . $jsPath . 'kindeditor/kindeditor-min.js"></script>
                    <script>
                        var editor;
                        KindEditor.ready(function(K) {
                            editor = K.create(\'#' . $obj . '\', {uploadJson: "' . $url . '",allowFileManager : false,minHeight:500, width:"100%",autoHeightEnabled:false, afterBlur:function(){this.sync();}});
                        });
                    </script>';
            break;
        case 'ckeditor':
            $html = '<script src="' . $jsPath . 'ckeditor/ckeditor.js"></script>';
            $html .= '<script>';
            foreach ($obj as  $v) {
                $html .= 'CKEDITOR.replace("' . $v . '",{filebrowserImageUploadUrl:"' . $url . '"});';
            }
            $html .= '</script>';
            break;

        default:
            $html = '<link href="' . $jsPath . 'umeditor/themes/default/css/umeditor.css" type="text/css" rel="stylesheet">';
            $html .= '<script src="' . $jsPath . 'umeditor/third-party/jquery.min.js"></script>';
            $html .= '<script src="' . $jsPath . 'umeditor/third-party/template.min.js"></script>';
            $html .= '<script src="' . $jsPath . 'umeditor/umeditor.config.js"></script>';
            $html .= '<script src="' . $jsPath . 'umeditor/umeditor.min.js"></script>';
            $html .= '<script>';
            foreach ($obj as  $k => $v) {
                $html .= 'var um' . $k . ' = UM.getEditor("' . $v . '", {
                            initialFrameWidth:"100%"
                            ,initialFrameHeight:"500"
                            ,autoHeightEnabled:false
                            ,imageUrl:"' . $url . '"
                            ,imageFieldName:"upfile"});';
            }
            $html .= '</script>';
            break;
    }
    return $html;
}

function createFormHtml($config, $is_child = false)
{
    $html = [];
    foreach ($config as $item) {
        $html[] = createFormItemHtml($item, $is_child);
    }

    return join("", $html);
}
/**
 * 获取数组中的某一项
 * @author 马良 <1826888766@qq.com>
 * @date 2020-12-03
 * @param [type] $obj
 * @param [type] $field
 * @param string $default
 */
function getField($obj, $field, $default = '')
{
    return isset($obj[$field]) ? $obj[$field] : $default;
}
/**
 * 解析数值
 * @author 马良 <1826888766@qq.com>
 * @date 2020-12-03
 * @param [type] $value
 * @return void
 */
function decodeValueString($value)
{
    if (is_string($value)) {
        $value = explode(',', $value);
        $__NEW_VALUE = [];
        foreach ($value as $v) {
            $__NEW_VALUE[] = explode('|', $v);
        }
        $value = $__NEW_VALUE;
    } else if (is_array($value) && !empty($value)) {
        if (isset($value[0]['name'])) {
            $__NEW_VALUE = [];
            foreach ($value as $item) {
                $__NEW_VALUE[] = [$item['value'], $item['name']];
            }
            $value = $__NEW_VALUE;
        }
    }
    return $value;
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
