<?php

namespace app\console;

use app\BaseController;
use app\console\model\Menu;
use think\exception\HttpResponseException;
use think\facade\View;
use think\Model;

/**
 * 接口基础控制器
 * @author 马良 <1826888766@qq.com>
 * @date 2020-12-01
 */
class ConsoleBase extends BaseController
{
    protected $iframe = 0;
    // 当前控制器主要模型
    protected $model = "";
    // 当前控制器主要验证器
    protected $validate = "";
    // 验证场景
    protected $validateScene = [
        "add" => "", // 添加
        "edit" => "", // 编辑
        "status" => "", // 状态更新
        "del" => "" // 删除
    ];
    /**
     * 初始化操作
     * @author 马良 <1826888766@qq.com>
     * @date 2020-12-02
     * @throws HttpResponseException 
     */
    public function initialize()
    {
        $controller = $this->request->controller(true);
        $action = $this->request->action(true);
        $this->assign('iframe', $this->iframe);
       
        $curMenu = Menu::getCurrent();
        if (!$curMenu) {
            $this->error('节点不存在或无权限！');
        }
        if (!$this->request->isAjax()) {
            $this->assign('tableCols',[]);
            $menus = Menu::createMainMenu();
            $this->assign('menus', $menus);
            $parent = false;
            $is_iframe = input('is_iframe', false);
            if ($this->iframe) {
                if (($action !== "index" || $controller !== "index") && !$is_iframe) {
                    $this->redirect(url('index'), 302, ['parent_id' => $curMenu['id']]);
                } else {
                    if ($parent_id = input('parent_id/d')) {
                        $parent = Menu::where(['id' => $parent_id])->find();
                    }
                }
                $this->layout('iframe');
            } else {
                $this->layout();
            }

            $crumb = Menu::getCrumb($curMenu['id']);
            $this->assign('parent', $parent);
            $tabData = [
                'menus' => [],
                'current' => [],
            ];
            $this->assign('crumb', $crumb);
            $this->assign('tableConfig', []);
            $this->assign('curMenu', $curMenu);
            $this->assign('tabType', 1);
            $this->assign('tabData', $tabData);
            parent::initialize();
        }
    }


    /**
     * 开启或关闭layout
     * @author 马良 <1826888766@qq.com>
     * @date 2020-12-01
     * @param bool $layout
     * @return void
     */
    protected function layout($layout = true)
    {
        if (true === $layout) {
            $layout_name = "layout";
        } else {
            $layout_name = $layout;
        }
        View::config(['layout_on' => $layout, 'layout_name' => $layout_name]);
    }

    /**
     * 获取当前模型
     * @author 马良 <1826888766@qq.com>
     * @date 2020-12-03
     * @return \think\Model
     */
    protected function model() : Model
    {
        return model($this->model);
    }
}
