register("discuss", {
         template: {
         type: "container",
         classList: [ "discuss" ],
         children: [ {
                    type: "image",
                    attr: {
                    src: "https://gw.alicdn.com/tps/TB1FmkEKVXXXXb_XpXXXXXXXXXX-22-22.png"
                    },
                    classList: [ "discuss-img" ]
                    }, {
                    type: "text",
                    attr: {
                    value: function() {
                    return this.dataSource;
                    }
                    },
                    classList: [ "discuss-txt" ]
                    } ]
         },
         deps: [ "container", "image", "text" ],
         style: {
         discuss: {
         width: 100,
         height: 38,
         position: "relative",
         flex: 1,
         borderRadius: 18,
         borderColor: "#c5cacd",
         borderWidth: 1,
         borderStyle: "solid"
         },
         "discuss-txt": {
         width: 60,
         height: 38,
         lineHeight: 38,
         fontSize: 18,
         color: "#60656f",
         textAlign: "center",
         position: "absolute",
         right: 6
         },
         "discuss-img": {
         width: 22,
         height: 22,
         position: "absolute",
         left: 15,
         top: 9
         }
         },
         data: function() {
         return {
         dataSource: 0
         };
         },
         methods: {
         ready: function() {
         var vm = this;
         }
         }
         });

register("praise", {
         template: {
         type: "container",
         children: [ {
                    type: "container",
                    classList: [ "praise" ],
                    events: {
                    click: "trigger"
                    },
                    children: [ {
                               type: "image",
                               attr: {
                               src: function() {
                               return this.currentSrc;
                               }
                               },
                               classList: [ "praise-img" ]
                               }, {
                               type: "text",
                               attr: {
                               value: function() {
                               return this.dataSource;
                               }
                               },
                               classList: [ "praise-txt" ]
                               } ],
                    style: {
                    backgroundColor: function() {
                    return this.backgroundColor;
                    },
                    borderWidth: function() {
                    return this.borderWidth;
                    },
                    color: function() {
                    return this.color;
                    }
                    }
                    } ]
         },
         deps: [ "container", "image", "text" ],
         style: {
         praise: {
         marginRight: 20,
         width: 100,
         height: 38,
         position: "relative",
         flex: 1,
         borderRadius: 18,
         borderColor: "#c5cacd",
         borderStyle: "solid"
         },
         haspraise: {
         backgroundColor: "#ff5500",
         borderWidth: 0
         },
         "praise-txt": {
         width: 60,
         height: 38,
         lineHeight: 38,
         fontSize: 18,
         textAlign: "center",
         position: "absolute",
         right: 6
         },
         "haspraise-txt": {
         color: "#ffffff"
         },
         "praise-img": {
         width: 25,
         height: 24,
         position: "absolute",
         left: 18,
         top: 5
         },
         "haspraise-img": {
         width: 24,
         height: 24
         }
         },
         data: function() {
         return {
         dataSource: 0,
         hasPraise: false,
         color: "",
         backgroundColor: "#ffffff",
         borderWidth: "1",
         currentState: "cancel",
         currentSrc: "",
         cancelSrc: "https://gw.alicdn.com/tps/TB1UhsvKVXXXXcTXFXXXXXXXXXX-25-24.png",
         addSrc: "https://gw.alicdn.com/tps/TB1D6AnKVXXXXcpXVXXXXXXXXXX-24-24.png"
         };
         },
         methods: {
         ready: function() {
         var vm = this;
         vm.currentSrc = vm.cancelSrc;
         },
         trigger: function() {
         var vm = this;
         if (vm.currentState === "add") {
         vm.goCancelPraise();
         }
         if (vm.currentState === "cancel") {
         vm.goAddPraise();
         }
         },
         goAddPraise: function() {
         var vm = this;
         vm.dataSource++;
         vm.backgroundColor = "#ff5500";
         vm.borderWidth = "0px";
         vm.currentSrc = vm.addSrc;
         vm.currentState = "cancel";
         },
         goCancelPraise: function() {
         var vm = this;
         vm.dataSource--;
         vm.backgroundColor = "#ffffff";
         vm.borderWidth = "1px";
         vm.currentSrc = vm.cancelSrc;
         vm.currentState = "add";
         }
         }
         });

