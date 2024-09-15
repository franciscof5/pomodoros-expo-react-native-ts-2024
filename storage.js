import { registerInDevtools, Store } from "pullstate";

export const WizardStore = new Store({
  //received from API
  token: "",
  user_object: {
    "id": null,
    "username": "",
    "name": "",
    "first_name": "",
    "last_name": "",
    "email": "",
    "url": "",
    "description": "",
    "link": "",
    "locale": "",
    "nickname": "",
    "slug": "",
    "roles": [],
    "registered_date": "",
    "capabilities": {},
    "extra_capabilities": {},
    "avatar_urls": {
      "24": "",
      "48": "",
      "96": ""
    },
    "meta": {
      "persisted_preferences": []
    },
    "_links": {
      "self": [
        {
          "href": ""
        }
      ],
      "collection": [
        {
          "href": ""
        }
      ]
    }
  },
  post_object: {
    "ID":null,
    "post_author":null,
    "post_date":"",
    "post_date_gmt":"",
    "post_content":"",
    "post_title":"",
    "post_excerpt":"",
    "post_status":"",
    "comment_status":"",
    "ping_status":"",
    "post_password":"",
    "post_name":"",
    "to_ping":"",
    "pinged":"",
    "post_modified":"",
    "post_modified_gmt":"",
    "post_content_filtered":"",
    "post_parent":0,
    "guid":"",
    "menu_order":0,
    "post_type":"",
    "post_mime_type":"",
    "comment_count":"",
    "filter":""
  },
  //controlled from app
  session_object: {
    secondsRemainingFromPHP: 0,
    secondsRemainingClock: "",
    pomodoro_actual: 0,
    pomodoros_done_today: 0,
    pomodoros_to_big_rest: 4,
    pomodoroTime: 1500,
    restTime: 300,
    bigRestTime: 1800,
    intervalMiliseconds: 1000,
    button_title: "Focar",  
    is_pomodoro: true,//is_pomodoros is when using timer for focusing (otherwise ir resting)
  },
});

registerInDevtools({
  WizardStore,
});