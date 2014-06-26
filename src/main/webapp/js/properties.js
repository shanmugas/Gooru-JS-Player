/* Created by Gooru on 2014
 * Copyright (c) 2014 Gooru. All rights reserved.
 * http://www.goorulearning.org/
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var GOORU_REST_ENDPOINT = ('https:' == document.location.protocol ? 'https://' : 'http://') + '${gooru.player.rest.point}';
var DOC_HOME = ('https:' == document.location.protocol ? 'https://' : 'http://') + '${gooru.player.doc.home}';
var DOC_CACHE = '${gooru.player.doc.cache}';
var HOME_URL = '${gooru.player.home}'
var USER = {
  sessionToken: '2397d31f-20a6-4e3b-a993-ab7ee1d7b0c1',
  gooruUid : ""
};
var GOORU_PROFILE_S3_URL = ('https:' == document.location.protocol ? 'https://' : 'http://') + '${gooru.player.gooru.profile.s3.url}';
var STATIC_FILE_PATH = ('https:' == document.location.protocol ? 'https://' : 'http://') + '${gooru.player.static.file}';
var BUILD_TIME_STAMP = '${buildNumber}';
