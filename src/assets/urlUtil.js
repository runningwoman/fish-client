define(['./base64'],function(Base64){
    return {
        /**
         * 将name=zhangsan&age=13转化为{name:'zhangsan',age:13}
         */
        parse2Obj: function(str){
            str = this.decode(str);
            var obj = {};
            if(str){
                var params = str.split('&');
                for(var i=0; i<params.length; i++){
                    var attrs = params[i].split('=');
                    obj[attrs[0]] = decodeURI(attrs[1]);
                }
            }
            return obj;
        },
        /**
         * 将object转化为字符串，例如{name:'zhangsan',age:13}
         * 转化为name=zhangsan&age=13
         */
        parse2Str: function(obj){
            var arr = [];
            for(attr in obj){
                arr.push(attr+"="+obj[attr]);
            }
            var string = arr.join('&');
            string = encodeURI(string);
            return this.encode(string);
        },
        /**
        * 功能：根据字符串来改变hash
        */
        changeHash: function(url,str){
            location.hash = url+str;
        },
        /**
        * 功能：更具Params来设置hash值
        */
        changeHashByParams: function(url,params){
            url = url || location.hash.match(/#page\/[^\/]*\//);
            params = params || Params;

            location.hash = url+this.parse2Str(params);
        },
        encode : function (string) {  
            // return CryptoJS.AES.encrypt(string, "tendcloud");
            return Base64.encode(string);
        },  
        // public method for url decoding  
        decode : function (string) {  
            // return CryptoJS.AES.decrypt(string, "tendcloud");
            return Base64.decode(string);
        }
    };
});