//
//  WXStreamModule.m
//  TBWeAppPlusAdapter
//
//  Created by jyi on 15/12/14.
//  Copyright © 2015年 rocky. All rights reserved.
//

#import "WXStreamModule.h"

#import <WeexSDK/WXSDKManager.h>
#import <WeexSDK/WXUtility.h>

@implementation WXStreamModule
{
}

- (instancetype) init{
    self = [super init];
    if (self) {
    }
    return self;
}

WX_EXPORT_MODULE(WXStreamModule)

WX_EXPORT_METHOD(@selector(sendMtop:callback:))
WX_EXPORT_METHOD(@selector(sendHttp:callback:))

- (void)sendMtop:(NSDictionary*)param callback:(NSString*)callback
{
    
}

- (void)sendHttp:(NSDictionary*)param callback:(NSString*)callback
{
    NSString* method = [param objectForKey:@"method"];
    NSString* urlStr = [param objectForKey:@"url"];
    NSDictionary* header = [param objectForKey:@"header"];
    NSString* body = [param objectForKey:@"body"];
    
    NSURL *url = [NSURL URLWithString:urlStr];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:method];
    [request setTimeoutInterval:60.0];
    for (NSString *key in header) {
        NSString *value = [header objectForKey:key];
        [request setValue:value forHTTPHeaderField:key];
    }
    [request setHTTPBody:[body dataUsingEncoding:NSUTF8StringEncoding]];
    
    [NSURLConnection sendAsynchronousRequest:request
                                       queue:[NSOperationQueue currentQueue]
                           completionHandler:^(NSURLResponse *response, NSData *data, NSError *error){
                               NSString *responseData = nil;
                               if (!error) {
                                   responseData = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
                               }
                               //else ok
                               
                               NSString* instanceId = WXGetInstance(self);
                               [[WXSDKManager bridgeMgr] callBack:instanceId funcId:callback params:responseData];
                           }];
}

@end
