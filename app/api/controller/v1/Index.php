<?php
declare (strict_types = 1);

namespace app\api\controller\v1;
use app\api\ApiBaseController;

class Index extends ApiBaseController
{
    public function index()
    {
        return success("1");
    }
}
