<?php

declare(strict_types=1);

namespace app\console\model;

use think\Model;
use think\Paginator;

/**
 * @mixin \think\Model
 */
class BaseModel extends Model
{
    protected $autoWriteTimestamp = true;

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
        return $this->field($filed)->where($where)->order($order)->group($group)->paginate($limit);
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
