#import "AppDelegate.h"
#import "RNBootSplash.h"
#import "LivekitReactNative.h"

#import <React/RCTLinkingManager.h>
#import <React/RCTBundleURLProvider.h>
#import <Firebase.h>
#import <RNShareMenu/ShareMenuManager.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  [LivekitReactNative setup];
  self.moduleName = @"chatter";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (UIView *)createRootViewWithBridge:(RCTBridge *)bridge
                          moduleName:(NSString *)moduleName
                           initProps:(NSDictionary *)initProps {
  UIView *rootView = [super createRootViewWithBridge:bridge
                                          moduleName:moduleName
                                           initProps:initProps];

  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:rootView];

  return rootView;
}
//- (BOOL)application:(UIApplication *)application
//   openURL:(NSURL *)url
//   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
//{
//  
//  // check url string
//  NSString *urlString = url.absoluteString;
//  
//  // if url contains ShareExtension prefix, handle with ShareMenuManager
//  if ([urlString hasPrefix:@"chattershare://"]) {
//    NSLog(@"Entered with the following string: %@s", urlString);
//    return [ShareMenuManager application:application openURL:url options:options];
//  }
//  
//  // else use React Native Linking
//  return [RCTLinkingManager application:application openURL:url options:options];
//}

- (BOOL)application:(UIApplication *)app
         openURL:(NSURL *)url
         options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
 {
   if ([self.authorizationFlowManagerDelegate resumeExternalUserAgentFlowWithURL:url]) {
     NSLog(@"returning yes to authorizationFlowManagerDelegate");
     return YES;
   }
   NSLog(@"returning ShareMenuManager");
  // return [RCTLinkingManager application:app openURL:url options:options];
   return [ShareMenuManager application:app openURL:url options:options];
 }

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{

     if ([userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb]) {
       if (self.authorizationFlowManagerDelegate) {
         BOOL resumableAuth = [self.authorizationFlowManagerDelegate resumeExternalUserAgentFlowWithURL:userActivity.webpageURL];
         if (resumableAuth) {
           return YES;
         }
       }
     }
     return [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
   }
//
//- (BOOL)application:(UIApplication *)application
//   openURL:(NSURL *)url
//   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
//{
//  return [RCTLinkingManager application:application openURL:url options:options];
//}

@end
