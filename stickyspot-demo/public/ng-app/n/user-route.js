CRMAPP.config(function ($routeProvider) {
    $routeProvider
        //Dashboard Controller
        
        .when("/dashboard", {
            templateUrl: BASE_URL + "/user/dashboard",
            controller: "mainController"
        })
        .when("/", {
            templateUrl: BASE_URL + "/template/contacts",
            controller: "contactController"
        })
        .when("/lead_stages", {
            templateUrl: BASE_URL + "/template/leads/lead_stages",
            controller: "leadController"
        })
        
        .when("/lead_sources", {
            templateUrl: BASE_URL + "/template/leads/lead_sources",
            controller: "leadController"
        })
        .when("/leads/import", {
            templateUrl: BASE_URL + "/template/leads/import_leads",
            controller: "leadController"
        })
        .when("/leads/export", {
            templateUrl: BASE_URL + "/template/leads/export_leads",
            controller: "leadController"
        })
        // .when("/lead_settings", {
        //     templateUrl: BASE_URL + "/template/lead_settings",
        //     controller: "leadController"
        // })
        .when("/contacts", {    //Leads
            templateUrl: BASE_URL + "/template/contacts",
            controller: "contactController"
        })
        .when("/contact/details/:param1", {
            templateUrl: BASE_URL + "/template/contact_details",
            controller: "contactController"
        })
        .when("/contact/chat/:param1", {
            templateUrl: BASE_URL + "/template/contact-chat",
            controller: "contactController"
        })
        .when("/ads/campaign", {
            templateUrl: BASE_URL + "/template/ad_campaigns",
            controller: "adController"
        })
        .when("/ads/pages", {
            templateUrl: BASE_URL + "/template/ad_pages",
            controller: "adController"
        })
        .when("/ads/accounts", {
            templateUrl: BASE_URL + "/template/ad_accounts",
            controller: "adController"
        })
        .when("/ads", {
            templateUrl: BASE_URL + "/ads",
            controller: "leadController"
        })
        .when("/departments", {
            templateUrl: BASE_URL + "/template/departments",
            controller: "teamController"
        })
        .when("/team/create", {
            templateUrl: BASE_URL + "/template/team_create",
            controller: "teamController"
        })
        .otherwise({
            redirectTo: 'dashboard'
        })
})