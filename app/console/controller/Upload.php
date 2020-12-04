<?php

declare(strict_types=1);

namespace app\console\controller;


class Upload
{

    public function index()
    {
        $param = \request()->param();
        $from = isset($param['from']) ? strtolower($param['from']) : 'input';
        $input = isset($param['input']) ? $param['input'] : 'file';
        $fullPath = isset($param['full_path']) ? $param['full_path'] : false;
        switch ($from) {
            case 'kindeditor':

                $input = 'imgFile';

                break;

            case 'umeditor':

                $input = 'upfile';

                break;

            case 'ckeditor':

                $input = 'upload';

                break;

            case 'ueditor':

                $input = 'upfile';

                if (isset($_GET['action']) && $_GET['action'] == 'config') {

                    $content = file_get_contents('./static/js/editor/ueditor/config.json');

                    $json = preg_replace("/\/\*[\s\S]+?\*\//", "", $content);
                    echo json_encode(json_decode($json, true), 256);

                    exit;
                }
                break;

            default: // 默认使用layui.upload上传控件
                break;
        }
        $file = request()->file($input);

        if (empty($file)) {
            return self::result('未找到上传的文件(文件大小可能超过php.ini默认2M限制)！', $from);
        }

        if ($file->getMime() == 'text/x-php' || $file->getMime() == 'text/html') {
            return self::result('禁止上传php,html文件！', $from);
        }

        $savename = \think\facade\Filesystem::disk('public')->putFile('image', $file,'md5');
        $fileSize = round($file->getSize() / 1024, 2);

        $data = [
            'file' => str_replace('\\', '/', $savename),
            'hash' => $file->md5(),
            'size' => $fileSize,
            'ctime' => request()->time(),
        ];
        if($fullPath){
            
            $data['file'] = config('filesystem.disks.public.url').'/'.$data['file'];
        }
        return self::result('文件上传成功。', $from, 1, $data);
    }

    /**
     * 返回结果
     */
    private static function result($info = '', $from = 'input', $status = 0, $data = [])
    {
        $arr = [];

        switch ($from) {

            case 'kindeditor':

                if ($status == 0) {

                    $arr['error'] = 1;
                    $arr['message'] = $info;
                } else {

                    $arr['error'] = 0;
                    $arr['url'] = $data['file'];
                }

                break;

            case 'ckeditor':

                if ($status == 1) {
                    echo '<script type="text/javascript">window.parent.CKEDITOR.tools.callFunction(1, "' . $data['file'] . '", "");</script>';
                } else {
                    echo '<script type="text/javascript">window.parent.CKEDITOR.tools.callFunction(1, "", "' . $info . '");</script>';
                }

                exit;

                break;

            case 'umeditor':
            case 'ueditor':

                if ($status == 0) {

                    $arr['message'] = $info;
                    $arr['state'] = 'ERROR';
                } else {

                    $arr['message'] = $info;
                    $arr['url'] = $data['file'];
                    $arr['state'] = 'SUCCESS';
                }

                echo json_encode($arr, 1);
                exit;

                break;

            default:

                $arr['msg'] = $info;
                $arr['code'] = $status;
                $arr['data'] = $data;

                break;
        }

        return $arr;
    }
}
