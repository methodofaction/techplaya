function throttle(method, scope) {
    clearTimeout(method._tId);
    method._tId= setTimeout(function(){
        method.call(scope);
    }, 500);
}