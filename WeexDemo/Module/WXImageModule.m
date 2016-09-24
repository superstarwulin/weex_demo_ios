//
//  WXImageModule.m
//  TBWXAdapter
//
//  Created by jyi on 15/12/15.
//  Copyright © 2015年 rocky. All rights reserved.
//

#import "WXImageModule.h"

#import <SDWebImage/UIImageView+WebCache.h>

#define MIN_IMAGE_WIDTH 36
#define MIN_IMAGE_HEIGHT 36

#if OS_OBJECT_USE_OBJC
#undef  WXDispatchQueueRelease
#undef  WXDispatchQueueSetterSementics
#define WXDispatchQueueRelease(q)
#define WXDispatchQueueSetterSementics strong
#else
#undef  WXDispatchQueueRelease
#undef  WXDispatchQueueSetterSementics
#define WXDispatchQueueRelease(q) (dispatch_release(q))
#define WXDispatchQueueSetterSementics assign
#endif

@interface WXImageModule()

@property (WXDispatchQueueSetterSementics, nonatomic) dispatch_queue_t ioQueue;

@end

@implementation WXImageModule

WX_EXPORT_MODULE(WXImageModule)

#pragma mark -
#pragma mark WXImgLoaderProtocol
- (void)setImageURL:(NSString *)url onView:(UIView *)view userInfo:(NSDictionary *)userInfo
{
    if([view isKindOfClass:[UIImageView class]]){
        UIImageView* imageView = (UIImageView*) view;
        [imageView sd_setImageWithURL:[NSURL URLWithString:url]];
    }
}

@end
