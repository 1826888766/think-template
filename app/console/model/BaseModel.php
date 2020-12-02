<?php

declare(strict_types=1);

namespace app\console\model;

use Closure;
use think\Model;
use think\Paginator;

use function PHPSTORM_META\type;

/**
 * @mixin \think\Model
 */
class BaseModel extends Model
{
    protected $autoWriteTimestamp = true;

    protected $withSearchWhere = false;
    /**
     * 基本获取列表数据
     * @author 马良 <1826888766@qq.com>
     * @date 2020-12-02
     * @param mixed $where 查询条件
     * @param mixed $filed 返回字段
     * @param mixed $order 排序规则
     * @param mixed $group 分组
     * @return Paginator
     */
    public function getList($where = [],  $filed = '*', $order = "id desc",  $group = ""): Paginator
    {
        $limit = input('limit', 10);
        if ($this->withSearchWhere) {
            if ($where instanceof Closure) {
                $where = getSearchWhere(request()->param(), $where);
            } else {
                
                $where = array_merge_recursive(getSearchWhere(request()->param()), $where);
            }
        }
        return $this->field($filed)->where($where)->order($order)->group($group)->paginate($limit);
    }

    public function searchWhere()
    {
        $this->withSearchWhere = true;
        return $this;
    }
    /**
     * 获取一条数据
     * @author 马良 <1826888766@qq.com>
     * @date 2020-12-02
     * @param [type] $id
     * @return Model
     */
    public function get($id)
    {
        return $this->where('id', $id)->find();
    }
}
