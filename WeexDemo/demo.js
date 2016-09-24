register("weapp-plus-demo", {
    template: {
        type: "scroller",
        children: [ {
            type: "div",
            classList: [ "row" ],
            children: [ {
                type: "div",
                classList: [ "cell" ],
                children: [ {
                    type: "image",
                    attr: {
                        src: function() {
                            return this.shopImgM1;
                        }
                    },
                    classList: [ "thumb" ]
                }, {
                    type: "text",
                    attr: {
                        value: function() {
                            return this.shopName1;
                        }
                    },
                    classList: [ "title" ]
                } ]
            }, {
                type: "div",
                classList: [ "cell" ],
                children: [ {
                    type: "image",
                    attr: {
                        src: function() {
                            return this.shopImgM2;
                        }
                    },
                    classList: [ "thumb" ]
                }, {
                    type: "text",
                    attr: {
                        value: function() {
                            return this.shopName2;
                        }
                    },
                    classList: [ "title" ]
                } ]
            } ],
            repeat: function() {
                return this.list;
            }
        } ],
        style: {
            flexDirection: "column"
        }
    },
    deps: [ "div", "image", "text" ],
    style: {
        row: {
            display: "flex",
            width: 750
        },
        cell: {
            width: 375,
            height: 500,
            backgroundColor: "#eeeeee",
            flexDirection: "column"
        },
        thumb: {
            width: 375,
            height: 440
        },
        title: {
            fontSize: 36,
            fontWeight: "bold",
            textAlign: "left"
        }
    },
    data: function() {
        return {
            list: [ {
                shopName2: "韩都衣舍旗舰店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/i1/TB1nXtOKXXXXXXpaXXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/i1/TB1zEXkKpXXXXacXVXXSutbFXXX.jpg",
                shopName1: "优衣库官方旗舰店",
                shopUrl2: "http://handuyishe.tmall.com/campaign-3731-8.htm?acm=lb-zebra-25854-380608.1003.4.506054&scm=1003.4.lb-zebra-25854-380608.SHOP_263817957_506054"
            }, {
                shopName2: "乐町官方旗舰店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/i1/TB1vCQ7KXXXXXXTaXXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/i1/TB1xo4oKpXXXXb3XpXXSutbFXXX.jpg",
                shopName1: "拉夏贝尔官方旗舰",
                shopUrl2: "http://leting.tmall.com/campaign-3731-9.htm?acm=lb-zebra-25854-380608.1003.4.506054&scm=1003.4.lb-zebra-25854-380608.SHOP_513051429_506054"
            }, {
                shopName2: "ochirly官方旗舰店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/i1/TB1LKpjKpXXXXa0XFXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/i1/TB1Z0NrKpXXXXa1XpXXSutbFXXX.jpg",
                shopName1: "veromoda官方旗舰店",
                shopUrl2: "http://ochirly.tmall.com/campaign-3731-17.htm?acm=lb-zebra-25854-380608.1003.4.506054&scm=1003.4.lb-zebra-25854-380608.SHOP_272205633_506054"
            }, {
                shopName2: "artka官方旗舰店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/i1/TB1FlhvKpXXXXclXXXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/i1/TB1lAlCKpXXXXbKXpXXSutbFXXX.jpg",
                shopName1: "ONLY官方旗舰店",
                shopUrl2: "http://artka.tmall.com/campaign-3731-8.htm?acm=lb-zebra-25854-380608.1003.4.506054&scm=1003.4.lb-zebra-25854-380608.SHOP_444076877_506054"
            }, {
                shopName2: "优衣库官方旗舰店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/i1/TB1dkhJKpXXXXb3XXXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/i1/TB1tDXNKXXXXXaWXFXXSutbFXXX.jpg",
                shopName1: "JackJones官方旗舰店",
                shopUrl2: "http://uniqlo.m.tmall.com/h5/campaign-3731-22.htm?acm=lb-zebra-25854-380611.1003.4.499493&scm=1003.4.lb-zebra-25854-380611.SHOP_196993935_499493"
            }, {
                shopName2: "森马官方旗舰店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/i1/TB1B8FZKXXXXXaGXVXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/i1/TB1GlWzKXXXXXaRXpXXSutbFXXX.jpg",
                shopName1: "太平鸟男装旗舰店",
                shopUrl2: "http://semir.m.tmall.com/h5/campaign-3731-14.htm?acm=lb-zebra-25854-380611.1003.4.499493&scm=1003.4.lb-zebra-25854-380611.SHOP_397341302_499493"
            }, {
                shopName2: "海澜之家官方旗舰店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/i1/TB1opk2KXXXXXaZXVXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/i1/TB1ntn5KXXXXXXSXpXXSutbFXXX.jpg",
                shopName1: "GXG官方旗舰店",
                shopUrl2: "http://heilanhome.m.tmall.com/h5/campaign-3731-3.htm?acm=lb-zebra-25854-380611.1003.4.499493&scm=1003.4.lb-zebra-25854-380611.SHOP_693060164_499493"
            }, {
                shopName2: "优衣库官方旗舰店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/i1/TB1dkhJKpXXXXb3XXXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/i1/TB1tDXNKXXXXXaWXFXXSutbFXXX.jpg",
                shopName1: "JackJones官方旗舰店",
                shopUrl2: "http://uniqlo.m.tmall.com/h5/campaign-3731-22.htm?acm=lb-zebra-25854-380611.1003.4.499493&scm=1003.4.lb-zebra-25854-380611.SHOP_196993935_499493"
            }, {
                shopName2: "森马官方旗舰店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/i1/TB1B8FZKXXXXXaGXVXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/i1/TB1GlWzKXXXXXaRXpXXSutbFXXX.jpg",
                shopName1: "太平鸟男装旗舰店",
                shopUrl2: "http://semir.m.tmall.com/h5/campaign-3731-14.htm?acm=lb-zebra-25854-380611.1003.4.499493&scm=1003.4.lb-zebra-25854-380611.SHOP_397341302_499493"
            }, {
                shopName2: "海澜之家官方旗舰店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/i1/TB1opk2KXXXXXaZXVXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/i1/TB1ntn5KXXXXXXSXpXXSutbFXXX.jpg",
                shopName1: "GXG官方旗舰店",
                shopUrl2: "http://heilanhome.m.tmall.com/h5/campaign-3731-3.htm?acm=lb-zebra-25854-380611.1003.4.499493&scm=1003.4.lb-zebra-25854-380611.SHOP_693060164_499493"
            }, {
                shopName2: "vans官方旗舰店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/i1/TB194ZiKXXXXXbRXVXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/i1/TB1PSxZKXXXXXbyXVXXSutbFXXX.jpg",
                shopName1: "anta官方旗舰店",
                shopUrl2: "http://vans.tmall.com/campaign-3731-10.htm?acm=lb-zebra-25854-380613.1003.4.498148&scm=1003.4.lb-zebra-25854-380613.SHOP_746866993_498148"
            }, {
                shopName2: "thenorthface官方旗舰",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/i1/TB1MnqwKXXXXXbyXpXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/i1/TB1VgB3KXXXXXaQXFXXSutbFXXX.jpg",
                shopName1: "pelliot户外旗舰店",
                shopUrl2: "http://thenorthface.tmall.com/campaign-3731-11.htm?acm=lb-zebra-25854-380613.1003.4.498148&scm=1003.4.lb-zebra-25854-380613.SHOP_928417138_498148"
            }, {
                shopName2: "公猴旗舰店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/i1/TB1wH9FKXXXXXahXXXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/i1/TB10.1XKXXXXXaMXXXXSutbFXXX.jpg",
                shopName1: "贝蒂佩琪旗舰店",
                shopUrl2: "http://gonghou.tmall.com/campaign-3731-3.htm?acm=lb-zebra-25854-380613.1003.4.484905&scm=1003.4.lb-zebra-25854-380613.SHOP_757742771_484905"
            }, {
                shopName2: "jbenato宾度旗舰店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/i1/TB1T31eKXXXXXbvXFXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/i1/TB10sFBKpXXXXbZXpXXSutbFXXX.jpg",
                shopName1: "公牛世家官方旗舰店",
                shopUrl2: "http://jbenato.tmall.com/campaign-3731-5.htm?acm=lb-zebra-25854-380613.1003.4.484901&scm=1003.4.lb-zebra-25854-380613.SHOP_1668434515_484901"
            }, {
                shopName2: "洽洽食品官方旗舰店",
                shopImgM1: "http://img.alicdn.com/imgextra/i2/1642656465/TB299iKgVXXXXazXXXXXXXXXXXX-1642656465.jpg",
                shopImgM2: "http://img.alicdn.com/imgextra/i4/742982950/TB2FNSlgVXXXXasXXXXXXXXXXXX_!!742982950.jpg",
                shopName1: "anchor安佳官方旗舰店",
                shopUrl2: "http://qiaqia.m.tmall.com/h5/campaign-3731-2.htm?acm=lb-zebra-25854-380612.1003.4.500138&scm=1003.4.lb-zebra-25854-380612.SHOP_742982950_500138"
            }, {
                shopName2: "狮王官方旗舰店",
                shopImgM1: "http://img.alicdn.com/imgextra/i2/2652162797/TB2E0SjgVXXXXbLXpXXXXXXXXXX_!!2652162797.jpg",
                shopImgM2: "http://img.alicdn.com/imgextra/i4/605623409/TB2UkEPgpXXXXaQXXXXXXXXXXXX_!!605623409.jpg",
                shopName1: "董酒官方旗舰店",
                shopUrl2: "http://lion.tmall.com/campaign-3731-2.htm?acm=lb-zebra-25854-380612.1003.4.499688&scm=1003.4.lb-zebra-25854-380612.SHOP_605623409_499688"
            }, {
                shopName2: "沙宣官方旗舰店",
                shopImgM1: "http://img.alicdn.com/imgextra/i4/808734231/TB2p5ICgpXXXXcMXXXXXXXXXXXX_!!808734231.jpg",
                shopImgM2: "http://img.alicdn.com/imgextra/i3/1943402959/TB2ooxMgVXXXXXFXXXXXXXXXXXX-1943402959.jpg",
                shopName1: "丝蓓绮官方旗舰店",
                shopUrl2: "http://vs.tmall.com/campaign-3731-1.htm?acm=lb-zebra-25854-380612.1003.4.499688&scm=1003.4.lb-zebra-25854-380612.SHOP_1943402959_499688"
            }, {
                shopName2: "mothercare官方旗舰店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/TB1qTyRKXXXXXXcXpXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/TB11hC.KXXXXXcLXXXXSutbFXXX.jpg",
                shopName1: "笑巴喜旗舰店",
                shopUrl2: "http://mothercare.tmall.com/campaign-3731-17.htm?acm=lb-zebra-25854-380616.1003.4.512574&scm=1003.4.lb-zebra-25854-380616.SHOP_1611992394_512574"
            }, {
                shopName2: "newbalance童鞋旗舰店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/TB1LEurKXXXXXaIXVXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/TB1XeCLKXXXXXajXpXXSutbFXXX.jpg",
                shopName1: "巴布豆中赛专卖店",
                shopUrl2: "http://newbalancekids.tmall.com/campaign-3731-7.htm?acm=lb-zebra-25854-380616.1003.4.512574&scm=1003.4.lb-zebra-25854-380616.SHOP_1119887712_512574"
            }, {
                shopName2: "芬腾官方旗舰店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/i1/TB1VbaxKXXXXXcWXXXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/i1/TB129ysKXXXXXcoXXXXSutbFXXX.jpg",
                shopName1: "gainreel歌瑞尔内衣旗舰店",
                shopUrl2: "http://fenteng.tmall.com?acm=lb-zebra-25854-380614.1003.4.501042&scm=1003.4.lb-zebra-25854-380614.SHOP_665542280_501042"
            }, {
                shopName2: "新秀丽官方旗舰店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/i1/TB1iqE.KXXXXXa4XpXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/i1/TB1GglBKpXXXXX3XFXXSutbFXXX.jpg",
                shopName1: "gillivo官方旗舰店",
                shopUrl2: "http://samsonite.tmall.com/campaign-3731-4.htm?acm=lb-zebra-25854-380614.1003.4.487028&scm=1003.4.lb-zebra-25854-380614.SHOP_2421830954_487028"
            }, {
                shopName2: "小米官方旗舰店",
                shopImgM1: "http://img.alicdn.com/imgextra/i3/1695308781/TB20M5sgpXXXXbWXpXXXXXXXXXX_!!1695308781.jpg",
                shopImgM2: "http://img.alicdn.com/imgextra/i3/1714128138/TB2udetgpXXXXcjXpXXXXXXXXXX-1714128138.jpg",
                shopName1: "魅族官方旗舰店",
                shopUrl2: "http://xiaomi.m.tmall.com/h5/campaign-3731-0.htm?acm=lb-zebra-25854-380620.1003.4.520924&scm=1003.4.lb-zebra-25854-380620.SHOP_1714128138_520924"
            }, {
                shopName2: "大疆",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/TB1yHVHKXXXXXbDXpXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/TB1UTnHKXXXXXXnaXXXSutbFXXX.jpg",
                shopName1: "微软",
                shopUrl2: "http://dji.tmall.com/campaign-3731-1.htm?acm=lb-zebra-25854-380620.1003.4.483552&spm=0.0.0.0.Tc4IgN&scm=1003.4.lb-zebra-25854-380620.SHOP_1773095659_483552"
            }, {
                shopName2: "",
                shopImgM1: "http://img.alicdn.com/imgextra/i1/279887075/TB2doqSgXXXXXbAXpXXXXXXXXXX_!!279887075.jpg",
                shopImgM2: "http://img.alicdn.com/imgextra/i3/678669052/TB2HH2ggXXXXXXGXXXXXXXXXXXX_!!678669052.jpg",
                shopName1: "罗莱家纺官方旗舰店",
                shopUrl2: "http://nwkcwyp.m.tmall.com/h5/campaign-3731-3.htm?acm=lb-zebra-25854-380618.1003.4.483596&scm=1003.4.lb-zebra-25854-380618.SHOP_678669052_483596"
            }, {
                shopName2: "都市大药房旗舰店",
                shopImgM1: "http://img.alicdn.com/imgextra/i4/859515618/TB2g5dVgpXXXXbJXpXXXXXXXXXX_!!859515618.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/i1/TB17AU_KXXXXXbtXVXXSutbFXXX.jpg",
                shopName1: "博库图书专营店",
                shopUrl2: "http://dsdyf.m.tmall.com/h5/campaign-3731-2.htm?acm=lb-zebra-25854-380618.1003.4.483931&scm=1003.4.lb-zebra-25854-380618.SHOP_2002400747_483931"
            }, {
                shopName2: "attent海外旗舰店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/TB1OyRWKXXXXXafXXXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/TB1bQXPKXXXXXbfXXXXSutbFXXX.jpg",
                shopName1: "普丽普莱海外旗舰店",
                shopUrl2: "http://attent.tmall.hk/campaign-3731-0.htm?acm=lb-zebra-25854-380621.1003.4.506270&scm=1003.4.lb-zebra-25854-380621.SHOP_2635883896_506270"
            }, {
                shopName2: "万达旅游旗舰店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/TB1p.cwKXXXXXXjXVXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/imgextra/i1/2613440682/TB2xr1.gpXXXXbxXXXXXXXXXXXX_!!2613440682.jpg",
                shopName1: "sainsburys官方海外旗舰店",
                shopUrl2: "http://tb.cn/LK6rgux?acm=lb-zebra-25854-380621.1003.4.513403&scm=1003.4.lb-zebra-25854-380621.SHOP_2613440682_513403"
            }, {
                shopName2: "西门子百诚专卖店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/TB1uu0_KXXXXXXhXVXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/TB1l41bKXXXXXawXVXXSutbFXXX.jpg",
                shopName1: "kktv官方旗舰店",
                shopUrl2: "http://www.tmall.com/wow/act/14700/ximenzi?acm=lb-zebra-25854-380623.1003.4.496557&scm=1003.4.lb-zebra-25854-380623.SHOP_872411436_496557"
            }, {
                shopName2: "海迅电器专营店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/TB1HK29KXXXXXbMXXXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/TB1EVqxKXXXXXagXXXXSutbFXXX.jpg",
                shopName1: "海尔生活家电旗舰店",
                shopUrl2: "http://www.tmall.com/wow/act/14700/auxxjd?acm=lb-zebra-25854-380623.1003.4.497230&scm=1003.4.lb-zebra-25854-380623.SHOP_828157221_497230"
            }, {
                shopName2: "九牧官方旗舰店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/i1/TB1VD4XKpXXXXXtXFXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/i1/TB1VqVfKpXXXXbJXFXXSutbFXXX.jpg",
                shopName1: "喜临门爱倍旗舰店",
                shopUrl2: "http://jomoo.m.tmall.com/h5/campaign-3731-4.htm?acm=lb-zebra-25854-380624.1003.4.484694&scm=1003.4.lb-zebra-25854-380624.SHOP_667286523_484694"
            }, {
                shopName2: "特维轮汽车用品旗舰店",
                shopImgM1: "http://img.alicdn.com/bao/uploaded/i1/TB1kBBpKpXXXXbjXXXXSutbFXXX.jpg",
                shopImgM2: "http://img.alicdn.com/bao/uploaded/i1/TB19eAVKXXXXXXJXVXXSutbFXXX.jpg",
                shopName1: "tata木门官方旗舰店",
                shopUrl2: "http://teweilun.m.tmall.com/h5/campaign-3731-2.htm?acm=lb-zebra-25854-380624.1003.4.486254&scm=1003.4.lb-zebra-25854-380624.SHOP_1984719051_486254"
            } ]
        };
    }
});

render("weapp-plus-demo");

