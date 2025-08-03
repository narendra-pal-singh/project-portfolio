var STARTERAPP = angular.module('starterApp', ["ngRoute", "ngSanitize", "ngCookies", "template/pagination/pagination.html", "ui.bootstrap.pagination", "ui.sortable"])
    .run(function ($route, $http, $location, $filter, $routeParams, $rootScope, $window, $sce, $templateCache) {
        $rootScope.child_id = 0;
        $rootScope.child_menu_show = function () {
            $rootScope.child_id = $routeParams.child_id;
            var path = $location.path();
            var pathsToShowMenu = [
                /^\/dashboard\/\d+$/,
                /^\/assessments\/\d+$/,
                /^\/assessments\/\d+\/subject\/\d+$/,
                /^\/assessments\/start\/\d+$/,
                /^\/assessments\/\d+\/list/,
                /my-video/,
                /rhymes/,
                /role-play/,
                /alfa-book/,
                /shopping/
            ];
            return pathsToShowMenu.some(function (regex) {
                return regex.test(path);
            });
        };
        $rootScope.formatDate = function (date) {
            if (date == null || date == '0000-00-00') return '-';
            else return new Date(date);
        };
        $rootScope.query_post = {};
        //----------------------------
        $rootScope.$on('$routeChangeStart', function () {
            $templateCache.removeAll();
            $rootScope.obj = {};
        });
        $rootScope.$on('$routeChangeSuccess', function () {
            window.scrollTo(0, 0);
        });
        //-------------------------------
    })
    .filter('capitalize', function () {
        return function (input) {
            if (input) {
                return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
            }
        };
    })
    .filter('formattedDate', function () {
        return function (input) {
            var dateObject = new Date(input);
            var options = { day: 'numeric', month: 'long', year: 'numeric' };
            return dateObject.toLocaleDateString('en-US', options);
        };
    })
    .filter('formattedDateTime', function () {
        return function (input) {
            if (!input) return ''; // Handle invalid or empty input
            var dateObject = new Date(input);
            // Options to include both date and time
            var options = {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true // Use 12-hour format with AM/PM
            };
            return dateObject.toLocaleString('en-US', options);
        };
    })
    .filter('inrCurrency', function () {
        return function (input) {
            if (isNaN(input)) {
                return input; // Return the input as-is if it's not a number
            }
            // Convert to float for safety
            input = parseFloat(input);
            // Format the number in the Indian numbering system
            const parts = input.toFixed(2).split(".");
            let integerPart = parts[0];
            const decimalPart = parts[1];
            // Add commas in Indian number format
            const lastThreeDigits = integerPart.slice(-3);
            const otherDigits = integerPart.slice(0, -3);
            if (otherDigits) {
                integerPart = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThreeDigits;
            }
            // Combine the integer part, decimal part, and the rupee symbol
            return `${integerPart}.${decimalPart}`;
        };
    });
function Loader(show) {
    if (show == true) {
        $('.page-loader-wrapper').show();
    } else {
        $('.page-loader-wrapper').hide();
    }
}
function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return '1';
    }
    return '0';
}
function ValidateNumber(e) {
    if (e.which != 8 && e.which != 13 && e.which != 0 && e.which != 46 && e.which != 31 && (e.which < 48 || e.which > 57)) {
        return false;
    } else if (/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[+0]?)?[+01234567891]{10,20}$/.test(e)) {   // Modified after customer requirement at 17-10-2022 to validate and accept the 20 digits mobile/contact number
        return '1';
    } else {
        return '0';
    }
}
function Validatepassword(pass, con) {
    if (pass.length < 8) {
        return '1';
    }
    if (pass != con) {
        return '2';
    } else {
        return '0';
    }
}
function checkZip(value) {
    if ((/(^\d{6}$)|(^\d{6}-\d{4}$)/).test(value)) {
        return '1';
    }
    return '0';
}
function validateInput(input) {
    // Remove any non-numeric characters from the input
    input.value = input.value.replace(/[^0-9]/g, '');
}
