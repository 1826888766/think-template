layui.define([
    'jquery',
    'form',
    'table',
    'laydate',
    'laytpl',
    'upload'
], function (exports) {
    'use strict';
    var tableInstance;
    const $ = layui.$;
    const table = layui.table;
    const laydate = layui.laydate;
    const form = layui.form;
    const upload = layui.upload;
    const laytpl = layui.laytpl;
    var searchTpl = " <style>\n" +
        "        .page-toolbar {\n" +
        "            height: auto;\n" +
        "        }\n" +
        "\n" +
        "        .page-filter {\n" +
        "            height: auto;\n" +
        "        }\n" +
        "    </style>\n" +
        "    <div class=\"layui-form-item\">\n" +
        "        {{# for (var key in d.field){\n" +
        "        var item = d.field[key];\n" +
        "        }}\n" +
        "        <div class=\"layui-inline\">\n" +
        "            {{# if(item.showLabel!==false){ }}\n" +
        "            <label class=\"layui-form-label\" style=\" min-width: 60px;width: auto;\">{{item.title}}</label>\n" +
        "            {{# } }}\n" +
        "            <div class=\"layui-input-inline\" style=\"width: {{d.width?d.width:180}}px;\">\n" +
        "                {{# if (item.type == 'select') { }}\n" +
        "                <select data-key=\"{{key}}\" {{item.search ?'lay-search':''}}\n" +
        "                lay-filter=\"mlSearchSelect\"\n" +
        "                name=\"{{item.field}}\">\n" +
        "                {{# for(var i in item.options) {\n" +
        "                var option = item.options[i];\n" +
        "                }}\n" +
        "                <option value=\"{{option.value}}\" {{option.value==item.value?'selected':''}}>{{option.name}}</option>\n" +
        "                {{# } }}\n" +
        "                </select>\n" +
        "                {{# } else if(item.type == 'date') { }}\n" +
        "                <input type=\"text\" data-key=\"{{key}}\"\n" +
        "                       name=\"{{item.field}}\"\n" +
        "                       autocomplete=\"off\"\n" +
        "                       value=\"{{item.value||''}}\"\n" +
        "                       placeholder=\"{{item.placeholder||('请选择'+item.title)}}\"\n" +
        "                       class=\"layui-input date{{item.range?'-range':''}}\">\n" +
        "                {{# } else { }}\n" +
        "                <input data-key=\"{{key}}\"\n" +
        "                       value=\"{{item.value||''}}\"\n" +
        "                       autocomplete=\"off\"\n" +
        "                       type=\"text\" name=\"{{item.field}}\"\n" +
        "                       placeholder=\"{{item.placeholder||('请输入'+item.title)}}\"\n" +
        "                       class=\"layui-input\">\n" +
        "                {{# } }}\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        {{# } }}\n" +
        "\n" +
        "        <div class=\"layui-inline\">\n" +
        "            <button type=\"submit\" lay-submit lay-filter=\"mlSearch\"\n" +
        "                    class=\"layui-btn layui-btn-normal\">\n" +
        "                搜索\n" +
        "            </button>\n" +
        "            <button type=\"reset\" onclick=\"ml.reload()\"\n" +
        "                    class=\"layui-btn layui-btn-primary \">\n" +
        "                重置\n" +
        "            </button>\n" +
        "        </div>\n" +
        "    </div>";
    var ml = function () {
        this.v = "0.0.1";
        this.config = {}
    }
    ml.prototype.on = function (e, t) {
        return layui.onevent.call(e, t)
    }

    ml.prototype.success = function () { }

    ml.prototype.render = function (config) {
        this.config = initConfig(config)
        renderTable(this.config.table)
        renderToolbar(this.config.toolbar)
        renderSearchForm(this.config.search)
        this.searchListen();
        this.toolbarListen();
        this.tableListen();
        this.success()
    }
    ml.prototype.search = null

    ml.prototype.reload = function (config) {
        config && (this.config = initConfig(config));
        reloadSearchForm(this.config.search)
        reloadTable(this.config.table)
    }
    ml.prototype.reloadTable = function (config) {
        config && (this.config = initConfig(config));
        reloadTable(this.config.table)
    }
    ml.prototype.reloadSearch = function (config) {
        config && (this.config = initConfig(config));
        reloadSearchForm(this.config.search)
    }

    ml.prototype.tableInstance = tableInstance;

    function createUrl(name, params) {
        var parentUrl = GetUrlRelativePath();
        var param = ""
        var relUrl = name
        if (name.indexOf("?") != -1) {
            relUrl = name.split("?")[0];
            param = "?" + name.split("?")[1] + "&" + params
        } else {
            param = "?" + params
        }
        var a = relUrl.split("/")
        var b = parentUrl.split("/")
        var module = b[1]
        var controller = b[2]
        var action = b[3]
        if (a.length == 3) {
            module = a[0]
            controller = a[1]
            action = a[2]
        } else if (a.length == 2) {
            controller = a[0]
            action = a[1]
        } else if (a.length == 1) {
            action = a[0]
        } else if (a.length > 3) {
            module = a[0]
            controller = a[1]
            action = name.substring(a[0].length + a[1].length - 1)
        }
        return ['', module, controller, action].join("/") + param
    }

    function createBtns(btns) {
        var html = [];
        $.each(btns, function (index) {
            var url = this.url ? this.url : createUrl(index)
            // 添加id 和扩展参数
            url += "?id={{d.id}}&is_iframe=1&" + (this.param || '')
            var btn = "<span " + (this.confirm ? "confirm='" + this.confirm + "'" : '') +
                " onclick=add_tab('" + this.name + "','" + url + "') class='layui-btn layui-btn-sm " +
                (this.ajax ? ' ajax ' : ' iframe ') +
                (this.refersh ? ' refersh ' : '') +
                (this.class || ' layui-btn-normal') + "'>" + this.name + "</span>"
            html.push(btn)
        })
        return "<div class='layui-btn-group'>" + html.join("") + "</div>"
    }

    function createSwitch(name, config) {
        var switchBtn = { text: "", value: 1, url: "status" }
        switchBtn = $.extend(switchBtn, config)
        var text = switchBtn.text || ""
        var value = switchBtn.value || 1
        var url = switchBtn.url ? createUrl(switchBtn.url, "id={{d.id}}") : createUrl('status?id={{d.id}}&field=' + name)
        return "<div><input type='checkbox' name=" + name + " value=" + value
            + " lay-skin='switch' lay-filter='changeSwitch' " +
            "lay-text=' " + text + "' {{eq(d." + name + "," + value + ")?'checked':''}} "
            + " data-href='" + url + "' ></div>";
    }

    /**
     * 初始化配置信息
     * @param {*} config 
     */
    function initConfig(config) {
        var filed = []
        $.each(config.cols[0], function () {
            if (this.search) {
                filed.push(this)
            }
            if (this.type == "tools") {
                this['templet'] = this['templet'] || createBtns(this.btns)
                this['fixed'] = "right"
            } else if (this.type == "switch") {
                this['templet'] = this['templet'] || createSwitch(this.field, this.switch)
            }
        })
        var toolbar = {};
        if (typeof config.toolbar == "object") {
            toolbar = config.toolbar;
            delete config['toolbar'];
        }
        var new_config = {
            table: $.extend({
                elem: "#mlTableData",
                page: true,
                cellMinWidth: 100,
                url: GetUrlRelativePath()
            }, config),
            toolbar: $.extend({ field: [], elem: "#mlTableDataToolbar" }, toolbar),
            search: {
                elem: config.search_elem || "#mlTableDataSearch",
                field: filed,
                search: config.search,
                change: config.change
            }
        };
        return new_config;
    }
    /**
     * 获取当前路由
     */
    function GetUrlRelativePath() {
        var url = document.location.toString();
        var arrUrl = url.split("//");

        var start = arrUrl[1].indexOf("/");
        var relUrl = arrUrl[1].substring(start);

        if (relUrl.indexOf("?") != -1) {
            relUrl = relUrl.split("?")[0];
        }
        return relUrl;
    }
    /**
     * 渲染搜索
     * @param {*} config 
     */
    function renderSearchForm(config) {
        var html = laytpl(searchTpl).render(config)
        $(config.elem).html(html)
        form.render()
    }
    /**
     * 更新搜索
     * @param {*} config 
     */
    function reloadSearchForm(config) {
        var formJson = {};
        // 转换表单为json
        var formArray = dom.serializeArray();
        $.each(formArray, function () {
            if (formJson[this.name]) {
                if (!formJson[this.name].push) {
                    formJson[this.name] = [formJson[this.name]];
                }
                formJson[this.name].push(this.value || '');
            } else {
                formJson[this.name] = this.value || '';
            }
        });

        if (config.field) {
            $.each(config.field, function () {
                if (formJson.hasOwnProperty(this.field) && formJson[this.field]) {
                    if (!this.value) {
                        this['value'] = formJson[this.field]
                    }
                }
            });
        }
        renderSearchForm(config)
    }

    /**
     * 渲染表格
     * @param {*} config 
     */
    function renderTable(config) {
        tableInstance = table.render(config)
    }
    /**
     * 生成快捷菜单toolbar
     * @param {*} config 
     */
    function createToolbar(config) {
        var html = [];
        $.each(config, function (index) {
            if (this.type == "btn") {
                var url = this.url ? this.url : createUrl(index)
                // 添加id 和扩展参数
                url += this.param ? ("?" + this.param) : '';
                var btn = "<span " + (this.confirm ? "confirm='" + this.confirm + "'" : '') +
                    " onclick=add_tab('" + this.name + "','" + url + "') class='layui-btn layui-btn-sm " +
                    (this.method || ' view ') +
                    (this.refersh ? ' refersh ' : '') +
                    (this.class || ' layui-btn-normal') + "'>" + this.name + "</span>"
                html.push(btn)
            } else {
                html.push("<span class='layui-btn layui-btn-sm layui-btn-primary " + (this.class) + " '>" + this.name + " ：" + this.text + "</span>")
            }
        })
        return "<div >" + html.join("") + "</div>"
    }
    /**
     * 渲染快捷菜单
     * @param {*} config 
     */
    function renderToolbar(config) {
        debugger
        var html = createToolbar(config.field);
        $(config.elem).html(html);
    }
    /**
     * 更新表格
     * @param {*} config 
     */
    function reloadTable(config) {
        tableInstance.reload(config)
    }
    // 渲染多个上传组件
    ml.prototype.renderUploadList = function (elem) {
        var uploadConfig = {
            elem: elem,
            choose: function (obj) {
                console.log(obj)
                var item = this.item;
                var data = $(item).data()
                // 是否预览
                if (data.preview) {
                    var demoListView = $('#' + data.name + 'List')
                    var files; //将每次选择的文件追加到文件队列

                    if (this.multiple) {
                        files = this.files = obj.pushFile()
                    } else {
                        this.files = [];
                        files = this.files = obj.pushFile();
                        demoListView.html("")
                    }
                    if (this.accept !== 'images') {
                        //读取本地文件
                        obj.preview(function (index, file, result) {
                            var tr = $(['<tr id="upload-' + index + '">'
                                , '<td>' + file.name + '</td>'
                                , '<td>' + (file.size / 1024).toFixed(1) + 'kb</td>'
                                , '<td>等待上传</td>'
                                , '<td>'
                                , '<button type="button" class="layui-btn layui-btn-xs ml-upload-reload layui-hide">重传</button>'
                                , '<button type="button" class="layui-btn layui-btn-xs layui-btn-danger ml-upload-delete">删除</button>'
                                , '</td>'
                                , '</tr>'].join(''));

                            //单个重传
                            tr.find('.ml-upload-reload').on('click', function () {
                                tr.remove();
                                obj.upload(index, file);
                            });

                            //删除
                            tr.find('.ml-upload-delete').on('click', function () {
                                delete files[index]; //删除对应的文件
                                tr.remove();
                                $(item).next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                            });
                            demoListView.append(tr);
                        });
                    } else {
                        obj.preview(function (index, file, result) {
                            $('#demo1').attr('src', result); //图片链接（base64）
                            var tr = $([
                                '<tr id="upload-' + index + '">'
                                , '<td>' + '<img src=' + result + '> ' + file.name + '</td>'
                                , '<td>' + (file.size / 1024).toFixed(1) + 'kb</td>'
                                , '<td>等待上传</td>'
                                , '<td>'
                                , '<button type="button" class="layui-btn layui-btn-xs ml-upload-reload layui-hide">重传</button>'
                                , '<button type="button" class="layui-btn layui-btn-xs layui-btn-danger ml-upload-delete">删除</button>'
                                , '</td>'
                                , '</tr>'].join(''));
                            //单个重传
                            tr.find('.ml-upload-reload').on('click', function () {
                                tr.remove();
                                obj.upload(index, file);
                            });

                            //删除
                            tr.find('.ml-upload-delete').on('click', function () {
                                delete files[index]; //删除对应的文件
                                tr.remove();
                                $(item).next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                            });
                            demoListView.append(tr);
                        });
                    }
                }

            },
            url: "/console/upload/index?full_path=yes"
            , done: function (res, index, upload) {
                //获取当前触发上传的元素，一般用于 elem 绑定 class 的情况，注意：此乃 layui 2.1.0 新增
                var item = this.item;
                var data = $(item).data()
                var demoListView = $('#' + data.name + 'List')
                var domInput = $("input[name='" + data.name + "']");

                var value = domInput.val().split(',')
                if (res.code = 1) { //上传成功
                    // 是否预览
                    if (this.multiple) {
                        value[index] = res.data.file;
                    } else {
                        value = [res.data.file];
                    }

                    domInput.val(value.join(','));
                    $("input[name='" + data.name + "']").val()
                    if (data.preview) {
                        if (data.type == 'file') {
                            var tr = demoListView.find('tr#upload-' + index)
                                , tds = tr.children();
                            tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
                            tds.eq(3).html(''); //清空操作
                            return delete this.files[index]; //删除文件队列已经上传成功的文件
                        }
                    } else {
                        var tr = demoListView.find('tr#upload-' + index)
                            , tds = tr.children();
                        tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
                        tds.eq(3).html(''); //清空操作
                        return delete this.files[index]; //删除文件队列已经上传成功的文件
                    }
                }
                this.error(index, upload);
            }, error: function (index, upload) {
                var item = this.item;
                var data = $(item).data()
                var demoListView = $('#' + data.name + 'List')
                setTimeout(function () {
                    var tr = demoListView.find('tr#upload-' + index)
                        , tds = tr.children();
                    tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
                    tds.eq(3).find('.ml-upload-reload').removeClass('layui-hide'); //显示重传
                })

            }
        }
        $(elem).each(function () {
            uploadConfig.elem = this
            var layData = $(this).attr('lay-data');
            layData = new Function("return " + layData)();
            var newUploadConfig = $.extend(layData || {}, uploadConfig)
            upload.render(newUploadConfig)
        })

    }

    /**
     * 搜索栏监听
     */
    ml.prototype.searchListen = function () {
        var searchDom = $(this.config.search.elem)
        var that = this;
        form.on("submit(mlSearch)", function (obj) {
            typeof that.config.search.search == "function" && that.config.search.search(obj);
            reloadTable({
                where: obj.field
            })
            layui.event('search(submit)', obj)
            return false;
        })

        form.on('select(mlSearchSelect)', selectChange)
        searchDom.on("change", "input", inputChange)

        function inputChange() {
            var key = $(this).data('key');
            var field = that.config.search.field[key]
            var data = {
                type: "input",
                value: $(this).val(),
                name: field.name,
                field: field
            }
            that.config.search.field[key].value = data.value
            typeof that.config.search.change == "function" && that.config.search.change(data, that.config.search);
            layui.event('search(input)', data)
        }

        function selectChange(obj) {
            var key = $(obj.elem).data('key');
            var field = that.config.search.field[key]
            var data = {
                type: "select",
                value: obj.value,
                name: field.name,
                field: field
            }
            that.config.search.field[key].value = obj.value
            typeof that.config.search.change == "function" && that.config.search.change(data, that.config.search);
            layui.event('search(select)', data)

        }

        $(".date").each(function () {
            laydate.render({
                elem: this, done: dateChange,
                mark: {

                },
                isInitValue: false,
            })
        })
        $(".date-range").each(function () {
            laydate.render({
                elem: this,
                range: true,
                mark: {

                },
                isInitValue: false,
                done: dateChange
            })
        })

        function dateChange(value, date, endDate) {
            var elem = $(this)[0].elem;
            var key = $(elem).data('key');
            var field = that.config.search.field[key]
            var data = {
                type: "date",
                value: value,
                name: field.name,
                field: field
            }
            that.config.search.field[key].value = value
            typeof that.config.search.change == "function" && that.config.search.change(data, that.config.search);
            layui.event('search(date)', data)
        }
    }

    ml.prototype.tableListen = function () {
        // tableInstance.on("")
    }
    ml.prototype.toolbarListen = function () {
        // tableInstance.on("")
    }

    ml = new ml();
    exports("ml", ml)
});
