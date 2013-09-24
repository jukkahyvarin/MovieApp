'use strict';


app.service('SessionService', function ($cookieStore) {
    //var locSession = {};
    //locSession.currentArea = null;

    //$cookieStore.session = locSession;

    this.getCurrentArea = function () {
        return $cookieStore.get('currentArea');
    };

    this.setCurrentArea = function (area) {
        $cookieStore.put('currentArea', area);
    };
   
});

