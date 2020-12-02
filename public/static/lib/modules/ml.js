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
        renderSearchForm(this.config.search)
        renderTable(this.config.table)
        this.searchListen();
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

    function createBtns(btns) {
        var html = [];
        $.each(btns, function () {
            var btn = "<span onclick=add_tab('" + this.name + "','" + this.url + "') class='layui-btn " + (this.class || 'layui-btn-normal') + " '></span>"
            html.push(btn)
        })
        return "<div class='layui-btn-group'>" + html.join("") + "</div>"
    }

    function initConfig(config) {
        var filed = []
        $.each(config.cols[0], function () {
            if (this.search) {
                filed.push(this)
            }
            if (this.field == "field") {
                this['templet'] = this['templet'] || createBtns(this.btns)
            }
        })
        var new_config = {
            table: $.extend({
                elem: "#mlTableData",
                page: true,
                url: GetUrlRelativePath()
            }, config), search: {
                elem: config.search_elem || "#mlTableDataSearch",
                field: filed
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


    function reloadTable(config) {
        tableInstance.reload(config)
    }

    ml.prototype.searchListen = function () {
        var searchDom = $(this.config.search.elem)
        var that = this;
        form.on("submit(mlSearch)", function (obj) {
            typeof that.search == "function" && that.search(obj);
            reloadTable({
                where: obj.field
            })
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
        }
    }

    ml.prototype.tableListen = function () {
        // tableInstance.on("")
    }

    ml = new ml();
    exports("ml", ml)
});