register("foot", {
         template: {
         type: "container",
         classList: [ "main-foot" ],
         children: [ {
                    type: "container",
                    classList: [ "main-foot-inner" ],
                    children: [ {
                               type: "praise",
                               attr: {
                               dataSource: function() {
                               return this.dataSource.praise;
                               }
                               }
                               }, {
                               type: "discuss",
                               attr: {
                               dataSource: function() {
                               return this.dataSource.discuss;
                               }
                               }
                               } ]
                    } ]
         },
         deps: [ "container", "praise", "discuss" ],
         style: {
         "main-foot": {
         width: 620,
         height: 40,
         position: "relative",
         marginTop: 18
         },
         "main-foot-inner": {
         position: "absolute",
         right: 0
         }
         },
         data: function() {
         return {
         dataSource: {}
         };
         }
         });

register("date", {
         template: {
         type: "container",
         classList: [ "main-date" ],
         children: [ {
                    type: "text",
                    attr: {
                    value: "达人"
                    },
                    classList: [ "main-date-brand" ]
                    }, {
                    type: "text",
                    attr: {
                    value: "昨天 12：57"
                    },
                    classList: [ "main-date-txt" ]
                    } ]
         },
         deps: [ "container", "text" ],
         style: {
         "main-date": {
         marginTop: 8,
         fontSize: 20,
         width: 200
         },
         "main-date-txt": {
         color: "#999999",
         flex: 1,
         fontSize: 20,
         marginTop: 2
         },
         "main-date-brand": {
         width: 50,
         textAlign: "center",
         borderRadius: 3,
         paddingTop: 3,
         paddingBottom: 3,
         fontSize: 18,
         backgroundColor: "#ffd200",
         color: "#ffffff",
         marginRight: 8
         }
         },
         data: function() {
         return {
         dataSource: {
         timestamp: ""
         }
         };
         }
         });

register("avatar", {
         template: {
         type: "container",
         classList: [ "avatar" ],
         children: [ {
                    type: "image",
                    attr: {
                    src: function() {
                    return this.dataSource.logoUrl + "_64x64.jpg";
                    }
                    },
                    classList: [ "avatar-image" ]
                    } ]
         },
         deps: [ "container", "image" ],
         style: {
         avatar: {
         flex: 1,
         marginRight: 18,
         width: 64
         },
         "avatar-image": {
         width: 64,
         height: 64
         }
         },
         data: function() {
         return {
         dataSource: {
         logoUrl: "",
         accountNick: ""
         }
         };
         }
         });

