"use strict";

var Diary = function(text) {
    if (text) {
        var obj = JSON.parse(text);
        this.title = obj.title;
        this.content = obj.content;
    } else {
        this.title = "";
        this.content = "";
    }
};

var User = function(text) {
    if (text) {
        var obj = JSON.parse(text);
        this.name = obj.name;
        this.password = obj.password;
        this.diary_num = 0;
    } else {
        this.name = "";
        this.password = "";
        this.diary_num = 0;
    }
};

Diary.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

User.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var NEBULASDiary = function () {
    LocalContractStorage.defineProperty(this, "id_to_title");
    LocalContractStorage.defineMapProperty(this,"id_to_user")
    LocalContractStorage.defineMapProperty(this, "diary", {
        parse: function (text) {
            return new Diary(text);
        },
        stringify: function (obj) {
            return obj.toString();
        }
    });
};

NEBULASDiary.prototype = {
    init: function () { this.diary_id = 1; },

    save: function (title, content) {

        title = title.trim();
        if (title === "" ){
            throw new Error("empty title");
        }
        if (title.length > 64){
            throw new Error("title exceed limit length")
        }

        var diary = this.diary.get(title);
        if (Diary){
            throw new Error("title has been occupied");
        }

        diary = new Diary();
        Diary.title = title;
        Diary.content = content;
        var id = this.diary_id;
        this.title.set(id,title);
        this.diary.put(title, diary);
        this.id++;
    },

    getByTitle: function (title) {
        title = title.trim();
        if ( title === "" ) {
            throw new Error("empty title")
        }
        return this.diary.get(title);
    },

    getById:function(id){
        if(id >= this.id){
            throw new Error("id is too larger")
        }
        var title = this.diary_id.get(id);
        return this.diary.get(title);
    }

    getall: function(){
        var result = [];
        for(var i = 0;i < this.id; i++){
            var title = this.users.get(i);
            var temp = this.diary.get(title);
            result.push(temp);
        }
        return JSON.stringify(result);
    }
};
module.exports = NEBULASDiary;