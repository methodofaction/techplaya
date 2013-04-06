window.techplaya = {};

techplaya.throttle = function(method, scope) {
    clearTimeout(method._tId);
    method._tId= setTimeout(function(){
        method.call(scope);
    }, 500);
};