register("card-isv", {
         template: {
         type: "scroller",
         children: [ {
                    type: "container",
                    classList: [ "card" ],
                    children: [ {
                               type: "avatar",
                               attr: {
                               dataSource: function() {
                               return this.account;
                               }
                               }
                               }, {
                               type: "container",
                               classList: [ "main" ],
                               children: [ {
                                          type: "text",
                                          attr: {
                                          value: function() {
                                          return this.account.accountNick;
                                          }
                                          },
                                          classList: [ "main-title" ]
                                          }, {
                                          type: "date",
                                          attr: {
                                          dataSource: function() {
                                          return this.data;
                                          }
                                          }
                                          }, {
                                          type: "text",
                                          attr: {
                                          value: "#投票有礼#"
                                          },
                                          classList: [ "main-label" ]
                                          }, {
                                          type: "container",
                                          classList: [ "main-isv" ],
                                          children: [ {
                                                     type: "image",
                                                     attr: {
                                                     src: "https://gw.alicdn.com/tps/TB1ZgsNKVXXXXbhXXXXXXXXXXXX-96-96.png"
                                                     },
                                                     classList: [ "main-isv-img" ]
                                                     }, {
                                                     type: "text",
                                                     attr: {
                                                     value: function() {
                                                     return this.feed.title;
                                                     }
                                                     },
                                                     classList: [ "main-isv-txt" ]
                                                     } ]
                                          }, {
                                          type: "foot",
                                          attr: {
                                          dataSource: function() {
                                          return this.foot;
                                          }
                                          }
                                          } ]
                               } ]
                    } ]
         },
         deps: [ "scroller", "container", "avatar", "text", "date", "image", "foot" ],
         style: {
         card: {
         fontSize: 28,
         padding: 24,
         backgroundColor: "#ffffff",
         position: "relative"
         },
         main: {
         flexDirection: "column",
         position: "relative",
         width: 620
         },
         "main-summary": {
         width: 620,
         marginTop: 20,
         fontSize: 32,
         color: "#565656",
         marginBottom: 24
         },
         "main-title": {
         fontSize: 32,
         color: "#374953",
         flexDirection: "column"
         },
         "main-isv": {
         width: 620,
         marginTop: 24,
         backgroundColor: "#f5f5f5",
         marginBottom: 6
         },
         "main-isv-img": {
         width: 96,
         height: 96,
         marginRight: 24
         },
         "main-isv-txt": {
         height: 96,
         color: "#051b28",
         fontSize: 28,
         flex: 1,
         lineHeight: 96
         },
         "main-label": {
         position: "absolute",
         right: 0,
         top: 10,
         color: "#f31534",
         fontSize: 26,
         width: 150,
         textAlign: "right"
         }
         },
         data: function() {
         return {
         id: "5404980246",
         timestamp: "1450231770792",
         foot: {
         praise: 10,
         discuss: 10
         },
         account: {
         id: "1621166048",
         logoUrl: "http://gtms02.alicdn.com/tps/i2/TB1fjZRHpXXXXX8XFXXrywt4VXX-120-120.png",
         accountNick: "微淘发现",
         nick: "微淘小助手",
         accountType: "-1",
         jumpType: "0",
         iconList: [],
         isSeller: "false"
         },
         feed: {
         id: "5404980246",
         title: "早市|婴幼儿大牌尖货全场满就减！",
         creatorId: "1621166048",
         coverTile: {
         type: "pic",
         path: "http://gw1.alicdn.com/tfscom/tuitui/https://img.alicdn.com/imgextra/i1/1/TB2IpTRipXXXXcAXXXXXXXXXXXX_!!1-0-dgshop.jpg",
         picWidth: "630",
         picHeight: "210"
         },
         tiles: [],
         timestamp: "1450231770792",
         detailUrl: "http://h5.m.taobao.com/we/weDetail.htm?feed_id=5404980246&shop_id=null&feed_type=406&sign=6f11d05f2de269ffc761780f07d9f895&target_url=aHR0cHM6Ly93d3cudG1hbGwuY29tL3dvdy9hY3QvMTUzMjQvYmFvbnVhbmpp",
         feedType: "406",
         feedCount: {
         commentCount: "25",
         feedFavourCount: "452",
         feedFavoriteCount: "0",
         readCount: "29768"
         },
         feedTypeIcon: "http://gtms03.alicdn.com/tps/i3/TB1OIXbHFXXXXapXpXXGNNhIXXX-64-30.png",
         feedTypeIconHeight: "30",
         feedTypeIconWidth: "64",
         itemCount: "0",
         cardType: "5",
         newCardType: "2",
         needCorner: "false",
         needPrice: "false",
         needDropDown: "false",
         newTiles: [ {
                    type: "pic",
                    path: "http://gw1.alicdn.com/tfscom/tuitui/https://img.alicdn.com/imgextra/i1/1/TB2IpTRipXXXXcAXXXXXXXXXXXX_!!1-0-dgshop.jpg",
                    picWidth: "630",
                    picHeight: "210"
                    } ]
         }
         };
         },
         methods: {
         ready: function() {
         var vm = this;
         }
         }
         });

render("card-isv");