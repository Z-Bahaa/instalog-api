"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lookups = {
    users: [
        {
            "actor_id": "user_3VG742k9PUA2",
            "actor_name": "zeyad bahaa",
            "group": "facebook.com",
            "target_name": "sami@google.com",
            "target_id": "user_DOKwD1U3L031",
            "location": "105.40.62.95",
        },
        {
            "actor_id": "user_3VG7p2j9PUA2",
            "actor_name": "ali salah",
            "group": "instatus.com",
            "target_name": "zeyad@facebook.com",
            "target_id": "user_DOKVD1UpL031",
            "location": "189.90.26.15",
        },
        {
            "actor_id": "user_3VG740j9PUA2",
            "actor_name": "sami omar",
            "group": "google.com",
            "target_name": "ali@instatus.com",
            "target_id": "user_DOKVD1U3j031",
            "location": "151.42.72.12",
        },
    ],
    actions: [
        {
            "name": "user.searched_activity_log_events",
            "redirect": "/event_log",
            "description": "User Searched Activity Log Events.",
            "x_request_id": "req_W4Y47lljg85H"
        },
        {
            "name": "user.login_success",
            "redirect": "/profile",
            "description": "User Logged In Successfully",
            "x_request_id": "req_C4Y47lljj85H"
        },
        {
            "name": "user.logout_success",
            "redirect": "/landing",
            "description": "User Logged Out Successfully",
            "x_request_id": "req_H4Y47lljg85w"
        },
        {
            "name": "user.login_failure",
            "redirect": "/setup",
            "description": "User Login Failure",
            "x_request_id": "req_K4Y47lljg85H"
        },
        {
            "name": "user.create_post_success",
            "redirect": "/post",
            "description": "User Created New Post Successfully.",
            "x_request_id": "req_O4Y47lljg85H"
        }
    ]
};
exports.default = Lookups;
