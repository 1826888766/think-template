function eq(a, b) {
    return a == b;
}
layui.use(['form', 'jquery'], function () {
    const form = layui.form;
    const $ = layui.$;
    /**
     * 通用状态设置开关
     * @attr data-href 请求地址
     * @attr confirm 确认提示
     */
    form.on('switch(changeSwitch)', function (data) {
        var value = [0, 1];
        var that = $(this), status = 0, func = function () {
            $.get(that.attr('data-href'), { val: status }, function (res) {
                layer.msg(res.msg);
                if (res.code == 1) {
                    that.trigger('click');
                    form.render('checkbox');
                }
            });
        };
        if (typeof (that.attr('data-href')) == 'undefined') {
            layer.msg('请设置data-href参数');
            return false;
        }
        if (typeof (that.attr('data-value')) != 'undefined') {
            var _value = that.attr('data-value').split("|")
            if (_value.length != 2) {
                layer.msg('请正确设置data-value参数');
                return
            }
        }
        if (this.checked) {
            status = value[1];
        } else {
            status = value[0];
        }

        if (typeof (that.attr('confirm')) == 'undefined') {
            func();
        } else {
            layer.confirm(that.attr('confirm') || '你确定要执行操作吗？', { title: false, closeBtn: 0 }, function (index) {
                func();
            }, function () {
                that.trigger('click');
                form.render('checkbox');
            });
        }
    });
})