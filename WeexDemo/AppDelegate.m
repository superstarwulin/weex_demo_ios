//
//  AppDelegate.m
//  WeexDemo
//
//  Created by huangjy on 15/12/14.
//  Copyright © 2015年 taobao. All rights reserved.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import <WeexSDK/WXSDKEngine.h>

@interface AppDelegate ()
@property (nonatomic, strong) UINavigationController *navigation;
@end

@implementation AppDelegate

- (void)initWeexSDKEnviroment
{
    NSString *filePath = [[NSBundle mainBundle] pathForResource:@"weex" ofType:@"js"];
    if(![[NSFileManager defaultManager] fileExistsAtPath:filePath]) {
        NSLog(@"Error!");
        return;
    }
    SEL selector = @selector(test:);
    
    NSMethodSignature *sig = [self methodSignatureForSelector:selector];
    
    int *p = malloc(sizeof(int));
    memset(p, 0, sizeof(int));
    *p = 2;
    
    NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:sig];
    [invocation setTarget:self];
    [invocation setSelector:selector];
    [invocation setArgument:p atIndex:2];
    [invocation retainArguments];
    [invocation invoke];
    
    free(p);
    
    // 初始化SDK
    NSString *script = [NSString stringWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:nil];
    [WXSDKEngine initSDKEnviroment:script];
}

- (void)test:(int)a
{
    NSLog(@"%d", a);
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    self.window.backgroundColor = [UIColor whiteColor];
    
    ViewController *vc = [[ViewController alloc] init];
    self.navigation = [[UINavigationController alloc] initWithRootViewController:vc];
    
    self.window.rootViewController = self.navigation;
    
    [self initWeexSDKEnviroment];
    
    [self.window makeKeyAndVisible];
    
    return YES;
}

- (void)applicationWillResignActive:(UIApplication *)application {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

@end
