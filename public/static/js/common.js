function eq(a, b) {
    return a == b;
}
layui.use(['form', 'jquery', 'ml', 'upload'], function () {
    const form = layui.form;
    const $ = layui.$;
    const ml = layui.ml;
    // 渲染多上传组件
    ml.renderUploadList(".mlUpload")

    /**
     * 监听表单提交
     * @attr action 请求地址
     * @attr data-form 表单DOM
     */
    form.on('submit(mlFormSubmit)', function (data) {
        var _form = '',
            that = $(this),
            text = that.text(),
            opt = {},
            def = { pop: false, refresh: true, jump: false, callback: null, time: 3000 };
        if ($(this).attr('data-form')) {
            _form = $(that.attr('data-form'));
        } else {
            _form = $(data.form);
        }

        if (that.attr('hisi-data')) {
            opt = new Function('return ' + that.attr('hisi-data'))();
        } else if (that.attr('lay-data')) {
            opt = new Function('return ' + that.attr('lay-data'))();
        }

        opt = $.extend({}, def, opt);

        that.removeClass('layui-btn-normal').addClass('layui-btn-disabled').prop('disabled', true).text('提交中...');
        $.ajax({
            type: "POST",
            url: _form.attr('action'),
            data: _form.serialize(),
            success: function (res) {
                that.removeClass("layui-btn-disabled");
                if (res.code == 0) {
                    that.text(res.msg).prop('disabled', false).removeClass('layui-btn-normal').addClass('layui-btn-danger');
                    setTimeout(function () {
                        that.removeClass('layui-btn-danger').addClass('layui-btn-normal').text(text);
                    }, opt.time);
                } else {
                    if (opt.callback) {
                        opt.callback(that, res);
                    } else {
                        that.addClass('layui-btn-normal').text(res.msg);
                        setTimeout(function () {
                            that.text(text).prop('disabled', false);
                            if (opt.pop == true) {
                                if (opt.refresh == true) {
                                    parent.location.reload();
                                } else if (opt.jump == true && res.url != '') {
                                    parent.location.href = res.url;
                                }
                                parent.layui.layer.closeAll();
                            } else if (opt.refresh == true) {
                                if (res.url != '') {
                                    location.href = res.url;
                                } else {
                                    history.back(-1);
                                }
                            }
                        }, opt.time);
                    }
                }
            }
        });
        return false;
    });
    /**
     * 监听下拉选择
     */
    form.on('select(mlFilterSelect)', function (obj) {
        var data = $(obj.elem).data()
        if (data.to) {
            var to = $("select[name=" + data.to + "]");
            if (!to) return;
            to.val('')
            if (data.ajax) {
                var url = data.ajax.replace("[id]", obj.value)
                $.post(url, function (res) {
                    if (res.code == 0) {
                        var html = "<option value=''>请选择" + to.data('label') + "</option>";
                        $.each(res.data, function () {
                            html += "<option value=" + this.value + ">" + this.name + "</option>"
                        })
                        to.html(html)
                        form.render('select')
                    } else {
                        layer.msg(res.msg)
                    }
                })
            }
            form.render('select')
        }

    })
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