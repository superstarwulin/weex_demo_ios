//
//  ViewController.m
//  WeexDemo
//
//  Created by huangjy on 15/12/14.
//  Copyright © 2015年 taobao. All rights reserved.
//

#import "ViewController.h"
#import <WeexSDK/WXSDKInstance.h>
#import <WeexSDK/WXSDKEngine.h>
#import <WeexSDK/WXUtility.h>
#import "WXImageModule.h"
#import "WXStreamModule.h"
#import "MyViewComponent.h"

@interface ViewController ()
@property (nonatomic, strong) WXSDKInstance *instance;
@property (nonatomic, strong) UIView *weexView;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"refresh" style:UIBarButtonItemStyleBordered target:self action:@selector(refreshData)];
    
    // Do any additional setup after loading the view.
    NSString *filePath = [[NSBundle mainBundle] pathForResource:@"weitao" ofType:@"js"];
    
    NSString *string = [NSString stringWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:nil];
    
    [WXSDKEngine registerModule:@"stream" withClass:[WXStreamModule class]];
    [WXSDKEngine registerModule:nil withClass:[WXImageModule class]];
    
    [WXSDKEngine registerComponent:@"MyView" withClass:[MyViewComponent class]];
    
    NSLog(@"start---%f", [[NSDate date] timeIntervalSince1970] *1000);
    _instance = [[WXSDKInstance alloc] init];
    _instance.frame = CGRectMake(0, 64, self.view.frame.size.width, self.view.frame.size.height - 64);
    [_instance renderView:string options:nil data:nil];
    __weak typeof(self) weakSelf = self;
    _instance.onCreate = ^(UIView *view){
        weakSelf.weexView = view;
        [weakSelf.view addSubview:weakSelf.weexView];
    };
    
    _instance.renderFinish = ^(UIView *view){
        NSLog(@"%@", weakSelf.weexView);
    };
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
 #pragma mark - Navigation
 
 // In a storyboard-based application, you will often want to do a little preparation before navigation
 - (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
 // Get the new view controller using [segue destinationViewController].
 // Pass the selected object to the new view controller.
 }
 */

- (void)refreshData
{
    NSString *filePath = [[NSBundle mainBundle] pathForResource:@"data" ofType:@"json"];
    NSString *string = [NSString stringWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:nil];
    
    NSDictionary *json = WXDecodeJson(string);
    
    [_instance reloadData:json];
}


@end
