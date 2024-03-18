import { registerInDevtools, Store } from "pullstate";

export const WizardStore = new Store({
  token: "",
  user: {
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
  progress: 0,
});

registerInDevtools({
  WizardStore,
});