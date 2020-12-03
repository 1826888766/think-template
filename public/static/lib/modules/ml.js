layui.define([
    'jquery',
    'form',
    'table',
    'laydate',
    'laytpl'
], function (exports) {
    'use strict';
    var tableInstance;
    const $ = layui.$;
    const table = layui.table;
    const laydate = layui.laydate;
    const form = layui.form;
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
        var toolbar = [];
        if ($.isArray(config.toolbar)) {
            toolbar = config.toolbar;
            delete config.toolbar;
        }
        var new_config = {
            table: $.extend({
                elem: "#mlTableData",
                page: true,
                cellMinWidth: 100,
                url: GetUrlRelativePath()
            }, config),
            toolbar: $.extend({field:[],elem:"#mlTableDataToolbar"},toolbar),
            search: {
                elem: config.search_elem || "#mlTableDataSearch",
                field: filed,
                search: config.search,
                change: config.change
            }
        };
        return new_config;
    }

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

    function renderSearchForm(config) {
        var html = laytpl(searchTpl).render(config)
        $(config.elem).html(html)
        form.render()
    }

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


    function renderTable(config) {
        tableInstance = table.render(config)
    }

    function createToolbar(config){
        var html = [];
        $.each(config,function(index){
            if(this.type == "btn"){
                var url = this.url ? this.url : createUrl(index)
            // 添加id 和扩展参数
            url += "?id={{d.id}}&is_iframe=1&" + (this.param || '')
            var btn = "<span " + (this.confirm ? "confirm='" + this.confirm + "'" : '') +
                " onclick=add_tab('" + this.name + "','" + url + "') class='layui-btn layui-btn-sm " +
                (this.ajax ? ' ajax ' : ' iframe ') +
                (this.refersh ? ' refersh ' : '') +
                (this.class || ' layui-btn-normal') + "'>" + this.name + "</span>"
                html.push(btn)
            }else{
                html.push("<label class='layui-form-label'>"+ this.name +"</label>")
            }
        })
    }

    function renderToolbar(config) {
        var html = createToolbar(config.field);
        $(config.elem).html(html);
    }

    function reloadTable(config) {
        tableInstance.reload(config)
    }

    ml.prototype.searchListen = function () {
        var searchDom = $(this.config.search.elem)
        var that = this;
        form.on("submit(mlSearch)", function (obj) {
            typeof that.config.search.search == "function" && that.config.search.search(obj);
            reloadTable({
                where: obj.field
            })
            layui.event('search(submit)',obj)
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
            layui.event('search(input)',data)
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
            layui.event('search(select)',data)
            
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
            layui.event('search(date)',data)
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
