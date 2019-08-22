//https://segmentfault.com/a/1190000005848133
//https://segmentfault.com/a/1190000011231042
//https://segmentfault.com/a/1190000006929722

var Navigator = navigator.userAgent;
var ifChrome = Navigator.match(/Chrome/i) != null && Navigator.match(/Version\/\d+\.\d+(\.\d+)?\sChrome\//i) == null ? true : false;
var ifAndroid = (Navigator.match(/(Android);?[\s\/]+([\d.]+)?/)) ? true : false;
var ifIos = Navigator.match(/iPhone|iPad|iPd/i) ? true : false;
var ifSafari = ifIos && Navigator.match(/Safari/);
// var ifWeixin = navigator.userAgent.indexOf('MicroMessenger') >= 0;
var iosVersion = Navigator.match(/OS\s*(\d+)/);
iosVersion = iosVersion ? (parseFloat(iosVersion[1], 10) || 0) : 0;
// var androidVersion = Navigator.match(/Android\s*(\d+)/);
// androidVersion = androidVersion ? (parseFloat(androidVersion[1], 10) || 0) : 0;

var timer = [];
function clearTimer() {
    for (var i = 0; i < timer.length; i++) {
        clearTimeout(timer[i]);
    }
}
function visibilityChange() {
    if (document.hidden) {
        clearTimer();
    }
}
window.addEventListener('blur', clearTimer, false);
window.addEventListener('pagehide', clearTimer, false);
document.addEventListener('visibilitychange', visibilityChange, false);

export default function openApp(schemaUrl, androidDownUrl, iosDownUrl) {
    schemaUrl = schemaUrl || 'supervoice://';
    androidDownUrl = androidDownUrl || 'http://gosingapp.com/goto_googleplay';
    iosDownUrl = iosDownUrl || 'http://gosingapp.com/goto_appstore';
    if (ifChrome) {
        if (ifAndroid) {
            setTimeout(function () {
                window.location.href = schemaUrl;
            }, 50);
        }
    }
    if (ifSafari && iosVersion >= 9) {
        setTimeout(function () {
            var link = document.createElement('a');
            link.setAttribute('href', schemaUrl);
            link.style.display = 'none';
            document.body.appendChild(link);
            var event = document.createEvent('HTMLEvents');
            event.initEvent('click', false, false);
            link.dispatchEvent(event);
        }, 0);
    } else {
        //低版本Android和iOS其它所有版本采用iframe
        var iframeId = '_downloadAppIframe_';
        var iframe = document.getElementById(iframeId);
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = iframeId;
            iframe.style.width = 0;
            iframe.style.height = 0;
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }
        iframe.src = schemaUrl;
    }
    var time1 = Date.now();
    var delay = 1500;
    setTimeout(function () {
        var t = setTimeout(function () {
            var time2 = Date.now();
            if (time2 - time1 < delay + 200) {
                window.location.href = ifIos ? iosDownUrl : androidDownUrl;
            }
        }, delay);
        timer.push(t);
    }, 100);
}