function download(){
    // location.href='http://anheeapp.vaiwan.com/exportTemp';
    // location.href='http://159.138.110.176:8090/exportTemp';
    location.href='http://localhost:8080/exportTemp';
}
$("#fileUpload").fileinput({
    language:"zh",
    // uploadUrl:'http://anheeapp.vaiwan.com/importTemp'
    // uploadUrl:'http://159.138.110.176:8090/importTemp'
    uploadUrl:'http://localhost:8080/importTemp'
});
