System.register("test", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function log() {
        console.log("logged");
        document.body.appendChild(document.createTextNode("logged"));
    }
    exports_1("log", log);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("index", ["test"], function (exports_2, context_2) {
    "use strict";
    var test_1;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (test_1_1) {
                test_1 = test_1_1;
            }
        ],
        execute: function () {
            console.log("about to log: ");
            test_1.log();
        }
    };
});
