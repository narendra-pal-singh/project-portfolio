CRMAPP.config(function ($routeProvider) {
    $routeProvider
        //Dashboard Controller
        
        .when("/dashboard", {
            templateUrl: BASE_URL + "/user/dashboard",
            controller: "mainController"
        })
        .when("/", {
            templateUrl: BASE_URL + "/template/contacts/conatct_list",
            controller: "contactController"
        })
        .when("/lead_stages", {
            templateUrl: BASE_URL + "/template/lead_stages",
            controller: "leadController"
        })
        
        .when("/lead_sources", {
            templateUrl: BASE_URL + "/template/lead_sources",
            controller: "leadController"
        })
        .when("/leads/import", {
            templateUrl: BASE_URL + "/template/import_leads",
            controller: "leadController"
        })
        .when("/leads/export", {
            templateUrl: BASE_URL + "/template/export_leads",
            controller: "leadController"
        })
        // .when("/lead_settings", {
        //     templateUrl: BASE_URL + "/template/lead_settings",
        //     controller: "leadController"
        // })
        .when("/contacts", {    //Leads
            templateUrl: BASE_URL + "/template/contacts/conatct_list",
            controller: "contactController"
        })
        .when("/contact/details/:param1", {
            templateUrl: BASE_URL + "/template/contacts/contact_details",
            controller: "contactController"
        })
        .when("/contact/chat/:param1", {
            templateUrl: BASE_URL + "/template/contacts/contact_chat",
            controller: "contactController"
        })
        .when("/ads/campaign", {
            templateUrl: BASE_URL + "/template/ads/ad_campaigns",
            controller: "adController"
        })
        .when("/ads/pages", {
            templateUrl: BASE_URL + "/template/ads/ad_pages",
            controller: "adController"
        })
        .when("/ads/accounts", {
            templateUrl: BASE_URL + "/template/ads/ad_accounts",
            controller: "adController"
        })
        .when("/ads", {
            // templateUrl: BASE_URL + "/template/ads/ad_connect",
            templateUrl: BASE_URL + "/ads",
            controller: "adController"
        })
        // .when("/permission_role/manage", {
        //     templateUrl: BASE_URL + "/template/permission_role_manage",
        //     controller: "teamController"
        // })
        .when("/permission_roles", {
            templateUrl: BASE_URL + "/template/permission_roles/permission_role_list",
            controller: "permissionRoleController"
        })
        .when("/permission_role/create", {
            templateUrl: BASE_URL + "/template/permission_roles/permission_role_create",
            controller: "permissionRoleController"
        })
        .when("/permission_role/edit/:param1", {
            templateUrl: BASE_URL + "/template/permission_roles/permission_role_edit",
            controller: "permissionRoleController"
        })
        .when("/departments", {
            templateUrl: BASE_URL + "/template/departments",
            controller: "teamController"
        })
        .when("/teams", {
            templateUrl: BASE_URL + "/template/team/team_list",
            controller: "teamController"
        })
        .when("/team/view/:param1", {
            templateUrl: BASE_URL + "/template/team/team_details",
            controller: "teamController"
        })
        .when("/team/edit/:param1", {
            templateUrl: BASE_URL + "/template/team/team_edit",
            controller: "teamController"
        })
        .when("/team/create", {
            templateUrl: BASE_URL + "/template/team/team_create",
            controller: "teamController"
        })
        .when("/mails", {
            templateUrl: BASE_URL + "/template/mails/mail_list",
            controller: "mailController"
        })
        .when("/mail/view/:id", {
            templateUrl: BASE_URL + "/template/mails/mail_view",
            controller: "mailController"
        })
        .when("/mail/compose", {
            templateUrl: BASE_URL + "/template/mails/mail_compose",
            controller: "mailController"
        })
        .otherwise({
            redirectTo: 'dashboard'
        })
})