register("taobao-item", {
    template: {
        type: "container",
        children: [ {
            type: "container",
            events: {
                click: "gotoDetail"
            },
            children: [ {
                type: "image",
                attr: {
                    src: function() {
                        return this.pictureUrl;
                    }
                },
                classList: [ "thumb" ]
            }, {
                type: "text",
                attr: {
                    value: function() {
                        return this.title;
                    }
                },
                classList: [ "title" ]
            } ]
        }, {
            type: "container",
            children: [ {
                type: "taobao-item",
                repeat: function() {
                    return this.subItemList;
                }
            } ],
            shown: function() {
                return this.subItemList;
            }
        } ],
        style: {
            flexDirection: "column"
        }
    },
    deps: [ "container", "image", "text", "taobao-item" ],
    style: {
        thumb: {
            width: 200,
            height: 210
        },
        title: {
            flex: 1,
            color: "#ff0000",
            fontSize: 48,
            fontWeight: "bold",
            backgroundColor: "#eeeeee"
        }
    },
    data: function() {
        return {
            itemId: "",
            title: "",
            pictureUrl: ""
        };
    },
    methods: {
        gotoDetail: function() {
            nativeLog('mainjs click:');
            // this.$openURL("https://item.taobao.com/item.htm?id=" + this.itemId);
        }
    }
});

register("3b20b0e3dcb4dcd16e33affdc52113d0", {
    template: {
        type: "div",
        children:[
        {
            type: "div",
            style:{
                width:'500',
                height:'200',
                backgroundColor:'#ff5000'
            }
        },
        {
            type: "div",
            children:[{
                type: "scroller",
                children: [ {
                    type: "container",
                    children: [ {
                        type: "taobao-item",
                        repeat: function() {
                            return this.itemList;
                        }
                    } ],
                    shown: function() {
                        return this.itemList;
                    },
                    style: {
                        flexDirection: "column"
                    }
                } ],
                style:{
                    flexDirection:'column',
                    flex:'1'
                }
            }],
            style:{
                width:'500',
                flex:'1',
                flexDirection:'column'
            }
        },
        {
            type: "div",
            style:{
                width:'500',
                height:'200',
                backgroundColor:'#ff5000'
            }
        }
        ],
    },
    deps: [ "container", "taobao-item" ],
    data: function() {
        return {
            deepCount: 1,
            listCount: 2,
            item: {
                itemId: "520421163634",
                title: "宝贝标题1",
                pictureUrl: "https://gd2.alicdn.com/bao/uploaded/i2/T14H1LFwBcXXXXXXXX_!!0-item_pic.jpg"
            }
        };
    },
    methods: {
        ready: function() {
            var that = this;
            this.itemList = [];
            while (this.itemList.length < this.listCount) {
                var item = Object.create(this.item);
                this.itemList.push(item);
                var deep = 0;
                while (deep++ < this.deepCount) {
                    var subItem = Object.create(this.item);
                    item.subItemList = [ subItem ];
                    item = subItem;
                }
            }
        }
    }
});

render("3b20b0e3dcb4dcd16e33affdc52113d0", {})
