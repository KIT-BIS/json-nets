/*! For license information please see 854.index.js.LICENSE.txt */
"use strict";(self.webpackChunkjson_nets=self.webpackChunkjson_nets||[]).push([[854],{60854:(e,t,s)=>{s.r(t),s.d(t,{conf:()=>r,language:()=>n});var r={wordPattern:/(-?\d*\.\d\w*)|([^\`\~\!\@\#%\^\&\*\(\)\=\$\-\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,comments:{blockComment:["###","###"],lineComment:"#"},folding:{markers:{start:new RegExp("^\\s*#region\\b"),end:new RegExp("^\\s*#endregion\\b")}}},n={defaultToken:"",ignoreCase:!1,tokenPostfix:".mips",regEx:/\/(?!\/\/)(?:[^\/\\]|\\.)*\/[igm]*/,keywords:[".data",".text","syscall","trap","add","addu","addi","addiu","and","andi","div","divu","mult","multu","nor","or","ori","sll","slv","sra","srav","srl","srlv","sub","subu","xor","xori","lhi","lho","lhi","llo","slt","slti","sltu","sltiu","beq","bgtz","blez","bne","j","jal","jalr","jr","lb","lbu","lh","lhu","lw","li","la","sb","sh","sw","mfhi","mflo","mthi","mtlo","move"],symbols:/[\.,\:]+/,escapes:/\\(?:[abfnrtv\\"'$]|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,tokenizer:{root:[[/\$[a-zA-Z_]\w*/,"variable.predefined"],[/[.a-zA-Z_]\w*/,{cases:{this:"variable.predefined","@keywords":{token:"keyword.$0"},"@default":""}}],[/[ \t\r\n]+/,""],[/#.*$/,"comment"],["///",{token:"regexp",next:"@hereregexp"}],[/^(\s*)(@regEx)/,["","regexp"]],[/(\,)(\s*)(@regEx)/,["delimiter","","regexp"]],[/(\:)(\s*)(@regEx)/,["delimiter","","regexp"]],[/@symbols/,"delimiter"],[/\d+[eE]([\-+]?\d+)?/,"number.float"],[/\d+\.\d+([eE][\-+]?\d+)?/,"number.float"],[/0[xX][0-9a-fA-F]+/,"number.hex"],[/0[0-7]+(?!\d)/,"number.octal"],[/\d+/,"number"],[/[,.]/,"delimiter"],[/"""/,"string",'@herestring."""'],[/'''/,"string","@herestring.'''"],[/"/,{cases:{"@eos":"string","@default":{token:"string",next:'@string."'}}}],[/'/,{cases:{"@eos":"string","@default":{token:"string",next:"@string.'"}}}]],string:[[/[^"'\#\\]+/,"string"],[/@escapes/,"string.escape"],[/\./,"string.escape.invalid"],[/\./,"string.escape.invalid"],[/#{/,{cases:{'$S2=="':{token:"string",next:"root.interpolatedstring"},"@default":"string"}}],[/["']/,{cases:{"$#==$S2":{token:"string",next:"@pop"},"@default":"string"}}],[/#/,"string"]],herestring:[[/("""|''')/,{cases:{"$1==$S2":{token:"string",next:"@pop"},"@default":"string"}}],[/[^#\\'"]+/,"string"],[/['"]+/,"string"],[/@escapes/,"string.escape"],[/\./,"string.escape.invalid"],[/#{/,{token:"string.quote",next:"root.interpolatedstring"}],[/#/,"string"]],comment:[[/[^#]+/,"comment"],[/#/,"comment"]],hereregexp:[[/[^\\\/#]+/,"regexp"],[/\\./,"regexp"],[/#.*$/,"comment"],["///[igm]*",{token:"regexp",next:"@pop"}],[/\//,"regexp"]]}}}}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiODU0LmluZGV4LmpzIiwibWFwcGluZ3MiOiI7Z0pBUUEsSUFBSUEsRUFBTyxDQUNUQyxZQUFhLHdGQUNiQyxTQUFVLENBQ1JDLGFBQWMsQ0FBQyxNQUFPLE9BQ3RCQyxZQUFhLEtBRWZDLFFBQVMsQ0FDUEMsUUFBUyxDQUNQQyxNQUFPLElBQUlDLE9BQU8sbUJBQ2xCQyxJQUFLLElBQUlELE9BQU8seUJBSWxCRSxFQUFXLENBQ2JDLGFBQWMsR0FDZEMsWUFBWSxFQUNaQyxhQUFjLFFBQ2RDLE1BQU8scUNBQ1BDLFNBQVUsQ0FDUixRQUNBLFFBQ0EsVUFDQSxPQUNBLE1BQ0EsT0FDQSxPQUNBLFFBQ0EsTUFDQSxPQUNBLE1BQ0EsT0FDQSxPQUNBLFFBQ0EsTUFDQSxLQUNBLE1BQ0EsTUFDQSxNQUNBLE1BQ0EsT0FDQSxNQUNBLE9BQ0EsTUFDQSxPQUNBLE1BQ0EsT0FDQSxNQUNBLE1BQ0EsTUFDQSxNQUNBLE1BQ0EsT0FDQSxPQUNBLFFBQ0EsTUFDQSxPQUNBLE9BQ0EsTUFDQSxJQUNBLE1BQ0EsT0FDQSxLQUNBLEtBQ0EsTUFDQSxLQUNBLE1BQ0EsS0FDQSxLQUNBLEtBQ0EsS0FDQSxLQUNBLEtBQ0EsT0FDQSxPQUNBLE9BQ0EsT0FDQSxRQUVGQyxRQUFTLFdBQ1RDLFFBQVMseUVBQ1RDLFVBQVcsQ0FDVEMsS0FBTSxDQUNKLENBQUMsaUJBQWtCLHVCQUNuQixDQUNFLGdCQUNBLENBQ0VDLE1BQU8sQ0FDTEMsS0FBTSxzQkFDTixZQUFhLENBQUVDLE1BQU8sY0FDdEIsV0FBWSxNQUlsQixDQUFDLGFBQWMsSUFDZixDQUFDLE9BQVEsV0FDVCxDQUFDLE1BQU8sQ0FBRUEsTUFBTyxTQUFVQyxLQUFNLGdCQUNqQyxDQUFDLGlCQUFrQixDQUFDLEdBQUksV0FDeEIsQ0FBQyxvQkFBcUIsQ0FBQyxZQUFhLEdBQUksV0FDeEMsQ0FBQyxvQkFBcUIsQ0FBQyxZQUFhLEdBQUksV0FDeEMsQ0FBQyxXQUFZLGFBQ2IsQ0FBQyxzQkFBdUIsZ0JBQ3hCLENBQUMsMkJBQTRCLGdCQUM3QixDQUFDLG9CQUFxQixjQUN0QixDQUFDLGdCQUFpQixnQkFDbEIsQ0FBQyxNQUFPLFVBQ1IsQ0FBQyxPQUFRLGFBQ1QsQ0FBQyxNQUFPLFNBQVUsbUJBQ2xCLENBQUMsTUFBTyxTQUFVLG1CQUNsQixDQUNFLElBQ0EsQ0FDRUgsTUFBTyxDQUNMLE9BQVEsU0FDUixXQUFZLENBQUVFLE1BQU8sU0FBVUMsS0FBTSxnQkFJM0MsQ0FDRSxJQUNBLENBQ0VILE1BQU8sQ0FDTCxPQUFRLFNBQ1IsV0FBWSxDQUFFRSxNQUFPLFNBQVVDLEtBQU0saUJBSzdDQyxPQUFRLENBQ04sQ0FBQyxhQUFjLFVBQ2YsQ0FBQyxXQUFZLGlCQUNiLENBQUMsS0FBTSx5QkFDUCxDQUFDLEtBQU0seUJBQ1AsQ0FDRSxLQUNBLENBQ0VKLE1BQU8sQ0FDTCxTQUFVLENBQ1JFLE1BQU8sU0FDUEMsS0FBTSwyQkFFUixXQUFZLFlBSWxCLENBQ0UsT0FDQSxDQUNFSCxNQUFPLENBQ0wsVUFBVyxDQUFFRSxNQUFPLFNBQVVDLEtBQU0sUUFDcEMsV0FBWSxZQUlsQixDQUFDLElBQUssV0FFUkUsV0FBWSxDQUNWLENBQ0UsWUFDQSxDQUNFTCxNQUFPLENBQ0wsVUFBVyxDQUFFRSxNQUFPLFNBQVVDLEtBQU0sUUFDcEMsV0FBWSxZQUlsQixDQUFDLFlBQWEsVUFDZCxDQUFDLFFBQVMsVUFDVixDQUFDLFdBQVksaUJBQ2IsQ0FBQyxLQUFNLHlCQUNQLENBQUMsS0FBTSxDQUFFRCxNQUFPLGVBQWdCQyxLQUFNLDRCQUN0QyxDQUFDLElBQUssV0FFUkcsUUFBUyxDQUNQLENBQUMsUUFBUyxXQUNWLENBQUMsSUFBSyxZQUVSQyxXQUFZLENBQ1YsQ0FBQyxZQUFhLFVBQ2QsQ0FBQyxNQUFPLFVBQ1IsQ0FBQyxPQUFRLFdBQ1QsQ0FBQyxZQUFhLENBQUVMLE1BQU8sU0FBVUMsS0FBTSxTQUN2QyxDQUFDLEtBQU0iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc29uLW5ldHMvLi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9lc20vdnMvYmFzaWMtbGFuZ3VhZ2VzL21pcHMvbWlwcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBWZXJzaW9uOiAwLjM0LjEoNTQ3ODcwYjY4ODEzMDJjNWI0ZmYzMjE3M2MxNmQwNjAwOWUzNTg4ZilcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9tb25hY28tZWRpdG9yL2Jsb2IvbWFpbi9MSUNFTlNFLnR4dFxuICotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbi8vIHNyYy9iYXNpYy1sYW5ndWFnZXMvbWlwcy9taXBzLnRzXG52YXIgY29uZiA9IHtcbiAgd29yZFBhdHRlcm46IC8oLT9cXGQqXFwuXFxkXFx3Kil8KFteXFxgXFx+XFwhXFxAXFwjJVxcXlxcJlxcKlxcKFxcKVxcPVxcJFxcLVxcK1xcW1xce1xcXVxcfVxcXFxcXHxcXDtcXDpcXCdcXFwiXFwsXFwuXFw8XFw+XFwvXFw/XFxzXSspL2csXG4gIGNvbW1lbnRzOiB7XG4gICAgYmxvY2tDb21tZW50OiBbXCIjIyNcIiwgXCIjIyNcIl0sXG4gICAgbGluZUNvbW1lbnQ6IFwiI1wiXG4gIH0sXG4gIGZvbGRpbmc6IHtcbiAgICBtYXJrZXJzOiB7XG4gICAgICBzdGFydDogbmV3IFJlZ0V4cChcIl5cXFxccyojcmVnaW9uXFxcXGJcIiksXG4gICAgICBlbmQ6IG5ldyBSZWdFeHAoXCJeXFxcXHMqI2VuZHJlZ2lvblxcXFxiXCIpXG4gICAgfVxuICB9XG59O1xudmFyIGxhbmd1YWdlID0ge1xuICBkZWZhdWx0VG9rZW46IFwiXCIsXG4gIGlnbm9yZUNhc2U6IGZhbHNlLFxuICB0b2tlblBvc3RmaXg6IFwiLm1pcHNcIixcbiAgcmVnRXg6IC9cXC8oPyFcXC9cXC8pKD86W15cXC9cXFxcXXxcXFxcLikqXFwvW2lnbV0qLyxcbiAga2V5d29yZHM6IFtcbiAgICBcIi5kYXRhXCIsXG4gICAgXCIudGV4dFwiLFxuICAgIFwic3lzY2FsbFwiLFxuICAgIFwidHJhcFwiLFxuICAgIFwiYWRkXCIsXG4gICAgXCJhZGR1XCIsXG4gICAgXCJhZGRpXCIsXG4gICAgXCJhZGRpdVwiLFxuICAgIFwiYW5kXCIsXG4gICAgXCJhbmRpXCIsXG4gICAgXCJkaXZcIixcbiAgICBcImRpdnVcIixcbiAgICBcIm11bHRcIixcbiAgICBcIm11bHR1XCIsXG4gICAgXCJub3JcIixcbiAgICBcIm9yXCIsXG4gICAgXCJvcmlcIixcbiAgICBcInNsbFwiLFxuICAgIFwic2x2XCIsXG4gICAgXCJzcmFcIixcbiAgICBcInNyYXZcIixcbiAgICBcInNybFwiLFxuICAgIFwic3JsdlwiLFxuICAgIFwic3ViXCIsXG4gICAgXCJzdWJ1XCIsXG4gICAgXCJ4b3JcIixcbiAgICBcInhvcmlcIixcbiAgICBcImxoaVwiLFxuICAgIFwibGhvXCIsXG4gICAgXCJsaGlcIixcbiAgICBcImxsb1wiLFxuICAgIFwic2x0XCIsXG4gICAgXCJzbHRpXCIsXG4gICAgXCJzbHR1XCIsXG4gICAgXCJzbHRpdVwiLFxuICAgIFwiYmVxXCIsXG4gICAgXCJiZ3R6XCIsXG4gICAgXCJibGV6XCIsXG4gICAgXCJibmVcIixcbiAgICBcImpcIixcbiAgICBcImphbFwiLFxuICAgIFwiamFsclwiLFxuICAgIFwianJcIixcbiAgICBcImxiXCIsXG4gICAgXCJsYnVcIixcbiAgICBcImxoXCIsXG4gICAgXCJsaHVcIixcbiAgICBcImx3XCIsXG4gICAgXCJsaVwiLFxuICAgIFwibGFcIixcbiAgICBcInNiXCIsXG4gICAgXCJzaFwiLFxuICAgIFwic3dcIixcbiAgICBcIm1maGlcIixcbiAgICBcIm1mbG9cIixcbiAgICBcIm10aGlcIixcbiAgICBcIm10bG9cIixcbiAgICBcIm1vdmVcIlxuICBdLFxuICBzeW1ib2xzOiAvW1xcLixcXDpdKy8sXG4gIGVzY2FwZXM6IC9cXFxcKD86W2FiZm5ydHZcXFxcXCInJF18eFswLTlBLUZhLWZdezEsNH18dVswLTlBLUZhLWZdezR9fFVbMC05QS1GYS1mXXs4fSkvLFxuICB0b2tlbml6ZXI6IHtcbiAgICByb290OiBbXG4gICAgICBbL1xcJFthLXpBLVpfXVxcdyovLCBcInZhcmlhYmxlLnByZWRlZmluZWRcIl0sXG4gICAgICBbXG4gICAgICAgIC9bLmEtekEtWl9dXFx3Ki8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgdGhpczogXCJ2YXJpYWJsZS5wcmVkZWZpbmVkXCIsXG4gICAgICAgICAgICBcIkBrZXl3b3Jkc1wiOiB7IHRva2VuOiBcImtleXdvcmQuJDBcIiB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcIlwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy9bIFxcdFxcclxcbl0rLywgXCJcIl0sXG4gICAgICBbLyMuKiQvLCBcImNvbW1lbnRcIl0sXG4gICAgICBbXCIvLy9cIiwgeyB0b2tlbjogXCJyZWdleHBcIiwgbmV4dDogXCJAaGVyZXJlZ2V4cFwiIH1dLFxuICAgICAgWy9eKFxccyopKEByZWdFeCkvLCBbXCJcIiwgXCJyZWdleHBcIl1dLFxuICAgICAgWy8oXFwsKShcXHMqKShAcmVnRXgpLywgW1wiZGVsaW1pdGVyXCIsIFwiXCIsIFwicmVnZXhwXCJdXSxcbiAgICAgIFsvKFxcOikoXFxzKikoQHJlZ0V4KS8sIFtcImRlbGltaXRlclwiLCBcIlwiLCBcInJlZ2V4cFwiXV0sXG4gICAgICBbL0BzeW1ib2xzLywgXCJkZWxpbWl0ZXJcIl0sXG4gICAgICBbL1xcZCtbZUVdKFtcXC0rXT9cXGQrKT8vLCBcIm51bWJlci5mbG9hdFwiXSxcbiAgICAgIFsvXFxkK1xcLlxcZCsoW2VFXVtcXC0rXT9cXGQrKT8vLCBcIm51bWJlci5mbG9hdFwiXSxcbiAgICAgIFsvMFt4WF1bMC05YS1mQS1GXSsvLCBcIm51bWJlci5oZXhcIl0sXG4gICAgICBbLzBbMC03XSsoPyFcXGQpLywgXCJudW1iZXIub2N0YWxcIl0sXG4gICAgICBbL1xcZCsvLCBcIm51bWJlclwiXSxcbiAgICAgIFsvWywuXS8sIFwiZGVsaW1pdGVyXCJdLFxuICAgICAgWy9cIlwiXCIvLCBcInN0cmluZ1wiLCAnQGhlcmVzdHJpbmcuXCJcIlwiJ10sXG4gICAgICBbLycnJy8sIFwic3RyaW5nXCIsIFwiQGhlcmVzdHJpbmcuJycnXCJdLFxuICAgICAgW1xuICAgICAgICAvXCIvLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGVvc1wiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiB7IHRva2VuOiBcInN0cmluZ1wiLCBuZXh0OiAnQHN0cmluZy5cIicgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgLycvLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiQGVvc1wiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiB7IHRva2VuOiBcInN0cmluZ1wiLCBuZXh0OiBcIkBzdHJpbmcuJ1wiIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICBdLFxuICAgIHN0cmluZzogW1xuICAgICAgWy9bXlwiJ1xcI1xcXFxdKy8sIFwic3RyaW5nXCJdLFxuICAgICAgWy9AZXNjYXBlcy8sIFwic3RyaW5nLmVzY2FwZVwiXSxcbiAgICAgIFsvXFwuLywgXCJzdHJpbmcuZXNjYXBlLmludmFsaWRcIl0sXG4gICAgICBbL1xcLi8sIFwic3RyaW5nLmVzY2FwZS5pbnZhbGlkXCJdLFxuICAgICAgW1xuICAgICAgICAvI3svLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgICckUzI9PVwiJzoge1xuICAgICAgICAgICAgICB0b2tlbjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgbmV4dDogXCJyb290LmludGVycG9sYXRlZHN0cmluZ1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAvW1wiJ10vLFxuICAgICAgICB7XG4gICAgICAgICAgY2FzZXM6IHtcbiAgICAgICAgICAgIFwiJCM9PSRTMlwiOiB7IHRva2VuOiBcInN0cmluZ1wiLCBuZXh0OiBcIkBwb3BcIiB9LFxuICAgICAgICAgICAgXCJAZGVmYXVsdFwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgWy8jLywgXCJzdHJpbmdcIl1cbiAgICBdLFxuICAgIGhlcmVzdHJpbmc6IFtcbiAgICAgIFtcbiAgICAgICAgLyhcIlwiXCJ8JycnKS8sXG4gICAgICAgIHtcbiAgICAgICAgICBjYXNlczoge1xuICAgICAgICAgICAgXCIkMT09JFMyXCI6IHsgdG9rZW46IFwic3RyaW5nXCIsIG5leHQ6IFwiQHBvcFwiIH0sXG4gICAgICAgICAgICBcIkBkZWZhdWx0XCI6IFwic3RyaW5nXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBbL1teI1xcXFwnXCJdKy8sIFwic3RyaW5nXCJdLFxuICAgICAgWy9bJ1wiXSsvLCBcInN0cmluZ1wiXSxcbiAgICAgIFsvQGVzY2FwZXMvLCBcInN0cmluZy5lc2NhcGVcIl0sXG4gICAgICBbL1xcLi8sIFwic3RyaW5nLmVzY2FwZS5pbnZhbGlkXCJdLFxuICAgICAgWy8jey8sIHsgdG9rZW46IFwic3RyaW5nLnF1b3RlXCIsIG5leHQ6IFwicm9vdC5pbnRlcnBvbGF0ZWRzdHJpbmdcIiB9XSxcbiAgICAgIFsvIy8sIFwic3RyaW5nXCJdXG4gICAgXSxcbiAgICBjb21tZW50OiBbXG4gICAgICBbL1teI10rLywgXCJjb21tZW50XCJdLFxuICAgICAgWy8jLywgXCJjb21tZW50XCJdXG4gICAgXSxcbiAgICBoZXJlcmVnZXhwOiBbXG4gICAgICBbL1teXFxcXFxcLyNdKy8sIFwicmVnZXhwXCJdLFxuICAgICAgWy9cXFxcLi8sIFwicmVnZXhwXCJdLFxuICAgICAgWy8jLiokLywgXCJjb21tZW50XCJdLFxuICAgICAgW1wiLy8vW2lnbV0qXCIsIHsgdG9rZW46IFwicmVnZXhwXCIsIG5leHQ6IFwiQHBvcFwiIH1dLFxuICAgICAgWy9cXC8vLCBcInJlZ2V4cFwiXVxuICAgIF1cbiAgfVxufTtcbmV4cG9ydCB7XG4gIGNvbmYsXG4gIGxhbmd1YWdlXG59O1xuIl0sIm5hbWVzIjpbImNvbmYiLCJ3b3JkUGF0dGVybiIsImNvbW1lbnRzIiwiYmxvY2tDb21tZW50IiwibGluZUNvbW1lbnQiLCJmb2xkaW5nIiwibWFya2VycyIsInN0YXJ0IiwiUmVnRXhwIiwiZW5kIiwibGFuZ3VhZ2UiLCJkZWZhdWx0VG9rZW4iLCJpZ25vcmVDYXNlIiwidG9rZW5Qb3N0Zml4IiwicmVnRXgiLCJrZXl3b3JkcyIsInN5bWJvbHMiLCJlc2NhcGVzIiwidG9rZW5pemVyIiwicm9vdCIsImNhc2VzIiwidGhpcyIsInRva2VuIiwibmV4dCIsInN0cmluZyIsImhlcmVzdHJpbmciLCJjb21tZW50IiwiaGVyZXJlZ2V4cCJdLCJzb3VyY2VSb290IjoiIn0=