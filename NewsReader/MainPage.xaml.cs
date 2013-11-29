/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License. 
*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;
using Microsoft.Phone.Controls;
using System.IO;
using System.Windows.Media.Imaging;
using System.Windows.Resources;

using System.Diagnostics;
using GoogleAds;
using FlurryWP8SDK;
using HockeyApp;

namespace NewsReader
{
    public partial class MainPage : PhoneApplicationPage
    {
        // Constructor
        public MainPage()
        {
            HockeyApp.CrashHandler.Instance.HandleCrashes();
            FlurryWP8SDK.Api.StartSession("QF7MR5C9Q6QRT53WNR25");


            InitializeComponent();

            var resolution = string.Format("{0}x{1} (Scale factor: {2}%)",
                                Application.Current.Host.Content.ActualWidth,
                                Application.Current.Host.Content.ActualHeight,
                                Application.Current.Host.Content.ScaleFactor);

            Debug.WriteLine("InitializeComponent " + resolution);

            var resolution2 = string.Format("{0}x{1} ",
                                CordovaView.Browser.ActualWidth,
                                CordovaView.Browser.ActualHeight);

            Debug.WriteLine("CordovaView Browser " + resolution2);

            if (App.Current.Host.Content.ScaleFactor == 100)
            {
                // WVGA        
                Debug.WriteLine("WVGA");
            }
            else if (App.Current.Host.Content.ScaleFactor == 160)
            {
                // WXGA   
                Debug.WriteLine("WXGA");
            }
            else if (App.Current.Host.Content.ScaleFactor == 150)
            {
                // 720p
                Debug.WriteLine("720p");
            }

            this.CordovaView.Loaded += CordovaView_Loaded;
            this.CordovaView.Browser.IsScriptEnabled = true;

        }

        private void OnAdReceived(object sender, AdEventArgs e)
        {
            Debug.WriteLine("Received ad successfully");
        }

        private void OnFailedToReceiveAd(object sender, AdErrorEventArgs errorCode)
        {
            Debug.WriteLine("Failed to receive ad with error " + errorCode.ErrorCode);
        }

        private void CordovaView_Loaded(object sender, RoutedEventArgs e)
        {

        }
    }
}
