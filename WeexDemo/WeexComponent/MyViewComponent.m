//
//  MyViewComponent.m
//  WeexDemo
//
//  Created by 凌言 on 15/12/16.
//  Copyright © 2015年 taobao. All rights reserved.
//

#import "MyViewComponent.h"
#import "UIView+Toast.h"

@interface MyViewComponent()
@property (nonatomic, strong) UISwitch* mySwitch;
@property (nonatomic, strong) UIView*   myView;
@end

@implementation MyViewComponent

- (UIView *)view
{
    if (!_myView) {
        _myView = [[UIView alloc] init];
    }
    if (!_mySwitch) {
        _mySwitch = [[UISwitch alloc] init];
        _mySwitch.on = YES;
        [_mySwitch addTarget:self action:@selector(switchAction:) forControlEvents:UIControlEventValueChanged];
        [_myView addSubview:_mySwitch];
    }
    
    return _myView;
}

- (void)setFrame:(CGRect)frame
{
    [super setFrame:frame];
    _mySwitch.center = _myView.center;
}

- (void)addSubview:(UIView *)view
{
    [super addSubview:view];
}

- (void)insertSubview:(UIView *)view atIndex:(NSInteger)index
{
    [super insertSubview:view atIndex:index];
}

- (void)removeFromSuperView
{
    [super removeFromSuperView];
}

#pragma mark -
#pragma actions

- (void)switchAction:(id)sender
{
    if ([_mySwitch isOn]) {
    }
    else{
    }
}

@end
