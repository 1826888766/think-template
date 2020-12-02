<?php

namespace app\console;

use app\BaseController;
use app\console\model\Menu;
use think\event\HttpEnd;
use think\exception\HttpResponseException;
use think\facade\View;

/**
 * 接口基础控制器
 * @author 马良 <1826888766@qq.com>
 * @date 2020-12-01
 */
class ConsoleBase extends BaseController
{
    protected $iframe = false;

    public function initialize()
    {
        $controller = $this->request->controller(true);
        $action = $this->request->action(true);
        $this->assign('iframe', $this->iframe);
        $menus = Menu::createMainMenu();
        $this->assign('menus', $menus);
        $curMenu = Menu::getCurrent();
        if(!$curMenu){
            $this->error('节点不存在或无权限！',url('console/index/index'));
        }
        $parent = false;
        $is_iframe = input('is_iframe',false);
        if($this->iframe){
            if(($action!=="index"||$controller !== "index")&&!$is_iframe){
                throw new HttpResponseException(redirect(url('index',['parent_id'=>$curMenu['id']])));
            }else{
                if($parent_id = input('parent_id/d')){
                    $parent = Menu::where(['id'=>$parent_id])->find();
                }
            }
            $this->layout('iframe');
        }else{
            $this->layout();
        }
        $crumb = Menu::getCrumb($curMenu['id']);
        $this->assign('parent',$parent);
        $tabData = [
            'menus' => [],
            'current' => [],
        ];
        $this->assign('crumb', $crumb);
        $this->assign('curMenu', $curMenu);
        $this->assign('tabType', 1);
        $this->assign('tabData', $tabData);
        parent::initialize();
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
}
